import "@/styles/globals.css";
import type { AppProps } from "next/app";
import dynamic from 'next/dynamic';

const NotificationOverlay = dynamic(() => import('@/components/hooks/notification/notification'), {
  ssr: false
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <NotificationOverlay />
    <Component {...pageProps} />;  
    </>
  )
  
}
