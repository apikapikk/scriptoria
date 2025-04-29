import BaseNavbar from '@/components/layout/baseNavbar'
import Report from '@/components/layout/report'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

export default function ReportPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const cookie = Cookies.get("user");
    if (!cookie) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(cookie);
    if (user.position !== "Manager") {
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
      <Report />
    </div>
  )
}
