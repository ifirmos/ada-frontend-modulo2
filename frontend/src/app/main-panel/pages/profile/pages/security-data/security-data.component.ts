import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-security-data',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './security-data.component.html',
  styleUrl: './security-data.component.css'
})
export class SecurityDataComponent {
  showPasswordForm = signal(false);
  isSavingPassword = signal(false);
  passwordSuccess = signal(false);
  passwordError = signal<string | null>(null);

  twoFactorEnabled = signal(true);
  loginNotifications = signal(true);
  transactionNotifications = signal(true);

  lastAccess = signal('28/03/2026 às 14:32');
  lastDevice = signal('Chrome 134 — Windows 11');
  lastIp = signal('189.•••.•••.42');

  passwordForm = new FormGroup({
    currentPassword: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    newPassword: new FormControl('', {
      validators: [Validators.required, Validators.minLength(8), this.passwordStrength],
      nonNullable: true,
    }),
    confirmPassword: new FormControl('', { validators: [Validators.required], nonNullable: true }),
  }, { validators: this.passwordMatch });

  private passwordMatch(group: AbstractControl): ValidationErrors | null {
    const pwd = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pwd === confirm ? null : { mismatch: true };
  }

  private passwordStrength(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value;
    if (!value) return null;
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasDigit = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const strong = hasUpper && hasLower && hasDigit && hasSpecial;
    return strong ? null : { weak: true };
  }

  get passwordStrengthLevel(): 'weak' | 'medium' | 'strong' {
    const value: string = this.passwordForm.controls.newPassword.value;
    if (!value || value.length < 6) return 'weak';
    const checks = [/[A-Z]/, /[a-z]/, /\d/, /[!@#$%^&*(),.?":{}|<>]/];
    const passed = checks.filter(r => r.test(value)).length;
    if (passed >= 4 && value.length >= 8) return 'strong';
    if (passed >= 2) return 'medium';
    return 'weak';
  }

  togglePasswordForm(): void {
    this.showPasswordForm.update(v => !v);
    this.passwordSuccess.set(false);
    this.passwordError.set(null);
    this.passwordForm.reset();
  }

  onSavePassword(): void {
    if (this.passwordForm.invalid) return;

    const current = this.passwordForm.controls.currentPassword.value;
    if (current !== '123456') {
      this.passwordError.set('SECURITY.ERROR_WRONG_PASSWORD');
      return;
    }

    this.isSavingPassword.set(true);
    this.passwordError.set(null);

    setTimeout(() => {
      this.isSavingPassword.set(false);
      this.passwordSuccess.set(true);
      this.showPasswordForm.set(false);
      this.passwordForm.reset();
    }, 1500);
  }

  onToggle2FA(): void {
    this.twoFactorEnabled.update(v => !v);
  }

  onToggleLoginNotif(): void {
    this.loginNotifications.update(v => !v);
  }

  onToggleTransactionNotif(): void {
    this.transactionNotifications.update(v => !v);
  }
}
