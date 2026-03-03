'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal } from 'lucide-react';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';

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

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: '',
    min_price: '',
    max_price: '',
    size: '',
    color: '',
    sort: 'created_at',
    order: 'DESC',
  });

  useEffect(() => {
    fetchProducts();
  }, [filters, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      params.append('page', page.toString());
      params.append('limit', '12');

      const response = await api.get(`/products?${params.toString()}`);
      setProducts(response.data.products);
      setTotal(response.data.pagination.total);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="card p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <SlidersHorizontal size={20} />
              Filtreler
            </h3>

            {/* Sort */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sırala
              </label>
              <select
                className="input"
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                <option value="created_at">Yeniler</option>
                <option value="price">Fiyat (Düşük-Yüksek)</option>
                <option value="view_count">Popüler</option>
                <option value="name">İsim</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiyat Aralığı
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="input text-sm"
                  value={filters.min_price}
                  onChange={(e) => handleFilterChange('min_price', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="input text-sm"
                  value={filters.max_price}
                  onChange={(e) => handleFilterChange('max_price', e.target.value)}
                />
              </div>
            </div>

            {/* Brand */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marka
              </label>
              <select
                className="input"
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
              >
                <option value="">Tümü</option>
                <option value="Nike">Nike</option>
                <option value="Adidas">Adidas</option>
                <option value="Puma">Puma</option>
                <option value="New Balance">New Balance</option>
                <option value="Converse">Converse</option>
                <option value="Reebok">Reebok</option>
              </select>
            </div>

            {/* Size */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numara
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFilterChange('size', filters.size === size ? '' : size)}
                    className={`py-2 text-sm rounded border ${
                      filters.size === size
                        ? 'bg-primary-900 text-white border-primary-900'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Renk
              </label>
              <div className="flex gap-2">
                {[
                  { name: 'Siyah', code: '#000000' },
                  { name: 'Beyaz', code: '#FFFFFF' },
                  { name: 'Lacivert', code: '#1a1a2e' },
                ].map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleFilterChange('color', filters.color === color.name ? '' : color.name)}
                    className={`w-10 h-10 rounded-full border-2 ${
                      filters.color === color.name ? 'border-primary-900' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.code }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setFilters({
                  category: '',
                  brand: '',
                  min_price: '',
                  max_price: '',
                  size: '',
                  color: '',
                  sort: 'created_at',
                  order: 'DESC',
                });
                setPage(1);
              }}
              className="w-full btn-secondary"
            >
              Filtreleri Temizle
            </button>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Ürünler</h1>
            <p className="text-gray-600 mt-2">{total} ürün bulundu</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Ürün bulunamadı</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12 flex justify-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="btn-secondary disabled:opacity-50"
                >
                  Önceki
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Sayfa {page}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={products.length < 12}
                  className="btn-secondary disabled:opacity-50"
                >
                  Sonraki
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
