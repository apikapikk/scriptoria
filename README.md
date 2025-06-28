# Website Sistem Kasir untuk UMKM Alat Tulis
Website Sistem Kasir untuk UMKM Alat Tulis ini dirancang untuk membantu digitalisasi proses penjualan dan pengelolaan toko agar lebih efisien dan terorganisir. Sistem ini mendukung dua peran utama, yaitu Admin (pemilik toko) dan Karyawan (kasir), yang masing-masing memiliki hak akses sesuai kebutuhan operasional. Admin dapat mengelola produk, stok barang, laporan penjualan, serta data pengguna, sementara kasir dapat melakukan transaksi penjualan dan mencetak struk. Website ini dibangun dengan antarmuka yang responsif, ramah pengguna, dan dapat diakses melalui perangkat desktop secara lokal. Selain itu, sistem ini juga menyediakan fitur pencarian barang, histori transaksi, serta laporan yang membantu pemilik toko dalam menganalisis performa penjualan. Dengan fitur-fitur tersebut, sistem ini diharapkan dapat menjadi solusi praktis dan terjangkau untuk meningkatkan produktivitas dan akurasi operasional UMKM di bidang alat tulis.

![image alt](https://github.com/apikapikk/scriptoria/blob/228636099c64d54c387faa9a3e514fd8ee2c489a/Poster.png)

---
## Url Prodi
Berikut adalah Url Prodi Pendidikan Teknologi Informasi:  
🔗 [https://pendidikan-ti.ft.unesa.ac.id/](https://pendidikan-ti.ft.unesa.ac.id/)


🔗 https://scriptoria-indol.vercel.app/

    U: admin P:admin1234
---
## Anggota Tim Pengembang

| No. | Nama                             | NIM           |
|-----|----------------------------------|---------------|
| 1.  | Madhuri Lailatul Hamidah         | 23050974057   |
| 2.  | Febti Sofia Loren                | 23050974058   |
| 3.  | Muhammad Alfan Muwaffiqul Ihsan  | 23050974072   |
| 4.  | Narendra Adi Nugraha             | 23050974076   |

---
## Teknologi yang Digunakan

- **Frontend**: Next.js (Pages Router) + TypeScript
- **Styling**: CSS Modules
- **Backend/API**: Next.js API Routes (untuk notifikasi)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **QR Scanner**: `html5-qrcode` / `react-qr-reader`
- **Chart**: Recharts
- **Realtime**: Supabase Realtime Subscriptions
- **Deployment**: Vercel

---
## API Endpoint

| Method | Endpoint              | Deskripsi                          |
|--------|------------------------|-------------------------------------|
| GET    | `/api/notification`    | Mengambil daftar notifikasi         |
| POST   | `/api/notification`    | Menambahkan notifikasi baru         |

> Catatan: Data produk, transaksi, dan pengguna dikelola langsung melalui Supabase.

---
## Struktur Proyek

```
public/ # Aset publik (logo, gambar)
src/
 ├── components/ # Komponen UI seperti CardProduk, Header, dll.
 ├── lib/ # Konfigurasi Supabase Client
 ├── pages/ # Halaman utama (dashboard, kasir, login)
 │ └── api/notification # API routes notifikasi

```
---
## Fitur Umum

- Login berdasarkan peran (Admin/Karyawan)
- Manajemen Karyawan (khusus Admin)
- Manajemen Produk
- Manajemen Penjualan & Transaksi
- Laporan Keuangan (khusus Admin)
- Komunikasi Internal melalui Catatan

---

## Akses Peran: Admin (Pemilik Toko)

Admin memiliki **akses penuh** ke seluruh fitur dalam sistem.

### Login
- Masuk menggunakan username dan password sebagai pemilik toko.

### Manajemen Karyawan
- **Create**: Tambah karyawan baru (Nama, Username, Password, Role)
- **Read**: Lihat daftar karyawan
- **Update**: Edit data karyawan
- **Delete**: Hapus karyawan yang sudah keluar

### Manajemen Produk
- **Create**: Tambah produk baru (Nama Produk, Harga, Stok)
- **Read**: Lihat semua produk
- **Update**: Ubah nama atau harga produk
- **Delete**: Hapus produk yang tidak dijual lagi
Generate QR code otomatis

### Manajemen Penjualan & Transaksi

#### a. Keranjang Produk
- **Create**: Tambahkan produk ke keranjang
- **Read**: Lihat daftar produk dalam keranjang
- **Update**: Ubah jumlah pembelian
- **Delete**: Hapus produk dari keranjang

#### b. Transaksi Penjualan
- **Create**: Buat transaksi baru dan nota penjualan
- **Read**: Lihat detail transaksi
- **Update**: Koreksi data transaksi
- **Delete**: Hapus transaksi dengan konfirmasi
scan qr 

### Laporan Keuangan
- **Read**: Lihat laporan penjualan harian dan bulanan otomatis dari transaksi

### Catatan Internal
- Admin dapat mengirimkan pesan, perintah, atau instruksi kerja ke karyawan (satu arah)
- Karyawan dapat memberikan validasi atau tanggapan atas tugas yang diberikan

---

## Akses Peran: Karyawan (Kasir)

Karyawan memiliki akses terbatas sesuai kebutuhan operasional kasir.

### Login
- Masuk menggunakan akun karyawan dengan hak akses terbatas.

### Manajemen Produk
- **Create**: Tambah produk baru
- **Read**: Lihat daftar produk
- **Update**: Ubah harga atau nama produk
- **Delete**: Hapus produk yang tidak tersedia

### Manajemen Penjualan & Transaksi

#### a. Keranjang Produk
- **Create**: Tambahkan produk ke keranjang
- **Read**: Lihat daftar produk dalam keranjang
- **Update**: Ubah jumlah pembelian
- **Delete**: Hapus produk dari keranjang

#### b. Transaksi Penjualan
- **Create**: Buat transaksi baru dan cetak nota
- **Read**: Lihat detail transaksi
- **Update**: Koreksi data transaksi
- **Delete**: Hapus transaksi (dengan konfirmasi)

### Catatan Internal
- Karyawan dapat melihat pesan dari Admin dan mengirimkan validasi atau respon atas tugas

---
## Catatan Tambahan

- Menggunakan UI/UX sederhana dan responsif
- Role-based access control manual (tanpa Supabase Auth)
- Komunikasi internal berbasis catatan tugas
- Penyimpanan file terintegrasi dengan Supabase Storage

## Lisensi

Open Source — bebas digunakan dan dimodifikasi sesuai kebutuhan, dengan tetap mencantumkan atribusi yang sesuai.

## Cara Menjalankan Project Ini

1. **Clone repository**
   ```bash
   git clone https://github.com/apikapikk/scriptoria.git
   cd scriptoria

 Install dependencies

    npm install
  # atau jika menggunakan yarn:
    yarn install
  
  Buat file konfigurasi .env.local
  Contoh isi file .env.local (gunakan kredensial dari Supabase kalian):
    
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

  buat database di sql editor supabase, masukkan database dengan cara copy dari folder _database
  
  Jalankan di mode development
  
    npm run dev
  
  Aplikasi akan berjalan di: http://localhost:3000

---
