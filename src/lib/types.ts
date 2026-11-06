export type User = { id: string; name: string; email: string };
export type Company = {
  id: string;
  name: string;
  logo_url: string | null;
  accent: string;
};
export type Method = { label: string; details: string };
export type PaymentLink = {
  id: string;
  title: string;
  description: string;
  category: string;
  amount: number;
  currency: string;
  methods: Method[];
  theme: string;
  hero_url: string | null;
  recipient_name?: string;
  recipient_email?: string;
  note: string;
  active: boolean;
  created_at: string;
  receipt_heading: string;
  receipt_footer: string;
  company?: Company;
};
export type Payment = {
  id: string;
  link_id: string;
  name: string;
  email: string;
  amount: number;
  currency: string;
  provider: string;
  transfer_reference: string;
  status: string;
  created_at: string;
};
export type Receipt = {
  id: string;
  company: string;
  logo_url: string | null;
  accent: string;
  title: string;
  heading: string;
  footer: string;
  theme: string;
  payer: string;
  email: string;
  amount: number;
  currency: string;
  method: string;
  reference: string;
  confirmed_at: string;
};
export const money = (amount: number, currency: string) =>
  new Intl.NumberFormat("en", { style: "currency", currency }).format(
    amount / 100,
  );
