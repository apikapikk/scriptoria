import styles from './four.module.css';
const FourPages = () => {
 return (
  <div className={styles.container}>
    {/* Header */}
    <header className={styles.header}>
      <h1 className={styles.logo}>Scriptoria</h1>
    </header>

    {/* Form Input */}
    <div className={styles.formContainer}>
      <label>Tgl/Bulan/Tahun</label>
      <input type="text" placeholder="Tgl/Bulan/Tahun" className={styles.input} />
      
      <label>Nama Kasir</label>
      <input type="text" placeholder="Nama Kasir" className={styles.input} />
    </div>

    {/* Total Payment */}
    <div className={styles.totalPayment}>
      <h3>TOTAL PAYMENT</h3>
      <p>Rp.0,00</p>
    </div>

    {/* Tombol Aksi */}
    <div className={styles.buttonContainer}>
      <button className={styles.actionButton}>🛒 Tambah Produk</button>
      <button className={styles.actionButton}>✏️ Edit Produk</button>
      <button className={styles.actionButton}>🗑️ Hapus Produk</button>
    </div>

    {/* Tabel Produk */}
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID Produk</th>
          <th>Nama Produk</th>
          <th>Brand Produk</th>
          <th>Harga Produk</th>
          <th>Jumlah Produk</th>
          <th>Sub Total Produk</th>
        </tr>
      </thead>
      <tbody>
        <tr>
        <td colSpan={6} className={styles.emptyRow}>Data belum tersedia</td>
        </tr>
      </tbody>
    </table>

    {/* Input Pembayaran */}
    <div className={styles.paymentContainer}>
      <label>DIBAYAR</label>
      <input type="text" className={styles.input} />
      
      <label>KEMBALI</label>
      <input type="text" className={styles.input} />
    </div>
  </div>
);
} 
export default FourPages;