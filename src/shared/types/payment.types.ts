export interface PaymentMethod {
  id: number;
  cardType: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  isArchived: boolean;
}
