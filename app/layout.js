import Footer from "@/components/Footer";
import HeaderBottom from "@/components/HeaderBottom";
import HeaderTop from "@/components/HeaderTop";
import LoginCSS from "@/components/LoginCSS";
import Script from "next/script";
export const metadata = {
  title: "FUTY : Friendly App",
  description: "FUTY : Friendly App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-bs-theme="auto">
      <head>
        <HeaderTop></HeaderTop>
        <HeaderBottom></HeaderBottom>
        <LoginCSS></LoginCSS>
      </head>
      <body>
        {children}
        <Script src="/js/dataTables.js" strategy="afterInteractive" />
        <Script src="/js/dataTables.bootstrap5.js" strategy="afterInteractive" />
        <Footer></Footer>
      </body>
    </html>
  );
}
