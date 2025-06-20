'use client';

import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Thank you for applying!</h1>
      <p className="text-lg mb-4">
        Your resume has been submitted for review. If you meet the criteria, you'll be contacted soon.
      </p>
      <Link href="/" className="text-blue-500 underline">
        Return to Job Listings
      </Link>
    </div>
  );
}
