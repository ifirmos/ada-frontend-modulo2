# AngularBank — Dashboard Bancário SPA

![Angular](https://img.shields.io/badge/Angular-19.2-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Angular Material](https://img.shields.io/badge/Angular_Material-19.2-757575?style=for-the-badge&logo=angular&logoColor=white)
![ngx-translate](https://img.shields.io/badge/ngx--translate-17.0-0095D9?style=for-the-badge)
![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![json-server](https://img.shields.io/badge/json--server-1.0_beta-lightgrey?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

Projeto desenvolvido para o curso de **Angular (Módulo 2)** da plataforma **Ada**, com foco em arquitetura empresarial, performance e boas práticas de desenvolvimento frontend moderno com Angular 17+.

---

## ⚡ Quick Start

> Pré-requisitos: **Node.js 18+** e **npm 9+**

### Basta executar o comando combinado abaixo no terminal, na raiz do projeto:

```bash
npm install && npm start
```

Ele instala as dependências e sobe a API e o frontend simultaneamente.

| Serviço  | URL |
|----------|-----|
| 🖥️ Frontend | http://localhost:4200 |
| 🗄️ API (json-server) | http://localhost:3000 |

## 🔐 Credenciais de Acesso (Ambiente de Teste)

> As credenciais são fixas e validadas localmente pelo `AuthService` — não há endpoint de autenticação real no `json-server`.

| Campo | Valor |
|-------|-------|
| **E-mail** | `admin@banco.com` |
| **Senha** | `123456` |

Após o login, um JWT simulado é armazenado no `localStorage` e anexado automaticamente em todas as requisições pelo `authInterceptor`.

---

## 📌 Contexto Acadêmico

Este repositório atende ao enunciado do projeto **Dashboard Bancário — Refatoração e Otimização**, contemplando a transformação de uma interface estática em uma **Single Page Application (SPA)** segura, internacionalizada, reativa e com performance extrema.

---

## ✅ Funcionalidades Implementadas

- **Login** com autenticação JWT e sessão segura
- **Dashboard** com saldo (ocultar/mostrar), receitas, despesas e últimas transações com ordenação
- **Transferência** com formulário reativo, validação e atualização de saldo via API (`POST` + `PATCH`)
- **Extrato (Transações)** com listagem via API (`GET`), criação (`POST`) e exclusão (`DELETE`) com confirmação
- **Simulador de Empréstimo** carregado via `@defer` apenas após interação do usuário
- **Fatura do Cartão** carregada via `@defer` ao entrar no viewport
- **Perfil com rotas aninhadas** (`/perfil/dados` e `/perfil/segurança`):
  - Dados Pessoais: formulário completo com modo leitura/edição, máscaras (CPF, telefone, CEP) e validações
  - Segurança: alteração de senha com indicador de força, toggles 2FA e atividade recente
- **Página 404** para rotas não encontradas
- **Seletor global de idioma** com 4 línguas e bandeiras no header

---

## 🌐 Internacionalização (i18n)

A aplicação suporta **4 idiomas completos** via `ngx-translate`:

| Idioma | Arquivo |
|--------|---------|
| 🇧🇷 Português do Brasil | `pt-br.json` |
| 🇵🇹 Português de Portugal | `pt-pt.json` |
| 🇺🇸 Inglês (EUA) | `en-us.json` |
| 🇪🇸 Espanhol | `es.json` |

Todos os textos da aplicação usam `| translate`. O idioma padrão é definido via variável de ambiente (`environment.defaultLang`).

---

## ⚙️ Arquitetura e Requisitos Técnicos

### Roteamento (SPA)
- Navegação 100% via `<router-outlet>` com Angular Router — sem navegação por variáveis de estado
- **Lazy Loading** com `loadComponent` em todas as rotas principais
- **Preloading** com `withPreloading(PreloadAllModules)` para carregamento em segundo plano
- **Rotas aninhadas** na seção de Perfil (`/perfil/dados`, `/perfil/seguranca`)
- **Rota Coringa `**`** para captura de páginas não encontradas (404)

### Reatividade Moderna
- Estado migrado para **Signals** (`signal()`, `computed()`) nos componentes: dashboard, loan, transfer, login, header, profile e security
- Observables convertidos para Signals via **`toSignal()`**
- **`@if`** e **`@for`** utilizados em todos os templates (sem diretivas estruturais legadas `*ngIf` / `*ngFor`)
- **`@defer (on interaction)`** no Simulador de Empréstimo
- **`@defer (on viewport)`** na Fatura do Cartão

### Integração de API (RxJS + HttpClient)
- `HttpClient` conectado ao `json-server` local
- `catchError` + `throwError` em **todos os métodos HTTP** (`getTransactions`, `getTransactionById`, `createTransaction`, `deleteTransaction`)
- Indicadores de **loading** nos formulários (botões desabilitados + texto dinâmico)
- Alertas de erro exibidos na interface

### Segurança
- **`authGuard`** (`CanActivateFn`) bloqueando acesso às rotas protegidas sem token no `localStorage`
- **`authInterceptor`** (`HttpInterceptorFn`) anexando `Authorization: Bearer <token>` em todas as requisições de saída, com verificação de `isPlatformBrowser` para compatibilidade com SSR

### Performance
- **`ChangeDetectionStrategy.OnPush`** aplicado em todos os 18 componentes
- **SSR (Server-Side Rendering)** ativo via `@angular/ssr`
- **Hydration** configurada com `provideClientHydration(withEventReplay())` no `app.config.ts`

---

## 🗂️ Estrutura do Projeto

```
ada-frontend-modulo2/
├── backend/
│   └── db.json                  # API fake com json-server
└── frontend/
    └── src/
        ├── app/
        │   ├── app.config.ts    # Providers globais (Router, HttpClient, i18n, SSR)
        │   ├── app.routes.ts    # Rotas com Lazy Loading e Guards
        │   ├── core/
        │   │   ├── guards/      # authGuard
        │   │   ├── interceptors/# authInterceptor
        │   │   └── services/    # AccountStateService, AuthService, LoanService
        │   ├── header/          # Header com seletor de idioma e tema
        │   ├── sidebar/         # Navegação lateral traduzida
        │   ├── shared/          # Componentes reutilizáveis
        │   └── main-panel/
        │       └── pages/
        │           ├── login/
        │           ├── dashboard/
        │           ├── transfer/
        │           ├── transactions/
        │           ├── loan/
        │           ├── profile/
        │           │   └── pages/
        │           │       ├── personal-data/
        │           │       └── security-data/
        │           └── not-found/
        └── environments/
            ├── environment.ts
            └── environment.development.ts
```

---

## 🧪 Testes

```bash
cd frontend
ng test
```

---

## 📋 Melhorias em Relação à Versão Anterior

Detalhamento completo disponível em [`RESUMO_MELHORIAS.html`](./RESUMO_MELHORIAS.html).

Resumo das principais mudanças:
- Substituição total da navegação manual por Angular Router com Lazy Loading
- Migração de todo o estado para Signals (`signal`, `computed`, `toSignal`)
- Substituição de `*ngIf` / `*ngFor` pela nova sintaxe de Control Flow (`@if`, `@for`)
- Implementação de `@defer` para carregamento sob demanda
- Adição de 2 idiomas extras além dos requisitados (en-US e es)
- `ChangeDetectionStrategy.OnPush` em todos os componentes
- SSR ativo com Hydration