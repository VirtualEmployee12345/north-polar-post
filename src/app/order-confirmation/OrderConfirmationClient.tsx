"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';

interface OrderDetails {
  id: string;
  childName: string;
  orderNumber: string;
  orderDate: string;
  total: string;
  letters: {
    sequenceNumber: number;
    scheduledDate: string;
    status?: string;
  }[];
}

const OrderConfirmationContent: React.FC = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!sessionId) {
        setError('No order session found');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch real order data from API
        const response = await fetch(`/api/orders?sessionId=${encodeURIComponent(sessionId)}`)
        const data = await response.json()
        
        if (!data.success || !data.order) {
          throw new Error(data.error || 'Order not found')
        }
        
        setOrder(data.order)
        setIsLoading(false)
      } catch (err) {
        console.error('Failed to fetch order:', err)
        setError('Failed to load order details. The elves are still processing your order!')
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [sessionId])

  if (isLoading) {
    return (
      <main>
        <Header />
        <section className="relative py-16 px-6 bg-[#f5e6c8] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#8b4513] mx-auto mb-4"></div>
            <p className="font-serif text-xl text-[#3d2914]">Preparing the magic...</p>
          </div>
        </section>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main>
        <Header />
        <section className="relative py-16 px-6 bg-[#f5e6c8] min-h-screen">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-serif text-4xl font-bold text-[#3d2914] mb-4">
              Something Went Wrong
            </h1>
            <p className="font-serif text-lg text-[#5c4033] mb-8">
              We couldn&apos;t find your order. Please contact us for help.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center h-12 px-6 rounded-lg bg-gradient-to-b from-[#a0522d] via-[#8b4513] to-[#6b3410] text-white font-serif"
            >
              Return Home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <Header />
      <section className="relative py-16 px-6 bg-[#f5e6c8] min-h-screen">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-center text-[#3d2914] mb-12">
            Magic is on its Way!
          </h1>

          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
            
            <div className="flex-1">
              <img 
                src="/santa-sleigh.png" 
                alt="Santa Claus in his sleigh flying over a snowy village with reindeer"
                className="w-full h-auto max-w-lg mx-auto drop-shadow-2xl rounded-lg"
              />
            </div>

            <div className="flex-1 space-y-8">
              <div>
                <p className="font-serif text-lg md:text-xl text-[#3d2914] leading-relaxed">
                  Thank you! We have received your order for{" "}
                  <span className="font-semibold">{order.childName}</span>. The elves are already at work!
                </p>
              </div>

              <div className="bg-[#f8e8c8] rounded-lg p-6 border border-[#d4b896] shadow-inner">
                <div className="space-y-2 font-serif text-[#3d2914]">
                  <p><span className="font-semibold">Order #:</span> {order.orderNumber}</p>
                  <p><span className="font-semibold">Date:</span> {order.orderDate}</p>
                  <p><span className="font-semibold">Total:</span> {order.total}</p>
                </div>
              </div>

              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#3d2914] mb-4">
                  What Happens Next?
                </h2>
                <ol className="space-y-3 font-serif text-lg text-[#5c4033] list-decimal list-inside">
                  {order.letters.map((letter) => (
                    <li key={letter.sequenceNumber}>
                      Letter {letter.sequenceNumber} is planned for {letter.scheduledDate}.
                    </li>
                  ))}
                </ol>
              </div>

              <div className="pt-4">
                <p className="font-serif text-lg text-[#3d2914]">With anticipation,</p>
                <p className="font-serif text-2xl text-[#3d2914] italic mt-1">
                  Father Christmas
                </p>
              </div>

              <div className="pt-6">
                <Link 
                  href="/"
                  className="inline-flex items-center justify-center h-12 px-6 rounded-lg bg-gradient-to-b from-[#a0522d] via-[#8b4513] to-[#6b3410] text-white font-serif text-base tracking-wide shadow-[0_4px_0_#3d1310a,0_6px_15px_rgba(0,0,0,0.35)] transition-transform duration-150 active:translate-y-1 hover:from-[#b0633d] hover:via-[#9b5523] hover:to-[#7b4518]"
                >
                  Return to Home
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

function OrderConfirmationLoading() {
  return (
    <main>
      <Header />
      <section className="relative py-16 px-6 bg-[#f5e6c8] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#8b4513] mx-auto mb-4"></div>
          <p className="font-serif text-xl text-[#3d2914]">Preparing the magic...</p>
        </div>
      </section>
    </main>
  );
}

export default function OrderConfirmationClient() {
  return (
    <Suspense fallback={<OrderConfirmationLoading />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
