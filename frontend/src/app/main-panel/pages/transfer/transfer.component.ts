import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AccountStateService } from '../../../core/services/account-state.service';
import { take } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css'],
})
export class TransferComponent {
  private fb = inject(FormBuilder);
  private accountState = inject(AccountStateService);

  account = toSignal(this.accountState.account$);
  destinationAccounts = ['Conta Corrente 0012', 'Conta Poupança 5021', 'Conta Empresa 7770'];

  form = this.fb.group({
    destinationAccount: ['', [Validators.required]],
    amount: [null, [Validators.required, Validators.min(0.01)]],
    description: [''],
  });

  isTransfering = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  submit(): void {
    this.error.set(null);
    this.success.set(false);
    this.isTransfering.set(true);
    if (this.form.invalid) return;

    const destinationAccount = this.form.get('destinationAccount')!.value as string;
    const rawAmount = this.form.get('amount')!.value;
    const amount = rawAmount == null ? NaN : Number(rawAmount);
    const description = (this.form.get('description')!.value as string) || '';

    this.accountState.account$.pipe(take(1)).subscribe((acc) => {
      if (!acc) {
        this.error.set('Conta não carregada');
        return;
      }
      if (isNaN(amount) || amount <= 0) {
        this.error.set('Valor inválido');
        return;
      }

      if (acc.balance < amount) {
        this.error.set('Saldo insuficiente');
        return;
      }

      this.accountState.transfer(destinationAccount, amount, description)
        .subscribe({
          next: () => {
            this.success.set(true);
            this.form.reset();
          },
          error: (err) => {
            this.error.set(err?.message || 'Erro ao realizar transferência');
          },
          complete: () => {
            this.isTransfering.set(false);
          }
        });
    });
  }
}
