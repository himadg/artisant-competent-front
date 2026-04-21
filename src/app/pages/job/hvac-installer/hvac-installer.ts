import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './hvac-installer.html',
  styleUrl: './hvac-installer.scss',
})
export class HvacInstallerPage {}
