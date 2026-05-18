import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { AnnouncementBanner } from './core/layout/announcement-banner/announcement-banner';
import { Header } from './core/layout/header/header';
import { Footer } from './core/layout/footer/footer';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslocoModule, AnnouncementBanner, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly isAuthenticated = inject(AuthService).isAuthenticated;
}
