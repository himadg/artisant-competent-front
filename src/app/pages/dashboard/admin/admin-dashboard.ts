import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { PendingUser } from '../../../shared/interfaces/pending-user';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'dashboard-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslocoModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {
  private readonly adminApi = inject(AdminApiService);
  private readonly sanitizer = inject(DomSanitizer);
  readonly authService = inject(AuthService);

  readonly pendingUsers = signal<PendingUser[]>([]);
  readonly loading = signal(true);
  readonly selectedUser = signal<any>(null);

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
    if (!confirm('Êtes-vous sûr de vouloir valider cet artisan ? Il sera modal publiquement.')) return;
    this.adminApi.updateUserStatus(id, 'ACTIVE').subscribe({
      next: () => {
        this.selectedUser.set(null);
        this.loadPendingUsers();
      }
    });
  }

  rejectUser(id: string) {
    if (!confirm('Êtes-vous sûr de vouloir refuser cet artisan ?')) return;
    this.adminApi.updateUserStatus(id, 'REJECTED').subscribe({
      next: () => {
        this.selectedUser.set(null);
        this.loadPendingUsers();
      }
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
