'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface CartItem {
  id: number;
  variant_id: number;
  quantity: number;
  product_name: string;
  slug: string;
  size: string;
  color: string;
  price: number;
  discount_price?: number;
  image_url: string;
  stock_quantity: number;
}

export default function CartPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchCart();
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    if (quantity < 1) return;
    
    try {
      await api.put(`/cart/${id}`, { quantity });
      fetchCart();
      toast.success('Sepet güncellendi');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Güncelleme başarısız');
    }
  };

  const removeItem = async (id: number) => {
    try {
      await api.delete(`/cart/${id}`);
      fetchCart();
      toast.success('Ürün sepetten çıkarıldı');
    } catch (error) {
      toast.error('Silme başarısız');
    }
  };

  const applyCoupon = async () => {
    if (!couponCode) return;

    try {
      const response = await api.post('/validate-coupon', {
        code: couponCode,
        subtotal,
      });
      setDiscount(parseFloat(response.data.coupon.discount_amount));
      toast.success('Kupon uygulandı!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Geçersiz kupon');
    }
  };

  const subtotal = items.reduce((sum, item) => {
    const price = item.discount_price || item.price;
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal >= 500 ? 0 : 50;
  const tax = (subtotal * 18) / 100;
  const total = subtotal + shipping + tax - discount;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sepetiniz boş</h2>
          <p className="text-gray-600 mb-8">Alışverişe başlamak için ürünlere göz atın</p>
          <Link href="/products" className="btn-primary">
            Alışverişe Başla
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Sepetim</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const itemPrice = item.discount_price || item.price;
            return (
              <div key={item.id} className="card p-4 flex gap-4">
                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <Link href={`/products/${item.slug}`} className="font-semibold text-gray-900 hover:text-primary-900">
                    {item.product_name}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">
                    Numara: {item.size} | Renk: {item.color}
                  </p>
                  <p className="text-lg font-bold text-primary-900 mt-2">
                    {formatPrice(itemPrice)}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>

                  <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                      disabled={item.quantity >= item.stock_quantity}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sipariş Özeti</h2>

            {/* Coupon */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kupon Kodu
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input flex-1"
                  placeholder="KUPON KODU"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                />
                <button onClick={applyCoupon} className="btn-secondary">
                  Uygula
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Örnek: WELCOME10, SUMMER2026, FREESHIP
              </p>
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Ara Toplam</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Kargo</span>
                <span>{shipping === 0 ? 'Ücretsiz' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>KDV (%18)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>İndirim</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-3">
                <span>Toplam</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn-primary w-full mt-6 text-center block">
              Ödemeye Geç
            </Link>

            <Link href="/products" className="btn-outline w-full mt-3 text-center block">
              Alışverişe Devam Et
            </Link>

            {subtotal < 500 && (
              <p className="text-sm text-gray-600 mt-4 text-center">
                {formatPrice(500 - subtotal)} daha ekleyin, kargo ücretsiz!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
