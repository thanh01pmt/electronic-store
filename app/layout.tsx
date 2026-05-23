import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Container } from "@/components/ui/container";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth-context";
import { CurrencyProvider } from "@/context/currency-context";
import { ReduxProvider } from "@/context/redux-context";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter, Exo_2 } from "next/font/google";
import "./globals.css";
import { env } from "@/env";

const inter = Inter({ 
	subsets: ["vietnamese", "latin"],
	variable: "--font-inter",
});

const exo2 = Exo_2({ 
	subsets: ["vietnamese", "latin"],
	variable: "--font-exo2",
});

export const metadata: Metadata = {
	metadataBase: new URL(env.NEXT_PUBLIC_APP_URL || "https://localhost:3000"),
	title: "VICHIP Electronics | Nhà phân phối linh kiện công nghiệp chính hãng",
	description: "Nhà phân phối linh kiện điện tử công nghiệp hàng đầu: IC, MCU, Thiết bị nguồn, Cảm biến, Đầu nối, Rơ-le và Hệ thống nhúng.",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
	authors: [
		{
			name: "deepak-jdr",
			url: "https://www.consolelogs.in",
		},
	],
	creator: "VICHIP Electronics",
	openGraph: {
		title: "VICHIP Electronics | Nhà phân phối linh kiện công nghiệp chính hãng",
		description: "Nhà phân phối linh kiện điện tử công nghiệp hàng đầu: IC, MCU, Thiết bị nguồn, Cảm biến, Đầu nối, Rơ-le và Hệ thống nhúng.",
		url: "https://ele-store.netlify.app",
		locale: "vi_VN",
		siteName: "VICHIP Electronics",
		type: "website",
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="vi"
			className={`h-full ${inter.variable} ${exo2.variable}`}>
			<body className="font-sans antialiased bg-background text-foreground h-full min-h-screen flex flex-col">
				<AuthProvider>
					<CurrencyProvider>
						<ReduxProvider>
							<Header />
							<Container>{children}</Container>
						</ReduxProvider>
						<Footer />
					</CurrencyProvider>
				</AuthProvider>
				<Toaster />
				<Analytics />
			</body>
		</html>
	);
}
