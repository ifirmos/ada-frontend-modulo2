import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask'
import { TransactionTypes } from '../../constants/transaction-types.enum';
import { Transaction } from '../../models/transaction.model';
import { TransactionsService } from '../../services/transactions.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-transaction',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    NgxMaskDirective,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './create-transaction.component.html',
  styleUrl: './create-transaction.component.css',
})
export class CreateTransactionComponent {
  private readonly transactionsService = inject(TransactionsService);
  private readonly dialogRef = inject(MatDialogRef<CreateTransactionComponent>);

  transactionForm = new FormGroup({
    date: new FormControl(new Date().toISOString().split('T')[0], {
      validators: [Validators.required],
      nonNullable: true,
    }),
    description : new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ],
      nonNullable: true,
    }),
    amount: new FormControl(0, {
      validators: Validators.required,
      nonNullable: true,
    }),
    type: new FormControl<TransactionTypes | null>(null, {
      validators: Validators.required
    })
  });
  transactionTypesEnum = TransactionTypes;

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  onSubmit() {
    if (this.transactionForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null); // Limpa erros anteriores

      const formValue = this.transactionForm.getRawValue();
      const payload: Omit<Transaction, 'id'> = {
        ...formValue,
        amount:
          formValue.type === TransactionTypes.EXPENSE 
            ? -Math.abs(formValue.amount) // Garante que despesas sejam negativas
            : Math.abs(formValue.amount), // Garante que receitas sejam positivas
          type: formValue.type!, // Garante que o tipo seja um enum
      };

      this.transactionsService
        .createTransaction(payload)
        .subscribe({
        next: () => {
          alert("Transação feita com sucesso!");
          this.transactionForm.reset();
          this.dialogRef.close(true); // Fecha o modal e sinaliza sucesso
        },
        error: (err) => {
          console.error('Erro ao criar transação:', err);
          this.errorMessage.set('Ocorreu um erro ao criar a transação.');
        },
        complete: () => {
          this.isLoading.set(false);  // Conclui e desabilita o loading
        },
      });
    }
  }
}

