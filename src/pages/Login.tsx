import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AlertCircle, Zap } from 'lucide-react';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
    } catch (error: any) {
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)'
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center h-16 w-16 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}
          >
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            DJ CRM
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Futuristic Customer Relationship Management
          </p>
        </div>

        <Card className="glass">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl gradient-text">Welcome Back</CardTitle>
            <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
              Sign in to access your CRM dashboard
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <div
                className="mb-4 p-3 rounded-lg flex items-center gap-2"
                style={{
                  backgroundColor: 'var(--danger-bg)',
                  border: '1px solid var(--danger)',
                  color: 'var(--danger)'
                }}
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                disabled={isLoading}
              />

              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
              />

              <Button
                type="submit"
                loading={isLoading}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>
          Protected by advanced security protocols
        </p>
      </div>
    </div>
  );
};
