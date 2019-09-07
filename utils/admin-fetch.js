import { ADMIN_API, FETCH_CONFIG } from './const';
import { fetch, fetchWithToken } from './util';

/**
 * 根据wechatCode到后台登录
 * @params wechatCode
 * @return result: 包含token和uid的登录信息
 */
export const toLogin = (params) => {
  return fetch(
    ADMIN_API.LOGIN,
    params,
    { method: 'POST' }
  )
}