import { Component, computed, effect, inject, Signal, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, FormControl, FormArray, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { startWith } from 'rxjs/operators';
import { QuotePreviewComponent } from '../quote-preview/quote-preview.component';
import { QuoteCalculationService } from '../../services/quote-calculation.service';
import { QuoteService } from '../../services/quote.service';
import { UserApiService } from '../../../core/services/user-api.service';
import { AuthService } from '../../../core/services/auth.service';
import { QuotePayload } from '../../interfaces/quote';

// Validators
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
      const errors = endControl.errors || {};
      endControl.setErrors({ ...errors, [errorKey]: true });
      return { [errorKey]: true };
    } else {
      if (endControl.hasError(errorKey)) {
        const errors = { ...endControl.errors };
        delete errors[errorKey];
        endControl.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
    return null;
  };
}

type ArtisanForm = FormGroup<{
  name: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  siret: FormControl<string>;
  streetNumber: FormControl<string>;
  streetType: FormControl<string>;
  streetName: FormControl<string>;
  locality: FormControl<string>;
  apartmentNumber: FormControl<string>;
  buildingNumber: FormControl<string>;
  floor: FormControl<string>;
  postalCode: FormControl<string>;
  city: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  status: FormControl<string>;
}>;

@Component({
  selector: 'ac-quote-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuotePreviewComponent],
  templateUrl: './quote-form.component.html',
  styleUrls: ['./quote-form.component.scss']
})
export class QuoteFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  public calcService = inject(QuoteCalculationService);
  private quoteService = inject(QuoteService);
  private userApi = inject(UserApiService);
  private authService = inject(AuthService);

  artisanStatuses = ['Société', 'Auto-entrepreneur'];
  streetTypes = ['Rue', 'Avenue', 'Boulevard', 'Chemin', 'Place', 'Impasse', 'Allée'];
  showPreview = false;

  quoteForm = this.fb.nonNullable.group({
    quoteNumber: [''],
    coordinates: this.fb.nonNullable.group({
      client: this.fb.nonNullable.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        streetNumber: [''],
        streetType: ['Rue', Validators.required],
        streetName: ['', Validators.required],
        locality: [''],
        apartmentNumber: [''],
        buildingNumber: [''],
        floor: [''],
        postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
        city: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern('^0[1-9]([ .-]?[0-9]{2}){4}$')]]
      }),
      jobsite: this.fb.nonNullable.group({
        streetNumber: [''],
        streetType: ['Rue', Validators.required],
        streetName: ['', Validators.required],
        locality: [''],
        apartmentNumber: [''],
        buildingNumber: [''],
        floor: [''],
        postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
        city: ['', Validators.required]
      }),
      artisan: this.fb.group({
        name: [''],
        firstName: [''],
        lastName: [''],
        siret: ['', [Validators.required, Validators.pattern('^[0-9]{14}$')]],
        streetNumber: ['', Validators.required],
        streetType: ['Rue', Validators.required],
        streetName: ['', Validators.required],
        locality: [''],
        apartmentNumber: [''],
        buildingNumber: [''],
        floor: [''],
        postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
        city: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern('^0[1-9]([ .-]?[0-9]{2}){4}$')]],
        status: ['Auto-entrepreneur', Validators.required]
      })
    }),
    materials: this.fb.array<FormGroup<{ description: FormControl<string>; amountHT: FormControl<number>; tva: FormControl<number>; providedByClient: FormControl<boolean>; isReconditioned: FormControl<boolean>; paidByArtisan: FormControl<boolean>; }>>([]),
    services: this.fb.array<FormGroup<{ description: FormControl<string>; type: FormControl<string>; amountHT: FormControl<number>; tva: FormControl<number>; }>>([]),
    logistics: this.fb.nonNullable.group({
      suppliers: this.fb.array<FormControl<string>>([this.fb.nonNullable.control('', Validators.required)]),
      travelCostHT: [0, [Validators.required, Validators.min(0)]],
      wasteManagement: this.fb.nonNullable.group({ hasWaste: [false], cerfaSigned: [false] })
    }),
    planning: this.fb.nonNullable.group({
      placeOfWriting: ['', Validators.required],
      dateOfWriting: ['', [Validators.required, minDateTodayValidator()]],
      validityDate: ['', [Validators.required, minDateTodayValidator()]],
      estimatedStartDate: ['', [Validators.required, minDateTodayValidator()]],
      estimatedEndDate: ['', [Validators.required, minDateTodayValidator()]]
    }, { validators: [dateRangeValidator('dateOfWriting', 'validityDate', 'invalidValidityRange'), dateRangeValidator('dateOfWriting', 'estimatedStartDate', 'invalidStartRange'), dateRangeValidator('estimatedStartDate', 'estimatedEndDate', 'invalidEstimatedRange')] }),
    legal: this.fb.nonNullable.group({
      rcProDocument: [null as File | null, Validators.required],
      addDecennale: [false],
      decennaleDocument: [null as File | null],
      addOtherCertifications: [false],
      otherCertifications: this.fb.array<FormControl<File | null>>([]),
      applyTvaExemption: [false],
      includeRcsDispensation: [false]
    }),
    agreement: this.fb.nonNullable.group({
      insuranceVerified: [false, Validators.requiredTrue],
      waiveRetractionRights: [false, Validators.requiredTrue],
      arbitrationAgreement: [false, Validators.requiredTrue]
    })
  });

  /** If provided, the mission object containing all necessary data */
  @Input() mission?: any | null = null;
  /** If provided, existing quote id to update */
  @Input() quoteId?: string | null = null;
  /** If provided, professional user ID to pre-fill professional coordinates */
  @Input() professionalUserId?: string | null = null;
  @Output() saved = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  get f() { return this.quoteForm.controls; }
  get clientControls() { return this.f.coordinates.controls.client.controls; }
  get jobsiteControls() { return this.f.coordinates.controls.jobsite.controls; }
  get artisanControls() { return (this.f.coordinates.controls.artisan as ArtisanForm).controls; }
  get planningControls() { return this.f.planning.controls; }
  get planningGroup() { return this.f.planning; }
  get legalControls() { return this.f.legal.controls; }
  get otherCertifications() { return this.legalControls.otherCertifications as FormArray; }

  private statusControl = this.artisanControls['status'];
  artisanStatus: Signal<string> = toSignal(this.statusControl.valueChanges.pipe(startWith(this.statusControl.value)), { initialValue: 'Auto-entrepreneur' });
  isAutoEntrepreneur: Signal<boolean> = computed(() => this.artisanStatus() === 'Auto-entrepreneur');

  tvaMentions: Signal<string[]> = computed(() => {
    const status = this.artisanStatus();
    if (status === 'Auto-entrepreneur') return ['TVA non applicable, article 293 B du CGI'];
    if (status === 'Société') return ['TVA acquittée par l\'entreprise principale en application des dispositions de 2 Nonies de L\'article 283 du code Général des impôts'];
    return [];
  });

  private rcsDispensationSignal = toSignal(this.legalControls.includeRcsDispensation.valueChanges.pipe(startWith(this.legalControls.includeRcsDispensation.value)), { initialValue: false });
  optionalMentions: Signal<string[]> = computed(() => {
    if (this.isAutoEntrepreneur() && this.rcsDispensationSignal()) {
      return ['Dispensé d’immatriculation au registre du commerce et des sociétés, en application de l’article L. 12311 du Code de commerce'];
    }
    return [];
  });

  constructor() {
    this.statusControl.valueChanges.pipe(startWith(this.statusControl.value)).subscribe(status => {
      const artisanGroup = this.f.coordinates.controls.artisan;
      const nameControl = artisanGroup.get('name');
      const firstNameControl = artisanGroup.get('firstName');
      const lastNameControl = artisanGroup.get('lastName');

      if (status === 'Société') {
        nameControl?.setValidators([Validators.required]);
        firstNameControl?.clearValidators();
        lastNameControl?.clearValidators();
      } else { // Auto-entrepreneur
        nameControl?.clearValidators();
        firstNameControl?.setValidators([Validators.required]);
        lastNameControl?.setValidators([Validators.required]);
      }
      nameControl?.updateValueAndValidity();
      firstNameControl?.updateValueAndValidity();
      lastNameControl?.updateValueAndValidity();
    });

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

    this.legalControls.addDecennale.valueChanges.subscribe(add => {
      const docControl = this.legalControls.decennaleDocument;
      if (add) {
        docControl.setValidators([Validators.required]);
      } else {
        docControl.clearValidators();
        docControl.patchValue(null);
      }
      docControl.updateValueAndValidity();
    });

    this.legalControls.addOtherCertifications.valueChanges.subscribe(add => {
      if (!add) {
        this.otherCertifications.clear();
      }
    });
  }

  ngOnInit(): void {
    if (this.quoteId) {
      // En édition : on charge le devis existant, mais si la mission est dispo, on pré-remplit les coordonnées du client manquantes
      this.loadQuote();
    } else {
      this.preloadCoordinates();
    }
  }

  private loadQuote(): void {
    if (!this.quoteId) return;
    this.quoteService.getQuote(this.quoteId).subscribe({
      next: (quote: { quoteNumber?: string; payload: QuotePayload }) => {
        const payload = quote.payload;
        if (!payload) return;

        // Reconstruire les FormArray dynamiques avant le patchValue,
        // car patchValue ne crée pas les contrôles manquants.
        this.rebuildMaterials(payload.materials ?? []);
        this.rebuildServices(payload.services ?? []);
        this.rebuildSuppliers(payload.logistics?.suppliers ?? []);

        // Les certifications "autres" sont des fichiers : on recrée les contrôles
        // vides correspondants pour refléter le nombre de documents joints.
        this.rebuildOtherCertifications(payload.legal?.otherCertifications ?? []);

        // Le statut de l'artisan pilote les validateurs conditionnels :
        // on le pousse en premier pour que les validators soient corrects.
        const status = payload.coordinates?.artisan?.status;
        if (status) {
          this.artisanControls['status'].patchValue(status, { emitEvent: true });
        }

        // Si c'est une modification et que le payload n'a pas le téléphone,
        // on essaie de le récupérer depuis la mission (qui a été passée par le dashboard)
        if (this.mission?.client && (!payload.coordinates?.client?.phone || !payload.coordinates?.client?.email)) {
             if (!payload.coordinates) {
                 payload.coordinates = {} as any;
             }
             if (!payload.coordinates.client) {
                  payload.coordinates.client = {} as any;
             }
             payload.coordinates.client.phone = payload.coordinates.client.phone || this.mission.client.phone;
             payload.coordinates.client.email = payload.coordinates.client.email || this.mission.client.email;
        }

        this.quoteForm.patchValue({
          ...payload,
          quoteNumber: quote.quoteNumber ?? this.f.quoteNumber.value,
        });
      },
      error: (err) => console.error('Erreur lors du chargement du devis', err),
    });
  }

  private rebuildMaterials(materials: QuotePayload['materials']): void {
    this.materials.clear();
    materials.forEach((m) => {
      this.materials.push(this.fb.nonNullable.group({
        description: [m.description ?? '', [Validators.required, Validators.maxLength(255)]],
        amountHT: [m.amountHT ?? 0, [Validators.required, Validators.min(0)]],
        tva: [m.tva ?? 20, [Validators.required, Validators.min(0)]],
        providedByClient: [m.providedByClient ?? false],
        isReconditioned: [m.isReconditioned ?? false],
        paidByArtisan: [m.paidByArtisan ?? true],
      }));
    });
  }

  private rebuildServices(services: QuotePayload['services']): void {
    this.services.clear();
    services.forEach((s) => {
      this.services.push(this.fb.nonNullable.group({
        description: [s.description ?? '', [Validators.required, Validators.maxLength(255)]],
        type: [s.type ?? 'Principale', Validators.required],
        amountHT: [s.amountHT ?? 0, [Validators.required, Validators.min(0)]],
        tva: [s.tva ?? 20, [Validators.required, Validators.min(0)]],
      }));
    });
  }

  private rebuildSuppliers(suppliers: string[]): void {
    this.suppliers.clear();
    const list = suppliers.length ? suppliers : [''];
    list.forEach((name) => {
      this.suppliers.push(this.fb.nonNullable.control(name ?? '', Validators.required));
    });
  }

  private rebuildOtherCertifications(certifications: (File | null)[]): void {
    this.otherCertifications.clear();
    certifications.forEach(() => {
      this.otherCertifications.push(this.fb.control(null as File | null, Validators.required));
    });
  }

  private preloadCoordinates(): void {
    // Pré-remplir les coordonnées du client si la mission est fournie
    if (this.mission?.client) {
      const clientData = this.mission.client;
      const clientAddress = clientData.address || {};
      const clientControls = this.f.coordinates.controls.client;
      clientControls.patchValue({
        firstName: clientData.firstName || '',
        lastName: clientData.lastName || '',
        email: clientData.email || '',
        phone: clientData.phone || '',
        streetNumber: clientAddress.streetNumber || '',
        streetType: clientAddress.streetType || 'Rue',
        streetName: clientAddress.streetName || '',
        locality: clientAddress.locality || '',
        apartmentNumber: clientAddress.apartmentNumber || '',
        buildingNumber: clientAddress.buildingNumber || '',
        floor: clientAddress.floor || '',
        postalCode: clientAddress.postalCode || '',
        city: clientAddress.city || '',
      });
    }

    // Pré-remplir les coordonnées du professionnel si professionalUserId est fourni (ou utiliser l'utilisateur actuel)
    const proUserId = this.professionalUserId || this.authService.getCurrentUserId();
    if (proUserId) {
      this.userApi.getProfessionalProfile(proUserId).subscribe({
        next: (proData: any) => {
          const proUser = proData.user || {};
          const proAddress = proData.workAddress || {};
          const artisanGroup = this.f.coordinates.controls.artisan as FormGroup;

          const status = proData.companyStatus === 'COMPANY' ? 'Société' : 'Auto-entrepreneur';
          artisanGroup.get('status')?.patchValue(status, { emitEvent: true });

          artisanGroup.patchValue({
            name: proData.companyName || '',
            firstName: proUser.firstName || '',
            lastName: proUser.lastName || '',
            email: proData.professionalEmail || proUser.email || '',
            phone: proData.managerPhone || '',
            siret: proData.siret || '',
            streetNumber: proAddress.streetNumber || '',
            streetType: proAddress.streetType || 'Rue',
            streetName: proAddress.streetName || '',
            locality: proAddress.locality || '',
            apartmentNumber: proAddress.apartmentNumber || '',
            buildingNumber: proAddress.buildingNumber || '',
            floor: proAddress.floor || '',
            postalCode: proAddress.postalCode || '',
            city: proAddress.city || '',
          });
        },
        error: (err) => console.error('Erreur lors du chargement du profil professionnel', err),
      });
    }
  }

  onFileChange(event: Event, controlName: keyof QuoteFormComponent['legalControls'] | 'otherCertifications', index?: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (controlName === 'otherCertifications' && index !== undefined) {
        this.otherCertifications.at(index).patchValue(file);
      } else {
        (this.legalControls[controlName as keyof QuoteFormComponent['legalControls']] as FormControl).patchValue(file);
      }
    } else {
      if (controlName === 'otherCertifications' && index !== undefined) {
        this.otherCertifications.at(index).patchValue(null);
      } else {
        (this.legalControls[controlName as keyof QuoteFormComponent['legalControls']] as FormControl).patchValue(null);
      }
    }
  }

  addCertification(): void {
    this.otherCertifications.push(this.fb.control(null as File | null, Validators.required));
  }

  removeCertification(index: number): void {
    this.otherCertifications.removeAt(index);
  }

  get materials() { return this.f.materials; }
  addMaterial(): void { this.materials.push(this.fb.nonNullable.group({ description: ['', [Validators.required, Validators.maxLength(255)]], amountHT: [0, [Validators.required, Validators.min(0)]], tva: [20, [Validators.required, Validators.min(0)]], providedByClient: [false], isReconditioned: [false], paidByArtisan: [true] })); }
  removeMaterial(index: number): void { this.materials.removeAt(index); }

  get services() { return this.f.services; }
  addService(): void { this.services.push(this.fb.nonNullable.group({ description: ['', [Validators.required, Validators.maxLength(255)]], type: ['Principale', Validators.required], amountHT: [0, [Validators.required, Validators.min(0)]], tva: [20, [Validators.required, Validators.min(0)]] })); }
  removeService(index: number): void { this.services.removeAt(index); }

  get suppliers(): FormArray<FormControl<string>> { return this.f.logistics.controls.suppliers; }
  addSupplier(): void { this.suppliers.push(this.fb.nonNullable.control('', Validators.required)); }
  removeSupplier(index: number): void { if (this.suppliers.length > 1) this.suppliers.removeAt(index); }

  get totalHT(): number { return this.calcService.getTotalHT(this.quoteForm.getRawValue()); }
  get grandTotalTTC(): number { return this.calcService.getGrandTotalTTC(this.quoteForm.getRawValue()); }

  hasWaste(): boolean { return this.f.logistics.controls.wasteManagement.controls.hasWaste.value; }

  private generateQuoteNumber(): void {
    if (this.f.quoteNumber.value) return;

    const client = this.clientControls;
    const artisan = this.artisanControls;
    const artisanStatus = this.artisanStatus();

    const clientName = `${client.firstName.value}-${client.lastName.value}`.toLowerCase().replace(/ /g, '-');
    let artisanName = '';
    if (artisanStatus === 'Auto-entrepreneur') {
      artisanName = `${artisan.firstName.value}-${artisan.lastName.value}`.toLowerCase().replace(/ /g, '-');
    } else {
      artisanName = artisan.name.value.toLowerCase().replace(/ /g, '-');
    }

    const timestamp = Date.now();
    const quoteNumber = `devis-${clientName}-${artisanName}-${timestamp}`;

    this.f.quoteNumber.patchValue(quoteNumber);
  }

  copyClientAddressToJobsite(): void {
    const client = this.quoteForm.getRawValue().coordinates.client;
    this.quoteForm.controls.coordinates.controls.jobsite.patchValue({
      streetNumber: client.streetNumber,
      streetType: client.streetType,
      streetName: client.streetName,
      locality: client.locality,
      apartmentNumber: client.apartmentNumber,
      buildingNumber: client.buildingNumber,
      floor: client.floor,
      postalCode: client.postalCode,
      city: client.city
    });
  }

  openPreview(): void {
    if (this.quoteForm.invalid) {
      this.quoteForm.markAllAsTouched();
      alert("Veuillez remplir correctement les champs obligatoires avant de prévisualiser.");
      return;
    }
    if (this.hasWaste() && !this.f.logistics.controls.wasteManagement.controls.cerfaSigned.value) {
      alert("Le document CERFA doit être signé pour la gestion des déchets.");
      return;
    }
    this.generateQuoteNumber();
    this.showPreview = true;
  }

  onSubmit(): void {
    this.generateQuoteNumber();
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

    const formValue = this.quoteForm.getRawValue();
    const payload: QuotePayload = {
      ...formValue,
      missionId: this.mission?.id || '',
    };

    // Build FormData to allow file uploads
    const formData = new FormData();
    formData.append('payload', JSON.stringify(payload));
    const rcFile = this.legalControls.rcProDocument.value as File | null;
    if (rcFile) formData.append('rcProDocument', rcFile, rcFile.name);
    const decFile = this.legalControls.decennaleDocument?.value as File | null;
    if (decFile) formData.append('decennaleDocument', decFile, decFile.name);
    this.otherCertifications.controls.forEach((c, i) => {
      const f = c.value as File | null;
      if (f) formData.append(`otherCertification_${i}`, f, f.name);
    });

    // submit to backend (create or update)
    if (this.quoteId) {
      this.quoteService.updateQuote(this.quoteId, formData).subscribe({
        next: (res) => this.saved.emit(res),
        error: (err) => {
          console.error('Erreur lors de la mise à jour du devis', err);
          alert('Une erreur est survenue lors de la sauvegarde du devis.');
        }
      });
    } else {
      this.quoteService.createQuote(formData).subscribe({
        next: (res) => this.saved.emit(res),
        error: (err) => {
          console.error('Erreur lors de la création du devis', err);
          alert('Une erreur est survenue lors de la création du devis.');
        }
      });
    }
  }
}
