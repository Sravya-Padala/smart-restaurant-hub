// src/context/AuthContext.jsx

import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';

// Step 1: Create the context with a default value.
const AuthContext = createContext({});

// Step 2: Create the AuthProvider component that will wrap your app.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for an active session when the component mounts
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session ? session.user : null);
      setLoading(false);
    };

    getSession();

    // Listen for changes in authentication state (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session ? session.user : null);
    });

    // Cleanup the subscription when the component unmounts
    return () => subscription.unsubscribe();
  }, []);
  
  // The value object contains the functions and data to be shared
  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    logIn: (data) => supabase.auth.signInWithPassword(data),
    logOut: () => supabase.auth.signOut(),
    resetPassword: (email) => supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/update-password',
    }),
    updatePassword: (password) => supabase.auth.updateUser({ password: password }),
    user,
  };

  // Provide the value to all child components.
  // Don't render children until the initial session check is complete.
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Step 3: Create the custom hook that components will use to access the context.
// This line MUST come AFTER AuthContext is created.
export const useAuth = () => useContext(AuthContext);