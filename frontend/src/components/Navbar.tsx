'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, User, Heart, Menu, X, Search } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <nav className="bg-white shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary-900">
              ShoeStore
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-primary-900 transition-colors">
              Ürünler
            </Link>
            <Link href="/products?category=erkek-ayakkabi" className="text-gray-700 hover:text-primary-900 transition-colors">
              Erkek
            </Link>
            <Link href="/products?category=kadin-ayakkabi" className="text-gray-700 hover:text-primary-900 transition-colors">
              Kadın
            </Link>
            <Link href="/products?category=spor-ayakkabi" className="text-gray-700 hover:text-primary-900 transition-colors">
              Spor
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-700 hover:text-primary-900 transition-colors">
              <Search size={20} />
            </button>

            {isAuthenticated ? (
              <>
                <Link href="/favorites" className="p-2 text-gray-700 hover:text-primary-900 transition-colors">
                  <Heart size={20} />
                </Link>
                <Link href="/cart" className="p-2 text-gray-700 hover:text-primary-900 transition-colors relative">
                  <ShoppingCart size={20} />
                  <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </Link>
                <div className="relative group">
                  <button className="p-2 text-gray-700 hover:text-primary-900 transition-colors">
                    <User size={20} />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-soft-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Hesabım
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Siparişlerim
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link href="/login" className="btn-primary">
                Giriş Yap
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <Link href="/products" className="block py-2 text-gray-700 hover:text-primary-900">
              Ürünler
            </Link>
            <Link href="/products?category=erkek-ayakkabi" className="block py-2 text-gray-700 hover:text-primary-900">
              Erkek
            </Link>
            <Link href="/products?category=kadin-ayakkabi" className="block py-2 text-gray-700 hover:text-primary-900">
              Kadın
            </Link>
            <Link href="/products?category=spor-ayakkabi" className="block py-2 text-gray-700 hover:text-primary-900">
              Spor
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
