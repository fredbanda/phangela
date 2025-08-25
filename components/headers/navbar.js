'use client';

import React, { useState } from 'react';
import { ThemeToggle } from './theme-toggle';
import Image from 'next/image';
import Logo from '../../assets/logo.png';
import Link from 'next/link';
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/nextjs';
import { Button } from '../ui/button';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between p-3 shadow-md bg-white dark:bg-gray-900 relative">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image
          src={Logo}
          alt="Logo"
          width={30}
          height={30}
          className="rotate-90 mr-2"
        />
        <span className="text-xl font-bold hidden md:block">Phangela</span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6 items-center text-white">
        <Link href="/resume/create">Create Resume</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/vacancies">Current Vacancies</Link>
        <Link href="/jobs/create">Post A Job</Link>
        <Link href="/supportus">Support the Project</Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <SignedOut>
          <SignInButton mode="modal">
            <Button
              variant="outline"
              className="px-3 py-1 rounded text-white  dark:text-white bg-gray-700"
            >
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <button
            onClick={() => (window.location.href = '/dashboard')}
            className="text-md font-medium hover:underline text-white "
          >
            {user?.fullName}&apos;s Dashboard
          </button>
          <UserButton />
        </SignedIn>

        <ThemeToggle />

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-white "
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="fixed top-[64px] inset-x-0 bg-white dark:bg-gray-900 shadow-md flex flex-col z-50 items-start p-4 space-y-4 md:hidden dark:text-white ">
          <Link href="/resume/create" onClick={() => setMenuOpen(false)} className='cursor-pointer'>
            Create Resume
          </Link>
          <Link href="/dashboard" onClick={() => setMenuOpen(false)} className='cursor-pointer'>
           Dashboard
          </Link>
          <Link href="/vacancies" onClick={() => setMenuOpen(false)} className='cursor-pointer'>
            Current Vacancies
          </Link>
          <Link href="/jobs/create" onClick={() => setMenuOpen(false)} className='cursor-pointer'>
            Post A Job
          </Link>
          <Link href="/supportus" onClick={() => setMenuOpen(false)} className='cursor-pointer'>
            Support the Project
          </Link>
        </div>
      )}
    </nav>
  );
}
