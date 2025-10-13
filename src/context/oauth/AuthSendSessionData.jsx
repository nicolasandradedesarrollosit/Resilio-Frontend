import supabase from './Supabase';

const sendUserData = async() => {
  try {
    console.log('🔐 Obteniendo sesión de Supabase...');
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Error obteniendo sesión:', error);
      throw error;
    }
    if (!session) {
      console.error('❌ No se encontró sesión');
      throw new Error('No se encontró sesión de autenticación');
    }
    
    console.log('✅ Sesión de Supabase obtenida');
    console.log('📧 Email:', session.user.email);
    
    // El servidor ahora enviará las cookies automáticamente
    console.log('📤 Enviando datos al backend...');
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
      console.error('❌ Error del servidor:', response.status, errorData);
      throw new Error(errorData.message || 'Error al procesar la autenticación');
    }
    
    const result = await response.json();
    console.log('✅ Respuesta del backend:', result);
    
    // Ya no almacenamos el token en localStorage, está en cookies HTTP-only
    // El servidor lo envió automáticamente en la respuesta
    
    console.log('🔓 Cerrando sesión de Supabase...');
    await supabase.auth.signOut();
    console.log('✅ Sesión de Supabase cerrada');
    
    return { 
      user: session.user,
      userId: result.userId,
      role: result.role
    };
    
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('❌ Error en sendUserData:', err);
    }
    throw err;
  }
}

export default sendUserData;