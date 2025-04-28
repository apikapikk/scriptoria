import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import styles from "./loginForm.module.css";
import { useRouter } from "next/router";
import { supabase } from "../../../utils/supabase";
import { useEffect } from "react";
import Cookies from "js-cookie";

const LoginForm = () => {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const username = (form.username as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;

    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("username_employee", username)
      .eq("password_employee", password)
      .single(); 

    if (error || !data) {
      alert("Username atau password salah.");
      return;
    }

    Cookies.set("user", JSON.stringify({
        id: data.id_employee,
        username: data.username_employee,
        name: data.name_employee,
        position: data.position_employee,
      }), { expires: 1 });
      window.dispatchEvent(new CustomEvent('user-login', { detail: { isLoggedIn: true } }));
      router.push("/home");

  };

  useEffect(() => {
    const cookie = Cookies.get("user");
  if (cookie) {
    const user = JSON.parse(cookie);
    if (user.position === "Manager" || user.position === "Admin") {
      router.push("/home");
    } else {
      Cookies.remove("user");
    }
  }
  },);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Link href="" passHref>
            <Image className={styles.logo} src="/logo.png" alt="Logo" width={500} height={500} />
            <Image className={styles.textLogo} src="/text-logo.png" alt="textLogo" width={500} height={500} />
          </Link>
        </div>
      </header>
      <div className={styles.mainPage}>
        <div className={styles.leftPage}>
          <h1>LAKUKAN LOGIN AKSES AKUN</h1>
          <h3>Selamat datang kembali! Masuk dan gunakan akun anda!</h3>
        </div>
        <div className={styles.rightPage}>
          <motion.div
            className={styles.loginWrapper}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" placeholder="Masukkan username" required />
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Masukkan password" required />
              <button type="submit" className={styles.loginButton}>Login</button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
