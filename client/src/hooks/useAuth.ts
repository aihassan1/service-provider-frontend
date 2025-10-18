import { useMutation } from '@tanstack/react-query';
import { authApi, type LoginRequest } from '@/lib/api';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';

export function useAuth() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState(() => authApi.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => authApi.isAuthenticated());

  useEffect(() => {
    const checkAuth = () => {
      setUser(authApi.getCurrentUser());
      setIsAuthenticated(authApi.isAuthenticated());
    };

    // Check auth on mount and when storage changes
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      setIsAuthenticated(true);
      toast.success('Login successful');
      setLocation('/admin');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });

  const logout = () => {
    authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
    setLocation('/login');
  };

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout,
  };
}

