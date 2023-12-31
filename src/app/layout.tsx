import "server-only";
import "./globals.css"

export const metadata = {
  title: "Event Captioner by Deepgram",
  description: " Transcribe your events in real-time with Deepgram's Event Captioner."
};

import SupabaseAuthProvider from "../components/providers/supabase-auth-provider";
import SupabaseProvider from "../components/providers/supabase-provider";
import { createClient } from "../utils/supabase-server";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
          <SupabaseAuthProvider serverSession={session}>
            {children}
          </SupabaseAuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}