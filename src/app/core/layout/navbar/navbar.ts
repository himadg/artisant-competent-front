import { Component, ElementRef, HostListener, ViewChild, inject, PLATFORM_ID, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { filter } from 'rxjs/operators';
import { LangToggle } from '../../../shared/components/lang-toggle/lang-toggle';
import { ThemeToggle } from '../../../shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'ac-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, TranslocoModule, LangToggle, ThemeToggle],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly router = inject(Router);

  // Opens the sandwich menu on mobiles
  readonly mobileNavOpen = signal(false);
  // Opens the registration dropdown on mobiles
  readonly mobileNavRegisterOpen = signal(false);
  // Opens the login dropdown on mobiles
  readonly mobileNavLoginOpen = signal(false);
  // Opens the registration dropdown on tablets
  readonly tabletNavRegisterOpen = signal(false);
  // Opens the login dropdown on tablets
  readonly tabletNavLoginOpen = signal(false);

  @ViewChild('registerDropdown') registerDropdown?: ElementRef<HTMLElement>;
  @ViewChild('loginDropdown') loginDropdown?: ElementRef<HTMLElement>;

  ngOnInit() {
    // Ferme le menu mobile automatiquement lors d'un changement de page
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMobileNav();
      this.tabletNavRegisterOpen.set(false);
      this.tabletNavLoginOpen.set(false);
    });
  }

  toggleMobileNav() {
    this.mobileNavOpen.update(v => !v);
  }

  closeMobileNav() {
    this.mobileNavOpen.set(false);
  }

  toggleMobileNavRegister() {
    this.mobileNavLoginOpen.set(false);
    this.mobileNavRegisterOpen.update(v => !v);
  }

  toggleMobileNavLogin() {
    this.mobileNavRegisterOpen.set(false);
    this.mobileNavLoginOpen.update(v => !v);
  }

  toggleDesktopRegister() {
    if (!this.isBrowser || window.matchMedia('(min-width: 1024px)').matches) return;
    this.tabletNavLoginOpen.set(false);
    this.tabletNavRegisterOpen.update(v => !v);
  }

  toggleDesktopLogin() {
    if (!this.isBrowser || window.matchMedia('(min-width: 1024px)').matches) return;
    this.tabletNavRegisterOpen.set(false);
    this.tabletNavLoginOpen.update(v => !v);
  }

  @HostListener('document:pointerdown', ['$event'])
  onDocPointerDown(event: PointerEvent) {
    if (!this.isBrowser || window.matchMedia('(min-width: 1024px)').matches) return;
    const target = event.target as Node;
    if (this.tabletNavRegisterOpen()) {
      const element = this.registerDropdown?.nativeElement;
      if (element && !element.contains(target)) this.tabletNavRegisterOpen.set(false);
    }
    if (this.tabletNavLoginOpen()) {
      const element = this.loginDropdown?.nativeElement;
      if (element && !element.contains(target)) this.tabletNavLoginOpen.set(false);
    }
  }
}
