import axios, { AxiosRequestConfig } from 'axios';
import { config } from '../../config';

interface RequestConfig {
  method: string;
  pathTemplate: string;
}

const RequestConfigList: Record<string, RequestConfig> = {
  auth: {
    method: 'get',
    pathTemplate: '/api/auth',
  },
  login: {
    method: 'post',
    pathTemplate: '/api/auth/login',
  },
  storeBalance: {
    method: 'get',
    pathTemplate: '/api/lite-stock/store-balance',
  },
  menu: {
    method: 'get',
    pathTemplate: '/api/external-menu/3341',
  },
  menuItem: {
    method: 'get',
    pathTemplate: '/api/external-menu/item/{id}',
  },
};

class IikoWebApi {
  private sessionCookie: string | null = null;
  private loginName: string;
  private password: string;
  private host: string;

  constructor() {
    this.sessionCookie = null;
    this.loginName = config.iiko.apiLogin || '';
    this.password = config.iiko.password || '';
    this.host = 'ip-bagdasaryan.iikoweb.ru';
  }

  private createRequest = async (
    request: {
      name: string;
      urlParams?: Record<string, string>;
    },
    params?: Record<string, unknown>,
    data?: Record<string, unknown>,
    options?: AxiosRequestConfig
  ) => {
    let url = `https://${this.host}:${RequestConfigList[request.name].pathTemplate}`;

    if (request.urlParams) {
      Object.entries(request.urlParams).forEach(([key, value]) => {
        url = url.replace(`{${key}}`, value);
      });
    }

    const config: AxiosRequestConfig = {
      method: RequestConfigList[request.name].method as import('axios').Method,
      url,
      params,
      data,
      withCredentials: true,
      ...options,
    };

    if (this.sessionCookie) {
      config.headers = {
        cookie: this.sessionCookie,
      };
    }

    return axios(config)
      .then((response) => {
        if (response.status === 200) {
          if (response.headers['set-cookie']) {
            this.sessionCookie = response.headers['set-cookie'][0];
          }

          return response.data;
        }
      })
      .catch((error) => console.log(error));
  };

  login = async () =>
    this.createRequest(
      { name: 'login' },
      {},
      { login: this.loginName, password: this.password }
    )
      .then((response) => response)
      .catch((error) => console.log(error));

  isAuthorized = async () =>
    this.createRequest({ name: 'auth' })
      .then((response) => {
        if (response) {
          return response.authorized;
        }
      })
      .catch((error) => console.log(error));

  getMenu = async () => {
    const authorized = await this.isAuthorized();

    if (!authorized) {
      await this.login();
    }

    return await this.createRequest({ name: 'menu' }).then((response) => {
      return response?.data?.itemCategories;
    });
  };

  getMenuItem = async (id: string) => {
    const authorized = await this.isAuthorized();

    if (!authorized) {
      await this.login();
    }

    return await this.createRequest({
      name: 'menuItem',
      urlParams: { id },
    }).then((response) => response?.data);
  };
}

export default new IikoWebApi();
