#!/bin/bash

echo "🚀 Iniciando É de Comer? - Ambiente de Desenvolvimento"

# Iniciar backend
echo "🔧 Iniciando backend..."
cd backend
npm run dev &
BACKEND_PID=$!

# Aguardar backend
echo "⏳ Aguardando backend iniciar..."
sleep 5

# Iniciar frontend
echo "🎨 Iniciando frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Ambientes iniciados!"
echo "🔗 Backend: http://localhost:3001"
echo "🔗 Frontend: http://localhost:5173"
echo "📊 API Health: http://localhost:3001/api/health"
echo ""
echo "📝 Credenciais de teste:"
echo "   👤 Admin: admin@ecomestivel.com / admin123"
echo "   👤 Moderador: moderador@ecomestivel.com / moderador123"
echo "   👤 Usuário: usuario@ecomestivel.com / usuario123"
echo ""
echo "🛑 Para parar: Ctrl+C"

# Manter script rodando
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait