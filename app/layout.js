import Footer from "@/components/Footer";
import HeaderBottom from "@/components/HeaderBottom";
import HeaderTop from "@/components/HeaderTop";
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
         <link href="/css/login.css" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}
