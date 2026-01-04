import './globals.css';

export const metadata = {
  title: 'SQL Query Builder',
  description: 'Demo SQL Query Builder like Mixpanel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
