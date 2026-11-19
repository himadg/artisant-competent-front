import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { MissionService } from '../../../../../core/services/mission.service';
import { LocalizedDatePipe } from '../../../../../shared/pipes/localized-date.pipe';

@Component({
  selector: 'individual-missions-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, TranslocoModule, LocalizedDatePipe],
  templateUrl: './individual-missions-section.html',
  styleUrl: './individual-missions-section.scss',
})
export class IndividualMissionsSection {
  private readonly missionService = inject(MissionService);

  readonly missionsResource = resource({ loader: () => this.missionService.getMine() });
}
