"use client";
import { usePathname } from "next/navigation";
export default function LoginCSS() {
    const pathname = usePathname();
    const isLoginPage = pathname === "/";
    return (
        <>
             {isLoginPage && <link rel="stylesheet" href="/css/login.css" />}
        </>

    );
}
