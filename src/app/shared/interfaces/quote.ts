export interface QuotePayload {
  quoteNumber: string;
  missionId: string | null | undefined;
  coordinates: {
    client: {
      firstName: string;
      lastName: string;
      streetNumber: string;
      streetType: string;
      streetName: string;
      locality: string;
      apartmentNumber: string;
      buildingNumber: string;
      floor: string;
      postalCode: string;
      city: string;
      email: string;
      phone?: string;
    };
    jobsite: {
      streetNumber: string;
      streetType: string;
      streetName: string;
      locality: string;
      apartmentNumber: string;
      buildingNumber: string;
      floor: string;
      postalCode: string;
      city: string;
    };
    artisan: {
      name: string | null;
      firstName: string | null;
      lastName: string | null;
      siret: string | null;
      streetNumber: string | null;
      streetType: string | null;
      streetName: string | null;
      locality: string | null;
      apartmentNumber: string | null;
      buildingNumber: string | null;
      floor: string | null;
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
    paidByArtisan: boolean;
  }[];
  services: {
    description: string;
    type: string;
    amountHT: number;
    tva: number;
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
    rcProDocument?: File | null;
    addDecennale: boolean;
    decennaleDocument?: File | null;
    addOtherCertifications: boolean;
    otherCertifications?: (File | null)[];
    applyTvaExemption: boolean;
    includeRcsDispensation: boolean;
  };
  agreement: {
    insuranceVerified: boolean;
    waiveRetractionRights: boolean;
    arbitrationAgreement: boolean;
  };
}
