import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { RouterModule } from '@angular/router';
import { SearchPro } from '../../shared/components/search-pro/search-pro';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, RouterModule, SearchPro],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage {
  /**
   * Section "Preuve sociale" masquée tant qu'il n'y a pas au moins 3 avis réels.
   * Passer à true une fois les avis réels disponibles (section 7 du brief V5).
   */
  readonly reviewsEnabled = false;
}
