import React from 'react'
import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import('@/components/layout/loginForm'), {
  ssr: false, // Mencegah server-side rendering
});

export default function LoginPage() {
  return <LoginForm />;
}