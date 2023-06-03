export type LocationResponse = {
  id: number;
  created_at: Date;
  updated_at: Date;
  owner_id: null;
  code: number;
  status: string;
  accommodation: string;
  type: string;
  max_guest_capacity: number;
  rate: number;
  building: number;
  building_yogha: number;
  town: string;
  area: string;
  postal_code: string;
  street_type: string;
  address: string;
  street_number: string;
  floor: string;
  number: number;
  owner: string;
  owner_yogha: number;
  accomodation_registration_number: string;
  type_property: number;
  status_property: string;
  cadastral_reference: null;
  fee_contract: number;
  wifi_name: string;
  wifi_password: string;
  typeLock_id: number;
  status_limpeza: string;
  status_finance: string;
  name: string;
  payment: number;
  parking: string;
  parking_vagas: string;
  active: boolean;
};
export type LocationSearchAddressResponse = {
  id: number;
  name: string;
  town: string;
  area: string;
  address: string;
  street_number: string;
};