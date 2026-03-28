import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AccountStateService } from '../../../core/services/account-state.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile',
  imports: [RouterModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  private readonly accountState = inject(AccountStateService);
  readonly account = toSignal(this.accountState.account$);
}
