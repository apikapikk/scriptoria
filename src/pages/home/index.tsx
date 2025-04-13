import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import BaseNavbar from '@/components/layout/baseNavbar'
import HomeFirstPage from '@/components/layout/homePages/firstPage'
import HomeSecondPage from '@/components/layout/homePages/secondPage'


export default function HomePage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const cookie = Cookies.get("user");
    if (!cookie) {
      router.push("/login");
      return;
    }

    // Cek role jika perlu (misalnya hanya admin boleh)
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
    <div>
      <BaseNavbar />
      <HomeFirstPage />
      <HomeSecondPage />

    </div>
  )
}
