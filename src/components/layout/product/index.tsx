import styles from './product.module.css';
import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabase';
import Image from 'next/image';

interface ProductType {
  id: string;
  name_product: string;
  brand_product: string;
  price_product: number;
  stock_product: number;
  type_product: string;
  image_products: string;
}

export default function Product() {
  const [form, setForm] = useState({
    name_product: '',
    brand_product: '',
    price_product: '',
    stock_product: '',
    type_product: '',
  });

  const [products, setProducts] = useState<ProductType[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (!error && data) {
      setProducts(data as ProductType[]);
    } else {
      console.error('Gagal mengambil produk:', error?.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      const productData = {
        ...form,
        price_product: Number(form.price_product),
        stock_product: Number(form.stock_product),
        ...(imageUrl && { image_products: imageUrl }),
      };

      let result;
      if (editMode && editId) {
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', editId);
      } else {
        result = await supabase
          .from('products')
          .insert([{ ...productData, image_products: imageUrl }]);
      }

      if (result.error) throw result.error;

      alert(editMode ? 'Produk berhasil diperbarui!' : 'Produk berhasil ditambahkan!');
      setForm({ name_product: '', brand_product: '', price_product: '', stock_product: '', type_product: '' });
      setImageFile(null);
      setEditMode(false);
      setEditId(null);
      fetchProducts();
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      fetchProducts();
    }
  };

  const handleEdit = (product: ProductType) => {
    setForm({
      name_product: product.name_product,
      brand_product: product.brand_product,
      price_product: product.price_product.toString(),
      stock_product: product.stock_product.toString(),
      type_product: product.type_product,
    });
    setEditMode(true);
    setEditId(product.id);
    setImageFile(null);
  };

  // Filter dan Sorting
  const filteredProducts = products
    .filter(p => filterType === 'all' || p.type_product === filterType)
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name_product.localeCompare(b.name_product);
      } else {
        return b.name_product.localeCompare(a.name_product);
      }
    });

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className={styles.allcontainer}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        {/* Input Fields */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Nama Product</label>
          <input type="text" name="name_product" value={form.name_product} onChange={handleChange} required className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Brand Product</label>
          <input type="text" name="brand_product" value={form.brand_product} onChange={handleChange} required className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Harga Product</label>
          <input type="number" name="price_product" value={form.price_product} onChange={handleChange} required className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Total Stok</label>
          <input type="number" name="stock_product" value={form.stock_product} onChange={handleChange} required className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Tipe Produk</label>
          <select name="type_product" value={form.type_product} onChange={handleChange} required className={styles.select}>
            <option value="">Pilih Tipe</option>
            <option value="Alat Alat">Alat Alat</option>
            <option value="Bahan Bahan">Bahan Bahan</option>
            <option value="Karya">Karya</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Gambar Produk</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className={styles.fileInput} />
        </div>
        <button type="submit" disabled={loading} className={styles.buttonAdd}>
          {loading ? (editMode ? 'Menyimpan Perubahan...' : 'Mengunggah...') : (editMode ? 'Perbarui Produk' : 'Tambah Produk')}
        </button>
        {editMode && (
          <button type="button" onClick={() => {
            setEditMode(false);
            setEditId(null);
            setForm({ name_product: '', brand_product: '', price_product: '', stock_product: '', type_product: '' });
            setImageFile(null);
          }} className={styles.button}>
            Batal Edit
          </button>
        )}
      </form>

      {/* Sorting dan Filtering */}
      <div className={styles.sortFilterContainer}>
        <div>
          <label>Urutkan Nama:</label>
          <select onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')} value={sortOrder} className={styles.select}>
            <option value="asc">A - Z</option>
            <option value="desc">Z - A</option>
          </select>
        </div>
        <div>
          <label>Filter Tipe:</label>
          <select onChange={(e) => setFilterType(e.target.value)} value={filterType} className={styles.select}>
            <option value="all">Semua</option>
            <option value="Alat Alat">Alat Alat</option>
            <option value="Bahan Bahan">Bahan Bahan</option>
            <option value="Karya">Karya</option>
          </select>
        </div>
      </div>

      {/* Tabel Produk */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Gambar</th>
            <th>Nama</th>
            <th>Merk</th>
            <th>Harga</th>
            <th>Stok</th>
            <th>Tipe</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((p) => (
            <tr key={p.id}>
              <td>
                {p.image_products ? (
                  <Image src={p.image_products} alt={p.name_product} width={120} height={120} style={{ objectFit: 'cover', borderRadius: '8px' }} />
                ) : "Tidak ada gambar"}
              </td>
              <td>{p.name_product}</td>
              <td>{p.brand_product}</td>
              <td>{p.price_product}</td>
              <td>{p.stock_product}</td>
              <td>{p.type_product}</td>
              <td>
                <button onClick={() => handleEdit(p)} className={styles.button}>Edit</button>
                <button onClick={() => handleDelete(p.id)} className={styles.button}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`${styles.pageButton} ${currentPage === i + 1 ? styles.active : ''}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
