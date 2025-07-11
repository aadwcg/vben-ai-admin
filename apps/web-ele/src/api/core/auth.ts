import type { GrantType } from '@vben/common-ui';

import { useAppConfig } from '@vben/hooks';

import { baseRequestClient, requestClient } from '#/api/request';

const { clientId, sseEnable } = useAppConfig(
  import.meta.env,
  import.meta.env.PROD,
);

export namespace AuthApi {
  /**
   * @description: 所有登录类型都需要用到的
   * @param clientId 客户端ID 这里为必填项 但是在loginApi内部处理了 所以为可选
   * @param grantType 授权/登录类型
   * @param tenantId 租户id
   */
  export interface BaseLoginParams {
    clientId?: string;
    grantType: GrantType;
    tenantId: string;
  }

  /**
   * @description: oauth登录需要用到的参数
   * @param socialCode 第三方参数
   * @param socialState 第三方参数
   * @param source 与后端的 justauth.type.xxx的回调地址的source对应
   */
  export interface OAuthLoginParams extends BaseLoginParams {
    socialCode: string;
    socialState: string;
    source: string;
  }

  /**
   * @description: 验证码登录需要用到的参数
   * @param code 验证码 可选(未开启验证码情况)
   * @param uuid 验证码ID 可选(未开启验证码情况)
   * @param username 用户名
   * @param password 密码
   */
  export interface SimpleLoginParams extends BaseLoginParams {
    code?: string;
    uuid?: string;
    username: string;
    password: string;
  }

  export type LoginParams = OAuthLoginParams | SimpleLoginParams;

  // /** 登录接口参数 */
  // export interface LoginParams {
  //   password?: string;
  //   username?: string;
  // }

  /** 登录接口返回值 */
  export interface LoginResult {
    access_token: string;
    client_id: string;
    expire_in: number;
  }
  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>(
    '/auth/login',
    { ...data, clientId },
    {
      encrypt: true,
    },
  );
}
/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>('/auth/refresh', {
    withCredentials: true,
  });
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return baseRequestClient.post('/auth/logout', {
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/auth/codes');
}

/**
 * 用户登出
 * @returns void
 */
export function doLogout() {
  return requestClient.post('/auth/logout');
}
/**
 * 关闭sse连接
 * @returns void
 */
export function seeConnectionClose() {
  /**
   * 未开启sse 不需要处理
   */
  if (!sseEnable) {
    return;
  }
  return requestClient.get('/resource/sse/close');
}
