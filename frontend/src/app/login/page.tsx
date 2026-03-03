'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(loginData.email, loginData.password);
      toast.success('Giriş başarılı!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(registerData);
      toast.success('Kayıt başarılı!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Kayıt başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isLogin ? 'Hesabınıza giriş yapın' : 'Yeni hesap oluşturun'}
            </p>
          </div>

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="input"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  className="input"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-primary-900 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                    Beni hatırla
                  </label>
                </div>

                <Link href="/forgot-password" className="text-sm text-primary-900 hover:underline">
                  Şifremi unuttum
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 disabled:opacity-50"
              >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Ad
                  </label>
                  <input
                    id="first_name"
                    type="text"
                    required
                    className="input"
                    value={registerData.first_name}
                    onChange={(e) => setRegisterData({ ...registerData, first_name: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Soyad
                  </label>
                  <input
                    id="last_name"
                    type="text"
                    required
                    className="input"
                    value={registerData.last_name}
                    onChange={(e) => setRegisterData({ ...registerData, last_name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg_email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <input
                  id="reg_email"
                  type="email"
                  required
                  className="input"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+90 5XX XXX XX XX"
                  className="input"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="reg_password" className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre
                </label>
                <input
                  id="reg_password"
                  type="password"
                  required
                  minLength={6}
                  className="input"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">En az 6 karakter</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 disabled:opacity-50"
              >
                {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary-900 hover:underline"
            >
              {isLogin ? 'Hesabınız yok mu? Kayıt olun' : 'Zaten hesabınız var mı? Giriş yapın'}
            </button>
          </div>
        </div>

        {/* Test Credentials */}
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
          <p className="font-semibold mb-2">Test Kullanıcıları:</p>
          <p><strong>Admin:</strong> admin@example.com / admin123</p>
          <p><strong>User:</strong> user@example.com / user123</p>
        </div>
      </div>
    </div>
  );
}
