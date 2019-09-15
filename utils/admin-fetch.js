import { ADMIN_API, FETCH_CONFIG } from './const';
import { fetch, fetchWithToken, uploadFile } from './util';

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
export const getUserInfo = (prams = {}) => {
  return fetchWithToken(
    ADMIN_API.GET_USER_INFO,
    prams,
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
export const changePassword = (params = {}) => {
  return fetchWithToken(
    ADMIN_API.CHANGE_PASSWORD,
    params,
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

/**
 * 获取收入记录
 */
export const fetchImcomeRecords = (params) => {
  return fetchWithToken(
    ADMIN_API.GET_INCOME_RECORDS,
    params,
    true
  )
    // 对接真实接口删掉下面的catch
    .catch(() => {
      return {
        success: true,
        result: [{
          id: '1',
          title: '网点1  SN：123',
          time: '2019-07-03 15:32:33',
          balance: 233.32,
          payments: '+9.9'
        }, {
          id: '2',
          title: '提现',
          time: '2019-07-03 15:32:33',
          balance: 233.32,
          payments: '-200'
        }, {
          id: '3',
          title: '提现',
          time: '2019-07-03 15:32:33',
          balance: 233.32,
          payments: '-200'
        }]
      };
    })
}

/**
 * 提现
 */
export const toGetCash = (params) => {
  return fetchWithToken(
    ADMIN_API.TO_GET_CASH,
    params,
    { method: 'POST' },
    true
  )
    // 对接真实接口删掉下面的catch
    .catch(() => {
      // return {
      //   success: true,
      //   result: {
      //     success: true, // 提现成功 true | 失败 false
      //     msg: '提现成功'
      //   }
      // };

      return {
        success: true, // 接口调用成功
        result: {
          success: false, // 提现成功 true | 失败 false
          msg: '账户余额不足'
        }
      };
    })
}

/**
 * 获取代理商数据
 */
export const getAgent = (params) => {
  return fetchWithToken(
    ADMIN_API.GET_AGENT,
    params,
    true
  )
    // 对接真实接口删掉下面的catch
    .catch(() => {
      return {
        success: true, // 接口调用成功
        result: [{
          id: '1',
          acount: 'Tooo1',
          name: '名称1',
          phone: '13345678912'
        }, {
          id: '2',
          acount: 'Tooo2',
          name: '名称2',
          phone: '13345678912'
        }]
      };
    })
}

/**
 * 新增代理商
 */
export const toAddAgent = (params) => {
  return fetchWithToken(
    ADMIN_API.ADD_AGENT,
    params,
    { method: 'POST' },
    true
  )
    // 对接真实接口删掉下面的catch
    .catch(() => {
      return {
        success: true,
        result: {
          success: true, // 新增成功 true | 失败 false
          msg: '新增成功'
        }
      };
    })
}

/**
 * 获取店铺数据
 */
export const getShop = (params) => {
  return fetchWithToken(
    ADMIN_API.GET_SHOP,
    params,
    true
  )
    // 对接真实接口删掉下面的catch
    .catch(() => {
      return {
        success: true, // 接口调用成功
        result: [{
          id: '1',
          name: '店铺名称1',
          deviceCount: 3
        }, {
          id: '2',
          name: '店铺名称2',
          deviceCount: 4
        }]
      };
    })
}

/**
 * 获取单个店铺信息
 */
export const getShopInfo = (params) => {
  return fetchWithToken(
    ADMIN_API.GET_SHOP_INFO,
    params,
    true
  )
    // 对接真实接口删掉下面的catch
    .catch(() => {
      return {
        success: true, // 接口调用成功
        result: {
          name: '店铺名称1',
          deviceCount: 2,
          deviceNum: 'test001',
          position: '店铺地址呢',
          longitude: '22.33333',
          latitude: '110.6461651',
          contact: '共享',
          phone: '12345678901',
          pic: [],
          devices: [{
            id: '1',
            deviceNum: 'Toooo1',
            SNCode: '161658135213'
          }, {
            id: '2',
            deviceNum: 'Toooo2',
            SNCode: '15236263'
          }]
        }
      };
    })
}

/**
 * 新增设备
 */
export const toAddDevice = (params) => {
  return fetchWithToken(
    ADMIN_API.ADD_DEVICE,
    params,
    { method: 'POST' },
    true
  )
    // 对接真实接口删掉下面的catch
    .catch(() => {
      return {
        success: true,
        result: {
          success: true, // 新增成功 true | 失败 false
          msg: '新增成功'
        }
      };
    })
}

/**
 * 新增和修改店铺
 */
export const saveShop = (params) => {
  return fetchWithToken(
    ADMIN_API.SAVE_SHOP,
    params,
    { method: 'POST' },
    true
  )
    // 对接真实接口删掉下面的catch
    .catch(() => {
      return {
        success: true,
        result: {
          success: true, // 新增成功 true | 失败 false
          msg: '新增店铺成功'
        }
      };
    })
}

/**
 * 上传店铺照片
 */
export const uploadPic = (paths) => {
  const uploadPicPromises = paths.map(path => uploadFile(
    ADMIN_API.UPLOAD_PIC,
    path
  ));
  return Promise.all(uploadPicPromises)
    .then(res => {
      return res.map(itemRes => itemRes.data);
    })
    // 对接真实接口删掉下面的catch
    .catch(() => {
      return paths.map((path, index) => `${index}.png`)
    })
}

/**
 * 删除店铺
 */
export const delShop = (params) => {
  return fetchWithToken(
    ADMIN_API.DEL_SHOP,
    params,
    { method: 'POST' },
    true
  )
    // 对接真实接口删掉下面的catch
    .catch(() => {
      return {
        success: true,
        result: {
          // success: true, // 新增成功 true | 失败 false
          // msg: '删除成功'
          success: false,
          msg: '删除失败'
        }
      };
    })
}
