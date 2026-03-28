import { 
  ChangeDetectionStrategy,
  Component, 
  DestroyRef, 
  inject, 
  OnInit, 
  signal,
  computed 
} from '@angular/core';
import { first } from 'rxjs';
import { Transaction } from '../../models/transaction.model';

import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountStateService } from '../../../../../core/services/account-state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { TransactionsService } from '../../services/transactions.service';
import { CreateTransactionComponent } from '../create-transaction/create-transaction.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-list-transactions',
  imports: [
    DatePipe,
    CurrencyPipe,
    FormsModule,
    MatSortModule,
    MatIconModule,
    MatDialogModule,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './list-transactions.component.html',
  styleUrl: './list-transactions.component.css',
})
export class ListTransactionsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly accountState = inject(AccountStateService);
  private readonly dialog = inject(MatDialog);
  private transactionsService = inject(TransactionsService);

  transactions = signal<Transaction[]>([]);
  searchTerm = signal('');
  accountBalance = signal(0);
  sortState = signal<Sort>({ active: 'date', direction: 'desc' });
  isLoading = signal(false);

  filteredTransactions = computed(() => {
    const normalized = this.searchTerm().trim().toLowerCase();
    if (!normalized) {
      return this.transactions();
    }

    return this.transactions().filter((item) => {
      const date = new Date(item.date).toLocaleDateString('pt-BR');
      return (
        item.description.toLowerCase().includes(normalized) ||
        date.includes(normalized)
      );
    });
  });

  totalIncome = computed(() => this.accountBalance());

  totalExpense = computed(() =>
    this.transactions()
      .filter((item) => item.amount < 0)
      .reduce((sum, item) => sum + Math.abs(item.amount), 0)
  );

  sortedFilteredTransactions = computed(() =>
    this.sortTransactions(this.filteredTransactions(), this.sortState())
  );

  ngOnInit(): void {
    this.loadTransactions();
    this.accountState.account$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((account) => {
        this.accountBalance.set(account?.balance || 0);
      });
  }

  loadTransactions(): void {
    this.isLoading.set(true);
    this.transactionsService.getTransactions().subscribe({
      next: (data) => { this.transactions.set(data); this.isLoading.set(false); },
      error: (err) => { console.error(err); this.isLoading.set(false); },
    });
  }

  openCreateTransactionDialog(): void {
    this.dialog
      .open(CreateTransactionComponent, {
        width: '420px',
      })
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
        if (result) {
          this.loadTransactions();
        }
      }
    );
  }

  onDelete(id: string): void {
    const transactionToDelete = this.transactions().find((item) => item.id === id);
    if (!transactionToDelete) {
      return;
    }

    this.dialog
      .open(ConfirmDeleteDialogComponent, {
        width: '420px',
        data: {
          description: transactionToDelete.description,
          id: transactionToDelete.id,
        },
      })
      .afterClosed()
      .pipe(first())
      .subscribe((confirmed) => {
        if (confirmed) {
          this.loadTransactions();
        }
      });
  }

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
        case 'type':
          return this.compare(a.type, b.type, isAsc);
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
