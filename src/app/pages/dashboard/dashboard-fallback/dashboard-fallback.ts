import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthService } from '../../../core/services/auth.service';

/** Affiché tant que le rôle de l'utilisateur n'est pas résolu, ou s'il ne correspond à aucun
 * dashboard connu (ex: rôle DIRECTION, volontairement désactivé pour l'instant). */
@Component({
  selector: 'dashboard-fallback',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule],
  templateUrl: './dashboard-fallback.html',
})
export class DashboardFallback {
  private readonly authService = inject(AuthService);
  readonly role = computed(() => this.authService.currentUser()?.role?.code ?? null);
}
