# PicStock Backend

API REST para o app de controle de estoque PicStock. Stack: Node.js, Express, Sequelize e PostgreSQL.

## Estrutura

- server.js — inicializa o servidor Express, middlewares, estáticos e registra as rotas.
- .env — variáveis de ambiente (porta, credenciais do BD, JWT, etc).
- .sequelizerc — configura caminhos do sequelize-cli (migrations, models, seeders, config).
- config/config.js — configurações do Sequelize por ambiente (development/test/production).
- models/
  - index.js — bootstrap dos models; carrega e associa todos os models.
  - user.js — model User (campos: name, email, faceDescriptor, profilePhoto, active). Associação: hasMany StockMovement.
  - item.js — model Item (campos: name, description, barcode, qrCode, category, currentQuantity, minQuantity). Associação: hasMany StockMovement.
  - stockmovement.js — model StockMovement (campos: itemId, userId, movementType, quantity, notes). Associações: belongsTo Item e User.
- migrations/
  - 20250101000000-create-user.js — cria tabela Users (snake_case em DB), índices de email/active.
  - 20250101000001-create-item.js — cria tabela Items e índices (barcode, qr_code, category).
  - 20250101000002-create-stock-movement.js — cria tabela StockMovements, FKs e índices (created_at, item_id, user_id, movement_type).
- controllers/
  - usersController.js — CRUD de usuários + endpoints de biometria facial (salvar descriptor e identificar).
  - itemsController.js — CRUD de itens + busca / filtro e busca por código de barras/QR.
  - movementsController.js — listar e criar movimentos (IN/OUT) com transação e atualização do saldo.
- routes/
  - users.js — rotas /api/users (CRUD, PUT /:id/face, POST /identify).
  - items.js — rotas /api/items (CRUD; GET /code/:code antes de GET /:id).
  - movements.js — rotas /api/movements (GET lista, POST cria).
  - dashboard.js — rota /api/dashboard com contagens gerais e baixo estoque.
- uploads/ — pasta para arquivos estáticos (ex.: fotos de perfil). Servida em /uploads.
- middleware/ e utils/ — pasta para middlewares e utilitários futuros.
- seeders/
  - 20250101000010-demo-users.js — insere usuários de exemplo.
  - 20250101000011-demo-items.js — insere itens de exemplo.

## Como rodar

1. Requisitos: Node.js 18+.
2. Configure o arquivo `.env` (usuário, senha e DB).
3. Instale dependências:
   ```
   cd backend
   npm install
   ```
4. Crie o banco e rode migrations/seeds:
   ```
   npm run db:create    # cria o DB local (se estiver usando local)
   npm run db:migrate   # aplica as migrations (local ou Supabase)
   npm run db:seed      # insere dados de exemplo
   ```
5. Suba o servidor em dev:
   ```
   npm run dev
   ```
6. Testes rápidos:
   - GET http://localhost:3000/
   - GET http://localhost:3000/api/items
   - GET http://localhost:3000/api/items/code/ITEM001
   - POST http://localhost:3000/api/movements
     ```json
     { "itemId": 1, "userId": 1, "movementType": "OUT", "quantity": 1 }
     ```
   - PUT http://localhost:3000/api/users/1/face
     ```json
     { "descriptor": [0.1, 0.2, ... floats ...] }
     ```
   - POST http://localhost:3000/api/users/identify
     ```json
     { "descriptor": [0.1, 0.2, ...], "threshold": 0.5 }
     ```

## Usando o Neon (PostgreSQL gerenciado)

1. Crie o banco/projeto no Neon e copie a Connection string (URI).
2. No arquivo `.env`, preencha:
   ```
   DATABASE_URL=postgresql://USUARIO:SENHA@HOST/neondb?sslmode=require&channel_binding=require
   DB_SSL=true
   ```
   Observações:
   - O backend está preparado para usar `DATABASE_URL` diretamente com SSL habilitado (Neon exige).
   - Não é necessário (nem recomendado) rodar `db:create` no Neon; use apenas migrations e seeds.
3. Rode as migrations e seeds apontando para o Neon:
   ```
   npm run db:migrate
   npm run db:seed
   ```
4. Suba a API normalmente:
   ```
   npm run dev
   ```

### Segurança
- Nunca commite credenciais; mantenha o `.env` fora do versionamento (já no .gitignore).
- Use `DB_SSL=true` no Neon. Em produção, considere validar certificados se necessário.
- Se expuser sua URL/senha, troque-a imediatamente no painel do Neon.

## Notas de projeto

- Banco: PostgreSQL com Sequelize, colunas snake_case no DB e camelCase na aplicação (mapeadas por `field`/`underscored`).
- Movimentos: uso de transação para manter consistência de estoque e evitar saldo negativo.
- Facial: backend armazena o descriptor (array) e faz matching por similaridade cosseno. O cálculo do descriptor é responsabilidade do app.
- Segurança: adicione autenticação (JWT) quando publicar em produção e use HTTPS.
- Próximos passos: upload de foto (multer/sharp), papéis (admin/operador), relatórios e alertas de baixo estoque.
