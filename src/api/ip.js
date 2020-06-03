import axios from 'axios';

export const getIP = () => {
  return axios.get('https://ip.nf/me.json');
};
