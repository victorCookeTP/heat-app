import "./globals.css";

export const metadata = {
  title: "HEAT",
  description: "An application to evaluate English proficiency",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
