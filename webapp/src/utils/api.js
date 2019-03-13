import axios from 'axios';

class Api {
  // Todas las llamadas pasan por aquí
  static xhr = async function(route, params, verb) {
    const host = `${process.env.TRACK_APP_BASE_URL}/api`;
    const url = `${host}${route}`;
    const options = {
      url: url,
      method: verb,
      data: params
    };
    return axios(options);
  };

  static get(route) {
    return this.xhr(route, null, 'GET');
  }

  static post(route, params) {
    return this.xhr(route, params, 'POST');
  }

  static put(route, params) {
    return this.xhr(route, params, 'PUT');
  }

  static delete(route, params) {
    return this.xhr(route, params, 'DELETE');
  }
}

export default Api;
