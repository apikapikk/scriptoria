import Image from "next/image";
import Link from "next/link";
import styles from "./baseNavbar.module.css";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const BaseNavbar = () => {
    const router = useRouter()
    const handleLogout = () => {
        Cookies.remove("user");
        window.dispatchEvent(new CustomEvent('user-logout', { detail: { isLoggedIn: false } }));
        console.log("Logout clicked");
        router.push("/"); 
    };
    return (
        <>
            <header className={styles.header}>
            <div className={styles.logoContainer}>
            <Link href="/" passHref>
            <Image className={styles.logo} src="/logo.png" alt="Logo" width={500} height={500} />
            <Image className={styles.textLogo} src="/text-logo.png" alt="textLogo" width={500} height={500} />
            </Link>
            <div className={styles.logout} onClick={handleLogout} style={{ cursor: "pointer" }}>
            <Image className={styles.logoutLogo} src="/logout.png" alt="textLogo" width={500} height={500} />
            </div>
            </div>
            </header>
        </>
    )
}
export default BaseNavbar;