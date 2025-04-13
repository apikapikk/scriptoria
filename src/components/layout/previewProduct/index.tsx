import styles from "./previewProduct.module.css"
import Image from 'next/image';
import { motion } from "framer-motion";
import useTypewriter from "@/components/hooks/animations/useTypewritter";
import { useRouter } from "next/router";

const PreviewProduct = () => {
    const typedText = useTypewriter(
        "Membantu Mengelola Penjualan", 
        ["Produk Pilihan", "Alat Tulis Pilihan"], 
        80, 
        1500
    );
    const router = useRouter()
    const handleLogin = () => {
        console.log("Login clicked");
        router.push("/login"); 
    };
    return (
    <div className={styles.previewContainer}>
        <span className={styles.textContainer}>
        <motion.h1 
        className={styles.headingText} 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }} > {typedText} </motion.h1>
        <p className={styles.paragraphText}>Scriptoria hadir untuk membantu pemilik usaha UMKM Alat Tulis mengelola penjualan produk dengan mekanisme yang tercepat</p>
        <a className={styles.buttonSet} onClick={handleLogin} style={{ cursor: "pointer" }}><button>Atur Penjualan </button></a>
        </span>
        <motion.div className={styles.imageContainer}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false, amount: 0.5 }} >
        <Image className={styles.productPreview} src="/product-preview.png" alt="productPreview" width={1000} height={1000} />
        <Image className={styles.productPreviewBottom} src="/product-preview-bottom.png"  alt="productPReviewBottom" width={1000} height={1000} />
        </motion.div>
    </div>
    )
}
export default PreviewProduct;