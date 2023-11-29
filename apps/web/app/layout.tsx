import "@/styles/globals.css";
import "@/styles/mdx.css";

import { cookies } from "next/headers";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "trpc/react";

export const metadata = {
  title: {
    default: "Monorepo",
    template: "%s | Monorepo",
  },
  description: "Generated by Monorepo-Starter",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <TRPCReactProvider cookies={cookies().toString()}>
          {children}
          <Toaster richColors />
          <ReactQueryDevtools
            buttonPosition="bottom-left"
            initialIsOpen={false}
          />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
