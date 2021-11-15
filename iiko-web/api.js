const axios = require('axios');

const RequestConfigList = {
  auth: {
    method: 'get',
    pathTemplate: '/api/auth'
  },
  login: {
    method: 'post',
    pathTemplate: '/api/auth/login'
  },
  storeBalance: {
    method: 'get',
    pathTemplate: '/api/lite-stock/store-balance'
  }
};

class iikoWebApi {
  constructor() {
    this.sessionCookie = null;
    this.loginName = process.env.IIKO_LOGIN;
    this.password = process.env.IIKO_PASS;
    this.host = 'ip-bagdasaryan.iikoweb.ru';
  }

  createRequest = async (name, params, data, options) => {
    const url = `https://${this.host}:${RequestConfigList[name].pathTemplate}`;

    const config = {
      method: RequestConfigList[name].method,
      url,
      params,
      data,
      withCredentials: true,
      ...options
    };

    if (this.sessionCookie) {
      config.headers = {
        cookie: this.sessionCookie
      };
    }

    return axios(config)
      .then((response) => {
        if (response.status === 200) {
          if (response.headers["set-cookie"]) {
            this.sessionCookie = response.headers["set-cookie"][0];
          }

          return response.data;
        }
      })
      .catch((error) => console.log(error));
  }

  login = async () => {
    if (this.sessionCookie) {
      return;
    }

    return this.createRequest('login', {},{ login: this.loginName, password: this.password })
      .catch(error => console.log(error));
  }

  getBarBalance = async () => {
    await this.login();

    if (this.sessionCookie) {
      return this.createRequest('storeBalance')
        .then((response) => response.data[1].balanceItems)
    }

    return null;
  };
}

module.exports = new iikoWebApi();