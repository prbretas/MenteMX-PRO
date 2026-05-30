# 🧪 Guia de Testes Manuais — MenteMX Pro

## O que já funciona?

| Componente | Status | Como testar |
|------------|--------|-------------|
| Backend API | ✅ Funcional (9 módulos) | Postman, Insomnia ou curl |
| Mobile App | ✅ Login + Cadastro + Home | Expo Go no celular |
| Desktop App | ❌ Placeholder | Ainda não implementado |

---

## 1. Testar o Backend (API)

### Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL rodando (local ou Docker)

### Passo 1: Instalar dependências

```bash
cd src/MenteMX-Pro-App
npm install --legacy-peer-deps
```

### Passo 2: Configurar o banco de dados

```bash
cd apps/backend
copy .env.example .env
```

Edite o `.env` com suas credenciais do PostgreSQL:
```
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:sua_senha@localhost:5432/mentemx_pro
JWT_SECRET=minha-chave-secreta-dev
JWT_EXPIRES_IN=7d
```

### Passo 3: Criar o banco no PostgreSQL

```sql
CREATE DATABASE mentemx_pro;
```

### Passo 4: Iniciar o servidor

```bash
cd src/MenteMX-Pro-App/apps/backend
npx tsx src/index.ts
```

Deve aparecer: `🏁 MenteMX Pro API running on port 3000`

### Passo 5: Testar os endpoints

#### Health Check
```bash
curl http://localhost:3000/api/health
```
Resposta esperada: `{"status":"ok","service":"mentemx-pro-api","version":"0.1.0"}`

#### Cadastrar Piloto
```bash
curl -X POST http://localhost:3000/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Philippe\",\"email\":\"philippe@mentemx.com\",\"password\":\"123456\"}"
```
Resposta: token JWT + dados do piloto

#### Login
```bash
curl -X POST http://localhost:3000/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"philippe@mentemx.com\",\"password\":\"123456\"}"
```
Resposta: token JWT

#### Cadastrar Moto (use o token do login)
```bash
curl -X POST http://localhost:3000/pilots/SEU_PILOT_ID/bikes ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer SEU_TOKEN" ^
  -d "{\"brand\":\"Honda\",\"model\":\"CRF 250R\",\"year\":2024,\"displacementCc\":250}"
```

#### Iniciar Sessão
```bash
curl -X POST http://localhost:3000/pilots/SEU_PILOT_ID/sessions ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer SEU_TOKEN" ^
  -d "{}"
```

#### Registrar Volta
```bash
curl -X POST http://localhost:3000/sessions/SEU_SESSION_ID/laps ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer SEU_TOKEN" ^
  -d "{\"lapTimeMs\":92500}"
```

#### Encerrar Sessão
```bash
curl -X POST http://localhost:3000/sessions/SEU_SESSION_ID/end ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer SEU_TOKEN" ^
  -d "{\"mentalScore\":7,\"physicalScore\":8}"
```

#### Gerar License Key
```bash
curl -X POST http://localhost:3000/api/keys/generate ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer SEU_TOKEN" ^
  -d "{\"plan\":\"monthly\"}"
```

#### Sync Batch
```bash
curl -X POST http://localhost:3000/sync/batch ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer SEU_TOKEN" ^
  -d "{\"operations\":[{\"id\":\"550e8400-e29b-41d4-a716-446655440000\",\"deviceId\":\"dev-1\",\"opType\":\"INSERT\",\"tableName\":\"lap\",\"recordId\":\"rec-1\",\"payload\":\"{}\",\"createdAt\":\"2024-01-01T10:00:00Z\"}]}"
```

---

## 2. Testar o Mobile (Expo)

### Pré-requisitos

- Node.js 18+
- Expo Go instalado no celular (Google Play ou App Store)
- Celular e computador na mesma rede Wi-Fi

### Passo 1: Instalar dependências (se ainda não fez)

```bash
cd src/MenteMX-Pro-App
npm install --legacy-peer-deps
```

### Passo 2: Configurar IP do backend

Edite o arquivo `apps/mobile/src/constants/api.ts` e coloque o IP do seu PC:

```typescript
// Descubra seu IP: ipconfig (Windows) ou ifconfig (Mac/Linux)
export const API_BASE_URL = __DEV__
  ? 'http://SEU_IP_AQUI:3000'
  : 'https://api.mentemxpro.com';
```

### Passo 3: Iniciar o backend (em um terminal)

```bash
cd src/MenteMX-Pro-App/apps/backend
npx tsx src/index.ts
```

### Passo 4: Iniciar o Expo (em outro terminal)

```bash
cd src/MenteMX-Pro-App/apps/mobile
npx expo start
```

### Passo 5: Abrir no celular

- Escaneie o QR Code com o app **Expo Go**
- A tela de **Login** deve aparecer (fundo escuro, botões grandes)

### Passo 6: Testar o fluxo

1. **Tela de Login** — Toque em "Criar conta"
2. **Tela de Cadastro** — Preencha nome, email e senha → "Cadastrar"
3. **Home** — Deve aparecer o card de MX Score e Streak
4. Volte e teste o **Login** com as credenciais criadas

### O que verificar (Modo Luva)

- [ ] Botões são grandes (fácil de tocar com luva)
- [ ] Fundo escuro com texto branco (alto contraste)
- [ ] Máximo 3 botões/ações por tela
- [ ] Mensagens de erro aparecem em vermelho abaixo do campo
- [ ] Teclado não cobre os campos (scroll funciona)

---

## 3. Rodar os Testes Automatizados

### Testes do Core (lógica de negócio)
```bash
cd src/MenteMX-Pro-App
npx vitest run --workspace=packages/core
```

### Testes do Backend
```bash
cd src/MenteMX-Pro-App
npx vitest run --workspace=apps/backend
```

### Todos os testes
```bash
cd src/MenteMX-Pro-App
npm test
```

---

## 4. Usando Postman/Insomnia (Recomendado)

Para facilitar os testes, importe esta collection:

### Variáveis de ambiente
```
BASE_URL = http://localhost:3000
TOKEN = (preencher após login)
PILOT_ID = (preencher após register)
```

### Fluxo de teste completo
1. POST /auth/register → salvar token e pilotId
2. POST /pilots/:id/bikes → cadastrar moto
3. POST /pilots/:id/sessions → iniciar sessão
4. POST /sessions/:id/laps → registrar 5+ voltas
5. POST /sessions/:id/end → ver resumo com consistência
6. POST /api/keys/generate → gerar license key
7. GET /api/health → verificar que tudo está ok

---

## Problemas Comuns

| Problema | Solução |
|----------|---------|
| `Cannot find module` | Rode `npm install --legacy-peer-deps` na raiz |
| `Connection refused :5432` | PostgreSQL não está rodando |
| `relation does not exist` | Rode as migrations (tabelas não criadas) |
| Expo não conecta | Verifique se celular e PC estão na mesma rede |

---

## Próximos Passos (o que falta para app completo)

- [x] ~~Issue #8: Telas de login/cadastro no mobile~~ ✅
- [ ] Issue #32: Interface Modo Luva (tema escuro completo)
- [ ] Issue #36: Tela de ativação por Key
- [ ] Issue #42: App Desktop base
- [ ] Tela de Sessão (registrar voltas)
- [ ] Tela de Analytics (Radar + MX Score)
- [ ] Tela de Setup Técnico
- [ ] Tela de Eventos
