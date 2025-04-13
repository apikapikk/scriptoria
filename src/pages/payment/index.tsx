import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import Payment from '@/components/layout/payment'
import BaseNavbar from '@/components/layout/baseNavbar'

export default function PaymentPage() {
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
    <>
      <div>
        <BaseNavbar />
        <Payment />
      </div>
    </>
  )
}
