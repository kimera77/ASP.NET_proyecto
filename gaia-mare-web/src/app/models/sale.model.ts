export interface Sale {
  saleId: number;
  inventoryId: number;
  saleDate: string;
  finalPrice: number;
  paymentMethod?: string;
  discountApplied?: number;
  clientId?: number;
}

export interface SaleCreate {
  inventoryId: number;
  finalPrice: number;
  paymentMethod: string;
  discountApplied?: number;
  clientId?: number;
}
