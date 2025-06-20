'use client'; // <-- this is required at the top

import { useRouter } from 'next/navigation'; // <-- switch to the correct hook
import { useEffect, useState } from 'react';

export default function FeedbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    // fake fetch just for demonstration
    setTimeout(() => setStatus('Thanks for your feedback!'), 1000);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Feedback</h1>
      <p>{status}</p>
    </div>
  );
}
