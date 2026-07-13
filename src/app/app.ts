import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { AnnouncementBanner } from './core/layout/announcement-banner/announcement-banner';
import { PrelaunchBanner } from './core/layout/prelaunch-banner/prelaunch-banner';
import { Header } from './core/layout/header/header';
import { Footer } from './core/layout/footer/footer';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslocoModule, AnnouncementBanner, PrelaunchBanner, Header, Footer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly routeData = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) route = route.firstChild;
        return route.snapshot.data;
      }),
    ),
  );

  readonly showHeader = computed(() => this.routeData()?.['showHeader'] ?? true);
  readonly showFooter = computed(() => this.routeData()?.['showFooter'] ?? true);
}
