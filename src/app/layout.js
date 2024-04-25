import { Roboto } from "next/font/google";
import "./globals.css";
import Heading from "@/components/Heading/Heading";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata = {
  title: "TubeTalks",
  description: "Created by Ralph Sormillon",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <div className="container">
          <Heading />
          {children}
        </div>
      </body>
    </html>
  );
}
