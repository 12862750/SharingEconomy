//index.js
import { getLocationMarker, getDotMarker } from './utils';
import { fetchDotListByLocation } from '../../utils/fetch';
//获取应用实例
const app = getApp();

Page({
  data: {
    isSearching: false,
    isFocus: false,
    isIPX: app.globalData.isIPX,
    markers: [],
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
      .then(({ pois }) => {
        // 设置附近网点、当前位置、地图中心
        const { latitude, longitude } = this.userLocation;
        const markers = [
          getLocationMarker(latitude, longitude),
          ...pois.map((item, index) => {
            const [longi, lati] = item.location.split(',');
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
  getLocationPremission() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: (res) => {
          if (!res.authSetting['scope.userLocation']) {
            wx.authorize({
              scope: 'scope.userLocation',
              success: () => {
                resolve();
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
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success(res) {
        console.log(res);
        wx.navigateTo({
          url:'/pages/apply/apply'
        })
      }
    })
  },
  onLocalTap() {
    this.getLocation()
      .then(({ latitude, longitude }) => {
        this.setData({
          latitude,
          longitude,
        })
      })
  },
  onMapTap() {
    this.setData({
      isFocus: false,
    });
  },
  onMarkerTap({ markerId }) {
    const curDot = this.data.markers[markerId];
    this.setData({
      isFocus: true,
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
            width: '68rpx',
            height: '76rpx',
          }
        } else {
          return {
            ...item,
            width: '51rpx',
            height: '57rpx',
          }
        }
      })
    });
  },
  onPhoneTap(e) {
    const { phone } = e.currentTarget.dataset;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  onSearchFocus() {
    this.setData({
      isSearching: true,
    });
  },
  onSearchBlur() {
    this.setData({
      isSearching: false,
    });
  },
  goToPerson() {
    // 暂时先不跳个人中心
    // wx.navigateTo({
    //   url:'/pages/personal/personal'
    // })
  }
})
