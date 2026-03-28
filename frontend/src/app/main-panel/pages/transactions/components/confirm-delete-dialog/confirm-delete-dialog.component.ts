import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { TransactionsService } from '../../services/transactions.service';

interface ConfirmDeleteDialogData {
  description: string;
  id: string;
}

@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrl: './confirm-delete-dialog.component.css',

  
})
export class ConfirmDeleteDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ConfirmDeleteDialogComponent, boolean>);
  private readonly transactionsService = inject(TransactionsService);
  readonly data = inject<ConfirmDeleteDialogData>(MAT_DIALOG_DATA);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  confirmDelete(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.transactionsService.deleteTransaction(this.data.id).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Erro ao excluir transação:', err);
        this.errorMessage.set('Ocorreu um erro ao excluir a transação.');
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  
  close(confirm?: boolean): void {
    this.dialogRef.close(confirm);
  }
}
