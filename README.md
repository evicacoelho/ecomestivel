# 🌿 É de Comer?

**Aplicação web colaborativa para identificação e catalogação de plantas urbanas comestíveis e medicinais**

[![License: CC](https://mirrors.creativecommons.org/presskit/icons/cc.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/) [![License: CC](https://mirrors.creativecommons.org/presskit/icons/by.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/) [![License: CC](https://mirrors.creativecommons.org/presskit/icons/nc.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/) [![License: CC](https://mirrors.creativecommons.org/presskit/icons/sa.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933.svg)](https://nodejs.org/)

## 📋 Sobre o Projeto

O **"É de Comer?"** é uma plataforma web colaborativa que permite aos usuários identificar, catalogar e compartilhar informações sobre plantas urbanas da sua vizinhança. A aplicação promove educação ambiental, sustentabilidade e conscientização sobre a flora local.

### 🎯 Objetivos
- Criar um catálogo colaborativo de plantas urbanas
- Promover educação ambiental e conscientização
- Facilitar a identificação de plantas comestíveis e medicinais
- Criar uma comunidade engajada na preservação da flora local

## 🚀 Começando

### Pré-requisitos

- **Node.js** 18+ e **npm** 9+
- **PostgreSQL** 15+ (ou Docker)
- **Git**

### Instalação Rápida

```bash
# 1. Clone o repositório
git clone https://github.com/evicacoelho/ecomestivel.git
cd ecomestivel

# 2. Inicie tudo com um comando
./scripts/start-dev.sh
```

Ou faça manualmente:

```bash
# Backend
cd backend
cp .env.example .env  # Configure suas variáveis
npm install
npx prisma generate
npx prisma migrate dev
npm run dev

# Frontend (em outro terminal)
cd frontend
npm install
npm run dev
```

### 🐳 Usando Docker (Recomendado)

```bash
# Inicie o PostgreSQL com Docker
docker-compose up -d

# Siga os passos de instalação acima
```

## 🏗️ Arquitetura do Projeto

```
ecomestivel/
├── frontend/                 # Aplicação React + TypeScript
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # APIs e serviços
│   │   └── hooks/          # Custom hooks
│   └── public/             # Assets estáticos
│
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── controllers/    # Controladores das rotas
│   │   ├── routes/         # Definição de rotas
│   │   ├── services/       # Lógica de negócio
│   │   └── middleware/     # Middlewares
│   ├── prisma/             # Schema do banco
│   └── uploads/            # Imagens uploadadas
│
└── scripts/                # Scripts auxiliares
    ├── start-dev.sh        # Inicia tudo
    └── reset-db.sh         # Reseta banco de dados
```

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **React 18** com **TypeScript**
- **Material-UI (MUI)** para componentes
- **Redux Toolkit** para gerenciamento de estado
- **React Query** para cache de dados
- **React Hook Form + Yup** para formulários
- **Leaflet + OpenStreetMap** para mapas
- **Vite** como build tool

### **Backend**
- **Node.js + Express** com **TypeScript**
- **PostgreSQL** com **Prisma ORM**
- **JWT** para autenticação
- **bcrypt** para hash de senhas
- **Multer** para upload de imagens
- **Express Validator** para validação

### **DevOps & Tools**
- **Docker & Docker Compose**
- **Git + GitHub**
- **Prisma Studio** (interface do banco)
- **ESLint + Prettier**

## 📱 Funcionalidades

### 🗺️ Mapa Interativo
- Visualize plantas próximas à sua localização
- Filtre por categoria (comestível, medicinal, nativa)
- Clique em marcadores para ver detalhes

### 🌿 Catálogo de Plantas
- Busca por nome popular ou científico
- Filtros avançados (comestível, medicinal, nativa)
- Paginação e ordenação
- Visualização em cards ou lista

### 👤 Sistema de Usuários
- Registro e login seguro
- Perfis (Usuário, Moderador, Admin)
- Sistema de reputação
- Histórico de contribuições

### 📝 Registro de Plantas
- Formulário passo-a-passo
- Upload de múltiplas imagens
- Seleção de localização no mapa
- Categorização automática

### 💬 Comunidade
- Comentários e avaliações
- Sistema de moderação
- Status de aprovação (Pendente/Aprovado/Rejeitado)

## 🗄️ Modelo do Banco de Dados

```prisma
model Usuario {
  id           String       @id @default(uuid())
  nome         String
  email        String       @unique
  senhaHash    String
  perfil       PerfilUsuario @default(USUARIO)
  avatarUrl    String?
  reputacao    Int          @default(0)
}

model Planta {
  id               String       @id @default(uuid())
  nomePopular      String
  nomeCientifico   String?
  descricao        String
  comestivel       Boolean      @default(false)
  medicinal        Boolean      @default(false)
  nativa           Boolean      @default(true)
  categorias       Categoria[]
}

model Localizacao {
  id        String    @id @default(uuid())
  latitude  Float
  longitude Float
  endereco  String?
}
```

## 📡 API Endpoints Principais

### Autenticação
```
POST   /api/auth/login          # Login de usuário
POST   /api/auth/register       # Registro de novo usuário
GET    /api/auth/profile        # Perfil do usuário atual
GET    /api/auth/verify-token   # Verificar token JWT
```

### Plantas
```
GET    /api/plantas             # Listar plantas (com filtros)
GET    /api/plantas/proximas    # Plantas por geolocalização
GET    /api/plantas/:id         # Detalhes de uma planta
POST   /api/plantas             # Cadastrar nova planta
PUT    /api/plantas/:id         # Atualizar planta
DELETE /api/plantas/:id         # Remover planta
POST   /api/plantas/:id/avaliar # Avaliar/comentar planta
```

### Health Check
```
GET    /api/health             # Status da API
```

## 🧪 Credenciais de Teste

A aplicação vem com usuários pré-cadastrados:

```
👤 Administrador: admin@ecomestivel.com / admin123
👤 Moderador:    moderador@ecomestivel.com / moderador123  
👤 Usuário:      usuario@ecomestivel.com / usuario123
```

## 🚀 Scripts Úteis

```bash
# Iniciar ambiente de desenvolvimento completo
./scripts/start-dev.sh

# Apenas backend
cd backend && npm run dev

# Apenas frontend  
cd frontend && npm run dev

# Banco de dados
cd backend && npx prisma studio  # Interface visual do banco
cd backend && npx prisma migrate dev  # Rodar migrations

# Reset completo
./scripts/reset-db.sh
```

## 📁 Estrutura de Pastas

```
frontend/
├── src/
│   ├── components/     # Componentes React
│   │   ├── common/    # Componentes genéricos
│   │   ├── forms/     # Formulários
│   │   ├── layout/    # Layout principal
│   │   ├── mapa/      # Componentes de mapa
│   │   └── plantas/   # Componentes de plantas
│   ├── pages/         # Páginas da aplicação
│   ├── services/      # APIs e serviços
│   ├── store/         # Redux store
│   ├── hooks/         # Custom hooks
│   └── types/         # Tipos TypeScript
```

## 🔧 Configuração de Ambiente

### Backend (`.env`)
```env
PORT=3001
DATABASE_URL="postgresql://user:pass@localhost:5432/ecomestivel_db"
JWT_SECRET="seu_super_segredo_jwt"
JWT_EXPIRES_IN="7d"
```

### Frontend (`.env`)
```env
VITE_API_URL="http://localhost:3001/api"
VITE_MAPBOX_TOKEN="seu_token_opcional"
```

## 🤝 Como Contribuir

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

## 👥 Autores

- **Emanuelle Coelho** - [@evicacoelho](https://github.com/evicacoelho)

## 🙏 Agradecimentos

- Comunidade open source
- OpenStreetMap por fornecer dados de mapas gratuitos
- Todos os contribuidores e testadores

## 📞 Suporte

Encontrou um bug ou tem uma sugestão? Por favor, abra uma [issue](https://github.com/evicacoelho/ecomestivel/issues).

---

<div align="center">
  
**🌍 Conectando pessoas com a natureza urbana**  
**📚 Educação ambiental através da tecnologia**  
**🤝 Construindo comunidades sustentáveis**

</div>