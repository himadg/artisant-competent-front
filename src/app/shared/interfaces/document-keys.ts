export interface DiplomaDoc {
  key: string;
  documentName: string;
  expiryDate: string;
}

export interface DocumentKeys {
  photoKey: string;
  idFrontKey: string;
  idBackKey: string;
  diplomas: DiplomaDoc[];
  companyLogoKey: string;
  ribKey: string;
}
