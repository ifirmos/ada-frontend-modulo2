# Resumo de Melhorias — AngularBank

## 1. Signals e Computed
- Variáveis de estado migradas para `signal()` e `computed()` nos componentes: **loan**, **transfer**, **login**, **dashboard**, **header**
- Exemplos: `errorMessage = signal('')`, `totalIncome = computed(() => ...)`

## 2. Control Flow (@if)
- Todas as 5 ocorrências de `*ngIf` substituídas por `@if` (loan, transfer, login)

## 3. @defer (on viewport) — Fatura do Cartão
- No dashboard, o componente de fatura mudou de `@defer (on interaction)` para `@defer (on viewport)`

## 4. toSignal()
- No transfer, `account$` (Observable + async pipe) foi convertido para `toSignal()`

## 5. catchError em todas as requisições HTTP
- Os 5 métodos de `transactions.service.ts` agora possuem `catchError` + `throwError`
- Métodos: getTransactions, getTransactionById, createTransaction, updateTransaction, deleteTransaction

## 6. Indicadores de Loading nos Formulários
- `create-transaction`: botão desabilitado durante loading, texto muda para "Salvando...", exibe erro
- `confirm-delete-dialog`: botão desabilitado durante loading, texto muda para "Excluindo...", exibe erro

## 7. Header traduzido com | translate
- Todos os textos estáticos do header agora usam `{{ 'CHAVE' | translate }}`

## 8. Arquivos de Tradução (4 idiomas)
- **pt-br.json** — Português do Brasil (padrão)
- **pt-pt.json** — Português de Portugal
- **en-us.json** — Inglês (EUA) `[NOVO]`
- **es.json** — Espanhol `[NOVO]`
- Chaves: SIDEBAR (Dashboard, Transferir, Empréstimos, Transações, Perfil) e HEADER (Saudação, Tema, Sair, Idioma)

## 9. Seletor Global de Idioma
- Dropdown com bandeiras (🇧🇷🇵🇹🇺🇸🇪🇸) no header usando `MatMenu`
- `switchLang()` atualiza `TranslateService` e o signal `currentLang`

## 10. ChangeDetectionStrategy.OnPush
- Aplicado em **todos os 18 componentes** (antes só 1 tinha)

## 11. provideClientHydration
- `provideClientHydration(withEventReplay())` restaurado no `app.config.ts`

## 12. Perfil — Dados Pessoais `[NOVO]`
- Tela completa com formulário: nome, CPF (mascarado), data de nascimento, telefone (máscara), e-mail, nome da mãe, gênero
- Seção de endereço: CEP, rua, número, complemento, bairro, cidade, UF
- Modo leitura/edição com toggle — CPF não-editável por segurança
- Feedback visual: banner de sucesso, loading no botão
- Formulário reativo com `Validators.required`, `Validators.email`, `Validators.minLength`
- Layout responsivo (grid 2 colunas → 1 coluna mobile)
- Dados pré-carregados via `toSignal(account$)`

## 13. Perfil — Segurança `[NOVO]`
- **Alteração de senha:** formulário com senha atual, nova senha, confirmação — validação de match e de força
- **Indicador de força:** barra visual (fraca/média/forte) com cores dinâmicas
- Validação custom: mín. 8 chars, maiúsculas + minúsculas, número e caractere especial
- **Preferências:** toggles para 2FA, notificações de login e alertas de transações (`MatSlideToggle`)
- **Atividade recente:** último acesso, dispositivo e IP (mascarado)
- Todos os estados com `signal()`

## 14. Remoção da Edição de Transações `[NOVO]`
- Removida rota `transacoes/editar/:id`
- Removido botão de editar da tabela e método `onEdit()`
- Removido `updateTransactionWithBalance()` do `AccountStateService`
- **Justificativa:** transações bancárias efetivadas não podem ser editadas — apenas estornadas ou excluídas

## 15. i18n — Cobertura 100% `[NOVO]`
- Todos os textos estáticos usam `| translate`
- 14 seções traduzidas: SIDEBAR, HEADER, LOGIN, DASHBOARD, TRANSACTIONS, TRANSFER, LOAN, PROFILE, PERSONAL_DATA, SECURITY, CREATE_TRANSACTION, DELETE_DIALOG, NOT_FOUND, COMMON
- 4 idiomas completos: 🇧🇷 pt-BR, 🇵🇹 pt-PT, 🇺🇸 en-US, 🇪🇸 es

---

**Build validado com sucesso — 0 erros.**
