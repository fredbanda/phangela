import './globals.css';
import { ThemeProvider } from '@/context/theme';
import Navbar from '@/components/headers/navbar';
import { ResumeProvider } from '@/context/resume';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';
import Footer from '@/components/headers/footer';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['sans-serif'],
});

export const metadata = {
  title: 'Phangela - AI Resume Builder',
  description:
    'Create your CVs or Resume with AI powered that will pass any ATS or HR',
};

export default function RootLayout({ children, ...props }) {
  return (
    <ClerkProvider>
          <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          {...props}
        >
          <ResumeProvider>
            <Navbar />
            {children}
           
            <Toaster />
             <Footer />
          </ResumeProvider>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>

  );
}
