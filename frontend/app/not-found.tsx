import Link from 'next/link'
import React from 'react'
import Image from 'next/image';

export default function NotFoundPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center">
      <div className="text-center p-2">
        <Image src={'/404/404.gif'} width={380} height={150} alt='404' className='w-full h1/3'/>
        <p className="text-xl sm:text-2xl md:text-3xl font-light text-ticket-text mb-8 mt-4">
          Sorry, the page you're looking for cannot be found.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 text-lg sm:text-xl md:text-2xl font-medium text-secondary border-2 border-secondary hover:text-white hover:bg-secondary rounded-md  transition duration-500 ease-in-out"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}