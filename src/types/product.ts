export type ProductType = 'item' | 'quantity' | 'calibration';

export interface ProductFormValues {
  id: string | null;
  name: string;
  type: ProductType;
  description: string | null;
  warranty: string | null;
  categoryId: string | null;
  supplierId?: string | null;
  quantity?: number | null;
  serialNumber: string | null;
  costPrice: number | null;
  entryDate: string;
  supplierName?: string;

}

// Payload sent to backend - kept flexible to match API expectations
export interface ProductPayload {
  name: string;
  categoryId: string;
  supplierId?: string | null;
  type:
    | 'ITEM'
    | 'QUANTITY'
    | 'item'
    | 'quantity'
    | 'CALIBRATION'
    | 'calibration';
  serialNumber?: string | null;
  warranty?: string | null;
  description?: string | null;
  costPrice?: number | null;
  quantity?: number | null;
  entryDate: string;
}
