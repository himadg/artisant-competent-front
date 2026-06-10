import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchStateService } from '../../core/services/search-state.service';
import { MissionService } from '../../core/services/mission.service';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthService } from '../../core/services/auth.service';
import { FileUpload } from '../../shared/components/file-upload/file-upload';

@Component({
  selector: 'app-demande',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslocoModule, FileUpload],
  templateUrl: './demande.component.html',
})
export class DemandePageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private searchStateService = inject(SearchStateService);
  private missionService = inject(MissionService);
  private authService = inject(AuthService);

  /** Nombre maximum de photos jointes à la demande. */
  readonly maxPhotos = 3;

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      descriptif: ['', [Validators.required, Validators.minLength(20)]],
      // Chaque entrée = une clé de stockage renvoyée par le backend (upload via ac-file-upload).
      photos: this.fb.array<FormControl<string | null>>([]),
    });
  }

  ngOnInit(): void {
    const searchState = this.searchStateService.getState();
    if (!searchState || searchState.professionalIds.length === 0) {
      // If no state, redirect to home or search page
      this.router.navigate(['/']);
    }
  }

  get photos(): FormArray<FormControl<string | null>> {
    return this.form.get('photos') as FormArray<FormControl<string | null>>;
  }

  addPhoto(): void {
    if (this.photos.length >= this.maxPhotos) return;
    this.photos.push(new FormControl<string | null>(null));
  }

  removePhoto(index: number): void {
    this.photos.removeAt(index);
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

    // On ne garde que les clés réellement uploadées (entrées non vides).
    const photoUrls = (this.photos.value as (string | null)[]).filter((key): key is string => !!key);

    const missionData = {
      descriptif: this.form.value.descriptif,
      prestataireIds: searchState.professionalIds,
      metierId: searchState.tradeId,
      lieu: searchState.location,
      photoUrls,
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
