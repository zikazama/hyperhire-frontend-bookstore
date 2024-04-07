"use client"
import dynamic from 'next/dynamic'
const LoginForm = dynamic(() => import('../components/LoginForm'), { ssr: false })

/* eslint-disable @next/next/no-img-element */
export default function Login() {

  return (
    <LoginForm/>
  );
}
