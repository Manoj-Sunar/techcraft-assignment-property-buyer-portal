

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "./ReactQueryProvider";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./components/AuthContext";








const poppins = Poppins({
  display: "swap",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"]
});



export const metadata: Metadata = {
  title: "Property Site ",
  description: "Mark Your Property",
};




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">


        <ReactQueryProvider>

          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </ReactQueryProvider>


      </body>
    </html>
  );
}
