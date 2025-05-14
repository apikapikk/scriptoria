import AboutGroup from "@/components/layout/aboutGroup";
import AboutUs from "@/components/layout/aboutUs";
import Navbar from "@/components/layout/navbar";
import PreviewProduct from "@/components/layout/previewProduct";
import Services from "@/components/layout/services";
import { useEffect, useState } from "react";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const sections = document.querySelectorAll(".section");
    let isScrolling = false;

    const handleScroll = (event: WheelEvent) => {
      if (isScrolling) return;
      event.preventDefault();
      isScrolling = true;

      let newIndex = currentIndex + (event.deltaY > 0 ? 1 : -1);
      if (newIndex < 0) newIndex = 0;
      if (newIndex >= sections.length) newIndex = sections.length - 1;

      setCurrentIndex(newIndex);
      sections[newIndex].scrollIntoView({ behavior: "smooth" });

      setTimeout(() => {
        isScrolling = false;
      }, 800);
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    return () => window.removeEventListener("wheel", handleScroll);
  }, [currentIndex]);

  return (
    <div>
      <Navbar />
      <div className="section-container">
        <div id="home" className="section"><PreviewProduct /></div>
        <div id="services" className="section"><Services /></div>
        <div id="about" className="section"><AboutUs /></div>
        <div id="aboutGroup" className="section"><AboutGroup /></div>
      </div>
    </div>
  );
}
