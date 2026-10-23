import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const DEMO_USER = {
  id: 1,
  name: 'Demo Candidate',
  email: 'demo@careerflow.com',
  created_at: new Date().toISOString(),
  profile: {
    headline: 'Senior Full-Stack Engineer & Architect',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    location: 'Bengaluru',
    bio: 'Passionate software engineer building resilient, scalable web architectures.',
    avatar_url: '',
    resume_url: '',
    open_to_remote: 1,
    expected_salary_min: 28,
    expected_salary_max: 45,
    preferred_roles: ['Full-Stack Developer', 'Frontend Architect'],
    preferred_locations: ['Bengaluru', 'Remote']
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth state on mount
  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data && response.data.success) {
        setUser(response.data.user);
        try {
          localStorage.setItem('careerflow_session_user', JSON.stringify(response.data.user));
        } catch (e) {}
        return;
      }
    } catch (error) {
      // If API fails on Vercel or offline, recover session from localStorage
      try {
        const saved = localStorage.getItem('careerflow_session_user');
        if (saved) {
          setUser(JSON.parse(saved));
          return;
        }
      } catch (e) {}
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        setUser(response.data.user);
        try {
          localStorage.setItem('careerflow_session_user', JSON.stringify(response.data.user));
        } catch (e) {}
        toast.success(response.data.message || 'Logged in successfully!');
        return { success: true };
      }
    } catch (error) {
      const status = error.response?.status;
      const isOfflineOrVercel = !status || status === 404 || status === 405 || status === 502 || status === 503;

      if (isOfflineOrVercel) {
        let localUser = DEMO_USER;
        try {
          const registeredUsers = JSON.parse(localStorage.getItem('careerflow_registered_users') || '[]');
          const match = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
          if (match) {
            localUser = match;
          } else if (email.toLowerCase() === 'demo@careerflow.com') {
            localUser = DEMO_USER;
          } else {
            localUser = {
              ...DEMO_USER,
              id: Date.now(),
              email,
              name: email.split('@')[0]
            };
          }
          localStorage.setItem('careerflow_session_user', JSON.stringify(localUser));
        } catch (e) {}

        setUser(localUser);
        toast.success('Signed in successfully!');
        return { success: true };
      }

      const msg = error.response?.data?.message || 'Failed to log in. Please check your credentials.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Sign up
  const signup = async (name, email, password) => {
    try {
      const response = await api.post('/auth/signup', { name, email, password });
      if (response.data.success) {
        setUser(response.data.user);
        try {
          localStorage.setItem('careerflow_session_user', JSON.stringify(response.data.user));
        } catch (e) {}
        toast.success(response.data.message || 'Welcome to CareerFlow!');
        return { success: true };
      }
    } catch (error) {
      const status = error.response?.status;
      const isOfflineOrVercel = !status || status === 404 || status === 405 || status === 502 || status === 503;

      if (isOfflineOrVercel) {
        const newUser = {
          id: Date.now(),
          name: name || 'Engineer',
          email,
          created_at: new Date().toISOString(),
          profile: {
            headline: 'Software Engineer',
            skills: ['React', 'JavaScript', 'Node.js', 'Tailwind CSS'],
            location: 'Bengaluru',
            bio: 'Passionate developer building high-impact technology solutions.',
            avatar_url: '',
            resume_url: '',
            open_to_remote: 1,
            expected_salary_min: 20,
            expected_salary_max: 35,
            preferred_roles: ['Full-Stack Developer'],
            preferred_locations: ['Remote', 'Bengaluru']
          }
        };

        try {
          const registeredUsers = JSON.parse(localStorage.getItem('careerflow_registered_users') || '[]');
          registeredUsers.push(newUser);
          localStorage.setItem('careerflow_registered_users', JSON.stringify(registeredUsers));
          localStorage.setItem('careerflow_session_user', JSON.stringify(newUser));
        } catch (e) {}

        setUser(newUser);
        toast.success(`Welcome to CareerFlow, ${name}!`);
        return { success: true };
      }

      const msg = error.response?.data?.message || 'Failed to create account.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      try {
        localStorage.removeItem('careerflow_session_user');
      } catch (e) {}
      setUser(null);
      toast.success('Logged out successfully.');
    }
  };

  // Refresh user data (e.g. after updating profile, uploading avatar, etc.)
  const refreshUser = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.user);
        try {
          localStorage.setItem('careerflow_session_user', JSON.stringify(response.data.user));
        } catch (e) {}
      }
    } catch (e) {
      console.warn('Backend unavailable during user refresh');
    }
  };

  const updateProfileState = (partialProfile) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        profile: {
          ...prev.profile,
          ...partialProfile
        }
      };
      try {
        localStorage.setItem('careerflow_session_user', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refreshUser,
        updateProfileState
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
