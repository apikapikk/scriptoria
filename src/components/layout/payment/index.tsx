import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { supabase } from "../../../utils/supabase";
import { useRouter } from "next/router";
import styles from "./payment.module.css";
import Image from "next/image";
import { jsPDF } from "jspdf"; 
import dynamic from "next/dynamic";
const QRScanner = dynamic(() => import("../../hooks/qrscan/qrscanner"), { ssr: false });



type Product = {
  id: string;
  name_product: string;
  price_product: number;
  stock_product: number;
  image_products: string;
};

type CartItem = Product & {
  quantity: number;
};

type Transaction = {
  id_transaction: string;
  buyer_name: string;
  total_amount: number;
  payment_amount: number;
  change_amount: number;
};

type User = {
  id: string;
  name: string;
};

const KasirPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [payment, setPayment] = useState<number>(0);
  const [buyerName, setBuyerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      const cookie = Cookies.get("user");
      if (!cookie) return router.push("/login");
      setUser(JSON.parse(cookie));

      const { data, error } = await supabase.from("products").select("*");
      if (!error && data) {
        setProducts(data as Product[]);
        setFilteredProducts(data as Product[]);
      }
    };
    fetchData();
  }, [router]);

  const handleQRScan = (decodedText: string) => {
    const found = products.find(p => p.id === decodedText);
  
    if (found) {
      const existingItem = cart.find(item => item.id === found.id);
      
      if (existingItem) {
        setCart(prev => prev.map(item =>
          item.id === found.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        setCart(prev => [...prev, { ...found, quantity: 1 }]);
      }
  
      console.log(`Produk "${found.name_product}" ditambahkan ke keranjang!`);
    } else {
      console.log("Produk tidak ditemukan!");
    }
  
    // Jangan setShowScanner(false) di sini!
  };
  
  

  const addToCart = (product: Product) => {
    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const getTotal = () => {
    return cart.reduce(
      (total, item) => total + item.price_product * item.quantity,
      0
    );
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    const filtered = products.filter((p) =>
      p.name_product.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleCheckout = async () => {
    if (!user) return alert("User tidak ditemukan");
    if (!buyerName.trim()) return alert("Nama pembeli wajib diisi");
  
    const total = getTotal();
    if (payment < total) {
      return alert(`Nominal pembayaran kurang! Total: Rp${total.toLocaleString()}`);
    }
  
    const change = payment - total;
  
    setLoading(true);  // Set loading to true when the transaction starts
  
    try {
      const { data: trx, error: trxError } = await supabase
        .from("transactions")
        .insert({
          buyer_name: buyerName,
          employee_id: user.id,
          total_amount: total,
          payment_amount: payment,
          change_amount: change,
        })
        .select()
        .single();
  
      if (trxError || !trx) throw new Error("Gagal simpan transaksi");
  
      for (const item of cart) {
        await supabase.from("transaction_items").insert({
          transaction_id: trx.id_transaction,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price_product,
          subtotal: item.price_product * item.quantity,
        });
  
        await supabase.rpc("decrease_stock", {
          product_id_input: item.id,
          quantity_input: item.quantity,
        });
      }
  
      alert(`Transaksi berhasil! Kembalian: Rp${change.toLocaleString()}`);
      setCart([]);
      setPayment(0);
      setBuyerName("");
      generateInvoice(trx, change);  // Generate the invoice
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);  // Set loading to false after the transaction completes
    }
  };
  

  const generateInvoice = (trx: Transaction, change: number) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleString();
  
    // Title
    doc.setFontSize(18);
    doc.text("Invoice", 14, 20);
  
    // Transaction Details
    doc.setFontSize(12);
    doc.text(`No Transaksi: ${trx.id_transaction}`, 14, 30);
    doc.text(`Tanggal: ${date}`, 14, 40);
    doc.text(`Nama Pembeli: ${trx.buyer_name}`, 14, 50);
    doc.text(`Kasir: ${user?.name}`, 14, 60);
    doc.text(`Total: Rp${trx.total_amount.toLocaleString()}`, 14, 70);
    doc.text(`Pembayaran: Rp${trx.payment_amount.toLocaleString()}`, 14, 80);
    doc.text(`Kembalian: Rp${change.toLocaleString()}`, 14, 90);
  
    // Products Section
    let yOffset = 100;
    const maxWidth = 80; // Set the maximum width for product name
    doc.text("Produk", 14, yOffset);
    doc.text("Harga", 100, yOffset);
    doc.text("Jumlah", 140, yOffset);
    doc.text("Subtotal", 180, yOffset);
  
    yOffset += 10;
  
    cart.forEach((item) => {
      // Wrap the product name to fit within the defined width
      const wrappedProductName = doc.splitTextToSize(item.name_product, maxWidth);
  
      // Write each line of the wrapped product name
      wrappedProductName.forEach((line: string, index: number) => {
        doc.text(line, 14, yOffset + (index * 10)); // Increase the offset for each line of the name
      });
  
      // Adjust the Y offset after each product name
      yOffset += wrappedProductName.length * 10;
  
      // Add the other details
      doc.text(`Rp${item.price_product.toLocaleString()}`, 100, yOffset);
      doc.text(`${item.quantity}`, 140, yOffset);
      doc.text(`Rp${(item.price_product * item.quantity).toLocaleString()}`, 180, yOffset);
  
      yOffset += 10;
    });
  
    // Save PDF
    doc.save(`invoice_${trx.id_transaction}.pdf`);
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Kasir - {user?.name}</h1>
      <button
        onClick={() => setShowScanner(prev => !prev)}
        className={styles.button}
      >
        {showScanner ? "Tutup Scanner" : "Scan QR Produk"}
      </button>
      {showScanner && <QRScanner key="qr-scanner" onScanSuccess={handleQRScan} />}

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <h2 className={styles.sectionTitle}>Daftar Produk</h2>
          <div className={styles.productsScroll}>
            <div className={styles.productsGrid}>
              {filteredProducts.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  <Image
                    src={product.image_products}
                    alt={product.name_product}
                    width={100}
                    height={100}
                    objectFit="cover"
                  />
                  <h4>{product.name_product}</h4>
                  <p>Rp{product.price_product.toLocaleString()}</p>
                  <p>Stok: {product.stock_product}</p>
                  <button
                    className={styles.button}
                    onClick={() => addToCart(product)}
                  >
                    Tambah
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <h2 className={styles.sectionTitle}>Keranjang</h2>
          <div className={styles.cartTableWrapper}>
            <table className={styles.cartTable}>
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Harga</th>
                  <th>Jumlah</th>
                  <th>Subtotal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.max(cart.length, 5) }).map((_, index) => {
                  const item = cart[index];
                  return (
                    <tr key={item?.id || index}>
                      <td>{item?.name_product || "-"}</td>
                      <td>{item ? `Rp${item.price_product.toLocaleString()}` : "-"}</td>
                      <td>
                        {item ? (
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const newQty = Number(e.target.value);
                              if (newQty >= 1) {
                                setCart((prev) =>
                                  prev.map((cartItem) =>
                                    cartItem.id === item.id
                                      ? { ...cartItem, quantity: newQty }
                                      : cartItem
                                  )
                                );
                              }
                            }}
                            className={styles.qtyInput}
                          />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>{item ? `Rp${(item.price_product * item.quantity).toLocaleString()}` : "-"}</td>
                      <td>
                        {item ? (
                          <button
                            className={styles.deleteButton}
                            onClick={() => removeFromCart(item.id)}
                          >
                            Hapus
                          </button>
                        ) : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className={styles.totalSection}>
            <strong>Total: Rp{getTotal().toLocaleString()}</strong>
          </div>

          <div className={styles.paymentSection}>
            <label htmlFor="buyer">Nama Pembeli:</label>
            <input
              id="buyer"
              type="text"
              placeholder="Nama pembeli..."
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className={styles.paymentInput}
            />

            <label htmlFor="payment">Nominal Dibayar:</label>
            <input
              id="payment"
              type="text"
              inputMode="numeric"
              placeholder="Masukkan nominal pembayaran"
              value={payment === 0 ? "" : payment.toString()}
              onFocus={(e) => {
                if (payment === 0) e.target.select();
              }}
              onBlur={(e) => {
                if (!e.target.value) setPayment(0);
              }}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, ""); // hapus semua selain angka
                setPayment(Number(onlyNumbers || 0));
              }}
              className={styles.paymentInput}
            />

            <label>Kembalian:</label>
            <p className={styles.kembalian}>
              Rp{Math.max(payment - getTotal(), 0).toLocaleString()}
            </p>
          </div>

          <button
              className={styles.checkoutButton}
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <div className={styles.spinner}></div> // Add spinner class when loading
              ) : (
                'Proses Transaksi'
              )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default KasirPage;
