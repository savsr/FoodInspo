import './globals.css'

export const metadata = {
  title: 'Chick Feed',
  description: 'Recipe inspiration from your favourite chefs',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
