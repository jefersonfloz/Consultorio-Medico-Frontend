import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { User, Lock } from 'lucide-react';

import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { LoginRequest } from '../../types';
import authService from '../../services/authService';

interface LocationState {
  message?: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(state?.message || null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { control, handleSubmit, formState: { errors } } = useForm<LoginRequest>({
    defaultValues: {
      username: '',
      password: '',
    },
  });
  
  useEffect(() => {
    // Clear state message after 5 seconds
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [success]);
  
  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthLayout 
      title="Sign in to your account" 
      subtitle="Enter your credentials to access the system"
    >
      {error && (
        <div className="mb-4">
          <Alert
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        </div>
      )}
      
      {success && (
        <div className="mb-4">
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess(null)}
          />
        </div>
      )}
      
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Controller
            name="username"
            control={control}
            rules={{ required: 'Username is required' }}
            render={({ field }) => (
              <Input
                {...field}
                id="username"
                label="Username"
                type="text"
                error={errors.username?.message}
                leftIcon={<User className="h-5 w-5 text-gray-400" />}
                autoComplete="username"
              />
            )}
          />
        </div>
        
        <div>
          <Controller
            name="password"
            control={control}
            rules={{ required: 'Password is required' }}
            render={({ field }) => (
              <Input
                {...field}
                id="password"
                label="Password"
                type="password"
                error={errors.password?.message}
                leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                autoComplete="current-password"
              />
            )}
          />
        </div>
        
        <div>
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
          >
            Sign in
          </Button>
        </div>
        
        <div className="text-center">
          <Link to="/register" className="text-sm text-blue-600 hover:text-blue-500">
            Don't have an account? Register
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;