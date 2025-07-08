import type { Metadata } from "next";
import "./globals.css";
import ChakraCustomProvider from "@/components/chakra-config/custom-provider";
import ReactQuerryProvider from "@/components/external-libs/react-querry/provider";
import { ReactNode } from "react";
import { Montserrat } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Bridge CrossRoad",
  description: "Authors: Szymon Kubiczek, Bartłomiej Szubiak, Joanna Konieczny",
};

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      suppressHydrationWarning
      lang={locale}
      className={montserrat.variable}
    >
      <body>
        <ReactQuerryProvider>
          <NextIntlClientProvider>
            <ChakraCustomProvider>{children}</ChakraCustomProvider>
          </NextIntlClientProvider>
        </ReactQuerryProvider>
      </body>
    </html>
  );
}
