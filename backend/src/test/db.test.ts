import dotenv from 'dotenv';
import path from 'path';

// 1. Carregar .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log('🔍 Verificando variáveis de ambiente:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Presente' : '❌ Ausente');
console.log('NODE_ENV:', process.env.NODE_ENV);

// 2. Testar se a URL está no formato correto
if (process.env.DATABASE_URL) {
  const url = process.env.DATABASE_URL;
  console.log('📋 Formato da URL:', url.startsWith('postgresql://') ? '✅ Correto' : '❌ Errado');
  
  // Extrair partes da URL para debug
  try {
    const urlObj = new URL(url);
    console.log('🔗 Protocolo:', urlObj.protocol);
    console.log('👤 Usuário:', urlObj.username);
    console.log('📍 Host:', urlObj.hostname);
    console.log('🚪 Porta:', urlObj.port);
    console.log('🗃️  Banco:', urlObj.pathname.replace('/', ''));
  } catch (error) {
    console.log('❌ URL malformada:', error);
  }
}

// 3. Tentar importar e usar Prisma
try {
  const { PrismaClient } = require('@prisma/client');
  console.log('📦 Prisma Client carregado com sucesso');
  
  const prisma = new PrismaClient({
    log: ['info'],
  });
  
  async function test() {
    console.log('🔄 Tentando conectar ao banco...');
    await prisma.$connect();
    console.log('✅ Conexão bem-sucedida!');
    
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('🐘 PostgreSQL Version:', result);
    
    await prisma.$disconnect();
    console.log('👋 Conexão encerrada');
  }
  
  test().catch(console.error);
  
} catch (error) {
  console.error('❌ Erro ao carregar Prisma:', error);
}