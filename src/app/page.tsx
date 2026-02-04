import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Testimonials from '@/components/Testimonials';
import HowItWorks from '@/components/HowItWorks';
import OrderForm from '@/components/OrderForm';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Testimonials />
      <HowItWorks />
      <OrderForm />
    </main>
  );
}
