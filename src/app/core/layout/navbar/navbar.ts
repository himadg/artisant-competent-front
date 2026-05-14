import { Component, ElementRef, HostListener, ViewChild, inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { filter } from 'rxjs/operators';
import { LangToggle } from '../../../shared/components/lang-toggle/lang-toggle';
import { ThemeToggle } from '../../../shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'ac-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslocoModule, LangToggle, ThemeToggle],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly router = inject(Router);

  // Opens the sandwich menu on mobiles
  mobileNavOpen = false;
  // Opens the registration dropdown on mobiles
  mobileNavRegisterOpen = false;
  // Opens the login dropdown on mobiles
  mobileNavLoginOpen = false;
  // Opens the registration dropdown on tablets
  tabletNavRegisterOpen = false;
  // Opens the login dropdown on tablets
  tabletNavLoginOpen = false;

  @ViewChild('registerDropdown') registerDropdown?: ElementRef<HTMLElement>;
  @ViewChild('loginDropdown') loginDropdown?: ElementRef<HTMLElement>;

  ngOnInit() {
    // Ferme le menu mobile automatiquement lors d'un changement de page
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMobileNav();
      this.tabletNavRegisterOpen = false;
      this.tabletNavLoginOpen = false;
    });
  }

  toggleMobileNav() {
    this.mobileNavOpen = !this.mobileNavOpen;
  }

  closeMobileNav() {
    this.mobileNavOpen = false;
  }

  toggleMobileNavRegister() {
    this.mobileNavLoginOpen = false;
    this.mobileNavRegisterOpen = !this.mobileNavRegisterOpen;
  }

  toggleMobileNavLogin() {
    this.mobileNavRegisterOpen = false;
    this.mobileNavLoginOpen = !this.mobileNavLoginOpen;
  }

  toggleDesktopRegister() {
    if (!this.isBrowser || window.matchMedia('(min-width: 1024px)').matches) return;
    this.tabletNavLoginOpen = false;
    this.tabletNavRegisterOpen = !this.tabletNavRegisterOpen;
  }

  toggleDesktopLogin() {
    if (!this.isBrowser || window.matchMedia('(min-width: 1024px)').matches) return;
    this.tabletNavRegisterOpen = false;
    this.tabletNavLoginOpen = !this.tabletNavLoginOpen;
  }

  @HostListener('document:pointerdown', ['$event'])
  onDocPointerDown(event: PointerEvent) {
    if (!this.isBrowser || window.matchMedia('(min-width: 1024px)').matches) return;
    const target = event.target as Node;
    if (this.tabletNavRegisterOpen) {
      const element = this.registerDropdown?.nativeElement;
      if (element && !element.contains(target)) this.tabletNavRegisterOpen = false;
    }
    if (this.tabletNavLoginOpen) {
      const element = this.loginDropdown?.nativeElement;
      if (element && !element.contains(target)) this.tabletNavLoginOpen = false;
    }
  }
}
