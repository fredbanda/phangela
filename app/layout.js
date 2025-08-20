import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from '@/context/theme';
import Navbar from '@/components/headers/navbar';
import { Poppins } from 'next/font/google';
import { ResumeProvider } from '@/context/resume';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
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
      <body className={`${poppins.className} bg-background text-foreground`}>
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
          </ResumeProvider>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>

  );
}
