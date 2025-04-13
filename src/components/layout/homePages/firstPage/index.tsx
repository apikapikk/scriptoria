import Image from "next/image";
import styles from "./first.module.css";

const HomeFirstPage = () => {
  return (
   <>
   <div className={styles.page}>
   <div className={styles.headerContainer}>
   <h1>Selamat Datang dan Kelola Managemen Toko Alat Tulis Pilihan Anda!</h1>
   <Image className={styles.images} src="/homeAsset.png" alt="HomeAsset" width={500} height={500} />
   </div>
   </div>
   </>
  )
}
export default HomeFirstPage