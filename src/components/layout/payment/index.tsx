import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { supabase } from "../../../utils/supabase";
import { useRouter } from "next/router";
import styles from "./payment.module.css";
import Image from "next/image";

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

    if (trxError || !trx) return alert("Gagal simpan transaksi");

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
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Kasir - {user?.name}</h1>

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
                      <td>{item?.quantity || "-"}</td>
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
            <label>Nama Pembeli:</label>
            <input
              type="text"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className={styles.paymentInput}
            />
            <label>Nominal Dibayar:</label>
            <input
              type="number"
              value={payment}
              onChange={(e) => setPayment(Number(e.target.value))}
              className={styles.paymentInput}
            />
            <label>Kembalian:</label>
            <p className={styles.kembalian}>
              Rp{(payment - getTotal() > 0 ? payment - getTotal() : 0).toLocaleString()}
            </p>
          </div>

          <button className={styles.checkoutButton} onClick={handleCheckout}>
            Proses Transaksi
          </button>
        </div>
      </div>
    </div>
  );
};

export default KasirPage;
