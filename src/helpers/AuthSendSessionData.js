import supabase from '../services/Supabase';

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
    
    // Verificar que la sesión tenga un token válido y datos del usuario
    if (!session.access_token || !session.user || !session.user.email) {
      console.error('❌ Sesión incompleta o inválida');
      throw new Error('Sesión de autenticación incompleta');
    }
    
    // Verificar que la sesión no haya expirado
    if (session.expires_at && session.expires_at * 1000 < Date.now()) {
      console.error('❌ Sesión expirada');
      throw new Error('La sesión de autenticación ha expirado');
    }
    
    console.log('✅ Sesión de Supabase obtenida');
    console.log('📧 Email:', session.user.email);
    
    console.log('📤 Enviando datos al backend...');
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
      console.error('❌ Error del servidor:', response.status, errorData);
      throw new Error(errorData.message || 'Error al procesar la autenticación');
    }
    
    const result = await response.json();
    console.log('✅ Respuesta del backend:', result);
    
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