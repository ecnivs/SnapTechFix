import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Shield, User } from "lucide-react";
import { Helmet } from 'react-helmet-async';
import Logo from "@/components/ui/Logo";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in
  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  if (isLoggedIn) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Simple admin credentials check
      const ADMIN_EMAIL = "admin@snaptechfix.com";
      const ADMIN_PASSWORD = "admin123";

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Store admin session
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminEmail', email);
        localStorage.setItem('adminLoginTime', new Date().toISOString());
        
        // Small delay then redirect
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 100);
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Helmet>
        <title>Admin Login — SnapTechFix</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-6">
            <Logo variant="full" size="lg" showTagline={true} className="justify-center" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
          <p className="text-gray-600">
            Sign in to access the content management system
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@snaptechfix.com"
                required
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="bg-white"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in to Dashboard"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Demo Credentials:</h4>
            <p className="text-xs text-gray-600">
              <strong>Email:</strong> admin@snaptechfix.com<br />
              <strong>Password:</strong> admin123
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            This is a restricted area. Unauthorized access is prohibited.
            <br />
            <a href="/" className="text-blue-600 hover:underline">
              Return to website
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}