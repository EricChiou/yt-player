import axios from 'axios';

export const getIP = () => {
  return axios.get('http://ip-api.com/json/');
};
