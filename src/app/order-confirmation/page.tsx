import { Suspense } from 'react';
import OrderConfirmationClient from './OrderConfirmationClient';

// Force dynamic to prevent static generation issues with useSearchParams
export const dynamic = 'force-dynamic';

function OrderConfirmationLoading() {
  return (
    <main className="relative py-16 px-6 bg-[#f5e6c8] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#8b4513] mx-auto mb-4"></div>
        <p className="font-serif text-xl text-[#3d2914]">Preparing the magic...</p>
      </div>
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<OrderConfirmationLoading />}>
      <OrderConfirmationClient />
    </Suspense>
  );
}
