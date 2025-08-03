import RegisterPage from "@/components/auth/RegisterPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register Page | TailAdmin - Next.js Dashboard Template",
  description: "This is  Register Page TailAdmin Dashboard Template",
};
 export default function Register (){
  return (
    <RegisterPage/>
  )
}


