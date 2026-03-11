import './globals.css';

export const metadata = {
  title: 'Web Game Test',
  description: 'Playable browser game collection built with Next.js and Vercel.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}