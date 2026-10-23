import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { DarkModeProvider } from "./context/darkmode/DarkModeProvider";
import DarkMode from "./components/DarkMode";
import Script from "next/script";
import { CsrfProvider } from "./context/csrf/CsrfProvider";

const themeScript = `
  (function () {
    try {
      var savedTheme = localStorage.getItem("theme");
      var theme = savedTheme ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light");

      document.documentElement.dataset.theme = theme;
    } catch (e) {}
  })();
`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GKI Perumahan Citra 1",
  description: "A website app for church",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang='en'
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          id='theme-script'
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className='min-h-full flex flex-col'>
        <CsrfProvider>
          <DarkModeProvider>
            <Header />
            {children}
            <DarkMode />
          </DarkModeProvider>
        </CsrfProvider>
      </body>
    </html>
  );
}
