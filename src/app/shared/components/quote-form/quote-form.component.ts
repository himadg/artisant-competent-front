import { Component, computed, effect, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, FormControl, FormArray, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { startWith } from 'rxjs/operators';
import { QuotePreviewComponent } from '../quote-preview/quote-preview.component';

// Validator pour s'assurer que la date est >= aujourd'hui
export function minDateTodayValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    return inputDate >= today ? null : { minDateToday: true };
  };
}

// Validator pour comparer deux dates
export function dateRangeValidator(startControlName: string, endControlName: string, errorKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const startControl = group.get(startControlName);
    const endControl = group.get(endControlName);

    if (!startControl || !endControl || !startControl.value || !endControl.value) return null;

    const startDate = new Date(startControl.value);
    const endDate = new Date(endControl.value);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (startDate > endDate) {
      // Met aussi l'erreur sur le champ de fin pour le mettre en surbrillance facilement
      const errors = endControl.errors || {};
      endControl.setErrors({ ...errors, [errorKey]: true });
      return { [errorKey]: true };
    } else {
      // Nettoie l'erreur si elle est résolue
      if (endControl.hasError(errorKey)) {
        const errors = { ...endControl.errors };
        delete errors[errorKey];
        endControl.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
    return null;
  };
}

@Component({
  selector: 'app-quote-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuotePreviewComponent],
  templateUrl: './quote-form.component.html',
  styleUrls: ['./quote-form.component.scss']
})
export class QuoteFormComponent {
  private fb = inject(FormBuilder);

  artisanStatuses = ['Société', 'Auto-entrepreneur'];

  // Variable pour gérer l'affichage de la prévisualisation
  showPreview = false;

  quoteForm = this.fb.nonNullable.group({
    coordinates: this.fb.nonNullable.group({
      client: this.fb.nonNullable.group({
        name: ['', Validators.required],
        address: ['', Validators.required]
      }),
      artisan: this.fb.nonNullable.group({
        name: ['', Validators.required],
        siret: ['', [Validators.required, Validators.pattern('^[0-9]{14}$')]],
        address: ['', Validators.required],
        status: ['Auto-entrepreneur', Validators.required]
      })
    }),
    materials: this.fb.array<FormGroup<{
      description: FormControl<string>;
      amountHT: FormControl<number>;
      tva: FormControl<number>;
      providedByClient: FormControl<boolean>;
      isReconditioned: FormControl<boolean>;
      paidByArtisan: FormControl<boolean>;
    }>>([]),
    services: this.fb.array<FormGroup<{
      description: FormControl<string>;
      type: FormControl<string>;
      amountHT: FormControl<number>;
      tva: FormControl<number>;
    }>>([]),
    logistics: this.fb.nonNullable.group({
      suppliers: this.fb.array<FormControl<string>>([this.fb.nonNullable.control('', Validators.required)]),
      travelCostHT: [0, [Validators.required, Validators.min(0)]],
      wasteManagement: this.fb.nonNullable.group({
        hasWaste: [false],
        cerfaSigned: [false]
      })
    }),
    planning: this.fb.nonNullable.group({
      placeOfWriting: ['', Validators.required],
      dateOfWriting: ['', [Validators.required, minDateTodayValidator()]],
      validityDate: ['', [Validators.required, minDateTodayValidator()]],
      estimatedStartDate: ['', [Validators.required, minDateTodayValidator()]],
      estimatedEndDate: ['', [Validators.required, minDateTodayValidator()]]
    }, {
      validators: [
        dateRangeValidator('dateOfWriting', 'validityDate', 'invalidValidityRange'),
        dateRangeValidator('estimatedStartDate', 'estimatedEndDate', 'invalidEstimatedRange')
      ]
    }),
    legal: this.fb.nonNullable.group({
      insuranceDocument: [null as File | null, Validators.required],
      applyTvaExemption: [false],
      includeRcsDispensation: [false]
    }),
    agreement: this.fb.nonNullable.group({
      waiveRetractionRights: [false, Validators.requiredTrue],
      arbitrationAgreement: [false, Validators.requiredTrue]
    })
  });

  // Getters pour un accès facile dans le template
  get f() { return this.quoteForm.controls; }
  get clientControls() { return this.f.coordinates.controls.client.controls; }
  get artisanControls() { return this.f.coordinates.controls.artisan.controls; }
  get planningControls() { return this.f.planning.controls; }
  get planningGroup() { return this.f.planning; }
  get legalControls() { return this.f.legal.controls; }

  private statusControl = this.artisanControls.status;

  artisanStatus: Signal<string> = toSignal(
    this.statusControl.valueChanges.pipe(startWith(this.statusControl.value)),
    { initialValue: this.statusControl.value }
  );

  tvaMentions: Signal<string[]> = computed(() => {
    const status = this.artisanStatus();
    if (status === 'Auto-entrepreneur') {
      return ['TVA non applicable, article 293 B du CGI'];
    } else if (status === 'Société') {
      return ['TVA acquittée par l\'entreprise principale en application des dispositions de 2 Nonies de L\'article 283 du code Général des impôts'];
    }
    return [];
  });

  isAutoEntrepreneur: Signal<boolean> = computed(() => this.artisanStatus() === 'Auto-entrepreneur');

  private rcsDispensationSignal = toSignal(
    this.legalControls.includeRcsDispensation.valueChanges.pipe(startWith(this.legalControls.includeRcsDispensation.value)),
    { initialValue: false }
  );

  optionalMentions: Signal<string[]> = computed(() => {
    if (this.isAutoEntrepreneur() && this.rcsDispensationSignal()) {
      return ['Dispensé d’immatriculation au registre du commerce et des sociétés, en application de l’article L. 12311 du Code de commerce'];
    }
    return [];
  });

  constructor() {
    const applyTvaExemption$ = this.legalControls.applyTvaExemption.valueChanges.pipe(startWith(this.legalControls.applyTvaExemption.value));
    const materials$ = this.f.materials.valueChanges.pipe(startWith(this.f.materials.value));
    const applyTvaExemptionSignal = toSignal(applyTvaExemption$, {initialValue: false});
    const materialsSignal = toSignal(materials$);

    effect(() => {
      const applyTva = applyTvaExemptionSignal();
      materialsSignal();
      const options = { emitEvent: false };

      this.services.controls.forEach(service => {
        if (applyTva) {
          service.controls.tva.patchValue(0, options);
          service.controls.tva.disable(options);
        } else {
          service.controls.tva.enable(options);
          if (service.controls.tva.value === 0) service.controls.tva.patchValue(20, options);
        }
      });

      this.materials.controls.forEach(material => {
        const providedByClient = material.controls.providedByClient.value;
        if (providedByClient) {
          material.controls.tva.patchValue(20, options);
          material.controls.tva.disable(options);
          material.controls.amountHT.patchValue(0, options);
          material.controls.amountHT.disable(options);
        } else {
          material.controls.amountHT.enable(options);
          if (applyTva) {
            material.controls.tva.patchValue(0, options);
            material.controls.tva.disable(options);
          } else {
            material.controls.tva.enable(options);
            if (material.controls.tva.value === 0) material.controls.tva.patchValue(20, options);
          }
        }
      });
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.legalControls.insuranceDocument.patchValue(input.files[0]);
    } else {
      this.legalControls.insuranceDocument.patchValue(null);
    }
  }

  get materials() { return this.f.materials; }
  addMaterial(): void { this.materials.push(this.fb.nonNullable.group({ description: ['', Validators.required], amountHT: [0, [Validators.required, Validators.min(0)]], tva: [20, [Validators.required, Validators.min(0)]], providedByClient: [false], isReconditioned: [false], paidByArtisan: [true] })); }
  removeMaterial(index: number): void { this.materials.removeAt(index); }

  get services() { return this.f.services; }
  addService(): void { this.services.push(this.fb.nonNullable.group({ description: ['', Validators.required], type: ['Principale', Validators.required], amountHT: [0, [Validators.required, Validators.min(0)]], tva: [20, [Validators.required, Validators.min(0)]] })); }
  removeService(index: number): void { this.services.removeAt(index); }

  get suppliers(): FormArray<FormControl<string>> { return this.f.logistics.controls.suppliers; }
  addSupplier(): void { this.suppliers.push(this.fb.nonNullable.control('', Validators.required)); }
  removeSupplier(index: number): void { if (this.suppliers.length > 1) this.suppliers.removeAt(index); }

  calculateItemTTC(amountHT: number, tva: number): number { return amountHT * (1 + (tva / 100)); }
  get totalMaterialsHT(): number { return this.materials.controls.reduce((acc, curr) => acc + (curr.controls.amountHT.value || 0), 0); }
  get totalMaterialsTTC(): number { return this.materials.controls.reduce((acc, curr) => acc + this.calculateItemTTC(curr.controls.amountHT.value || 0, curr.controls.tva.value || 0), 0); }
  get totalServicesHT(): number { return this.services.controls.reduce((acc, curr) => acc + (curr.controls.amountHT.value || 0), 0); }
  get totalServicesTTC(): number { return this.services.controls.reduce((acc, curr) => acc + this.calculateItemTTC(curr.controls.amountHT.value || 0, curr.controls.tva.value || 0), 0); }
  get totalTravelCostHT(): number { return this.f.logistics.controls.travelCostHT.value || 0; }
  get totalHT(): number { return this.totalMaterialsHT + this.totalServicesHT + this.totalTravelCostHT; }
  get platformFee(): number { return this.totalHT < 1500 ? this.totalHT * 0.15 : this.totalHT * 0.10; }
  hasWaste(): boolean { return this.f.logistics.controls.wasteManagement.controls.hasWaste.value; }

  openPreview(): void {
    // Si le formulaire est invalide on prévient, sinon on ouvre directement
    if (this.quoteForm.invalid) {
      this.quoteForm.markAllAsTouched();
      alert("Veuillez remplir correctement les champs obligatoires avant de prévisualiser.");
      return;
    }

    if (this.hasWaste() && !this.f.logistics.controls.wasteManagement.controls.cerfaSigned.value) {
      alert("Le document CERFA doit être signé pour la gestion des déchets.");
      return;
    }

    this.showPreview = true;
  }

  onSubmit(): void {
    if (this.quoteForm.invalid) {
      this.quoteForm.markAllAsTouched();
      console.log('Formulaire invalide', this.quoteForm.value);
      alert("Veuillez corriger les erreurs et remplir tous les champs obligatoires.");
      return;
    }
    if (this.hasWaste() && !this.f.logistics.controls.wasteManagement.controls.cerfaSigned.value) {
      alert("Le document CERFA doit être signé pour la gestion des déchets.");
      return;
    }
    console.log('Devis validé', this.quoteForm.getRawValue());
  }
}
