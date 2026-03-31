import { ChangeDetectionStrategy, Component, inject, signal, effect, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { Transaction } from '../transactions/models/transaction.model';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AccountStateService } from '../../../core/services/account-state.service';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { CreditCardInvoiceComponent } from './components/credit-card-invoice/credit-card-invoice.component';
import { DashboardService } from './services/dashboard.service';
import { Account } from './models/account.model';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    DatePipe,
    FormsModule,
    DecimalPipe,
    MatSortModule,
    MatIconModule,
    CreditCardInvoiceComponent,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private readonly accountState = inject(AccountStateService);
  private readonly dashboardService = inject(DashboardService);

  accountData = toSignal<Account | undefined>(this.dashboardService.getAccount(), { initialValue: undefined });

  transactions = toSignal(this.accountState.transactions$, { initialValue: [] as Transaction[] });

  search = signal('');
  sortState = signal<Sort>({ active: 'date', direction: 'desc' });

  isBalanceVisible = signal(true);

  constructor() {
    effect(() => {
      console.log('A visibilidade doextrato mudou para:', this.isBalanceVisible());
    });
  }

  toogleBalance(): void {
    this.isBalanceVisible.update((visible) => !visible);
  }

  totalIncome = computed(() =>
    this.transactions()
      .filter((item) => item.amount > 0)
      .reduce((sum, item) => sum + item.amount, 0)
  );

  totalExpense = computed(() =>
    this.transactions()
      .filter((item) => item.amount < 0)
      .reduce((sum, item) => sum + Math.abs(item.amount), 0)
  );

  filteredTransactions = computed(() =>
    this.transactions().filter((item) =>
      item.description.toLowerCase().includes(this.search().toLowerCase()),
    )
  );

  sortedFilteredTransactions = computed(() =>
    this.sortTransactions(this.filteredTransactions(), this.sortState())
  );

  onSortChange(sort: Sort): void {
    this.sortState.set(sort);
  }

  private sortTransactions(items: Transaction[], sort: Sort): Transaction[] {
    const data = [...items];

    if (!sort.active || !sort.direction) {
      return data;
    }

    const isAsc = sort.direction === 'asc';

    return data.sort((a, b) => {
      switch (sort.active) {
        case 'date':
          return this.compare(new Date(a.date).getTime(), new Date(b.date).getTime(), isAsc);
        case 'description':
          return this.compare(a.description.toLowerCase(), b.description.toLowerCase(), isAsc);
        case 'amount':
          return this.compare(a.amount, b.amount, isAsc);
        default:
          return 0;
      }
    });
  }

  private compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
