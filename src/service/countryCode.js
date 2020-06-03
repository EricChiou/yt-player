// import axios from 'axios';
import { getIP } from '@/api/ip.js';

export const getCountryCode = () => {
  return new Promise((resolve, reject) => {
    getIP().then((resp) => {
      if (resp.status === 200) {
        const data = resp.data;
        if (data.status === 'success') {
          resolve(data.countryCode);
        } else {
          resolve('US');
        }
      } else {
        resolve('US');
      }
    }).catch(() => {
      resolve('US');
    });
  });
};
