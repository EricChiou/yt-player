export default {
  set: (name, value, expireDays = 0) => {
    let expires = '';
    if (expireDays) {
      const date = new Date();
      date.setTime(date.getTime() + expireDays * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }

    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}${expires}; path=/;`;
  },
  get: (name) => {
    const cookieAll = document.cookie.split('; ');
    const cookieName = encodeURIComponent(name) + '=';
    for (const cookie of cookieAll) {
      if (cookie.indexOf(cookieName) === 0) {
        return decodeURIComponent(cookie.substring(cookieName.length));
      }
    }
    return null;
  },
  delete: (name) => {
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;`;
  }
};
