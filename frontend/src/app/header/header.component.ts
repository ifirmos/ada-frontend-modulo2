import { ChangeDetectionStrategy, Component, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AccountStateService } from '../core/services/account-state.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../core/services/auth.service';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

interface LangOption {
  code: string;
  label: string;
  flag: string;
}

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatIconModule, MatMenuModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private readonly accountState = inject(AccountStateService);
  private readonly platformId = inject(PLATFORM_ID);
  readonly authService = inject(AuthService);
  readonly translate = inject(TranslateService);

  private readonly account = toSignal(this.accountState.account$);
  accountName = computed(() => this.account()?.name ?? 'Cliente');
  isLight = signal(false);

  languages: LangOption[] = [
    { code: 'pt-br', label: 'Português (BR)', flag: 'br' },
    { code: 'pt-pt', label: 'Português (PT)', flag: 'pt' },
    { code: 'en-us', label: 'English (US)', flag: 'us' },
    { code: 'es', label: 'Español', flag: 'es' },
  ];

  currentLang = signal(this.translate.currentLang || 'pt-br');

  get currentFlag(): string {
    return this.languages.find(l => l.code === this.currentLang())?.flag || 'br';
  }

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const stored = localStorage.getItem('theme');
        this.isLight.set(stored === 'light');
      } catch (e) {
        this.isLight.set(false);
      }
      this.applyTheme();
    }
  }

  switchLang(langCode: string): void {
    this.translate.use(langCode);
    this.currentLang.set(langCode);
  }

  toggleTheme(): void {
    this.isLight.update(v => !v);
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('theme', this.isLight() ? 'light' : 'dark');
      } catch (e) {}
      this.applyTheme();
    }
  }

  logout(): void {
    this.authService.logout();
  }

  private applyTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const root = document.documentElement;
      if (this.isLight()) root.classList.add('light');
      else root.classList.remove('light');
    }
  }
}
