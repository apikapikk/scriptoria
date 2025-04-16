"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";
import styles from "./qr.module.css";

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
}

const QRScanner = ({ onScanSuccess }: QRScannerProps) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    scanner.render(
      (decodedText: string) => {
        onScanSuccess(decodedText);
        scanner.clear().catch(console.error);
      },
      undefined // optional error callback
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [onScanSuccess]);

  return (
   <div className={styles.qrWrapper}>
  <div id="qr-reader" className={styles.qrReader}></div>
</div>
  )
};

export default QRScanner;
