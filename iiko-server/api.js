const axios = require('axios');

const RequestConfigList = {
  auth: {
    method: 'get',
    pathTemplate: '/resto/api/auth'
  },
  getOlapReport: {
    method: 'post',
    pathTemplate: '/resto/api/v2/reports/olap'
  },
};

class iikoServerApi {
  constructor() {
    this.login = process.env.IIKO_SERVER_LOGIN;
    this.pass = process.env.IIKO_SERVER_PASS;
    this.host = 'ip-bagdasaryan.iiko.it:443';
    this.instance = axios.create();
    this.addInterceptor();
  }

  createRequest = async (name, data, params, options) => {
    const url = `https://${this.host}${RequestConfigList[name].pathTemplate}`;

    const config = {
      method: RequestConfigList[name].method,
      url,
      params,
      data,
      withCredentials: true,
      ...options
    };

    return this.instance.request(config)
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }
      })
      .catch((error) => console.log(error));
  }

  addInterceptor = () => {
    this.instance.interceptors.response.use(response => response, (err) => {
      const error = err.response;

      if (error.status === 401 && !error.config.__isRetryRequest) {
        return this.createRequest('auth', undefined, { login: this.login, pass: this.pass })
          .then((response) => {
            error.config.headers = { ...error.config.headers, Cookie: `key=${response}` }
            error.config.__isRetryRequest = true;
            return this.instance(error.config);
          });
      }
      return Promise.reject(error);
    });
  };


  getOlapReport = async (data) => this.createRequest('getOlapReport', data)
    .then(response => response.data)
    .catch(error => console.log(error));


  getDeliverySales = async (dateFrom, dateTo) => this.getOlapReport({
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
        to: dateTo
      }
    }
  })
    .then(response => response)
    .catch(error => console.log(error));

  getLunchSales = async (dateFrom, dateTo) => this.getOlapReport({
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
        to: dateTo
      },
      DishCategory: {
        filterType: "IncludeValues",
        values: ["Бизнес-ланч"]
      }
    }
  })
    .then(response => response)
    .catch(error => console.log(error));
}

module.exports = new iikoServerApi();
