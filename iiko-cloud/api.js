const axios = require('axios');
const { response } = require("express");
const groupBy = require("lodash/groupBy");

const RequestConfigList = {
  accessToken: {
    method: 'post',
    pathTemplate: '/api/1/access_token'
  },
  deliveries: {
    method: 'post',
    pathTemplate: '/api/1/deliveries/by_delivery_date_and_status'
  },
};

const YandexPaymentTypeId = '2c7f0ed3-ba6e-4c79-87ce-c000f0ffd127';
const OrderTypesMap = {
  'courier': '76067ea3-356f-eb93-9d14-1fa00d082c4e',
  'pickup': '5b1508f9-fe5b-d6af-cb8d-043af587d5c2'
}

const MarketingSourceMap = {
  '85d37f70-bd17-4c6b-a8d1-d7e1ad2448ef': 'android',
  'a18845e2-caa1-4432-b9df-be64e6617814': 'site',
  '18b16c38-7141-44e9-b827-8ef0a9acc0ef': 'ios'
}

class iikoCloudApi {
  constructor() {
    this.apiLogin = process.env.IIKO_API_LOGIN;
    this.host = 'api-ru.iiko.services';
    this.organizationIds = 'dd2e6895-5b76-44fd-ac21-5a5f8ecf5f9d';
    this.instance = axios.create();

    this.addInterceptor();
  }

  createRequest = async (name, data, params, options) => {
    const url = `https://${this.host}:${RequestConfigList[name].pathTemplate}`;

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
        return this.createRequest('accessToken', { apiLogin: this.apiLogin })
          .then((response) => {
            error.config.headers = { ...error.config.headers, Authorization: `Bearer ${response.token}`}
            error.config.__isRetryRequest = true;
            return this.instance(error.config);
          });
      }
      return Promise.reject(error);
    });
  };

  getDeliveries = async (date) => this.createRequest('deliveries', {
    organizationIds: [this.organizationIds],
    deliveryDateFrom: date,
    statuses: ["Closed", "CookingCompleted"]
  })
    .then(response => {
      if (!response.ordersByOrganizations.length) {
        return {}
      }

      const data = response.ordersByOrganizations[0].orders.map(item => {
        const { order } = item;
        const orderType = order.orderType;
        const paymentType = order.payments ? order.payments[0].paymentType : null;
        const marketingSource = order.marketingSource;
        let source;

        if (paymentType && paymentType.id === YandexPaymentTypeId && !marketingSource) {
          source = { id: 'yandex', name: orderType.name };
        }

        if (orderType.id === OrderTypesMap.courier && !marketingSource) {
          source = { id: 'regularDelivery', name: orderType.name }
        }

        if (orderType.id === OrderTypesMap.pickup && !marketingSource) {
          source = { id: 'regularPickup', name: orderType.name }
        }

        if (orderType.id === OrderTypesMap.courier && marketingSource) {
          source = {
            id: MarketingSourceMap[marketingSource.id]  ? MarketingSourceMap[marketingSource.id] : 'sourceDelivery',
            name: `${orderType.name} из ${marketingSource.name}`
          }
        }

        if (orderType.id === OrderTypesMap.pickup && marketingSource) {
          source = {
            id: MarketingSourceMap[marketingSource.id]  ? MarketingSourceMap[marketingSource.id] : 'sourcePickup',
            name: `${orderType.name} из ${marketingSource.name}`
          };
        }

        return {
          id: item.id,
          source,
          sum: item.order.sum
        }
      });

      return groupBy(data, (value) => value.source.id);
    })
    .catch(error => console.log(error));
}

module.exports = new iikoCloudApi();
