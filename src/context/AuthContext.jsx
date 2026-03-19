import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) setProfile(data);

    const { data: addresses } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId);

    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    setProfile(prev => ({
      ...prev,
      addresses: addresses || [],
      orders: orders || [],
    }));
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signup = async (firstName, lastName, email, password) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });
    if (error) {
      if (error.message.includes('already registered'))
        return { error: 'An account with this email already exists.' };
      return { error: error.message };
    }
    return { success: true };
  };

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: 'Invalid email or password.' };
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const addAddress = async (address) => {
    const { data, error } = await supabase
      .from('addresses')
      .insert([{ ...address, user_id: user.id }])
      .select();
    if (error) return { error: error.message };
    setProfile(prev => ({
      ...prev,
      addresses: [...(prev?.addresses || []), ...data],
    }));
    return { success: true };
  };

  const deleteAddress = async (id) => {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id);
    if (error) return;
    setProfile(prev => ({
      ...prev,
      addresses: prev.addresses.filter(a => a.id !== id),
    }));
  };

  const saveOrder = async (order) => {
    const { data, error } = await supabase
      .from('orders')
      .insert([{ ...order, user_id: user.id }])
      .select();
    if (error) return;
    setProfile(prev => ({
      ...prev,
      orders: [data[0], ...(prev?.orders || [])],
    }));
  };

  const fullUser = user ? {
    ...user,
    firstName: profile?.first_name || user?.user_metadata?.first_name || '',
    lastName: profile?.last_name || user?.user_metadata?.last_name || '',
    email: user.email,
    addresses: profile?.addresses || [],
    orders: profile?.orders || [],
  } : null;

  return (
    <AuthContext.Provider value={{
      user: fullUser,
      loading,
      signup, login, logout,
      addAddress, deleteAddress, saveOrder,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);