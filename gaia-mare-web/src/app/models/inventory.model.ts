export interface Inventory {
  inventoryId: number;
  productId: number;
  productName: string;
  sku: string;
  status: string;
  location?: string;
  arrivalDate: string;
}

export interface InventoryCreate {
  productId: number;
  quantity: number;
  status?: string;
  location?: string;
  arrivalDate?: string;
}
