import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { AlertCircle, Mail, User, Lock } from 'lucide-react';

import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { SignupRequest } from '../../types';
import authService from '../../services/authService';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { control, handleSubmit, formState: { errors } } = useForm<SignupRequest>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      roles: ['ROLE_USER'],
    },
  });
  
  const onSubmit = async (data: SignupRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.register(data);
      navigate('/login', { state: { message: 'Registration successful. Please login.' } });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthLayout 
      title="Create your account" 
      subtitle="Already have an account? Sign in instead."
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
      
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Controller
            name="username"
            control={control}
            rules={{ 
              required: 'Username is required',
              minLength: { value: 3, message: 'Username must be at least 3 characters' }
            }}
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
            name="email"
            control={control}
            rules={{ 
              required: 'Email is required',
              pattern: { 
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            }}
            render={({ field }) => (
              <Input
                {...field}
                id="email"
                label="Email"
                type="email"
                error={errors.email?.message}
                leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
                autoComplete="email"
              />
            )}
          />
        </div>
        
        <div>
          <Controller
            name="password"
            control={control}
            rules={{ 
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            }}
            render={({ field }) => (
              <Input
                {...field}
                id="password"
                label="Password"
                type="password"
                error={errors.password?.message}
                leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                autoComplete="new-password"
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
            Register
          </Button>
        </div>
        
        <div className="text-center">
          <Link to="/login" className="text-sm text-blue-600 hover:text-blue-500">
            Already have an account? Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;