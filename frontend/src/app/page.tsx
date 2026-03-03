'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Truck, Shield, CreditCard } from 'lucide-react';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  link_url: string;
  button_text: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  product_count: number;
}

interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  discount_price?: number;
  primary_image: string;
  brand: string;
  is_new?: boolean;
  is_featured?: boolean;
}

export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersRes, categoriesRes, featuredRes, newRes] = await Promise.all([
          api.get('/banners'),
          api.get('/categories'),
          api.get('/products?is_featured=true&limit=8'),
          api.get('/products?is_new=true&limit=8'),
        ]);

        setBanners(bannersRes.data.banners || []);
        setCategories(categoriesRes.data.categories || []);
        setFeaturedProducts(featuredRes.data.products || []);
        setNewProducts(newRes.data.products || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner */}
      {banners.length > 0 && (
        <section className="relative h-[500px] bg-gradient-to-r from-primary-900 to-primary-700">
          <div className="absolute inset-0">
            <Image
              src={banners[0].image_url}
              alt={banners[0].title}
              fill
              className="object-cover opacity-20"
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-5xl font-bold mb-4">{banners[0].title}</h1>
              <p className="text-2xl mb-2">{banners[0].subtitle}</p>
              <p className="text-lg mb-8 text-gray-200">{banners[0].description}</p>
              <Link href={banners[0].link_url} className="btn-accent text-lg px-8 py-3">
                {banners[0].button_text}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-accent-100 rounded-lg">
                <Truck className="text-accent-600" size={32} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Ücretsiz Kargo</h3>
                <p className="text-gray-600 text-sm">500 TL ve üzeri siparişlerde</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-accent-100 rounded-lg">
                <Shield className="text-accent-600" size={32} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Güvenli Alışveriş</h3>
                <p className="text-gray-600 text-sm">SSL sertifikalı ödeme</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-accent-100 rounded-lg">
                <CreditCard className="text-accent-600" size={32} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Kolay İade</h3>
                <p className="text-gray-600 text-sm">14 gün içinde ücretsiz iade</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Kategoriler</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.slice(0, 5).map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="card-hover p-6 text-center group"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary-900 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">{category.product_count} Ürün</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Öne Çıkan Ürünler</h2>
            <Link href="/products?is_featured=true" className="flex items-center text-primary-900 font-medium hover:underline">
              Tümünü Gör <ChevronRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Yeni Gelenler</h2>
            <Link href="/products?is_new=true" className="flex items-center text-primary-900 font-medium hover:underline">
              Tümünü Gör <ChevronRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
