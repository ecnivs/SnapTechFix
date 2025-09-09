import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart';
import { Link } from 'react-router-dom';

export default function Checkout() {
  const cart = useCart();

  return (
    <div className="min-h-screen py-20">
      <Helmet>
        <title>Shopping Cart - SnapTechFix</title>
        <meta name="description" content="Review your cart and proceed to checkout." />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Shopping Cart</h1>
          <p className="text-xl text-gray-600">Review your items and proceed to checkout</p>
        </div>

        <div className="max-w-2xl mx-auto">
          {cart.items.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-4">Add some products to get started</p>
                <Link to="/buy">
                  <Button>Continue Shopping</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Your Cart ({cart.items.length} items)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${((item.price || 0) * item.quantity).toFixed(2)}</p>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => cart.remove(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total: ${cart.total.toFixed(2)}</span>
                      <Button size="lg">Proceed to Checkout</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}