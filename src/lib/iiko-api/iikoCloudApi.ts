import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

interface RetryConfig extends AxiosRequestConfig {
  __isRetryRequest?: boolean;
}

interface RequestConfig {
  method: string;
  pathTemplate: string;
}

const RequestConfigList: Record<string, RequestConfig> = {
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

class IikoCloudApi {
  private apiLogin: string;
  private host: string;
  private organizationId: string;
  private restaurantSectionId: string;
  private instance: AxiosInstance;

  constructor() {
    this.apiLogin = process.env.IIKO_API_LOGIN || '';
    this.host = "api-ru.iiko.services";
    this.organizationId = "dd2e6895-5b76-44fd-ac21-5a5f8ecf5f9d";
    this.restaurantSectionId = "69f18ace-efac-4318-87bf-0572a17c17fd";
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

  private addInterceptor = () => {
    this.instance.interceptors.response.use(
      (response) => response,
      async (err: AxiosError) => {
        const error = err.response;

        if (error && error.status === 401 && error.config && !(error.config as RetryConfig).__isRetryRequest) {
          const response = await this.createRequest("accessToken", {
            apiLogin: this.apiLogin,
          });
          const config = error.config as RetryConfig;
          if (config.headers) {
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${response?.token}`,
            } as typeof config.headers;
          }
          config.__isRetryRequest = true;
          return this.instance(config);
        }
        return Promise.reject(error);
      }
    );
  };

  getMenuList = async () =>
    this.createRequest("getExternalMenus").then(
      (response) => response?.externalMenus
    );

  getMenuById = async (id: string) =>
    this.createRequest("getMenuById", {
      externalMenuId: id,
      organizationIds: [this.organizationId],
    }).then((response) => response);

  getReserveListIds = async (dateFrom: string, dateTo?: string) =>
    this.createRequest("reservesList", {
      restaurantSectionIds: [this.restaurantSectionId],
      dateFrom: dateFrom,
      dateTo: dateTo,
    }).then((response) => response?.reserves?.map((item: { id: string }) => item.id) || []);

  getCurrentPrepays = async (reserveIds: string[]) =>
    this.createRequest("reserveDataById", {
      organizationId: this.organizationId,
      reserveIds,
    }).then((response) => {
      return (response?.reserves || [])
        .filter(
          (item: { reserve: { order?: { guestsInfo?: { count: number }; payments?: Array<{ isPrepay: boolean; paymentType?: { name?: string }; sum?: number }> } } }) =>
            item.reserve?.order &&
            item.reserve?.order?.payments &&
            item.reserve?.order?.payments?.length &&
            item.reserve?.order?.payments[0]?.isPrepay
        )
        .map(({ reserve, timestamp }: { reserve: { order?: { guestsInfo?: { count: number }; payments?: Array<{ isPrepay: boolean; paymentType?: { name?: string }; sum?: number }> } }; timestamp: string }) => ({
          timestamp,
          guestsCount: reserve?.order?.guestsInfo?.count,
          paymentType:
            reserve?.order &&
            reserve?.order?.payments &&
            reserve?.order?.payments[0]?.paymentType?.name,
          sum: reserve?.order?.payments?.[0]?.sum || 0,
        }));
    });
}

export default new IikoCloudApi();
