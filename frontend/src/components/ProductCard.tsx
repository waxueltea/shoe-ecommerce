'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: number;
    slug: string;
    name: string;
    price: number;
    discount_price?: number;
    primary_image: string;
    brand: string;
    is_new?: boolean;
    is_featured?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const finalPrice = product.discount_price || product.price;
  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
    : 0;

  return (
    <div className="card-hover group">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.primary_image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.is_new && (
            <span className="bg-accent-500 text-white text-xs font-medium px-2 py-1 rounded">
              Yeni
            </span>
          )}
          {hasDiscount && (
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
              %{discountPercentage} İndirim
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 bg-white rounded-full shadow-soft hover:bg-accent-500 hover:text-white transition-colors">
            <Heart size={18} />
          </button>
          <button className="p-2 bg-white rounded-full shadow-soft hover:bg-primary-900 hover:text-white transition-colors">
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-primary-900 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary-900">
            {formatPrice(finalPrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
