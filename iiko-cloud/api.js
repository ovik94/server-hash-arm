const axios = require('axios');

const RequestConfigList = {
  accessToken: {
    method: 'post',
    pathTemplate: '/api/1/access_token'
  },
};

class iikoCloudApi {
  constructor() {
    this.apiLogin = process.env.IIKO_API_LOGIN;
    this.host = 'api-ru.iiko.services';
  }

  createRequest = async (token, name, data, params, options) => {
    const url = `https://${this.host}:${RequestConfigList[name].pathTemplate}`;

    const config = {
      method: RequestConfigList[name].method,
      url,
      params,
      data,
      withCredentials: true,
      ...options
    };

    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`
      };
    }

    return axios(config)
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }
      })
      .catch((error) => console.log(error));
  }

  getAccessToken = async (token) => this.createRequest(token,'accessToken', { apiLogin: this.apiLogin } )
    .then(response => response)
    .catch(error => console.log(error));
}

module.exports = new iikoCloudApi();
