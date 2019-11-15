import axios from 'axios';

const apiKey = 'AIzaSyDNtjkWngssbHZ8QUgfiSIHTMA6eqxjJcQ';

export const getTrendingVideo = (pageToken) => {
  const params = {
    part: 'snippet',
    chart: 'mostPopular',
    maxResults: 20,
    regionCode: 'TW',
    key: apiKey
  };
  if (pageToken) { params.pageToken = pageToken; }

  return axios.get('https://www.googleapis.com/youtube/v3/videos',
    {
      params: params,
      withCredentials: true
    }
  );
};

export const searchVideo = (keyword, pageToken) => {
  const params = {
    part: 'snippet',
    q: keyword,
    maxResults: 20,
    regionCode: 'TW',
    type: 'video',
    key: apiKey
  };
  if (pageToken) { params.pageToken = pageToken; }

  return axios.get('https://www.googleapis.com/youtube/v3/search',
    {
      params: params,
      withCredentials: true
    }
  );
};

export const getVideoById = (videoId) => {
  const params = {
    part: 'snippet',
    id: videoId,
    key: apiKey,
  };

  return axios.get('https://www.googleapis.com/youtube/v3/videos',
    {
      params: params,
      withCredentials: true
    }
  );
};
