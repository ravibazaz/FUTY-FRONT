import Script from "next/script";
export const metadata = {
  title: "FUTY : Friendly App",
  description: "FUTY : Friendly App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/css/adminlte.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body className="hold-transition sidebar-mini layout-fixed">
        {children}
        <Script
          src="https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/js/adminlte.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
