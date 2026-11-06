import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { PendingUser, RejectProfessionalPayload } from '../../../shared/interfaces/user';
import { AuthService } from '../../../core/services/auth.service';
import { LocalizedDatePipe } from '../../../shared/pipes/localized-date.pipe';
import { FlashMessageService } from '../../../core/services/flash-message.service';
import { RejectProModal } from './reject-pro-modal/reject-pro-modal';

@Component({
  selector: 'dashboard-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslocoModule, RouterModule, LocalizedDatePipe, RejectProModal],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {
  private readonly adminApi = inject(AdminApiService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly transloco = inject(TranslocoService);
  private readonly flashMessage = inject(FlashMessageService);
  readonly authService = inject(AuthService);

  readonly pendingUsers = signal<PendingUser[]>([]);
  readonly loading = signal(true);
  readonly selectedUser = signal<any>(null);

  /** Dossier ciblé par la modale de refus (null = modale fermée). */
  readonly rejectTarget = signal<{ id: string; displayName: string } | null>(null);
  readonly rejecting = signal(false);

  readonly modalDocUrl = signal<SafeResourceUrl | string | null>(null);
  readonly modalDocType = signal<'image' | 'pdf' | null>(null);

  ngOnInit() {
    this.loadPendingUsers();
  }

  loadPendingUsers() {
    this.loading.set(true);
    this.adminApi.getPendingUsers().subscribe({
      next: (users) => {
        this.pendingUsers.set(users);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  viewDetails(id: string) {
    this.adminApi.getUserDetails(id).subscribe({
      next: (user) => this.selectedUser.set(user)
    });
  }

  closeDetails() {
    this.selectedUser.set(null);
  }

  approveUser(id: string) {
    if (!confirm(this.transloco.translate('dashboard.admin.confirmApprove'))) return;
    this.adminApi.approveUser(id).subscribe({
      next: () => {
        this.selectedUser.set(null);
        this.loadPendingUsers();
      }
    });
  }

  rejectUser(user: any) {
    const company = user.professionalProfile?.companyName;
    const name = `${user.firstName} ${user.lastName}`;
    this.rejectTarget.set({ id: user.id, displayName: company ? `${name} — ${company}` : name });
  }

  cancelReject() {
    this.rejectTarget.set(null);
  }

  confirmReject(payload: RejectProfessionalPayload) {
    const target = this.rejectTarget();
    if (!target) return;
    this.rejecting.set(true);
    this.adminApi.rejectProfessional(target.id, payload).subscribe({
      next: ({ mailSent, email }) => {
        this.rejecting.set(false);
        this.rejectTarget.set(null);
        this.selectedUser.set(null);
        this.loadPendingUsers();
        this.flashMessage.set(
          mailSent
            ? { type: 'success', key: 'dashboard.admin.rejectModal.success' }
            : { type: 'warning', key: 'dashboard.admin.rejectModal.mailFailed', params: { email } },
        );
      },
      error: () => {
        // La modale reste ouverte pour permettre de réessayer sans ressaisir le motif.
        this.rejecting.set(false);
        this.flashMessage.set({ type: 'error', key: 'dashboard.admin.rejectModal.error' });
      },
    });
  }

  openDocumentModal(url: string, isPdf: boolean) {
    if (isPdf) {
      this.modalDocUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
      this.modalDocType.set('pdf');
    } else {
      this.modalDocUrl.set(url);
      this.modalDocType.set('image');
    }
  }

  closeDocumentModal() {
    this.modalDocUrl.set(null);
    this.modalDocType.set(null);
  }
}
