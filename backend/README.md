# TODO List - Backend API

Sistema de gerenciamento de tarefas - Backend REST API

## Tecnologias

- Node.js
- TypeScript
- Express.js
- MS SQL Server
- Zod (validação)

## Estrutura do Projeto

```
src/
├── api/              # Controladores de API
├── routes/           # Definições de rotas
├── middleware/       # Middlewares Express
├── services/         # Lógica de negócio
├── utils/            # Funções utilitárias
├── instances/        # Instâncias de serviços
├── config/           # Configurações
└── server.ts         # Ponto de entrada
```

## Instalação

```bash
npm install
```

## Configuração

1. Copie `.env.example` para `.env`
2. Configure as variáveis de ambiente
3. Configure a conexão com o banco de dados

## Desenvolvimento

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Produção

```bash
npm start
```

## Endpoints da API

### Health Check
- `GET /health` - Verifica status da API

### API v1
- Base URL: `/api/v1`
- External routes: `/api/v1/external`
- Internal routes: `/api/v1/internal`

## Funcionalidades

- Criação de tarefas
- Categorização de tarefas
- Definição de prioridades
- Estabelecimento de prazos
- Marcação de conclusão
- Busca de tarefas
- Notificações e lembretes
- Compartilhamento de tarefas
- Visualização em calendário
- Sincronização multiplataforma

## Padrões de Código

- TypeScript strict mode
- Path aliases com @/
- Validação com Zod
- Tratamento de erros padronizado
- Multi-tenancy por conta
- Soft delete pattern

## Licença

ISC