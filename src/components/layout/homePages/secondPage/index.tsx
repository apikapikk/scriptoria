import Image from "next/image";
import styles from "./second.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const HomeSecondPage = () => {
  const router = useRouter();
  const [position, setPosition] = useState<string | null>(null);

  useEffect(() => {
    const cookie = Cookies.get("user");
    if (cookie) {
      try {
        const user = JSON.parse(cookie);
        setPosition(user?.position || null);
      } catch (error) {
        console.error("Failed to parse user cookie", error);
        setPosition(null);
      }
    } else {
      setPosition(null);
    }
  }, []);

  const handleNavigation = (path: string) => {
    console.log(`${path} clicked`);
    router.push(`/${path}`);
  };

  // Membuat list kartu sesuai dengan role
  const cards = [
    { title: "Managemen Karyawan", path: "employee", image: "/employeeIco.png", visible: position === "Manager" },
    { title: "Managemen Produk", path: "product", image: "/produkIco.png", visible: true },
    { title: "Laporan Penjualan", path: "report", image: "/reportIco.png", visible: position === "Manager" },
    { title: "Manajemen Penjualan", path: "payment", image: "/sellIco.png", visible: true },
  ];

  return (
    <div className={styles.page}>
      <span>Kategori</span>
      <div className={styles.cardContainer}>
        {cards
          .filter(card => card.visible) // Hanya menampilkan kartu yang visible
          .map((card, index) => (
            <div 
              key={index} 
              className={styles.cards} 
              onClick={() => handleNavigation(card.path)} 
              style={{ cursor: "pointer" }}
            >
              <Image 
                className={styles.images} 
                src={card.image} 
                alt={card.title} 
                width={500} 
                height={500} 
              />
              <h1>{card.title}</h1>
            </div>
          ))}
      </div>
    </div>
  );
};

export default HomeSecondPage;
