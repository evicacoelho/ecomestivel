echo "🚀 Configurando o backend do É de Comer?"

# 1. Verificar se .env existe
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env a partir do exemplo..."
    cp .env.example .env
    echo "⚠️  Por favor, edite o arquivo .env com suas configurações!"
    exit 1
fi

echo "[INFO] Instalando dependências..."
npm install

echo "[INFO] Gerando Prisma Client..."
npm run prisma:generate

echo "[INFO]  Executando migrations..."
npm run prisma:migrate

echo "[INFO] Executando seed do banco de dados..."
npm run prisma:seed

echo "[INFO] Setup completo!"
echo "[INFO] Para iniciar o servidor: npm run dev"