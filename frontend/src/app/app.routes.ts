import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    
    loadComponent: () =>
      import('./main-panel/pages/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: '',
    
    loadComponent: () =>
      import('./main-panel/main-panel.component').then(
        (m) => m.MainPanelComponent,
      ),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        
        loadComponent: () =>
          import('./main-panel/pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'transferencia',
        
        loadComponent: () =>
          import('./main-panel/pages/transfer/transfer.component').then(
            (m) => m.TransferComponent,
          ),
      },
      {
        path: 'emprestimo',
        
        loadComponent: () =>
          import('./main-panel/pages/loan/loan.component').then(
            (m) => m.LoanComponent,
          ),
      },
      {
        path: 'transacoes',
        
        loadComponent: () =>
          import('./main-panel/pages/transactions/transactions.component').then(
            (m) => m.TransactionsComponent,
          ),
      },
      {
        path: 'transacoes/criar',
        
        loadComponent: () =>
          import('./main-panel/pages/transactions/components/create-transaction/create-transaction.component').then(
            (m) => m.CreateTransactionComponent,
          ),
      },
      {
        path: 'cartao-fatura',
        
        loadComponent: () =>
          import('./main-panel/pages/dashboard/components/credit-card-invoice/credit-card-invoice.component').then(
            (m) => m.CreditCardInvoiceComponent,
          ),
      },
      {
        path: 'perfil',
        
        loadComponent: () =>
          import('./main-panel/pages/profile/profile.component').then(
            (m) => m.ProfileComponent,
          ),
        children: [
          {
            path: 'dados',
            
            loadComponent: () =>
              import('./main-panel/pages/profile/pages/personal-data/personal-data.component').then(
                (m) => m.PersonalDataComponent,
              ),
          },
          {
            path: 'seguranca',
            
            loadComponent: () =>
              import('./main-panel/pages/profile/pages/security-data/security-data.component').then(
                (m) => m.SecurityDataComponent,
              ),
          },
          { path: '', redirectTo: 'dados', pathMatch: 'full' },
        ],
      },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () =>
      import('./main-panel/pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
    
  },
];
