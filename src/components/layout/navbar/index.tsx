import Image from "next/image";
import styles from "./navbar.module.css";
import { useRouter } from "next/router";

const Navbar = () => {
  const handleNavigation = (id: string) => {
  console.log(`Navigating to: ${id}`); 
  const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      console.log(`Scrolled to: ${id}`);
    } else {
      console.warn(`Section ${id} not found!`);
    }
  };
  const router = useRouter()
      const handleLogin = () => {
          console.log("Login clicked");
          router.push("/login"); 
  }; 
  return (
    <header className={styles.header}>
    <div className={styles.logoContainer}>
      <Image className={styles.logo} src="/logo.png" alt="Logo" width={500} height={500} />
      <Image className={styles.textLogo} src="/text-logo.png" alt="textLogo" width={500} height={500} />
    </div>
    <nav className={styles.navigation}>
      <ul className={styles.navLinks}>
      <li onClick={(e) => { e.preventDefault(); handleNavigation("about"); }} >
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
      <a className={styles.cla} onClick={handleLogin} style={{ cursor: "pointer" }} >
        <button>LOGIN</button>
      </a>
    </header>
  );
};
export default Navbar;
