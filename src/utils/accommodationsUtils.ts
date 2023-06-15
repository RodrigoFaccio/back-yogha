import moment from 'moment';
import { AccommodationResponse } from '../models/locations';
import QueryString from 'qs';

export const formatReturnAccommodationNotCheckInCheckOut = (accommodations: any[], uniqueDay?: boolean) => {
  var currentDate = moment().format('YYYY-MM-DD');
  const newValue = accommodations.map((item) => {
    return {
      idAccommodation: item.idAccommodation,
      refStayId: item.refStayId,
      id: item.id,

      owner_id: item.owner_id,
      code: item.code,
      status: item.status,
      accommodation: item.accommodation,
      type: item.type,
      max_guest_capacity: item.max_guest_capacity,
      rate: item.rate,
      building: item.building,
      building_yogha: item.building_yogha,
      photo_gallery: item.photo_gallery,
      town: item.town,
      area: item.area,
      postal_code: item.postal_code,
      street_type: item.street_type,
      address: item.address,
      street_number: item.street_number,
      staircase: item.staircase,
      floor: item.floor,
      number: item.number,
      owner: item.owner,
      owner_yogha: item.owner_yogha,
      accomodation_registration_number: item.accomodation_registration_number,
      internal_notes: item.internal_notes,
      type_property: item.type_property,
      status_property: item.status_property,
      cadastral_reference: item.cadastral_reference,
      scp: item.scp,
      type_of_contract: item.type_of_contract,
      fee_contract: item.fee_contract,
      type_property_backup: item.type_property_backup,
      status_property_backup: item.status_property_backup,
      key_type: item.key_type,
      landmark: item.landmark,
      wifi_name: item.landmark,
      wifi_password: item.wifi_password,
      typeLock_id: item.typeLock_id,
      status_limpeza: item.status_limpeza,
      status_finance: item.status_finance,
      deleted_at: item.deleted_at,
      pool_id: item.pool_id,
      ref_stays: item.ref_stays,
      sub_type: item.sub_type,
      name_ad: item.name_ad,
      description: item.description,
      house_rules: item.house_rules,
      description_space: item.description_space,
      general_notes: item.general_notes,
      interaction_with_the_host: item.interaction_with_the_host,
      number_of_bedrooms: item.number_of_bedrooms,
      number_of_beds: item.number_of_beds,
      number_of_bathrooms: item.number_of_bathrooms,
      metreage: item.metreage,
      coin_id: item.coin_id,
      type_stays: item.type_stays,
      latitude: item.latitude,
      longitude: item.longitude,
      name: item.name,
      payment: item.payment,
      parking: item.parking,
      concierge_email: item.concierge_email,
      concierge_telefone: item.concierge_telefone,
      welcome_message: item.welcome_message,
      parking_vagas: item.parking_vagas,
      active: item.active,
      property_type: item.property_type,
      common_area: item.common_area,
      country_id: item.country_id,
      state_id: item.state_id,
      accommodation_id: item.accommodation_id,
      emphasys: item.emphasys,
      price_id: item.price_id,
      uniqueValue: Number(item[currentDate]),
      created_at: item.created_at,
      updated_at: item.updated_at
    };
  });

  return newValue;
};
export const formatReturnAccommodationCheckInCheckOut = (accommodations: any[]) => {
  var currentDate = moment().format('YYYY-MM-DD');
  const newValue = accommodations.map((item) => {
    return {
      idAccommodation: item.idAccommodation,
      refStayId: item.refStayId,
      id: item.id,

      owner_id: item.owner_id,
      code: item.code,
      status: item.status,
      accommodation: item.accommodation,
      type: item.type,
      max_guest_capacity: item.max_guest_capacity,
      rate: item.rate,
      building: item.building,
      building_yogha: item.building_yogha,
      photo_gallery: item.photo_gallery,
      town: item.town,
      area: item.area,
      postal_code: item.postal_code,
      street_type: item.street_type,
      address: item.address,
      street_number: item.street_number,
      staircase: item.staircase,
      floor: item.floor,
      number: item.number,
      owner: item.owner,
      owner_yogha: item.owner_yogha,
      accomodation_registration_number: item.accomodation_registration_number,
      internal_notes: item.internal_notes,
      type_property: item.type_property,
      status_property: item.status_property,
      cadastral_reference: item.cadastral_reference,
      scp: item.scp,
      type_of_contract: item.type_of_contract,
      fee_contract: item.fee_contract,
      type_property_backup: item.type_property_backup,
      status_property_backup: item.status_property_backup,
      key_type: item.key_type,
      landmark: item.landmark,
      wifi_name: item.landmark,
      wifi_password: item.wifi_password,
      typeLock_id: item.typeLock_id,
      status_limpeza: item.status_limpeza,
      status_finance: item.status_finance,
      deleted_at: item.deleted_at,
      pool_id: item.pool_id,
      ref_stays: item.ref_stays,
      sub_type: item.sub_type,
      name_ad: item.name_ad,
      description: item.description,
      house_rules: item.house_rules,
      description_space: item.description_space,
      general_notes: item.general_notes,
      interaction_with_the_host: item.interaction_with_the_host,
      number_of_bedrooms: item.number_of_bedrooms,
      number_of_beds: item.number_of_beds,
      number_of_bathrooms: item.number_of_bathrooms,
      metreage: item.metreage,
      coin_id: item.coin_id,
      type_stays: item.type_stays,
      latitude: item.latitude,
      longitude: item.longitude,
      name: item.name,
      payment: item.payment,
      parking: item.parking,
      concierge_email: item.concierge_email,
      concierge_telefone: item.concierge_telefone,
      welcome_message: item.welcome_message,
      parking_vagas: item.parking_vagas,
      active: item.active,
      property_type: item.property_type,
      common_area: item.common_area,
      country_id: item.country_id,
      state_id: item.state_id,
      accommodation_id: item.accommodation_id,
      emphasys: item.emphasys,
      price_id: item.price_id,
      uniqueValue: Number(item[currentDate]),
      created_at: item.created_at,
      updated_at: item.updated_at,
      sumValueByDaysAccommodation: item.sumValueByDaysAccommodation.toFixed(2),
      mediaByNight: item.mediaByNight.toFixed(2)
    };
  });

  return newValue;
};
export function getDatesBetween(startDate: any, endDate: any) {
  const dates = [];
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    dates.push(currentDate.toISOString().slice(0, 10));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
export const addValueByInterval = (
  checkIn: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined,
  checkOut: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined,
  accommodations: any[]
) => {
  const result: any = [];

  accommodations.forEach((accommodation) => {
    let sumValueByDaysAccommodation = 0;
    const datas = Object.keys(accommodation).filter((key) =>
      moment(key).isBetween(String(checkIn), String(checkOut), null, '[]')
    );

    datas.forEach((data) => {
      const valor = parseFloat(accommodation[data]);
      if (!isNaN(valor)) {
        sumValueByDaysAccommodation += valor;
      }
    });

    const numDias = moment(String(checkOut)).diff(String(checkIn), 'days') + 1;

    result.push({
      ...accommodation,
      sumValueByDaysAccommodation,
      mediaByNight: sumValueByDaysAccommodation / numDias
    });
  });

  return result;
};

export const sumValuesByInterval = (
  checkIn: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined,
  checkOut: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined,
  accommodations: any[]
) => {
  const result: any = [];

  accommodations.forEach((accommodation) => {
    let sumValueByDaysAccommodation = 0;
    const datas = Object.keys(accommodation).filter((key) =>
      moment(key).isBetween(String(checkIn), String(checkOut), null, '[]')
    );

    datas.forEach((data) => {
      const valor = parseFloat(accommodation[data]);
      if (!isNaN(valor)) {
        sumValueByDaysAccommodation += valor;
      }
    });

    const numDias = moment(String(checkOut)).diff(String(checkIn), 'days') + 1;

    result.push({
      ...accommodation,
      sumValueByDaysAccommodation,
      mediaByNight: sumValueByDaysAccommodation / numDias
    });
  });

  return result;
};
