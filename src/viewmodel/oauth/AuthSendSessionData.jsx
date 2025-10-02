import supabase from './Supabase';

const sendUserData = async() => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    if (!session) throw new Error('No se encontró sesión de autenticación');
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        supabaseToken: session.access_token,
        email: session.user.email,
        googleId: session.user.id
      })
    });
    console.log(session.access_token)
    console.log(response.data);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al procesar la autenticación');
    }
    
    const { token } = await response.json();
    
    localStorage.setItem('access_token', token);
    
    await supabase.auth.signOut();
    
    return { token, user };
    
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Error en sendUserData:', err);
    }
    throw err;
  }
}

export default sendUserData;