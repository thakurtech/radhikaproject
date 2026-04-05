import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "./components/AppLayout";

export const metadata: Metadata = {
  title: "EduVerse — AI-Powered School ERP",
  description: "The most advanced AI-integrated School & College ERP SaaS platform. Manage students, teachers, attendance, finance, and more with AI-powered insights.",
  keywords: ["school ERP", "college management system", "AI education", "student management", "school software"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
