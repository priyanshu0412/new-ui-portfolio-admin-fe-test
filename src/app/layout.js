import { Poppins } from "next/font/google";
import "./globals.css";
import { ClientProvider, Navbar } from "@/components";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "Priyanshu Agrawal | Admin",
  description: "Priyanshu Agrawal — Admin",
  icons: {
    icon: "/meta_icon.jpg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <ClientProvider>
          <Navbar />
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
