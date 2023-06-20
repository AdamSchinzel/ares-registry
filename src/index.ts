import axios from 'axios';
import { transform } from 'camaro';

const ARES_API = 'http://wwwinfo.mfcr.cz/cgi-bin/ares/darv_bas.cgi?ico=';

const ARES_OBJ = {
  resultsCount: '/are:Ares_odpovedi/are:Odpoved/D:PZA',
  companyName: '/are:Ares_odpovedi/are:Odpoved/D:VBAS/D:OF',
  addressStreet: '/are:Ares_odpovedi/are:Odpoved/D:VBAS/D:AA/D:NU',
  addressNumberOrientation: '/are:Ares_odpovedi/are:Odpoved/D:VBAS/D:AA/D:CO',
  addressNumberHouse: '/are:Ares_odpovedi/are:Odpoved/D:VBAS/D:AA/D:CD',
  addressCity: '/are:Ares_odpovedi/are:Odpoved/D:VBAS/D:AA/D:N',
  addressPostcode: '/are:Ares_odpovedi/are:Odpoved/D:VBAS/D:AA/D:PSC',
  flags: '/are:Ares_odpovedi/are:Odpoved/D:VBAS/D:PSU',
  dic: '/are:Ares_odpovedi/are:Odpoved/D:VBAS/D:DIC',
};

interface AresResponse {
  resultsCount: string;
  companyName: string;
  addressStreet: string;
  addressNumberOrientation: string;
  addressNumberHouse: string;
  addressCity: string;
  addressPostcode: string;
  flags: string;
  dic: string;
}

interface AresResult {
  addressStreet: string;
  isVatPayer: boolean;
  companyName: string;
  addressCity: string;
  addressPostcode: string;
  dic: string;
}

const validateIco = (ico: string): boolean => {
  if (!ico.match(/^\d{8}$/)) {
    return false;
  }
  let a = 0;
  for (let i = 0; i < 7; i++) {
    a += Number(ico[i]) * (8 - i);
  }
  a = a % 11;
  let c: number;
  if (a === 0) {
    c = 1;
  } else if (a === 1) {
    c = 0;
  } else {
    c = 11 - a;
  }
  return Number(ico[7]) === c;
};

const getCompanyData = async (ico: string): Promise<AresResult | undefined> => {
  if (!ico || !validateIco(ico)) {
    console.error('ICO is not valid');
    return;
  }

  try {
    const aresResponse = await axios.get(ARES_API + ico);

    if (aresResponse.status !== 200) {
      console.error('ARES API returned status code ' + aresResponse.status);
      return;
    }

    const aresData = (await transform(aresResponse.data, ARES_OBJ)) as AresResponse;

    if (!aresData.resultsCount || aresData.resultsCount !== '1') {
      console.error('Not found');
      return;
    }

    const {
      addressNumberOrientation,
      addressNumberHouse,
      addressStreet,
      flags,
      ...rest
    } = aresData;

    return {
      addressStreet: `${addressStreet} ${addressNumberHouse}${
        addressNumberHouse && addressNumberOrientation ? '/' : ''
      }${addressNumberOrientation}`.trim(),
      isVatPayer: flags[5] == 'A',
      ...rest,
    };
  } catch (err) {
    console.error(err);
  }
};

export default getCompanyData;
