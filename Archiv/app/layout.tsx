import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "COACH UNITED",
  description: "Fußballübungen für Trainer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body style={{ 
        margin: 0, 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: '#f5f5f5'
      }}>
        {children}
      </body>
    </html>
  );
}
