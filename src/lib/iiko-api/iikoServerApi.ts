import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

interface RetryConfig extends AxiosRequestConfig {
  __isRetryRequest?: boolean;
}

interface RequestConfig {
  method: string;
  pathTemplate: string;
}

interface RequestOptions extends AxiosRequestConfig {
  name: string;
  urlParams?: Record<string, string>;
}

const RequestConfigList: Record<string, RequestConfig> = {
  auth: {
    method: 'get',
    pathTemplate: '/resto/api/auth'
  },
  getOlapReport: {
    method: 'post',
    pathTemplate: '/resto/api/v2/reports/olap'
  },
  getOlapPresets: {
    method: 'get',
    pathTemplate: '/resto/api/v2/reports/olap/presets'
  },
  getOlapCashPayments: {
    method: 'get',
    pathTemplate: '/resto/api/v2/reports/olap/byPresetId/5ec59645-62a9-421d-92ae-49c64d72ea57'
  }
};

class IikoServerApi {
  private login: string;
  private pass: string;
  private host: string;
  private instance: AxiosInstance;

  constructor() {
    this.login = process.env.IIKO_SERVER_LOGIN || '';
    this.pass = process.env.IIKO_SERVER_PASS || '';
    this.host = 'ip-bagdasaryan.iiko.it:443';
    this.instance = axios.create();
    this.addInterceptor();
  }

  private createRequest = async (name: string, data?: unknown, params?: Record<string, unknown>, options?: AxiosRequestConfig) => {
    const url = `https://${this.host}${RequestConfigList[name].pathTemplate}`;

    const config: AxiosRequestConfig = {
      method: RequestConfigList[name].method as import('axios').Method,
      url,
      params,
      data,
      withCredentials: true,
      ...options
    };

    return this.instance.request(config).then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    }).catch((error) => console.log(error));
  }

  private addInterceptor = () => {
    this.instance.interceptors.response.use(
      (response) => response,
      async (err: AxiosError) => {
        const error = err.response;

        if (error && error.status === 401 && error.config && !(error.config as RetryConfig).__isRetryRequest) {
          const response = await this.createRequest('auth', undefined, { login: this.login, pass: this.pass });
          const config = error.config as RetryConfig;
          if (config.headers) {
            config.headers = { ...config.headers, Cookie: `key=${response}` } as typeof config.headers;
          }
          config.__isRetryRequest = true;
          return this.instance(config);
        }
        return Promise.reject(error);
      }
    );
  };

  getOlapReport = async (data: Record<string, unknown>) => 
    this.createRequest('getOlapReport', data).then(response => response?.data).catch(error => console.log(error));

  getOlapPresets = async () => 
    this.createRequest('getOlapPresets').then(response => response).catch(error => console.log(error));

  getOlapCashPayments = async (dateFrom: string) => 
    this.createRequest('getOlapCashPayments', undefined, { dateFrom }).then(response => response?.data).catch(error => console.log(error));

  getDeliverySales = async (dateFrom: string, dateTo: string) => 
    this.getOlapReport({
      reportType: "SALES",
      buildSummary: true,
      groupByRowFields: [
        "Delivery.MarketingSource",
        "OpenDate.Typed",
        "Delivery.SourceKey",
        "Delivery.ServiceType"
      ],
      aggregateFields: [
        "DishDiscountSumInt",
        "UniqOrderId"
      ],
      filters: {
        "OpenDate.Typed": {
          filterType: "DateRange",
          periodType: "CUSTOM",
          from: dateFrom,
          to: dateTo,
          includeHigh: true
        }
      }
    }).then(response => response).catch(error => console.log(error));

  getLunchSales = async (dateFrom: string, dateTo: string) => 
    this.getOlapReport({
      reportType: "SALES",
      buildSummary: true,
      groupByRowFields: [
        "Mounth",
        "OpenDate.Typed",
        "DishCategory"
      ],
      aggregateFields: [
        "DishDiscountSumInt",
        "UniqOrderId"
      ],
      filters: {
        "OpenDate.Typed": {
          filterType: "DateRange",
          periodType: "CUSTOM",
          from: dateFrom,
          to: dateTo,
          includeHigh: true
        },
        DishCategory: {
          filterType: "IncludeValues",
          values: ["Бизнес-ланч"]
        }
      }
    }).then(response => response).catch(error => console.log(error));
}

export default new IikoServerApi();
