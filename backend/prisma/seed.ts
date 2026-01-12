import { PrismaClient, TipoCategoria } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('📡 DATABASE_URL:', process.env.DATABASE_URL ? 'Configurada' : 'NÃO CONFIGURADA');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  const categorias = [
    { nome: 'COMESTIVEL', tipo: TipoCategoria.COMESTIVEL, descricao: 'Plantas com frutos ou partes comestíveis' },
    { nome: 'MEDICINAL', tipo: TipoCategoria.MEDICINAL, descricao: 'Plantas com propriedades medicinais' },
    { nome: 'NATIVA', tipo: TipoCategoria.NATIVA, descricao: 'Plantas nativas do Brasil' },
    { nome: 'EXOTICA', tipo: TipoCategoria.EXOTICA, descricao: 'Plantas exóticas/introduzidas' },
    { nome: 'URBANA', tipo: TipoCategoria.URBANA, descricao: 'Plantas adaptadas ao ambiente urbano' },
    { nome: 'ORNAMENTAL', tipo: TipoCategoria.ORNAMENTAL, descricao: 'Plantas com valor ornamental' },
  ];

  for (const categoria of categorias) {
    const existing = await prisma.categoria.findFirst({
      where: { nome: categoria.nome },
    });
    
    if (!existing) {
      await prisma.categoria.create({
        data: categoria,
      });
    } else {
      await prisma.categoria.update({
        where: { id: existing.id },
        data: categoria,
      });
    }
  }
  console.log('✅ Categorias criadas/atualizadas');

  // usuários
  const senhaHashAdmin = await bcrypt.hash('admin123', 10);
  const senhaHashUsuario = await bcrypt.hash('usuario123', 10);
  const senhaHashModerador = await bcrypt.hash('moderador123', 10);

  const usuarios = [
    {
      nome: 'Administrador Sistema',
      email: 'admin@ecomestivel.com',
      senhaHash: senhaHashAdmin,
      perfil: 'ADMIN' as const,
      avatarUrl: null,
    },
    {
      nome: 'Moderador Teste',
      email: 'moderador@ecomestivel.com',
      senhaHash: senhaHashModerador,
      perfil: 'MODERADOR' as const,
      avatarUrl: null,
    },
    {
      nome: 'Usuário Teste',
      email: 'usuario@ecomestivel.com',
      senhaHash: senhaHashUsuario,
      perfil: 'USUARIO' as const,
      avatarUrl: null,
    },
  ];

  for (const usuario of usuarios) {
    const existing = await prisma.usuario.findFirst({
      where: { email: usuario.email },
    });
    
    if (!existing) {
      await prisma.usuario.create({
        data: usuario,
      });
    } else {
      await prisma.usuario.update({
        where: { id: existing.id },
        data: usuario,
      });
    }
  }
  console.log('✅ Usuários criados/atualizados');

  // MOCK DATA
  const plantas = [
    {
      nomePopular: 'Mangueira',
      nomeCientifico: 'Mangifera indica',
      descricao: 'Árvore frutífera tropical, nativa do sul e sudeste asiático. Produz o fruto manga, muito apreciado no Brasil.',
      comestivel: true,
      medicinal: false,
      nativa: false,
      usos: 'Frutos comestíveis, sombra, madeira para móveis',
      cuidados: 'Necessita de espaço para crescer, solo bem drenado',
      categorias: ['COMESTIVEL', 'EXOTICA', 'URBANA'],
    },
    {
      nomePopular: 'Boldo',
      nomeCientifico: 'Plectranthus barbatus',
      descricao: 'Planta medicinal nativa da África, muito utilizada no Brasil para problemas digestivos.',
      comestivel: false,
      medicinal: true,
      nativa: false,
      usos: 'Chá para digestão, problemas hepáticos',
      cuidados: 'Cultivar em solo fértil e bem drenado',
      categorias: ['MEDICINAL', 'EXOTICA'],
    },
    {
      nomePopular: 'Pitangueira',
      nomeCientifico: 'Eugenia uniflora',
      descricao: 'Árvore nativa da Mata Atlântica, produz frutos pequenos e vermelhos muito saborosos.',
      comestivel: true,
      medicinal: true,
      nativa: true,
      usos: 'Frutos comestíveis, chá das folhas para baixar febre',
      cuidados: 'Adapta-se bem a diversos solos',
      categorias: ['COMESTIVEL', 'MEDICINAL', 'NATIVA', 'URBANA'],
    },
  ];

  for (const plantaData of plantas) {
    const existingPlanta = await prisma.planta.findFirst({
      where: { nomePopular: plantaData.nomePopular },
    });

    let planta;
    
    if (!existingPlanta) {
      planta = await prisma.planta.create({
        data: {
          nomePopular: plantaData.nomePopular,
          nomeCientifico: plantaData.nomeCientifico,
          descricao: plantaData.descricao,
          comestivel: plantaData.comestivel,
          medicinal: plantaData.medicinal,
          nativa: plantaData.nativa,
          usos: plantaData.usos,
          cuidados: plantaData.cuidados,
        },
      });
    } else {
      planta = await prisma.planta.update({
        where: { id: existingPlanta.id },
        data: {
          nomeCientifico: plantaData.nomeCientifico,
          descricao: plantaData.descricao,
          comestivel: plantaData.comestivel,
          medicinal: plantaData.medicinal,
          nativa: plantaData.nativa,
          usos: plantaData.usos,
          cuidados: plantaData.cuidados,
        },
      });
    }

    // categorias
    for (const categoriaNome of plantaData.categorias) {
      const categoria = await prisma.categoria.findFirst({
        where: { nome: categoriaNome },
      });

      if (categoria) {
        const existingRelation = await prisma.categoriaPlanta.findFirst({
          where: {
            plantaId: planta.id,
            categoriaId: categoria.id,
          },
        });

        if (!existingRelation) {
          await prisma.categoriaPlanta.create({
            data: {
              plantaId: planta.id,
              categoriaId: categoria.id,
            },
          });
        }
      }
    }
  }
  console.log('✅ Plantas de exemplo criadas/atualizadas');

  console.log('🌿 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });