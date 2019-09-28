export interface Lead {
  accessusers: string;
  contact: string;
  probability: number;
  priority: string;
}

export class LeadItem {

  cat: string;
  productname: string;
  qty: number;
  price: number;
  commissionpercent: number;
  commission: number;
  discountpercent: number;
  discount: number;
  taxpercent: number;
  // tax: number;
  amount: number

}