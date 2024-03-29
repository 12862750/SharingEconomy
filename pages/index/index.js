//index.js
import { getQueryString,getLocationMarker, getDotMarker } from './utils';
import { fetchDotListByLocation, fetchDotListByWords } from '../../utils/fetch';
//获取应用实例
const app = getApp();
let authSetting = {}

Page({
  data: {
    isSearching: false,
    isFocus: false,
    isIPX: app.globalData.isIPX,
    userInfo: null,
    keyWord: '',
    markers: [],
    searchList: [],
    latitude: 23.099994,
    longitude: 113.324520,
    curDot: {}
  },
  onLoad: function () {
    this.mapContext = wx.createMapContext('map');
    // 获取用户位置权限
    this.getLocationPremission()
      .then(() => {
        // 获取用户位置
        return this.getLocation();
      })
      .then(({ latitude, longitude }) => {
        // 记录用户当前的位置
        this.userLocation = {
          latitude,
          longitude,
        };

        // 根据经纬度获取附近网点
        return fetchDotListByLocation(latitude, longitude);
      })
      .then(({ result }) => {
        // 设置附近网点、当前位置、地图中心
        const { latitude, longitude } = this.userLocation;
        
        const markers = [
          getLocationMarker(latitude, longitude),
          ...result.map((item, index) => {
            const lati = item.longitude
            const longi = item.latitude
            return getDotMarker(lati, longi, index + 1, item);
          }),
        ];

        this.setData({
          markers,
          latitude,
          longitude,
        });
      })
  },
  onShow() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    } else {
      app.userInfoReadyCallback = (res) => {
        this.setData({
          userInfo: res.userInfo,
        })
      }
    }
  },
  getLocationPremission() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: (res) => {
          if (!res.authSetting['scope.userLocation']) {
            wx.authorize({
              scope: 'scope.userLocation',
              success: () => {
                resolve();
              },
              fail: () => {
                this.toSetting(resolve);
              }
            })
          } else {
            resolve();
          }
        },
        fail: () => {
          reject();
        }
      })
    })
  },
  toSetting(preResolve) {
    return new Promise((resolve, reject) => {
      wx.showModal({
        content: '您未对地理位置进行授权，无法获取附近网点，点击确定去设置',
        success: () => {
          wx.openSetting({
            success: (res) => {
              if (res.authSetting['scope.userLocation']) {
                preResolve();
              } else {
                reject(preResolve);
              }
            }
          })
        }
      })
    })
  },
  getLocation() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          resolve(res);
        },
        fail: (err) => {
          reject(err);
        }
      })
    })
  },
  onScanTap() {
    if (!authSetting[''])
      var that = this;
      wx.scanCode({
       success: (res) => {
        const path = res.result
        var deviceName = '0'
        if (path.length > 20) {
          let q = decodeURIComponent(path)
          deviceName = getQueryString(q, 'id')
        }

        if (deviceName === '0' || deviceName === 'undefined' || deviceName === null) {
          deviceName = path
        }

        //检查设备状态
        wx.navigateTo({
          url: '/pages/pay/pay?id=' + deviceName
        })

      },
      fail: (res) => {
        wx.showToast({
          title: '扫描失败',
          icon: 'success',
          duration: 2000
        })
      },
      complete: (res) => {
      }
    })
  },
  onLocalTap() {
    this.getLocation()
      .then(({ latitude, longitude }) => {
        fetchDotListByLocation(latitude, longitude)
          .then(({ result }) => {
            const markers = [
              getLocationMarker(latitude, longitude),
              ...result.map((item, index) => {
                const lati = item.longitude
                const longi = item.latitude
                return getDotMarker(lati, longi, index + 1, item);
              }),
            ];

            this.setData({
              markers,
              latitude,
              longitude,
            });
          })
      })
  },
  onMapTap() {
    this.setData({
      isFocus: false,
      keyWord: '',
      searchList: [],
      isSearching: false,
    });
  },
  onMarkerTap({ markerId }) {
    if (markerId === 0) {
      return;
    }
    const curDot = this.data.markers[markerId];
    this.setData({
      isFocus: true,
      isSearching: false,
      keyWord: '',
      searchList: [],
      curDot: {
        ...curDot.data,
        phone: '13245678944',
      },
      markers: this.data.markers.map((item, index) => {
        if (index === 0) {
          return item;
        } else if (index === markerId) {
          return {
            ...item,
            zIndex: 10,
            width: '68rpx',
            height: '76rpx',
          }
        } else {
          return {
            ...item,
            zIndex: 0,
            width: '51rpx',
            height: '57rpx',
          }
        }
      })
    });
  },
  onMapMove(e) {
    const { type, causedBy } = e;
    if (type === 'end' && causedBy === 'drag') {
      this.mapContext.getCenterLocation({
        success: ({ latitude, longitude }) => {
          fetchDotListByLocation(latitude, longitude)
            .then(({ result }) => {
              const locationMarker = this.data.markers[0];
              const markers = [
                locationMarker,
                ...result.map((item, index) => {
                  const lati = item.longitude
                  const longi = item.latitude
                  return getDotMarker(lati, longi, index + 1, item);
                }),
              ];

              this.setData({
                markers,
              });
            })
        }
      })
    }
  },
  onPhoneTap(e) {
    const { phone } = e.currentTarget.dataset;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  onSearch(e) {
    const { value: words } = e.detail;
    if (!words) {
      return;
    }
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.timer = setTimeout(() => {
      let queryRestaurantsParams = {
        searchText: words,
        startLatitude: this.data.latitude,
        startLongitude: this.data.longitude,
        endLatitude: this.data.latitude,
        endLongitude: this.data.longitude
      }
      fetchDotListByWords(queryRestaurantsParams)
        .then(res => {
          this.setData({
            keyWord: words,
            searchList: res.result
          })
        })
        .catch(err => {
          console.log(err);
          wx.showToast({
            title: '查询失败，请重试',
            icon: 'none',
          })
        })
      clearTimeout(this.timer);
      this.timer = null;
    }, 1000);
  },
  onSearchFocus() {
    this.setData({
      isSearching: true,
      isFocus: false,
    });
  },
  onSearchBlur() {
    if (!this.data.keyWord) {
      this.setData({
        isSearching: false,
      });
    }
  },
  goToPerson() {
    wx.navigateTo({
      url:'/pages/personal/personal'
    })
  },
  onSearchCardTap(e) {
    const { id, nav } = e.currentTarget.dataset;
    const { name, position: [longitude, latitude] } = this.data.searchList.find(item => item.id === id);

    fetchDotListByLocation(latitude, longitude)
      .then(({ result }) => {
        const locationMarker = this.data.markers[0];
        const markers = [
          locationMarker,
          ...result.map((item, index) => {
            const lati = item.longitude
            const longi = item.latitude
            const marker = getDotMarker(lati, longi, index + 1, item);
            if (name === item.name) {
              return {
                ...marker,
                zIndex: 10,
                width: '68rpx',
                height: '76rpx',
              }
            } else {
              return marker;
            }
          }),
        ];

        this.setData({
          markers,
          latitude,
          longitude,
        });
      });
  }
})
