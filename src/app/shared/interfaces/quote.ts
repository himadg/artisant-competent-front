export interface QuotePayload {
  quoteNumber: string;
  missionId: string | null | undefined;
  coordinates: {
    client: {
      firstName: string;
      lastName: string;
      streetNumber: string;
      streetName: string;
      postalCode: string;
      city: string;
      email: string;
      phone?: string;
    };
    jobsite: {
      streetNumber: string;
      streetName: string;
      postalCode: string;
      city: string;
    };
    artisan: {
      name: string | null;
      firstName: string | null;
      lastName: string | null;
      siret: string | null;
      streetNumber: string | null;
      streetName: string | null;
      postalCode: string | null;
      city: string | null;
      email: string | null;
      phone: string | null;
      status: string | null;
    };
  };
  materials: {
    description: string;
    amountHT: number;
    tva: number;
    providedByClient: boolean;
    isReconditioned: boolean;
    isNew?: boolean;
    paidByArtisan: boolean;
    isCustomSupply?: boolean;
  }[];
  services: {
    description: string;
    type: string;
    amountHT: number;
    tva: number;
    isNightIntervention?: boolean;
  }[];
  logistics: {
    suppliers: string[];
    travelCostHT: number;
    wasteManagement: {
      hasWaste: boolean;
      cerfaSigned: boolean;
    };
  };
  planning: {
    placeOfWriting: string;
    dateOfWriting: string;
    validityDate: string;
    estimatedStartDate: string;
    estimatedEndDate: string;
  };
  legal: {
    addDecennale: boolean;
    addOtherCertifications: boolean;
    applyTvaExemption: boolean;
    includeRcsDispensation: boolean;
  };
  agreement: {
    insuranceVerified: boolean;
    waiveRetractionRights: boolean;
    arbitrationAgreement: boolean;
    acceptSplitPayment: boolean;
    confirmFinChantier: boolean;
    confirmReleaseDelay: boolean;
    confirmPlatformRules: boolean;
  };
  remarks?: string | null;
}
