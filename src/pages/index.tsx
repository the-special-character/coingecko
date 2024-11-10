import localFont from "next/font/local";
import Highlights from "@/container/Highlights";
import TokensTable from "@/container/TokensTable";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)] min-h-dvh container mx-auto`}
    >
      <Highlights />
      <TokensTable />
    </div>
  );
}
