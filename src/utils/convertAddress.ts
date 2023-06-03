import axios from 'axios';
function extrairCEP(endereco: string) {
  const cepRegex = /\b\d{5}-?\d{3}\b/;
  const match = endereco.match(cepRegex);
  if (match) {
    return match[0];
  } else {
    return null;
  }
}
export const convertAddressLatLgn = async (address: string, postalCode: string) => {
  const response = await axios.get(`https://nominatim.openstreetmap.org/search.php?q=${address}&format=jsonv2`);

  console.log(response);
  return response;
};
