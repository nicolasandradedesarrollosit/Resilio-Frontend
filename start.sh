#!/bin/bash

# Script de inicio rápido para Resilio Frontend
# Autor: Configuración automática
# Fecha: $(date +%Y-%m-%d)

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║           🚀 RESILIO FRONTEND - INICIO RÁPIDO                ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    echo "   Instala Node.js desde: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js detectado: $(node --version)"
echo "✅ npm detectado: $(npm --version)"
echo ""

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
    echo ""
fi

# Verificar si existe .env.local
if [ ! -f ".env.local" ]; then
    echo "⚠️  Archivo .env.local no encontrado"
    echo "📝 Creando .env.local desde .env.example..."
    
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "✅ Archivo .env.local creado"
        echo ""
        echo "⚠️  IMPORTANTE: Edita .env.local con tus credenciales reales:"
        echo "   - VITE_SUPABASE_URL"
        echo "   - VITE_SUPABASE_ANON_KEY"
        echo ""
        echo "   Presiona Enter para continuar o Ctrl+C para editar ahora..."
        read -r
    else
        echo "❌ Error: .env.example no encontrado"
        exit 1
    fi
fi

echo "🔍 Verificando configuración..."

# Leer las variables del .env.local
source .env.local 2>/dev/null || true

# Verificar si las variables están configuradas
if [[ "$VITE_SUPABASE_URL" == *"tu-proyecto"* ]] || [[ "$VITE_SUPABASE_ANON_KEY" == *"tu_anon_key"* ]]; then
    echo "⚠️  ADVERTENCIA: Las credenciales de Supabase parecen ser valores por defecto"
    echo "   La aplicación puede no funcionar correctamente"
    echo ""
fi

echo "✅ Configuración verificada"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "🚀 Iniciando servidor de desarrollo..."
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "   Frontend: http://localhost:5173"
echo "   Backend esperado: ${VITE_API_URL:-http://localhost:3000}"
echo ""
echo "💡 Consejos:"
echo "   • Presiona Ctrl+C para detener el servidor"
echo "   • Los cambios se recargan automáticamente (HMR)"
echo "   • Revisa la consola del navegador para errores"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""

# Iniciar el servidor de desarrollo
npm run dev
