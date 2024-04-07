import dynamic from 'next/dynamic'
const RegisterForm = dynamic(() => import('../components/RegisterForm'), { ssr: false })

/* eslint-disable @next/next/no-img-element */
export default function Register() {
    return (
      <RegisterForm/>
    );
  }
  