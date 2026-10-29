export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const year = new Date().getFullYear();

  return (
    <html lang="en">
      <body>
        {children}
        <footer>&copy; {year} Next.js</footer>
      </body>
    </html>
  );
}
