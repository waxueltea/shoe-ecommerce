'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">ShoeStore</h3>
            <p className="text-gray-300 text-sm">
              Modern ayakkabı alışverişinin yeni adresi. Kaliteli ürünler, uygun fiyatlar.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-accent-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-accent-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-accent-500 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                  Ürünler
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  SSS
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Müşteri Hizmetleri</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-white transition-colors">
                  Kargo ve Teslimat
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-white transition-colors">
                  İade ve Değişim
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Kullanım Koşulları
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Phone size={16} />
                <span className="text-gray-300">+90 555 123 45 67</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <span className="text-gray-300">info@shoestore.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin size={16} className="mt-1" />
                <span className="text-gray-300">
                  İstanbul, Türkiye
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 ShoeStore. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
