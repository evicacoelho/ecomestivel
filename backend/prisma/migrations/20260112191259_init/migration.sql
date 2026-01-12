-- CreateEnum
CREATE TYPE "PerfilUsuario" AS ENUM ('USUARIO', 'MODERADOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatusRegistro" AS ENUM ('PENDENTE', 'APROVADO', 'REJEITADO', 'EM_ANALISE');

-- CreateEnum
CREATE TYPE "TipoCategoria" AS ENUM ('COMESTIVEL', 'MEDICINAL', 'NATIVA', 'EXOTICA', 'URBANA', 'ORNAMENTAL');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "perfil" "PerfilUsuario" NOT NULL DEFAULT 'USUARIO',
    "avatarUrl" TEXT,
    "reputacao" INTEGER NOT NULL DEFAULT 0,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plantas" (
    "id" TEXT NOT NULL,
    "nomePopular" TEXT NOT NULL,
    "nomeCientifico" TEXT,
    "descricao" TEXT NOT NULL,
    "comestivel" BOOLEAN NOT NULL DEFAULT false,
    "medicinal" BOOLEAN NOT NULL DEFAULT false,
    "nativa" BOOLEAN NOT NULL DEFAULT true,
    "usos" TEXT,
    "cuidados" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plantas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" "TipoCategoria" NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoria_planta" (
    "id" TEXT NOT NULL,
    "plantaId" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categoria_planta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registro_plantas" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "plantaId" TEXT NOT NULL,
    "localizacaoId" TEXT NOT NULL,
    "observacoes" TEXT,
    "status" "StatusRegistro" NOT NULL DEFAULT 'PENDENTE',
    "dataRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registro_plantas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "localizacoes" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "endereco" TEXT,
    "descricao" TEXT,
    "regiao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "localizacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagem_plantas" (
    "id" TEXT NOT NULL,
    "registroId" TEXT NOT NULL,
    "plantaId" TEXT,
    "url" TEXT NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "tamanho" INTEGER NOT NULL,
    "dataUpload" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "imagem_plantas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comentarios" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "registroId" TEXT NOT NULL,
    "plantaId" TEXT,
    "texto" TEXT NOT NULL,
    "avaliacao" INTEGER,
    "editado" BOOLEAN NOT NULL DEFAULT false,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comentarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacoes" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "plantaId" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "avaliacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nome_key" ON "categorias"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "categoria_planta_plantaId_categoriaId_key" ON "categoria_planta"("plantaId", "categoriaId");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacoes_usuarioId_plantaId_key" ON "avaliacoes"("usuarioId", "plantaId");

-- AddForeignKey
ALTER TABLE "categoria_planta" ADD CONSTRAINT "categoria_planta_plantaId_fkey" FOREIGN KEY ("plantaId") REFERENCES "plantas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categoria_planta" ADD CONSTRAINT "categoria_planta_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_plantas" ADD CONSTRAINT "registro_plantas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_plantas" ADD CONSTRAINT "registro_plantas_plantaId_fkey" FOREIGN KEY ("plantaId") REFERENCES "plantas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_plantas" ADD CONSTRAINT "registro_plantas_localizacaoId_fkey" FOREIGN KEY ("localizacaoId") REFERENCES "localizacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagem_plantas" ADD CONSTRAINT "imagem_plantas_registroId_fkey" FOREIGN KEY ("registroId") REFERENCES "registro_plantas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagem_plantas" ADD CONSTRAINT "imagem_plantas_plantaId_fkey" FOREIGN KEY ("plantaId") REFERENCES "plantas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_registroId_fkey" FOREIGN KEY ("registroId") REFERENCES "registro_plantas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_plantaId_fkey" FOREIGN KEY ("plantaId") REFERENCES "plantas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_plantaId_fkey" FOREIGN KEY ("plantaId") REFERENCES "plantas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
