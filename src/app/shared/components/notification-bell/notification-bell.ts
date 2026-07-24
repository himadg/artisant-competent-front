import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { AppNotification } from '../../interfaces/notification';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LocalizedDatePipe } from '../../pipes/localized-date.pipe';

@Component({
  selector: 'notification-bell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslocoModule, LocalizedDatePipe],
  templateUrl: './notification-bell.html',
  styleUrl: './notification-bell.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NotificationBell {
  readonly authService = inject(AuthService);
  readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly panelOpen = signal(false);

  @ViewChild('panel') panel?: ElementRef<HTMLElement>;

  togglePanel() {
    this.panelOpen.update((open) => !open);
  }

  async select(notification: AppNotification) {
    this.panelOpen.set(false);
    if (!notification.read) await this.notificationService.markAsRead(notification.id);
    this.router.navigateByUrl(notification.link);
  }

  markAllAsRead() {
    void this.notificationService.markAllAsRead();
  }

  @HostListener('document:pointerdown', ['$event'])
  onDocPointerDown(event: PointerEvent) {
    if (!this.panelOpen()) return;
    const target = event.target as Node;
    if (this.panel && !this.panel.nativeElement.contains(target)) this.panelOpen.set(false);
  }
}
