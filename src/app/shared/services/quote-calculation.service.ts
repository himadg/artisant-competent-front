import { Injectable } from '@angular/core';

// Interface pour représenter la structure des données d'un devis
export interface QuoteData {
  coordinates?: {
    client?: {
      firstName?: string;
      lastName?: string;
      streetNumber?: string;
      streetType?: string;
      streetName?: string;
      locality?: string;
      buildingNumber?: string;
      floor?: string;
      apartmentNumber?: string;
      postalCode?: string;
      city?: string;
      email?: string;
      phone?: string;
    };
    jobsite?: {
      streetNumber?: string;
      streetType?: string;
      streetName?: string;
      locality?: string;
      buildingNumber?: string;
      floor?: string;
      apartmentNumber?: string;
      postalCode?: string;
      city?: string;
    };
    artisan?: any;
  };
  materials: { amountHT: number; tva: number; providedByClient: boolean; isReconditioned: boolean; description: string }[];
  services: { amountHT: number; tva: number; description: string; type: string }[];
  logistics: { travelCostHT: number; suppliers: string[]; wasteManagement: { hasWaste: boolean; cerfaSigned: boolean } };
  legal: {
    applyTvaExemption: boolean;
    includeRcsDispensation?: boolean;
    rcProDocument?: any;
    addDecennale?: boolean;
    decennaleDocument?: any;
    addOtherCertifications?: boolean;
    otherCertifications?: any[];
  };
  agreement?: { insuranceVerified: boolean; waiveRetractionRights: boolean; arbitrationAgreement: boolean };
  quoteNumber?: string;
  planning?: {
    placeOfWriting?: string;
    dateOfWriting?: string;
    validityDate?: string;
    estimatedStartDate?: string;
    estimatedEndDate?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class QuoteCalculationService {

  constructor() { }

  calculateItemTTC(amountHT: number, tva: number, isTvaExempt: boolean = false): number {
    const appliedTva = isTvaExempt ? 0 : (tva || 0);
    return (amountHT || 0) * (1 + appliedTva / 100);
  }

  getTotalMaterialsHT(materials: QuoteData['materials']): number {
    if (!materials) return 0;
    return materials.reduce((acc, curr) => acc + (curr.providedByClient ? 0 : (curr.amountHT || 0)), 0);
  }

  getTotalServicesHT(services: QuoteData['services']): number {
    if (!services) return 0;
    return services.reduce((acc, curr) => acc + (curr.amountHT || 0), 0);
  }

  getTotalTravelCostHT(logistics: QuoteData['logistics']): number {
    return logistics?.travelCostHT || 0;
  }

  getTotalHT(data: Partial<QuoteData>): number {
    const materialsHT = this.getTotalMaterialsHT(data.materials || []);
    const servicesHT = this.getTotalServicesHT(data.services || []);
    const travelHT = this.getTotalTravelCostHT(data.logistics || { travelCostHT: 0, suppliers: [], wasteManagement: {hasWaste: false, cerfaSigned: false} });
    return materialsHT + servicesHT + travelHT;
  }

  getTotalMaterialsTTC(materials: QuoteData['materials'], legal: QuoteData['legal']): number {
    if (!materials) return 0;
    const isExempt = !!legal?.applyTvaExemption;

    return materials.reduce((acc, curr) => {
      // Si fourni par le client, pas facturé.
      return acc + this.calculateItemTTC(curr.providedByClient ? 0 : curr.amountHT, curr.tva, isExempt);
    }, 0);
  }

  getTotalServicesTTC(services: QuoteData['services'], legal: QuoteData['legal']): number {
    if (!services) return 0;
    const isExempt = !!legal?.applyTvaExemption;

    return services.reduce((acc, curr) => {
      return acc + this.calculateItemTTC(curr.amountHT, curr.tva, isExempt);
    }, 0);
  }

  getTravelCostTTC(logistics: QuoteData['logistics'], legal: QuoteData['legal']): number {
    const isExempt = !!legal?.applyTvaExemption;
    return this.calculateItemTTC(this.getTotalTravelCostHT(logistics), 20, isExempt);
  }

  getGrandTotalTTC(data: Partial<QuoteData>): number {
    const servicesTTC = this.getTotalServicesTTC(data.services || [], data.legal || { applyTvaExemption: false });
    const materialsTTC = this.getTotalMaterialsTTC(data.materials || [], data.legal || { applyTvaExemption: false });
    const travelTTC = this.getTravelCostTTC(data.logistics || { travelCostHT: 0, suppliers: [], wasteManagement: {hasWaste: false, cerfaSigned: false} }, data.legal || { applyTvaExemption: false });

    return servicesTTC + materialsTTC + travelTTC;
  }
}
