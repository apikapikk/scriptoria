import styles from "./services.module.css"
import Image from 'next/image';
import { motion } from "framer-motion";

const Services = () => {
    return (
        <div className={styles.servicesContainer}>
            <motion.span
                className={styles.aboutMe}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: false, amount: 0.5 }}
            >
                <h1>Layanan Kami</h1>
                <h3>Management  penjualan produk alat tulis menjadi solusi bagi kamu</h3>
            </motion.span>
            <motion.div
                className={styles.cards}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: false, amount: 0.5 }}
            >
                <div className={styles.childCards}>
                <Image className={styles.cardsIcons}
                    src="/employee.png" 
                    alt="Logo"
                    width={500}
                    height={500}
                />
                <span>Manajemen Produk</span>
                <h3>Pemilik toko dapat mengelola akses karyawan dan aktifitas karyawan dengan mekanisme CRUD </h3>
                </div>
                <div className={styles.childCards}>
                <Image className={styles.cardsIcons}
                    src="/product.png" 
                    alt="Logo"
                    width={500}
                    height={500}
                />
                <span>Manajemen Penjualan</span>
                <h3>Pemilik toko dapat mengelola stok produk, harga produk, dan diskon promo produk dengan mekanisme CRUD</h3>
                </div>
                <div className={styles.childCards}>
                <Image className={styles.cardsIcons}
                    src="/sell.png" 
                    alt="Logo"
                    width={500}
                    height={500}
                />
                <span>Manajemen Karyawan</span>
                <h3>Pemilik toko dapat mengelola penjualan produk yang dilakukan kasir dengan mekanisme CRUD </h3>
                </div>
            </motion.div>
        </div>
    )
}

export default Services