'use client';

import React from 'react';
import { ThemeToggle } from './theme-toggle';
import Image from 'next/image';
import Logo from '../../assets/logo.png';
import Link from 'next/link';
import {
  SignIn,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/nextjs';
import { Button } from '../ui/button';

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  return (
    <nav className="flex justify-between items-center  p-1 shadow">
      <Link href="/" className="flex items-center">
        <Image
          src={Logo}
          alt="Logo"
          width={20}
          height={10}
          className="rotate-90 mr-2 ml-3"
        />
        <span className="text-xl font-bold hidden md:block">Phangela</span>
      </Link>

      <div className="flex justify-end items-center gap-3">
        <SignedOut>
          <SignInButton mode="modal">
            <Button
              variant="outline"
              className="px-3 py-1 rounded  text-white dark:text-gray-700"
            >
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>

        {/* <SignedIn>
          <Link href="/dashboard">{user?.fullName}&apos;s Dashboard</Link>
          <UserButton />
        </SignedIn> */}

        <SignedIn>
          <button
            onClick={() => (window.location.href = '/dashboard')}
            // className="text-blue-600 hover:underline"
          >
            {user?.fullName}&apos;s Dashboard
          </button>
          <UserButton />
        </SignedIn>

        <ThemeToggle />
      </div>
    </nav>
  );
}
