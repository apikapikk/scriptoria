import Image from "next/image";
import styles from "./navbar.module.css";
import { useRouter } from "next/router";
import { useState } from "react";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false); // Tutup menu setelah klik
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Image className={styles.logo} src="/logo.png" alt="Logo" width={500} height={500} />
        <Image className={styles.textLogo} src="/text-logo.png" alt="textLogo" width={500} height={500} />
      </div>

      <button
        className={styles.hamburger}
        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
      >
        ☰
      </button>

      <nav className={`${styles.navigation} ${isMobileMenuOpen ? styles.showMenu : ""}`}>
        <ul className={styles.navLinks}>
          <li onClick={(e) => { e.preventDefault(); handleNavigation("about"); }}>
            <a href="#">BERANDA</a>
          </li>
          <li onClick={(e) => { e.preventDefault(); handleNavigation("services"); }}>
            <a href="#">LAYANAN</a>
          </li>
          <li onClick={(e) => { e.preventDefault(); handleNavigation("about"); }}>
            <a href="#">KONTAK</a>
          </li>
        </ul>
      </nav>

      <a className={styles.cla} onClick={handleLogin} style={{ cursor: "pointer" }}>
        <button>LOGIN</button>
      </a>
    </header>
  );
};

export default Navbar;
