import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import {
    BASE_WP,
    HTTP_REQUEST_SUCCESS,
    HTTP_REQUEST_TIMEOUT,
} from "@shared-constants";

export const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await Axios({
            baseURL: BASE_WP,
            timeout: HTTP_REQUEST_TIMEOUT,
            ...config,
        });

        if (response.status === HTTP_REQUEST_SUCCESS) {
            return response.data;
        } else {
            throw new Error(`Request failed with status: ${response.status}`);
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("An unknown error occurred");
        }
    }
};

export const requestGetData = async ({
    url,
    params,
    config,
}: {
    url: string;
    params?: Record<string, unknown>;
    config?: AxiosRequestConfig;
}): Promise<unknown> => {
    return request({
        url,
        method: "GET",
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        params,
        ...config,
    });
};

export const requestPostData = async ({
    url,
    data,
    config,
}: {
    url: string;
    data?: Record<string, unknown>;
    config?: AxiosRequestConfig;
}): Promise<unknown> => {
    return request({
        url,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data,
        ...config,
    });
};
