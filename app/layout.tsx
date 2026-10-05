import type { Metadata } from "next";
import "@fontsource/atkinson-hyperlegible/400.css";
import "@fontsource/atkinson-hyperlegible/700.css";
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/600.css";
import "./globals.css";
import { OFFER } from "@/lib/offer";

export const metadata: Metadata = {
  title: {
    default: "Aura",
    template: "%s · Aura",
  },
  description: `${OFFER.tagline} Gestión del ${OFFER.name} en ${OFFER.city}.`,
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-BO">
      <body className="bg-paper font-sans text-ink antialiased">
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
