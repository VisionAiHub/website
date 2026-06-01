// Root layout. The locale-aware shell lives in src/app/[locale]/layout.tsx —
// this file just exists because Next requires a root layout. It must NOT set
// <html> or <body> when a child layout does, so we render children directly.
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
