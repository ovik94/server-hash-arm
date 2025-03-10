const axios = require("axios");

const RequestConfigList = {
  accessToken: {
    method: "post",
    pathTemplate: "/api/1/access_token",
  },
  reservesList: {
    method: "post",
    pathTemplate: "/api/1/reserve/restaurant_sections_workload",
  },
  reserveDataById: {
    method: "post",
    pathTemplate: "/api/1/reserve/status_by_id",
  },
  getExternalMenus: {
    method: "post",
    pathTemplate: "/api/2/menu",
  },
  getMenuById: {
    method: "post",
    pathTemplate: "/api/2/menu/by_id",
  },
};

class iikoCloudApi {
  constructor() {
    this.apiLogin = process.env.IIKO_API_LOGIN;
    this.host = "api-ru.iiko.services";
    this.organizationId = "dd2e6895-5b76-44fd-ac21-5a5f8ecf5f9d";
    this.restaurantSectionId = "69f18ace-efac-4318-87bf-0572a17c17fd";
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
      headers: { "Content-Type": "application/json" },
      ...options,
    };

    return this.instance
      .request(config)
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }
      })
      .catch((error) => console.log(error));
  };

  addInterceptor = () => {
    this.instance.interceptors.response.use(
      (response) => response,
      (err) => {
        const error = err.response;

        if (error.status === 401 && !error.config.__isRetryRequest) {
          return this.createRequest("accessToken", {
            apiLogin: this.apiLogin,
          }).then((response) => {
            error.config.headers = {
              ...error.config.headers,
              Authorization: `Bearer ${response.token}`,
            };
            error.config.__isRetryRequest = true;
            return this.instance(error.config);
          });
        }
        return Promise.reject(error);
      }
    );
  };

  getMenuList = async () =>
    this.createRequest("getExternalMenus").then(
      (response) => response.externalMenus
    );

  getMenuById = async (id) =>
    this.createRequest("getMenuById", {
      externalMenuId: id,
      organizationIds: [this.organizationId],
    }).then((response) => response);

  getReserveListIds = async (dateFrom, dateTo) =>
    this.createRequest("reservesList", {
      restaurantSectionIds: [this.restaurantSectionId],
      dateFrom: dateFrom,
      dateTo: dateTo,
    }).then((response) => response.reserves.map((item) => item.id));

  getCurrentPrepays = async (reserveIds) =>
    this.createRequest("reserveDataById", {
      organizationId: this.organizationId,
      reserveIds,
    }).then((response) => {
      return (response.reserves || [])
        .filter(
          (item) =>
            item.reserve.order &&
            item.reserve.order.payments &&
            item.reserve.order.payments.length &&
            item.reserve.order.payments[0].isPrepay
        )
        .map(({ reserve, timestamp }) => ({
          timestamp,
          guestsCount: reserve.order.guestsInfo.count,
          paymentType:
            reserve.order &&
            reserve.order.payments &&
            reserve.order?.payments[0]?.paymentType.name,
          sum: reserve.order?.payments[0]?.sum,
        }));
    });
}

module.exports = new iikoCloudApi();
