import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-panel',
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main-panel.component.html',
  styleUrl: './main-panel.component.css',
})
export class MainPanelComponent {}
