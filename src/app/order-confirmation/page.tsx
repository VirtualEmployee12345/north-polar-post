import Header from '@/components/Header';
import OrderConfirmation from '@/components/OrderConfirmation';

// In a real app, this data would come from the order/payment success
export default function ConfirmationPage() {
  return (
    <main>
      <Header />
      <OrderConfirmation 
        childName="Emma"
        orderNumber="NP-789012"
        orderDate="February 4, 2026"
        total="$39.99"
      />
    </main>
  );
}
