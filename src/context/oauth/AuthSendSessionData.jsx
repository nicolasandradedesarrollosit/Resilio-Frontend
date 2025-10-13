import supabase from './Supabase';

const sendUserData = async() => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    if (!session) throw new Error('No se encontró sesión de autenticación');
    
    // El servidor ahora enviará las cookies automáticamente
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
      method: 'POST',
      credentials: 'include', // Permite que el servidor envíe cookies
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
    
    // Ya no almacenamos el token en localStorage, está en cookies HTTP-only
    // El servidor lo envió automáticamente en la respuesta
    
    await supabase.auth.signOut();
    
    return { user: session.user };
    
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Error en sendUserData:', err);
    }
    throw err;
  }
}

export default sendUserData;