import "./globals.css";
import { Suspense } from "react";
import { Provider } from "@/components/ui/provider";
import AuthProvider from "@/context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>
          <Suspense fallback={<div>Carregando...</div>}>
            <AuthProvider>{children}</AuthProvider>
          </Suspense>
        </Provider>
      </body>
    </html>
  );
}
