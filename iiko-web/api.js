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
  },
  menu: {
    method: 'get',
    pathTemplate: '/api/external-menu/3341'
  },
  menuItem: {
    method: 'get',
    pathTemplate: '/api/external-menu/item/{id}'
  }
};

class iikoWebApi {
  constructor() {
    this.sessionCookie = null;
    this.loginName = process.env.IIKO_LOGIN;
    this.password = process.env.IIKO_PASS;
    this.host = 'ip-bagdasaryan.iikoweb.ru';
  }

  createRequest = async (request, params, data, options) => {
    let url = `https://${this.host}:${RequestConfigList[request.name].pathTemplate}`;

    if (request.urlParams) {
      Object.entries(request.urlParams).forEach(([key, value]) => {
        url = url.replace(`{${key}}`, value);
      });
    }

    const config = {
      method: RequestConfigList[request.name].method,
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

  login = async () => this.createRequest({ name: 'login' }, {}, { login: this.loginName, password: this.password })
    .then(response => response)
    .catch(error => console.log(error));

  isAuthorized = async () => this.createRequest({ name: 'auth' })
    .then(response => {
      if (response) {
        return response.authorized;
      }
    })
    .catch(error => console.log(error));

  getBarBalance = async () => {
    const isAuthorized = await this.isAuthorized();

    if (!isAuthorized) {
      await this.login();
    }

    return await this.createRequest({ name: 'storeBalance' })
      .then((response) => response.data[1].balanceItems);
  };

  getMenu = async () => {
    const isAuthorized = await this.isAuthorized();

    if (!isAuthorized) {
      await this.login();
    }

    return await this.createRequest({ name: 'menu'} )
      .then((response) => {
        return response.data.itemCategories
      });
  }

  getMenuItem = async (id) => {
    const isAuthorized = await this.isAuthorized();

    if (!isAuthorized) {
      await this.login();
    }

    return await this.createRequest({ name: 'menuItem', urlParams: { id } } )
      .then((response) => response.data);
  }
}

module.exports = new iikoWebApi();
