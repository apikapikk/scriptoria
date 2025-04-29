import Chat from "@/components/layout/chat";
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

const Home = () => {
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
      <h1>Welcome to the live chat!</h1>
      <Chat />
    </div>
  );
};

export default Home;
