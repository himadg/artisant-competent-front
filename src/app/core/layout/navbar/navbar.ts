import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { LangToggle } from '../../../shared/components/lang-toggle/lang-toggle';
import { ThemeToggle } from '../../../shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'ac-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslocoModule, LangToggle, ThemeToggle],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
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
    if (window.matchMedia('(min-width: 1024px)').matches) return;
    this.tabletNavLoginOpen = false;
    this.tabletNavRegisterOpen = !this.tabletNavRegisterOpen;
  }

  toggleDesktopLogin() {
    if (window.matchMedia('(min-width: 1024px)').matches) return;
    this.tabletNavRegisterOpen = false;
    this.tabletNavLoginOpen = !this.tabletNavLoginOpen;
  }

  @HostListener('document:pointerdown', ['$event'])
  onDocPointerDown(event: PointerEvent) {
    if (window.matchMedia('(min-width: 1024px)').matches) return;
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
