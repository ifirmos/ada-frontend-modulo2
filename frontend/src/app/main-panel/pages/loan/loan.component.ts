import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LoanService } from '../../../core/services/loan.service';
import { AccountStateService } from '../../../core/services/account-state.service';
import { take } from 'rxjs/operators';
import { LoanSimulatorComponent } from './components/loan-simulator/loan-simulator.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-loan',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoanSimulatorComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css'],
})
export class LoanComponent {
  loanLimit = signal(180000);
  private fb = inject(FormBuilder);
  private loanService = inject(LoanService);
  private accountState = inject(AccountStateService);

  form = this.fb.group({
    amount: [null, [Validators.required, Validators.min(1)]],
    installments: [null as number | null, [Validators.required, Validators.min(1)]],
    monthlyRate: [1.99, [Validators.required, Validators.min(0)]],
  });

  installmentOptions = [6, 12, 18, 24, 36, 48];

  calculation = signal<{ monthly: number; total: number } | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  calculate(): void {
    this.error.set(null);
    if (this.form.invalid) return;
    const { amount, installments, monthlyRate } = this.form.value;
    try {
      this.calculation.set(this.loanService.calculate(amount!, installments!, monthlyRate!));
    } catch (err: any) {
      this.error.set(err?.message || 'Erro ao calcular');
    }
  }

  apply(): void {
    this.error.set(null);
    if (this.form.invalid) return;
    const { amount } = this.form.value;
    this.loading.set(true);
    this.accountState.applyLoan(amount!).subscribe({
      next: () => {
        this.loading.set(false);
        this.form.reset({ installments: null, monthlyRate: 1.99, amount: null });
        this.calculation.set(null);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.message || 'Erro ao solicitar empréstimo');
      },
    });
  }
}
