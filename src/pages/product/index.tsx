import BaseNavbar from '@/components/layout/baseNavbar'
import Product from '@/components/layout/product'
import React, { useEffect, useState } from 'react'
import styles from './product.module.css';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function ProductPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const cookie = Cookies.get("user");
    if (!cookie) {
      router.push("/login");
      return;
    }
    
    const user = JSON.parse(cookie);
    if (user.position !== "Manager" && user.position !== "Employee") {
      alert("Akses ditolak. Halaman ini hanya untuk admin.");
      router.push("/login");
      return;
    }

    setCheckingAuth(false);
  }, [router]);

  if (checkingAuth) return <div>Memuat...</div>;
  return (
    <div className={styles.container}>
      <BaseNavbar />
      <Product />
    </div>
  )
}
