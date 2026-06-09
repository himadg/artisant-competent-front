import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchStateService } from '../../core/services/search-state.service';
import { MissionService } from '../../core/services/mission.service';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-demande',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslocoModule],
  templateUrl: './demande.component.html',
})
export class DemandePageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private searchStateService = inject(SearchStateService);
  private missionService = inject(MissionService);
  private authService = inject(AuthService);

  form: FormGroup;
  photoPreviews: string[] = [];

  constructor() {
    this.form = this.fb.group({
      descriptif: ['', [Validators.required, Validators.minLength(20)]],
      photos: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    const searchState = this.searchStateService.getState();
    if (!searchState || searchState.professionalIds.length === 0) {
      // If no state, redirect to home or search page
      this.router.navigate(['/']);
    }
  }

  get photos(): FormArray {
    return this.form.get('photos') as FormArray;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (this.photos.length >= 3) {
        alert('Vous ne pouvez télécharger que 3 photos maximum.');
        return;
      }

      const file = input.files[0];
      // TODO: Implement direct S3 upload here and get the URL/key
      // For now, we'll just use a dummy URL and show a preview

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreviews.push(e.target.result);
        this.photos.push(this.fb.control(`dummy-s3-key-${Date.now()}`));

        // Set a timeout to remove the photo after 10 minutes
        setTimeout(() => {
          const index = this.photos.controls.findIndex(c => c.value === `dummy-s3-key-${Date.now()}`);
          if (index !== -1) {
            this.removePhoto(index);
          }
        }, 10 * 60 * 1000);
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(index: number): void {
    this.photos.removeAt(index);
    this.photoPreviews.splice(index, 1);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const searchState = this.searchStateService.getState();
    if (!searchState) {
      alert("Une erreur est survenue. Veuillez recommencer votre recherche.");
      return;
    }

    const missionData = {
      descriptif: this.form.value.descriptif,
      prestataireIds: searchState.professionalIds,
      metierId: searchState.tradeId,
      lieu: searchState.location,
      photoUrls: this.form.value.photos,
    };

    this.missionService.createMission(missionData).subscribe({
      next: (response) => {
        console.log('Demande créée avec succès', response);
        const user = this.authService.currentUser();
        if (user?.role?.code === 'INDIVIDUAL') {
          alert(`Votre demande a été envoyée !`);
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la création de la demande', err);
        alert('Une erreur est survenue lors de l\'envoi de votre demande.');
      }
    });
  }
}
