import QueryString from 'qs';

export type AccommodationResponse = {
  idAccommodation: string;
  ref_stays: string;
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
export type AccommodationSearchAddressResponse = {
  id: number;
  name: string;
  town: string;
  area: string;
  address: string;
  street_number: string;
};

export type AccommodationFindAll = {
  limit: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined;
  query: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined;
  guest: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined;
  page: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined;
};
export interface AccommodationsResponse {
  data: AccommodationResponse[];
  currentPage: number;
  limit: number;
  cacheExists: boolean;
  total?: number;
}
export type AccommodationsAllFree = {
  query: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined;
  limit: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined;
  checkIn: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined;
  checkOut: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined;
  page: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined;
};
export type SearchAccommodationsParams = {
  query: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined;
  limit: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined;
};
export type DataParamsStay = {
  from: string;
  to: string;
  guests?: number;
  rooms?: number;
  cities?: string[];
  regions?: ['string'];
  countries?: ['string'];
  states?: ['string'];
  properties?: string[];
  amenities?: string[];
  inventory?: string[];
  listingId?: string;
  sort?: string;
  skip?: 0;
  limit?: 100;
};
