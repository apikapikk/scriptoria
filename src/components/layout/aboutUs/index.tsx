import styles from "./aboutUs.module.css"
import Image from "next/image";

const AboutUs = () => {
    return (
        <>
        <div className={styles.aboutUsContainer}>
            <div className={styles.box}>
            <Image className={styles.textLogo} src="/dummyImage.png" alt="textLogo" width={500} height={500} />
            </div>
            <div className={styles.textContainer}>
            <h1>Tentang Kami</h1>
            <p>Scriptoria hadir sebagai platform inovatif yang membantu pemilik usaha UMKM di bidang alat tulis untuk mengelola bisnis dengan lebih efisien. Dengan fitur lengkap yang kami sediakan, Anda dapat dengan mudah memantau stok, mengelola transaksi, serta mengawasi kinerja karyawan dalam satu sistem yang terintegrasi.
                Kami memahami tantangan dalam menjalankan bisnis alat tulis, itulah sebabnya Scriptoria dirancang untuk memberikan kemudahan dalam manajemen toko, meningkatkan produktivitas, dan membantu bisnis Anda berkembang. Percayakan operasional toko Anda pada teknologi yang cerdas dan praktis bersama Scriptoria!</p>
            </div>
        </div>
        </>
        
    )
}

export default AboutUs