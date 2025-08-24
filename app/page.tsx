'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Vote, Users, Trophy, Shield } from 'lucide-react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const userRole = (session.user as any).role;
      if (userRole === 'admin') {
        router.push('/admin');
      } else if (userRole === 'candidate') {
        router.push('/candidate');
      } else {
        router.push('/voter');
      }
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-600 p-4 rounded-full">
                <Vote className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              School Elections
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Secure, transparent, and efficient online voting system for student leadership elections
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
                <Link href="/auth/register">Register</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Our Election System Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A comprehensive platform designed to make school elections fair, secure, and engaging
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-0 shadow-lg">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Shield className="h-12 w-12 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Secure Voting</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Each student can vote only once per position with secure authentication and encrypted data
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Users className="h-12 w-12 text-green-600" />
                </div>
                <CardTitle className="text-xl">Easy Participation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Students can easily register as candidates, campaign, and vote from any device
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Trophy className="h-12 w-12 text-yellow-600" />
                </div>
                <CardTitle className="text-xl">Real-time Results</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Live vote counting with detailed analytics and instant result announcements
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Participate?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students making their voices heard in school elections
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-3">
            <Link href="/auth/register">Get Started Now</Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <Vote className="h-8 w-8" />
          </div>
          <p className="text-gray-400">
            © 2024 School Election System. Empowering student democracy.
          </p>
        </div>
      </footer>
    </div>
  );
}