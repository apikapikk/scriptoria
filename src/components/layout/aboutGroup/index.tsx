import Footer from "../footer";
import styles from "./AboutGroup.module.css";
import Image from "next/image";

const AboutGroup = () => {
  return (
    <>
      <div className={styles.AboutGroupContainer}>
        <div className={styles.box}>
          <Image
            className={styles.textLogo}
            src="/props.jpg"
            alt="textLogo"
            width={500}
            height={500}
          />
        </div>

        <div className={styles.textContainer}>
          <h1>Tentang Kelompok Kami</h1>
          <p>
            Kami adalah Kelompok 7 dari Program Studi PTIB angkatan 2023, terdiri dari empat mahasiswa yang memiliki minat dalam pengembangan perangkat lunak. Website ini merupakan bagian dari proyek pengembangan software yang kami rancang dan bangun bersama, mulai dari tahap perencanaan, desain antarmuka, hingga implementasi fitur.
          </p>
          <ul>
            <li>Madhuri Lailatul Hamidah (23050974057)</li>
            <li>Febti Sofia Loren (23050974058)</li>
            <li>Muhammad Alfan Muwaffiqul Ihsan (23050974072)</li>
            <li>Narendra Adi Nugraha (23050974076)</li>
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutGroup;
