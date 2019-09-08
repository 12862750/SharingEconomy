import { ADMIN_API, FETCH_CONFIG } from './const';
import { fetch, fetchWithToken } from './util';

/**
 * 商家端登录
 */
export const toLogin = (params) => {
  return fetch(
    ADMIN_API.LOGIN,
    params,
    { method: 'POST' }
  )
  // 对接真实接口删掉下面的catch
  .catch(err => {
    return {
      result: {
        token: '111',
        uid: 2
      }
    };
  })
}

/**
 * 获取验证码
 */
export const getCode = (phone) => {
  return fetch(
    ADMIN_API.GET_CODE,
    { phone },
    { method: 'POST' }
  )
}

/**
 * 重置密码
 */
export const resetPassword = (params) => {
  return fetch(
    ADMIN_API.RESET_PASSWORD,
    params,
    { method: 'POST' }
  )
    // 对接真实接口删掉下面的catch
    .catch(() => {
      return {
        result: {
          token: '111',
          uid: 2
        }
      };
    })
}

/**
 * 获取商家用户信息
 */
export const getUserInfo = () => {
  return fetchWithToken(
    ADMIN_API.GET_USER_INFO,
    true
  )
    // 对接真实接口删掉下面的catch
    .catch(() => {
      return {
        result: {
          total: 49228.2,
          today: 2349,
          curMonth: 32324,
        }
      };
    })
}

/**
 * 修改密码
 */
export const changePassword = (params) => {
  return fetchWithToken(
    ADMIN_API.CHANGE_PASSWORD,
    true
  )
    // 对接真实接口删掉下面的catch
    .catch(() => {
      return {
        success: true,
        msg: '修改成功'
      };

      // return Promise.reject({
      //   success: false,
      //   msg: '旧密码输入错误'
      // })
    })
}