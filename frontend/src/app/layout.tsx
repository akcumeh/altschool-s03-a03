import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Kay's Kitchen",
    description: "Restaurant chatbot — order food, track your order, pay online.",
    icons: {
        icon: "/assets/apple-touch-icon.png",
        apple: "/assets/apple-touch-icon.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} h-full`}>
            <body className="min-h-dvh bg-[#3f4347] md:flex md:items-center md:justify-center md:py-8">
                {/*
                 * Phone frame: full-screen on mobile, fixed 390×760 card on desktop.
                 * md:h-[760px] — explicit height so it never fills the screen.
                 * md:max-h-[calc(100dvh-4rem)] — safety clamp on short viewports.
                 */}
                <div className="relative w-full h-dvh md:w-[390px] md:h-[760px] md:max-h-[calc(100dvh-4rem)] md:rounded-[24px] overflow-hidden md:shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_6px_20px_rgba(0,0,0,0.38),0_24px_70px_rgba(0,0,0,0.58)] bg-[#fff6e8]">
                    {children}
                </div>
            </body>
        </html>
    );
}
