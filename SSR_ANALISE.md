# 🏦 SSR no AngularBank — Análise de Prós e Contras

> Análise contextualizada para o projeto **AngularBank** (Angular 19 + json-server)

---

## 📊 Mapa Mental — Visão Geral

```mermaid
mindmap
  root((SSR no AngularBank))
    ✅ A FAVOR
      SEO e Indexação
      Performance Percebida
      Compartilhamento Social
      Infraestrutura já parcial
      Acessibilidade
    ❌ CONTRA
      Auth via localStorage
      Backend Incompatível
      Complexidade Desnecessária
      Browser APIs
      Escopo Acadêmico
```

---

## ✅ Motivos PARA usar SSR

### 1. 🔍 SEO e Indexação

```mermaid
flowchart LR
    A[Crawler Google] -->|Sem SSR| B["Vê HTML vazio<br/>⬜ &lt;app-root&gt;&lt;/app-root&gt;"]
    A -->|Com SSR| C["Vê HTML completo<br/>🟩 Conteúdo renderizado"]
    B --> D["❌ Indexação ruim"]
    C --> E["✅ Indexação completa"]
```

| Aspecto | Sem SSR | Com SSR |
|---------|---------|---------|
| Conteúdo visível ao crawler | ❌ Apenas `<app-root>` | ✅ HTML completo |
| Meta tags dinâmicas | ❌ Estáticas no index.html | ✅ Geradas por rota |
| Open Graph (WhatsApp/LinkedIn) | ❌ Preview genérico | ✅ Preview personalizado |

**Relevância para o projeto**: ⚠️ **Baixa** — a página de login seria a única indexável; todo o restante é protegido.

---

### 2. ⚡ Performance Percebida (Core Web Vitals)

```mermaid
sequenceDiagram
    participant U as Usuário
    participant S as Servidor
    participant B as Browser

    Note over U,B: 🔴 SEM SSR (CSR puro)
    U->>S: GET /login
    S-->>B: index.html (vazio)
    B->>B: Baixa JS bundles (~500KB)
    B->>B: Executa Angular bootstrap
    B->>B: Renderiza componentes
    Note over B: ⏱️ FCP: ~2-3s

    Note over U,B: 🟢 COM SSR
    U->>S: GET /login
    S->>S: Renderiza Angular no Node
    S-->>B: HTML completo + CSS
    Note over B: ⏱️ FCP: ~0.5-1s
    B->>B: Hydration (conecta eventos)
```

| Métrica | Sem SSR | Com SSR | Ganho |
|---------|---------|---------|-------|
| **FCP** (First Contentful Paint) | ~2-3s | ~0.5-1s | 🟢 60-70% |
| **LCP** (Largest Contentful Paint) | ~3-4s | ~1-2s | 🟢 50% |
| **TTI** (Time to Interactive) | ~3s | ~3s | 🟡 Similar |
| **CLS** (Cumulative Layout Shift) | Maior | Menor | 🟢 Melhor |

**Relevância para o projeto**: ⚠️ **Média** — benefício real apenas na tela de login (única rota sem guard).

---

### 3. 📱 Compartilhamento Social

Quando alguém compartilha o link do banco no WhatsApp ou LinkedIn, o SSR permite gerar previews corretos com título, descrição e imagem.

**Relevância para o projeto**: ❌ **Nula** — app bancário privado não é compartilhado socialmente.

---

### 4. 🏗️ Infraestrutura Já Parcialmente Configurada

O projeto **já possui** elementos de SSR instalados:

```
✅ @angular/ssr@19.2.22          → Pacote instalado
✅ provideClientHydration()       → Configurado no app.config.ts
✅ withEventReplay()              → Habilitado
✅ angular.json → server entry    → src/main.server.ts
✅ angular.json → ssr.entry       → src/server.ts
✅ package.json → serve:ssr       → Script pronto
✅ isPlatformBrowser() checks     → Auth service e interceptor
```

**Relevância para o projeto**: 🟢 **Alta** — parte do trabalho já está feita.

---

### 5. ♿ Acessibilidade

SSR envia HTML semântico completo, beneficiando:
- Screen readers (conteúdo disponível sem JS)
- Navegadores com JS desabilitado
- Conexões lentas (conteúdo antes do JS)

**Relevância para o projeto**: ⚠️ **Baixa** — o app depende de JS para funcionar (formulários, Material, etc).

---

## ❌ Motivos para NÃO usar SSR

### 1. 🔐 Autenticação Baseada em localStorage (BLOQUEADOR CRÍTICO)

```mermaid
flowchart TD
    A["Requisição chega ao servidor SSR"] --> B{"Servidor tem<br/>localStorage?"}
    B -->|"❌ NÃO"| C["AuthService.hasToken() → false"]
    C --> D["authGuard bloqueia"]
    D --> E["Redirect para /login"]
    E --> F["⚠️ Toda rota protegida<br/>renderiza APENAS o login"]

    style B fill:#ff6b6b,color:white
    style F fill:#ff6b6b,color:white
```

**O problema central:**

```typescript
// auth.service.ts — localStorage não existe no servidor!
private hasToken(): boolean {
    return this.isBrowser && !!localStorage.getItem('token');
}
```

| Rota | Protegida? | SSR renderiza |
|------|-----------|---------------|
| `/login` | ❌ | ✅ Login page |
| `/dashboard` | ✅ authGuard | ❌ Redirect → login |
| `/transferencia` | ✅ authGuard | ❌ Redirect → login |
| `/transacoes` | ✅ authGuard | ❌ Redirect → login |
| `/emprestimo` | ✅ authGuard | ❌ Redirect → login |
| `/perfil/**` | ✅ authGuard | ❌ Redirect → login |

> **Resultado**: SSR só consegue renderizar `/login`. Todas as outras 8+ rotas sempre redirecionam, tornando SSR inútil para 90% da aplicação.

---

### 2. 🖥️ Backend Incompatível com SSR

```mermaid
flowchart LR
    subgraph "Ambiente SSR (Servidor Node)"
        A[Angular SSR Server]
    end

    subgraph "Ambiente Dev Local"
        B["json-server<br/>localhost:3000"]
    end

    A -->|"HTTP GET /account"| B
    B -.->|"❌ ECONNREFUSED<br/>ou Network Error"| A

    style A fill:#4ecdc4,color:white
    style B fill:#ff6b6b,color:white
```

**Problemas encontrados nos serviços:**

```typescript
// dashboard.service.ts
apiUrl = 'http://localhost:3000';  // ❌ Hardcoded!

// transactions.service.ts  
private apiUrl = 'http://localhost:3000/transactions';  // ❌ Hardcoded!
```

- json-server é um mock local — não funciona em produção
- URLs hardcoded não resolvem do lado do servidor em deploy
- Nenhuma estratégia de `TransferState` para evitar requests duplicados

---

### 3. 🎯 Complexidade Desproporcional ao Benefício

```mermaid
pie title "Páginas Públicas vs Privadas"
    "Privadas (authGuard)" : 90
    "Públicas (login)" : 10
```

| Fator | Impacto |
|-------|---------|
| Única página pública | `/login` (formulário simples) |
| Servidor Node.js adicional | 💰 Custo de infraestrutura |
| Complexidade de deploy | 🔧 Muito maior que SPA estático |
| Debugging mais difícil | 🐛 Server + Client errors |
| `TransferState` necessário | 🔄 Evitar fetch duplicado |
| Platform checks em todo lugar | 📝 `isPlatformBrowser()` sempre |

---

### 4. 🌐 Problemas com Browser APIs

```mermaid
flowchart TD
    subgraph "APIs usadas no projeto"
        A["localStorage"] --> X["❌ Não existe no servidor"]
        B["document/DOM"] --> X
        C["window.location"] --> X
        D["navigator"] --> X
    end

    subgraph "Arquivos afetados"
        A --> E["auth.service.ts"]
        A --> F["auth.interceptor.ts"]
    end

    style X fill:#ff6b6b,color:white
```

**Mitigações já presentes (parciais)**:
```typescript
// auth.service.ts — ✅ Tem check de plataforma
private isBrowser = isPlatformBrowser(this.platformId);

// auth.interceptor.ts — ✅ Tem check de plataforma
const token = isPlatformBrowser(platformId) ? localStorage.getItem('token') : null;
```

Mas: precisa verificar **todos** os componentes que usam APIs de browser (Angular Material dialogs, scroll, etc).

---

### 5. 📚 Escopo Acadêmico do Projeto

| Característica | Detalhe |
|---------------|---------|
| Contexto | Módulo 2 — Ada Tech |
| Backend | json-server (mock) |
| Autenticação | Credenciais hardcoded |
| Deploy | Não previsto para produção |
| Público-alvo | Avaliação acadêmica |

---

## 📋 Quadro Comparativo Final

```mermaid
quadrantChart
    title SSR para AngularBank: Esforço vs Benefício
    x-axis "Baixo Esforço" --> "Alto Esforço"
    y-axis "Baixo Benefício" --> "Alto Benefício"
    quadrant-1 "Fazer!"
    quadrant-2 "Planejar"
    quadrant-3 "Ignorar"
    quadrant-4 "Evitar"
    "FCP da página login": [0.3, 0.4]
    "SEO do login": [0.25, 0.2]
    "Hydration (já config.)": [0.2, 0.3]
    "Refatorar auth p/ cookies": [0.8, 0.3]
    "TransferState em services": [0.7, 0.25]
    "Deploy Node.js server": [0.85, 0.15]
    "Resolver Browser APIs": [0.6, 0.2]
    "Backend real (não json-server)": [0.9, 0.5]
```

---

## 🎯 Veredicto

```mermaid
flowchart TD
    Q1{"O app tem páginas<br/>públicas importantes?"} -->|"Não — só /login"| Q2
    Q2{"SEO é requisito<br/>de negócio?"} -->|"Não — app privado"| Q3
    Q3{"Backend suporta<br/>SSR em produção?"} -->|"Não — json-server"| Q4
    Q4{"Auth funciona<br/>sem localStorage?"} -->|"Não — usa localStorage"| V

    V["🔴 SSR NÃO É RECOMENDADO<br/>para este projeto no estado atual"]

    style V fill:#ff4757,color:white,stroke:#ff4757,font-size:16px
    style Q1 fill:#f8f9fa,stroke:#333
    style Q2 fill:#f8f9fa,stroke:#333
    style Q3 fill:#f8f9fa,stroke:#333
    style Q4 fill:#f8f9fa,stroke:#333
```

### Resumo executivo

| | Peso | Veredito |
|---|---|---|
| **A favor** | SEO, FCP, infra parcial | Benefícios marginais — só `/login` se beneficia |
| **Contra** | Auth, backend, escopo | Bloqueadores críticos em 90% das rotas |
| **Recomendação** | | **❌ Não usar SSR neste projeto** |

### Se no futuro quiser SSR, precisaria:
1. **Migrar auth para cookies HTTP-only** (acessíveis pelo servidor)
2. **Substituir json-server** por um backend real (Express/NestJS)
3. **Implementar TransferState** para evitar requests duplicados
4. **Adicionar páginas públicas** que justifiquem o SSR (landing page, sobre, etc.)
5. **Configurar `server.ts`** com proxy correto para a API

---

*Documento gerado em 28/03/2026 — Análise baseada no código-fonte do projeto AngularBank*
