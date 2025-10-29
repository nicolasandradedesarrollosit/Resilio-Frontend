import supabase from '../services/Supabase';

const sendUserData = async() => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    if (!session) {
      throw new Error('No se encontró sesión de autenticación');
    }
    
    if (!session.access_token || !session.user || !session.user.email) {
      throw new Error('Sesión de autenticación incompleta');
    }
    
    if (session.expires_at && session.expires_at * 1000 < Date.now()) {
      throw new Error('La sesión de autenticación ha expirado');
    }
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        supabaseToken: session.access_token,
        email: session.user.email
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al procesar la autenticación');
    }
    
    const result = await response.json();
    await supabase.auth.signOut();
    return { 
      user: session.user,
      userId: result.userId,
      role: result.role
    };
    
  } catch (err) {
    if (import.meta.env.DEV) {
    }
    throw err;
  }
}

export default sendUserData;