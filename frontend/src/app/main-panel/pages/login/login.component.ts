import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = signal('');
  password = signal('');
  errorMessage = signal('');

  private authService = inject(AuthService);

  onSubmit() {
    if (!this.authService.login(this.email(), this.password())){
      this.errorMessage.set('Login ou senha incorretos!');
    }
  }
}
