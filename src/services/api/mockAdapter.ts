import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export const mockAdapter =
  <T>(data: T, status = 200, delay = 240) =>
  async (config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    await new Promise((resolve) => setTimeout(resolve, delay))

    return {
      data,
      status,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
    }
  }
