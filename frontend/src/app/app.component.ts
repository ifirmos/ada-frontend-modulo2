import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MainPanelComponent } from './main-panel/main-panel.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AccountStateService } from './core/services/account-state.service';
import { environment } from '../environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, SidebarComponent, MainPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(
    private accountState: AccountStateService,
    private translate: TranslateService
  ) {
    this.translate.addLangs(['pt-br', 'pt-pt', 'en-us', 'es']);
    this.translate.setFallbackLang(environment.defaultLang);
    this.translate.use(environment.defaultLang);
  }


  ngOnInit(): void {
    this.accountState.loadInitial();
  }
}
