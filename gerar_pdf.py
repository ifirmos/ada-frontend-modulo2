"""Gera o PDF de apresentação das melhorias do AngularBank."""

from fpdf import FPDF


class RelatorioPDF(FPDF):
    COR_PRIMARIA = (13, 110, 253)
    COR_TITULO = (30, 30, 30)
    COR_SUBTITULO = (60, 60, 60)
    COR_BODY = (50, 50, 50)
    COR_VERDE = (25, 135, 84)
    COR_VERMELHO = (220, 53, 69)
    COR_AMARELO = (255, 193, 7)
    COR_BG_LIGHT = (245, 247, 250)
    COR_BG_HEADER = (13, 110, 253)
    COR_BRANCO = (255, 255, 255)

    def header(self):
        if self.page_no() == 1:
            return
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, "AngularBank - Relatório de Melhorias | Ada Tech - Módulo 2", align="C")
        self.ln(12)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f"Página {self.page_no()}/{{nb}}", align="C")

    def capa(self):
        self.add_page()
        self.set_fill_color(*self.COR_BG_HEADER)
        self.rect(0, 0, 210, 297, "F")

        self.set_y(70)
        self.set_font("Helvetica", "B", 36)
        self.set_text_color(*self.COR_BRANCO)
        self.cell(0, 16, "AngularBank", align="C", new_x="LMARGIN", new_y="NEXT")
        self.ln(4)

        self.set_font("Helvetica", "", 18)
        self.set_text_color(200, 220, 255)
        self.cell(0, 10, "Relatorio de Melhorias e Refatoracao", align="C", new_x="LMARGIN", new_y="NEXT")
        self.ln(2)
        self.cell(0, 10, "Projeto Final - Angular II", align="C", new_x="LMARGIN", new_y="NEXT")

        self.ln(30)
        self.set_draw_color(*self.COR_BRANCO)
        self.set_line_width(0.5)
        self.line(60, self.get_y(), 150, self.get_y())
        self.ln(12)

        self.set_font("Helvetica", "", 13)
        self.set_text_color(220, 230, 255)
        self.cell(0, 8, "Ada Tech - Modulo 2", align="C", new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 8, "28 de Março de 2026", align="C", new_x="LMARGIN", new_y="NEXT")

        self.set_y(250)
        self.set_font("Helvetica", "I", 10)
        self.set_text_color(180, 200, 240)
        self.cell(0, 6, "Angular 19 | TypeScript | RxJS | Signals | Angular Material", align="C", new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 6, "ngx-translate | json-server | Lazy Loading | OnPush", align="C", new_x="LMARGIN", new_y="NEXT")

    def titulo_secao(self, numero, texto):
        self.ln(6)
        self.set_font("Helvetica", "B", 16)
        self.set_text_color(*self.COR_PRIMARIA)
        self.cell(0, 10, f"{numero}. {texto}", new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(*self.COR_PRIMARIA)
        self.set_line_width(0.6)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(4)

    def subtitulo(self, texto):
        self.set_font("Helvetica", "B", 12)
        self.set_text_color(*self.COR_SUBTITULO)
        self.cell(0, 8, texto, new_x="LMARGIN", new_y="NEXT")
        self.ln(1)

    def corpo(self, texto):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(*self.COR_BODY)
        self.multi_cell(0, 5.5, texto)
        self.ln(2)

    def badge(self, texto, cor):
        self.set_font("Helvetica", "B", 9)
        self.set_fill_color(*cor)
        self.set_text_color(*self.COR_BRANCO)
        w = self.get_string_width(texto) + 8
        self.cell(w, 6, texto, fill=True, align="C")
        self.set_text_color(*self.COR_BODY)
        self.cell(4, 6, "")

    def item_antes_depois(self, titulo, antes, depois):
        self.check_page_break(40)
        self.subtitulo(titulo)

        self.set_fill_color(255, 240, 240)
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(*self.COR_VERMELHO)
        self.cell(90, 6, "  ANTES", fill=True, new_x="RIGHT")
        self.set_fill_color(230, 255, 230)
        self.set_text_color(*self.COR_VERDE)
        self.cell(90, 6, "  DEPOIS", fill=True, new_x="LMARGIN", new_y="NEXT")

        self.set_font("Courier", "", 8)
        self.set_text_color(*self.COR_BODY)

        linhas_antes = antes.split("\n")
        linhas_depois = depois.split("\n")
        max_linhas = max(len(linhas_antes), len(linhas_depois))

        for i in range(max_linhas):
            self.check_page_break(5)
            self.set_fill_color(255, 248, 248)
            txt_a = linhas_antes[i] if i < len(linhas_antes) else ""
            self.cell(90, 4.5, f"  {txt_a}", fill=True, new_x="RIGHT")
            self.set_fill_color(245, 255, 245)
            txt_d = linhas_depois[i] if i < len(linhas_depois) else ""
            self.cell(90, 4.5, f"  {txt_d}", fill=True, new_x="LMARGIN", new_y="NEXT")
        self.ln(4)

    def tabela_resumo(self, dados):
        """dados = list of (texto, status_emoji)"""
        self.set_fill_color(*self.COR_BG_HEADER)
        self.set_text_color(*self.COR_BRANCO)
        self.set_font("Helvetica", "B", 10)
        self.cell(130, 8, "  Requisito", fill=True)
        self.cell(30, 8, "Status", fill=True, align="C")
        self.cell(30, 8, "Ref.", fill=True, align="C", new_x="LMARGIN", new_y="NEXT")

        self.set_font("Helvetica", "", 9)
        alt = False
        for (texto, status, ref) in dados:
            self.check_page_break(8)
            if alt:
                self.set_fill_color(*self.COR_BG_LIGHT)
            else:
                self.set_fill_color(255, 255, 255)
            self.set_text_color(*self.COR_BODY)
            self.cell(130, 7, f"  {texto}", fill=True)
            if status == "OK":
                self.set_text_color(*self.COR_VERDE)
            elif status == "PARCIAL":
                self.set_text_color(180, 130, 0)
            else:
                self.set_text_color(*self.COR_VERMELHO)
            self.set_font("Helvetica", "B", 9)
            self.cell(30, 7, status, fill=True, align="C")
            self.set_text_color(100, 100, 100)
            self.set_font("Helvetica", "", 8)
            self.cell(30, 7, ref, fill=True, align="C", new_x="LMARGIN", new_y="NEXT")
            alt = not alt
        self.ln(4)

    def lista_arquivos(self, titulo, arquivos):
        self.check_page_break(10 + len(arquivos) * 5)
        self.subtitulo(titulo)
        self.set_font("Courier", "", 8.5)
        self.set_text_color(80, 80, 80)
        for arq in arquivos:
            self.cell(6, 5, "")
            self.set_text_color(*self.COR_PRIMARIA)
            self.cell(3, 5, ">")
            self.set_text_color(80, 80, 80)
            self.cell(0, 5, f" {arq}", new_x="LMARGIN", new_y="NEXT")
        self.ln(3)

    def check_page_break(self, h):
        if self.get_y() + h > 275:
            self.add_page()


def gerar():
    pdf = RelatorioPDF()
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=20)

    # ===== CAPA =====
    pdf.capa()

    # ===== SUMÁRIO =====
    pdf.add_page()
    pdf.titulo_secao("", "Sumario das Alteracoes")
    pdf.corpo(
        "Este documento apresenta todas as melhorias e refatoracoes aplicadas ao projeto AngularBank "
        "para atender aos requisitos do Projeto Final do Modulo 2 - Angular II da Ada Tech.\n\n"
        "As alteracoes cobrem 12 itens distribuidos em 6 areas: Roteamento, Reatividade, "
        "Integracao de API, Seguranca, Internacionalizacao e Performance."
    )

    dados_resumo = [
        ("4.1 - Roteamento e SPA", "OK", "Sem alt."),
        ("4.2 - Signals e computed()", "OK", "Secao 1"),
        ("4.2 - Control Flow (@if, @for)", "OK", "Secao 2"),
        ("4.2 - @defer Emprestimo (on interaction)", "OK", "Sem alt."),
        ("4.2 - @defer Fatura Cartao (on viewport)", "OK", "Secao 3"),
        ("4.3 - HttpClient + json-server", "OK", "Sem alt."),
        ("4.3 - toSignal() para GETs", "OK", "Secao 4"),
        ("4.3 - catchError em todas as requisicoes", "OK", "Secao 5"),
        ("4.3 - Indicadores de Loading", "OK", "Secao 6"),
        ("4.4 - Guard e Interceptor", "OK", "Sem alt."),
        ("4.5 - ngx-translate configurado", "OK", "Sem alt."),
        ("4.5 - Header traduzido (| translate)", "OK", "Secao 7"),
        ("4.5 - JSONs de traducao completos", "OK", "Secao 8"),
        ("4.5 - Seletor global de idioma", "OK", "Secao 9"),
        ("4.6 - Lazy Loading (loadComponent)", "OK", "Sem alt."),
        ("4.6 - Preloading (PreloadAllModules)", "OK", "Sem alt."),
        ("4.6 - ChangeDetectionStrategy.OnPush", "OK", "Secao 10"),
        ("4.6 - provideClientHydration (SSR)", "OK", "Secao 11"),
    ]
    pdf.tabela_resumo(dados_resumo)

    # ===== SEÇÃO 1: SIGNALS =====
    pdf.add_page()
    pdf.titulo_secao("1", "Migracao para Signals e Computed")
    pdf.corpo(
        "Variaveis de estado primitivas foram substituidas por signal() e computed() "
        "em 6 componentes, garantindo reatividade eficiente e compatibilidade com OnPush."
    )

    pdf.item_antes_depois(
        "loan.component.ts - Estado do emprestimo",
        "calculation: {...} | null = null;\nloading = false;\nerror: string | null = null;",
        "calculation = signal<{...} | null>(null);\nloading = signal(false);\nerror = signal<string | null>(null);"
    )
    pdf.item_antes_depois(
        "transfer.component.ts - Estado da transferencia",
        "error: string | null = null;\nsuccess = false;",
        "error = signal<string | null>(null);\nsuccess = signal(false);"
    )
    pdf.item_antes_depois(
        "login.component.ts - Mensagem de erro",
        "errorMessage = '';",
        "errorMessage = signal('');"
    )
    pdf.item_antes_depois(
        "dashboard.component.ts - Transacoes e busca",
        "transactions: Transaction[] = [];\nsearch: string = '';\nsortState: Sort = {...};\n\nget totalIncome(): number {...}\nget totalExpense(): number {...}",
        "transactions = signal<Transaction[]>([]);\nsearch = signal('');\nsortState = signal<Sort>({...});\n\ntotalIncome = computed(() => ...);\ntotalExpense = computed(() => ...);"
    )
    pdf.item_antes_depois(
        "header.component.ts - Nome e tema",
        "accountName = 'Cliente';\nisLight = false;",
        "accountName = signal('Cliente');\nisLight = signal(false);"
    )

    pdf.lista_arquivos("Arquivos alterados", [
        "src/app/main-panel/pages/loan/loan.component.ts",
        "src/app/main-panel/pages/transfer/transfer.component.ts",
        "src/app/main-panel/pages/login/login.component.ts",
        "src/app/main-panel/pages/dashboard/dashboard.component.ts",
        "src/app/header/header.component.ts",
    ])

    # ===== SEÇÃO 2: CONTROL FLOW =====
    pdf.add_page()
    pdf.titulo_secao("2", "Substituicao de *ngIf por @if")
    pdf.corpo(
        "Todas as 5 ocorrencias restantes da diretiva legada *ngIf foram substituidas pela "
        "nova sintaxe de Control Flow (@if) do Angular 17+."
    )

    pdf.item_antes_depois(
        "loan.component.html - Resultado do calculo",
        '<article *ngIf="calculation"\n  class="card result-card">',
        "@if (calculation()) {\n  <article class=\"card result-card\">\n}"
    )
    pdf.item_antes_depois(
        "loan.component.html - Mensagem de erro",
        '<div *ngIf="error" class="error">\n  {{ error }}\n</div>',
        '@if (error()) {\n  <div class="error">{{ error() }}</div>\n}'
    )
    pdf.item_antes_depois(
        "transfer.component.html - Erro e sucesso",
        '<div *ngIf="error" class="error">\n<div *ngIf="success" class="success">',
        '@if (error()) {\n  <div class="error">{{ error() }}</div>\n}\n@if (success()) {\n  <div class="success">...</div>\n}'
    )
    pdf.item_antes_depois(
        "login.component.html - Mensagem de erro",
        '<p *ngIf="errorMessage">\n  {{ errorMessage }}\n</p>',
        '@if (errorMessage()) {\n  <p>{{ errorMessage() }}</p>\n}'
    )

    # ===== SEÇÃO 3: @DEFER VIEWPORT =====
    pdf.add_page()
    pdf.titulo_secao("3", "@defer da Fatura: interaction -> viewport")
    pdf.corpo(
        "O componente de fatura do cartao de credito no dashboard foi alterado para usar "
        "o trigger @defer (on viewport), conforme exigido pelo PDF de requisitos. "
        "Isso carrega o componente automaticamente quando o usuario rola ate a secao."
    )
    pdf.item_antes_depois(
        "dashboard.component.html",
        '@defer (on interaction(loadButton)) {\n  <app-credit-card-invoice />\n}\n@placeholder {\n  <div #loadButton>Clique para ver...</div>\n}',
        '@defer (on viewport) {\n  <app-credit-card-invoice />\n}\n@placeholder {\n  <div>Carregue para baixo...</div>\n}'
    )

    # ===== SEÇÃO 4: toSignal =====
    pdf.titulo_secao("4", "Conversao de Observables para toSignal()")
    pdf.corpo(
        "O componente de transferencia usava account$ com o pipe async no template. "
        "Foi migrado para toSignal(), convertendo o Observable em um Signal reativo."
    )
    pdf.item_antes_depois(
        "transfer.component.ts",
        "account$ = this.accountState.account$;\n\n// Template:\n{{ (account$ | async)?.balance }}",
        "account = toSignal(this.accountState.account$);\n\n// Template:\n{{ account()?.balance }}"
    )

    # ===== SEÇÃO 5: CATCHERROR =====
    pdf.add_page()
    pdf.titulo_secao("5", "Tratamento de Erros (catchError)")
    pdf.corpo(
        "Todos os 5 metodos HTTP de transactions.service.ts estavam sem qualquer tratamento "
        "de erros. Foi adicionado catchError com mensagens amigaveis e throwError em cada um."
    )
    pdf.item_antes_depois(
        "transactions.service.ts - Exemplo: getTransactions()",
        "getTransactions(): Observable<Transaction[]> {\n  return this.http.get<Transaction[]>(\n    `${this.apiUrl}`);\n}",
        "getTransactions(): Observable<Transaction[]> {\n  return this.http.get<Transaction[]>(\n    `${this.apiUrl}`).pipe(\n    catchError((err) => {\n      console.error('Erro:', err);\n      return throwError(\n        () => new Error('Erro ao carregar.')\n      );\n    })\n  );\n}"
    )
    pdf.corpo("Metodos corrigidos: getTransactions, getTransactionById, createTransaction, updateTransaction, deleteTransaction.")

    # ===== SEÇÃO 6: LOADING =====
    pdf.titulo_secao("6", "Indicadores de Loading nos Formularios")
    pdf.corpo(
        "Os componentes create-transaction e confirm-delete-dialog ja tinham signals de "
        "isLoading e errorMessage, mas nao os refletiam no template. Agora: botoes sao "
        "desabilitados durante o loading, texto muda, e erros sao exibidos."
    )
    pdf.item_antes_depois(
        "create-transaction.component.html",
        '<button type="submit"\n  [disabled]="form.invalid">\n  Salvar\n</button>',
        '<button type="submit"\n  [disabled]="form.invalid || isLoading()">\n  {{ isLoading()?\'Salvando...\':\'Salvar\' }}\n</button>\n@if (errorMessage()) {\n  <div class="error">{{ errorMessage() }}</div>\n}'
    )
    pdf.item_antes_depois(
        "confirm-delete-dialog.component.html",
        '<button (click)="confirmDelete()">\n  Excluir\n</button>',
        '<button (click)="confirmDelete()"\n  [disabled]="isLoading()">\n  {{ isLoading()?\'Excluindo...\':\'Excluir\' }}\n</button>\n@if (errorMessage()) {\n  <div class="error">{{ errorMessage() }}</div>\n}'
    )

    # ===== SEÇÃO 7: TRANSLATE HEADER =====
    pdf.add_page()
    pdf.titulo_secao("7", "Internacionalizacao do Header")
    pdf.corpo(
        "Todos os textos estaticos do header foram substituidos por chaves de traducao "
        "usando o pipe | translate do ngx-translate."
    )
    pdf.item_antes_depois(
        "header.component.html",
        'Ola, {{ accountName }}!\ntitle="Alternar tema"\ntitle="Sair"',
        "{{ 'HEADER.GREETING' | translate:{name:accountName()} }}\n[title]=\"'HEADER.TOGGLE_THEME' | translate\"\n[title]=\"'HEADER.LOGOUT' | translate\""
    )

    # ===== SEÇÃO 8: JSON TRADUÇÃO =====
    pdf.titulo_secao("8", "Arquivos de Traducao (4 idiomas)")
    pdf.corpo(
        "Foram criados/atualizados 4 arquivos JSON com chaves SIDEBAR e HEADER:\n"
        "- pt-br.json - Portugues do Brasil (padrao)\n"
        "- pt-pt.json - Portugues de Portugal\n"
        "- en-us.json - Ingles (EUA) [NOVO]\n"
        "- es.json - Espanhol [NOVO]"
    )

    pdf.subtitulo("Exemplo: en-us.json (novo)")
    pdf.set_font("Courier", "", 8.5)
    pdf.set_fill_color(*pdf.COR_BG_LIGHT)
    json_en = (
        '{\n'
        '  "SIDEBAR": {\n'
        '    "DASHBOARD": "Dashboard",\n'
        '    "TRANSFER": "Transfer",\n'
        '    "LOAN": "Loans",\n'
        '    "TRANSACTIONS": "Transactions",\n'
        '    "PROFILE": "Profile"\n'
        '  },\n'
        '  "HEADER": {\n'
        '    "GREETING": "Hello, {{name}}!",\n'
        '    "TOGGLE_THEME": "Toggle theme",\n'
        '    "LOGOUT": "Sign out",\n'
        '    "LANGUAGE": "Language"\n'
        '  }\n'
        '}'
    )
    pdf.multi_cell(0, 4.5, json_en, fill=True)
    pdf.ln(4)

    # ===== SEÇÃO 9: SELETOR =====
    pdf.add_page()
    pdf.titulo_secao("9", "Seletor Global de Idioma com Bandeiras")
    pdf.corpo(
        "Um seletor de idioma foi implementado no header usando MatMenu. Cada opcao exibe "
        "a bandeira do pais como emoji e o nome do idioma. O idioma atual e indicado pela "
        "bandeira visivel no botao do header.\n\n"
        "Idiomas disponiveis:"
    )

    idiomas = [
        ("Portugues (BR)", "pt-br", "Padrao"),
        ("Portugues (PT)", "pt-pt", ""),
        ("English (US)", "en-us", "Novo"),
        ("Espanol", "es", "Novo"),
    ]
    pdf.set_font("Helvetica", "", 10)
    for (nome, code, tag) in idiomas:
        pdf.set_text_color(*pdf.COR_BODY)
        pdf.cell(6, 7, "")
        pdf.cell(60, 7, f"  {nome}")
        pdf.set_font("Courier", "", 9)
        pdf.set_text_color(100, 100, 100)
        pdf.cell(30, 7, code)
        if tag:
            if tag == "Novo":
                pdf.badge(tag, pdf.COR_PRIMARIA)
            else:
                pdf.badge(tag, pdf.COR_VERDE)
        pdf.set_font("Helvetica", "", 10)
        pdf.ln(7)
    pdf.ln(4)

    pdf.corpo(
        "Implementacao tecnica:\n"
        "- header.component.ts - Array languages[] com code, label e flag (emoji)\n"
        "- currentLang = signal() sincronizado com TranslateService\n"
        "- switchLang() chama translate.use() e atualiza o signal\n"
        "- MatMenu renderiza a lista com @for\n"
        "- CSS .active-lang destaca o idioma ativo"
    )

    pdf.lista_arquivos("Arquivos envolvidos", [
        "src/app/header/header.component.ts",
        "src/app/header/header.component.html",
        "src/app/header/header.component.css",
        "src/app/app.component.ts (addLangs 4 idiomas)",
        "public/i18n/pt-br.json",
        "public/i18n/pt-pt.json",
        "public/i18n/en-us.json   [NOVO]",
        "public/i18n/es.json       [NOVO]",
    ])

    # ===== SEÇÃO 10: ONPUSH =====
    pdf.add_page()
    pdf.titulo_secao("10", "ChangeDetectionStrategy.OnPush")
    pdf.corpo(
        "A estrategia OnPush foi aplicada a todos os 18 componentes do projeto. "
        "Anteriormente, apenas 1 componente (CreditCardInvoiceComponent) tinha OnPush. "
        "Isso reduz drasticamente as verificacoes de mudanca do Angular, "
        "melhorando a performance em telas com listas e tabelas."
    )

    componentes = [
        "AppComponent",
        "HeaderComponent",
        "SidebarComponent",
        "MainPanelComponent",
        "LoginComponent",
        "NotFoundComponent",
        "DashboardComponent",
        "LoanComponent",
        "LoanSimulatorComponent",
        "TransferComponent",
        "TransactionsComponent",
        "ListTransactionsComponent",
        "CreateTransactionComponent",
        "ConfirmDeleteDialogComponent",
        "ProfileComponent",
        "PersonalDataComponent",
        "SecurityDataComponent",
        "CreditCardInvoiceComponent (ja tinha)",
    ]

    pdf.set_font("Helvetica", "B", 9)
    pdf.set_fill_color(*pdf.COR_BG_HEADER)
    pdf.set_text_color(*pdf.COR_BRANCO)
    pdf.cell(100, 7, "  Componente", fill=True)
    pdf.cell(40, 7, "OnPush Antes", fill=True, align="C")
    pdf.cell(40, 7, "OnPush Depois", fill=True, align="C", new_x="LMARGIN", new_y="NEXT")

    pdf.set_font("Helvetica", "", 9)
    alt = False
    for comp in componentes:
        pdf.check_page_break(7)
        if alt:
            pdf.set_fill_color(*pdf.COR_BG_LIGHT)
        else:
            pdf.set_fill_color(255, 255, 255)
        pdf.set_text_color(*pdf.COR_BODY)
        pdf.cell(100, 6, f"  {comp}", fill=True)
        antes = "Sim" if "ja tinha" in comp else "Nao"
        cor_a = pdf.COR_VERDE if antes == "Sim" else pdf.COR_VERMELHO
        pdf.set_text_color(*cor_a)
        pdf.set_font("Helvetica", "B", 9)
        pdf.cell(40, 6, antes, fill=True, align="C")
        pdf.set_text_color(*pdf.COR_VERDE)
        pdf.cell(40, 6, "Sim", fill=True, align="C", new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", "", 9)
        alt = not alt
    pdf.ln(4)

    # ===== SEÇÃO 11: SSR =====
    pdf.add_page()
    pdf.titulo_secao("11", "provideClientHydration (SSR)")
    pdf.corpo(
        "A funcao provideClientHydration(withEventReplay()) foi restaurada no app.config.ts, "
        "atendendo ao requisito 4.6 do PDF. Ela habilita o conceito de Hydration, onde o "
        "HTML pre-renderizado pelo servidor e reutilizado pelo Angular no cliente."
    )
    pdf.item_antes_depois(
        "app.config.ts",
        "providers: [\n  provideRouter(...),\n  provideHttpClient(...),\n  ...provideTranslateHttpLoader(...),\n]",
        "providers: [\n  provideRouter(...),\n  provideHttpClient(...),\n  ...provideTranslateHttpLoader(...),\n  provideClientHydration(withEventReplay()),\n]"
    )

    # ===== CONCLUSÃO =====
    pdf.add_page()
    pdf.titulo_secao("", "Conclusao")
    pdf.corpo(
        "Todas as 12 pendencias identificadas na auditoria foram corrigidas com sucesso. "
        "O projeto compila sem erros e atende a todos os 18 criterios de aceite listados "
        "no documento \"Projeto Final - Angular II\".\n\n"
        "Destaques das melhorias:"
    )

    destaques = [
        "18/18 componentes com ChangeDetectionStrategy.OnPush",
        "0 diretivas legadas (*ngIf) - 100% @if/@for/@switch",
        "100% das requisicoes HTTP com catchError",
        "4 idiomas com seletor visual no header",
        "Signals e computed() em todos os componentes com estado",
        "toSignal() para conversao de Observables em GETs",
        "@defer (on viewport) na fatura e (on interaction) no simulador",
        "Indicadores de loading em todos os formularios",
        "provideClientHydration + withEventReplay habilitados",
    ]
    pdf.set_font("Helvetica", "", 10)
    for d in destaques:
        pdf.set_text_color(*pdf.COR_VERDE)
        pdf.cell(6, 7, "")
        pdf.cell(5, 7, ">")
        pdf.set_text_color(*pdf.COR_BODY)
        pdf.cell(0, 7, f"  {d}", new_x="LMARGIN", new_y="NEXT")

    pdf.ln(8)
    pdf.set_draw_color(180, 180, 180)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(6)
    pdf.set_font("Helvetica", "I", 10)
    pdf.set_text_color(120, 120, 120)
    pdf.cell(0, 7, "Build validado com sucesso - 0 erros de compilacao.", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 7, "Angular 19.2 | TypeScript 5.7 | 28/03/2026", align="C")

    # ===== SALVAR =====
    output_path = r"C:\Users\Isaac\Desktop\Ada Tech\Módulo 2\angularbank\Relatorio_Melhorias_AngularBank.pdf"
    pdf.output(output_path)
    print(f"PDF gerado com sucesso: {output_path}")


if __name__ == "__main__":
    gerar()
