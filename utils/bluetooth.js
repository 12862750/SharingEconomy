var ofs1;
var ecOI2;
var gOE3 = 0;
var YFZWNTj4 = 0;
var XKFsrQG5 = 100;
var jpvtIv6 = 0;
import pos from './bluetoothpos.js';
var lq_KEF7 = 'BT05';
var M8 = '4616';
var hFfIwp$ci9 = '';
var V10 = '';
var Os11 = '';
var hqMRz12 = '';//可写的特征值
var lPGjy13 = '';//可读的特征值
var dYUsKnVfW17 = false;
var gwIuedY18 = false;
var Ur19 = false;
var jNjOIIw20 = false;
var WFnpAhi21 = 0;
var $UvlvHLvp22 = -1;
var pvV23 = '';
var deviceMAC = '';
var Z24;
var XweU25;
module["exports"] = {
  GetCurLog: GetCurLog,
  GetResLast: GetResLast,
  OpenBluetooth: OpenBluetooth,
  CloseBluetooth: CloseBluetooth,
  GetAvailable: GetAvailable,
  GetConnected: GetConnected,
  GetCanBluetooth: GetCanBluetooth,
};

function OpenBluetooth(deviceId) {
  pvV23 = '开始初始化蓝牙';
  deviceMAC = deviceId
  StartInterval()
}

function CloseBluetooth() {
  StopInterval();
  pos_ClearQueue();
  CloseBluetooth()
}

function GetCanBluetooth() {
  if ($UvlvHLvp22 == 0) return true;
  else return false
}

function GetAvailable() {
  return gwIuedY18
}

function GetConnected() {
  return Ur19
}

function GetCurLog() {
  return pvV23
}

function GetResLast() {
  return WFnpAhi21
}

function StartInterval() {
  try {
    ofs1 = setTimeout(WriteQueue, XKFsrQG5)
  } catch (err) {
    console["log"]("StartInterval err:" + err)
  }
}

function StopInterval() {
  try {
    clearInterval(ofs1)
  } catch (err) {
    console["log"]("StopInterval err:" + err)
  }
}

function WriteQueue() {
  try {
    if (!ecOI2) {
      ecOI2 = xcx_platform()
    }
    if (!gwIuedY18 || $UvlvHLvp22 == 1) {
      CloseBluetooth();
      gwIuedY18 = false;
      Ur19 = false;
      $UvlvHLvp22 = -1;
      jNjOIIw20 = false;
      console["log"]("!available");
      gOE3++;
      if (gOE3 > 3) {
        XKFsrQG5 = 10000
      } else {
        XKFsrQG5 = 10000
      }
      startOpenBluetooth()
    } else if (jNjOIIw20 && !Ur19) {
      console["log"]("!connected:");
      gOE3 = 0;
      YFZWNTj4++;
      if (YFZWNTj4 > 3) {
        XKFsrQG5 = 10000
      } else {
        XKFsrQG5 = 10000
      }
      console["log"]("DeviceId:" + V10);
      if (V10) {
        createBLEConnection(V10)
      } else {
        getBluetoothDevices()
      }
    } else if (gwIuedY18 && Ur19) {
      YFZWNTj4 = 0;
      if (pos_QueueWriteLength() > 0) {
        WriteOneQueue()
      } else {
        XKFsrQG5 = 20000
      }
    }
  } catch (err) {
    console["log"]("WriteQueue err:" + err)
  }
  ofs1 = setTimeout(WriteQueue, XKFsrQG5)
}

function WriteOneQueue() {
  if (gwIuedY18 && Ur19) {
    YFZWNTj4 = 0;
    if (pos_QueueWriteLength() > 0) {
      XKFsrQG5 = 10;
      console["log"]("WriteQueue");
      var $npECOS26 = pos_QueueWriteShift();
      // 分包发送
      var nI27 = 20;
      var c_heIVqQ28 = pos_Mathceil($npECOS26["length"], nI27);
      console["log"]("WriteQueue count:" + c_heIVqQ28);
      for (var sPzPNWJkN29 = 0; sPzPNWJkN29 < c_heIVqQ28; sPzPNWJkN29++) {
        var VsC30 = sPzPNWJkN29 * nI27;
        var abjG31 = VsC30 + nI27;
        if (VsC30 >= $npECOS26["length"]) {
          break
        }
        if (abjG31 > $npECOS26["length"]) {
          abjG31 = $npECOS26["length"]
        }
        var ECcZKZM32 = pos_BufferSlice($npECOS26, VsC30, abjG31);
        console["log"]("WriteQueue write tempBf:" + ECcZKZM32);
        write(ECcZKZM32)
      }
    }
  }
}

function openBluetoothAdapterSuccess(bW35) {
  WFnpAhi21 = 1000;
  pvV23 = '初始化蓝牙适配器成功';
  console["log"]("初始化蓝牙适配器-----success----------");
  console["log"](bW35);
  getBluetoothAdapterState()
}

function openBluetoothAdapterFail(_36) {
  WFnpAhi21 = 1001;
  pvV23 = '请先打开手机蓝牙开关';
  console["log"]('--openBluetoothAdapter---fail---');
  $UvlvHLvp22 = 1
}

function startOpenBluetooth() {
  if (!xcx_EnableBlue()) {
    $UvlvHLvp22 = 1;
    pvV23 = '版本过低,请先升级';
    return
  }
  $UvlvHLvp22 = 2;
  if (WFnpAhi21 == 1002 || WFnpAhi21 == 2002) {
    return
  }
  WFnpAhi21 = 1002;
  pvV23 = '开始初始化蓝牙适配器';
  console["log"](pvV23);
  xcx_OpenBluetoothAdapter()
}

function CloseBluetooth() {
  try {
    pvV23 = '开始断开蓝牙机';
    closeBLEConnection(V10);
    CloseBluetoothAdapter()
  } catch (err) { }
}

function closeBluetoothAdapterSuccess(tVd37) {
  WFnpAhi21 = 1100;
  pvV23 = '断开蓝牙机成功';
  console["log"]("success:" + tVd37);
  dYUsKnVfW17 = false;
  gwIuedY18 = false;
  Ur19 = false
}

function closeBluetoothAdapterFail(res) {
  WFnpAhi21 = 1101;
  console["log"](pvV23)
}

function CloseBluetoothAdapter() {
  if (WFnpAhi21 == 1102) {
    return
  }
  WFnpAhi21 = 1102;
  console["log"]("Start_CloseBluetoothAdapter");
  try {
    xcx_closeBluetoothAdapter()
  } catch (err) {
    console["log"]('--closeBluetooth---err---:' + err)
  }
}

function getBluetoothAdapterStateSuccess(csda38, oI39, QsvB40) {
  WFnpAhi21 = 2000;
  console["log"](csda38);
  console["log"](csda38["errMsg"]);
  dYUsKnVfW17 = oI39;
  gwIuedY18 = QsvB40;
  console["log"]('discovering:' + dYUsKnVfW17);
  console["log"]('available:' + gwIuedY18);
  if (QsvB40) {
    onBluetoothAdapterStateChange();
    if (!oI39) {
      startBluetoothDevicesDiscovery()
    }
  } else {
    pvV23 = '蓝牙未打开';
    $UvlvHLvp22 = 1
  }
}

function getBluetoothAdapterStateFail(res) {
  WFnpAhi21 = 2001;
  $UvlvHLvp22 = 1
}

function getBluetoothAdapterState() {
  if (WFnpAhi21 == 2002) {
    return
  }
  WFnpAhi21 = 2002;
  console["log"](pvV23);
  xcx_getBluetoothAdapterState()
}

function onBluetoothAdapterStateChangeResult(m$KLGTY41, mwega$V42) {
  if (!m$KLGTY41) {
    gwIuedY18 = m$KLGTY41;
    $UvlvHLvp22 = 1
  }
  dYUsKnVfW17 = mwega$V42
}

function onBluetoothAdapterStateChange() {
  console["log"]('监听蓝牙适配器状态变化事件');
  try {
    xcx_onBluetoothAdapterStateChange()
  } catch (err) {
    console["log"](`onBluetoothAdapterStateChange--err: ` + err)
  }
}

function startBluetoothDevicesDiscoverySuccess(fLJMlBr43) {
  jNjOIIw20 = true;
  WFnpAhi21 = 3000;
  console["log"](fLJMlBr43)
}

function startBluetoothDevicesDiscoveryFail(fo44) {
  WFnpAhi21 = 3001;
  pvV23 = '查找周边设备失败';
  $UvlvHLvp22 = 1;
  console["log"](pvV23)
}

function startBluetoothDevicesDiscovery() {
  if (WFnpAhi21 == 3002) {
    return
  }
  WFnpAhi21 = 3002;
  pvV23 = '查找可连接蓝牙机';
  console["log"](pvV23);
  xcx_startBluetoothDevicesDiscovery()
}

function getBluetoothDevicesComplete() {
  WFnpAhi21 = 9003
}

function getBluetoothDevicesSuccess(_deviceName, vw45) {
  WFnpAhi21 = 9000;
  console["log"]('新设备:' + _deviceName + "," + vw45);
  if (_deviceName == lq_KEF7) {
    V10 = vw45;
    pvV23 = '找到可连接蓝牙机';
    console["log"]('发现新设备:' + _deviceName);
    xcx_stopBluetoothDevicesDiscovery();
    return true
  }
  return false
}

function getBluetoothDevicesFail(o$HHioqk46) {
  console["log"]('获取所有已发现的蓝牙设备失败:' + o$HHioqk46);
  WFnpAhi21 = 9001;
  pvV23 = '获取所有蓝牙设备失败';
  $UvlvHLvp22 = 1
}

function getBluetoothDevices() {
  if (WFnpAhi21 == 9002) {
    return
  }
  WFnpAhi21 = 9002;
  console["log"](pvV23);
  xcx_getBluetoothDevices()
}

function onBluetoothDeviceFoundResult(Dss47, KsFM48, cIfnPz$49, Oo50) {
  try {
    WFnpAhi21 = 4000;
    if (cIfnPz$49 == lq_KEF7) {
      V10 = KsFM48;
      xcx_stopBluetoothDevicesDiscovery();
      pvV23 = '找到可连接蓝牙机';
      console["log"](pvV23);
      console["log"](Dss47);
      console["log"]('新设备', cIfnPz$49 + "," + KsFM48 + "," + Oo50);
      return true
    }
  } catch (err) { }
  return false
}

function bluetoothDeviceFound() {
  if (WFnpAhi21 == 4002) {
    return
  }
  WFnpAhi21 = 4002;
  console["log"]('开始注册发现新设备事件');
  xcx_onBluetoothDeviceFound()
}

function createBLEConnectionSuccess(lyoJes51, WfC52, XAsh53) {
  console["log"]('createBLEConnection:' + lyoJes51);
  WFnpAhi21 = 5000;
  pvV23 = '连接蓝牙机成功';
  Ur19 = true;
  xcx_onBLEConnectionStateChanged();
  getBLEDeviceServices(XAsh53)
}

function createBLEConnectionFail(bXGvetQD54) {
  WFnpAhi21 = 5001;
  pvV23 = '连接蓝牙机失败';
  $UvlvHLvp22 = 1
}

function createBLEConnection(_deviceId) {
  if (WFnpAhi21 == 5002) {
    return
  }
  WFnpAhi21 = 5002;
  pvV23 = '开始连接蓝牙机';
  console["log"](pvV23);
  xcx_createBLEConnection(_deviceId)
}

function closeBLEConnectionSccess(alXmvGANI55) {
  WFnpAhi21 = 5100;
  console["log"]('关闭蓝牙连接成功:' + alXmvGANI55)
}

function closeBLEConnectionFail(upZWEqkAW56) {
  WFnpAhi21 = 5101;
  pvV23 = '关闭蓝牙连接失败'
}

function closeBLEConnection(_deviceId) {
  if (!_deviceId) {
    return
  }
  if (WFnpAhi21 == 5102) {
    return
  }
  WFnpAhi21 = 5102;
  try {
    xcx_closeBLEConnection(_deviceId)
  } catch (err) { }
}

function onBLEConnectionStateChangedResult(OT57, dmUnB58, DnelLlY59) {
  console["log"](`device state has changed: ` + OT57);
  if (dmUnB58 == V10) {
    Ur19 = DnelLlY59;
    if (!DnelLlY59) {
      $UvlvHLvp22 = 1
    }
  }
}

function getBLEDeviceServicesSuccess(_deviceId, mejYD60) {
  try {
    WFnpAhi21 = 6001;
    console["log"]('服务:' + mejYD60);
    Os11 = mejYD60;
    getBLEDeviceCharacteristics(_deviceId, mejYD60);
    return true
  } catch (err) {
    console["log"]('getBLEDeviceServicesSuccess:' + err)
  }
  return false
}

function getBLEDeviceServicesFail() {
  WFnpAhi21 = 6001;
  pvV23 = '获取蓝牙服务失败';
  $UvlvHLvp22 = 1
}

function getBLEDeviceServices(_deviceId) {
  if (WFnpAhi21 == 6002) {
    return
  }
  WFnpAhi21 = 6002;
  xcx_getBLEDeviceServices(_deviceId)
}

function getBLEDeviceWriteCharacteristicsSuccess(EtcE61) {
  WFnpAhi21 = 7000;
  console["log"]('写特征码:' + EtcE61);
  hqMRz12 = EtcE61;
  $UvlvHLvp22 = 0
}


function getBLEDeviceReadCharacteristicsSuccess( EtcE61) {
  WFnpAhi21 = 7000;
  console["log"]('读特征码:' + EtcE61);
  lPGjy13 = EtcE61
  $UvlvHLvp22 = 0
}

function getBLEDeviceCharacteristicsFail(res) {
  WFnpAhi21 = 7001;
  $UvlvHLvp22 = 1;
  console["log"]('getBLEDeviceCharacteristics  fail')
}

function getBLEDeviceCharacteristics(a62, _IrFQmN63) {
  if (WFnpAhi21 == 7002) {
    return
  }
  WFnpAhi21 = 7002;
  console["log"]('_deviceId:' + a62);
  console["log"]('_serviceId:' + _IrFQmN63);
  xcx_getBLEDeviceCharacteristics(a62, _IrFQmN63)
}

function notifyBLECharacteristicValueChange(cdnEh64, iGMsM65, vybuaT66) {
  if (WFnpAhi21 == 8002) {
    return
  }
  WFnpAhi21 = 8002;
  xcx_notifyBLECharacteristicValueChange(cdnEh64, iGMsM65, vybuaT66)
}

function writeBLECharacteristicValueSuccess(S$Lg67) {
  try {
    WFnpAhi21 = 8100;
    jpvtIv6 = 0;
    console["log"]('writeBLECharacteristicValue success' + res);
    S$Lg67
  } catch (err) { }
}

function writeBLECharacteristicValueFail(t68) {
  try {
    WFnpAhi21 = 8101;
    jpvtIv6 = 1;
    console["log"]('writeBLECharacteristicValue  fail' + res);
    t68
  } catch (err) { }
}

function writeBLECharacteristicValue(rldHLki69, SkjHH_70, ehspvq71, SjT_sczBj72, eHdwNsrG73, fNEtcXzrs74) {
  WFnpAhi21 = 8102;
  jpvtIv6 = 2;
  xcx_writeBLECharacteristicValue(rldHLki69, SkjHH_70, ehspvq71, SjT_sczBj72["buffer"], eHdwNsrG73, fNEtcXzrs74)
}

function write($75) {
  if (!gwIuedY18) {
    console["log"]("available is false");
    return "available is false"
  }
  if (!V10) {
    console["log"]("DeviceId is null");
    return "DeviceId is null"
  }
  if (!Ur19) {
    console["log"]("connected is false");
    return "connected is false"
  }
  writeBLECharacteristicValue(V10, Os11, hqMRz12, $75, null, null)
}

function getPrintStorage() {
  try { } catch (e) { }
}

function clearPrinter() {
  hFfIwp$ci9 = '';
  V10 = '';
  Os11 = '';
  hqMRz12 = '';
  lPGjy13 = ''
}


function xcx_EnableBlue() {
  return wx.openBluetoothAdapter
}

function xcx_OpenBluetoothAdapter() {
  wx.openBluetoothAdapter({
    success: function (res) {
      openBluetoothAdapterSuccess(res)
    },
    fail: function (res) {
      openBluetoothAdapterFail(res)
    },
    complete: function (res) {
      console.log('--openBluetoothAdapter---complete---')
    }
  })
}

function xcx_closeBluetoothAdapter() {
  wx.closeBluetoothAdapter({
    success: function (res) {
      closeBluetoothAdapterSuccess(res)
    },
    fail: function (res) {
      closeBluetoothAdapterFail(res)
    },
    complete: function (res) {
      console.log('--openBluetoothAdapter---complete---')
    }
  })
}

function xcx_getBluetoothAdapterState() {
  wx.getBluetoothAdapterState({
    success: function (res) {
      getBluetoothAdapterStateSuccess(res, res.discovering, res.available)
    },
    fail: function (res) {
      getBluetoothAdapterStateFail(res)
    },
    complete: function (res) { }
  })
}

function xcx_onBluetoothAdapterStateChange() {
  wx.onBluetoothAdapterStateChange(function (res) {
    console.log(`adapterState changed, now is: ` + res);
    onBluetoothAdapterStateChangeResult(res.available, res.discovering)
  })
}

function xcx_startBluetoothDevicesDiscovery() {
  wx.startBluetoothDevicesDiscovery({
    success: function (res) {
      startBluetoothDevicesDiscoverySuccess(res)
    },
    fail: function (res) {
      startBluetoothDevicesDiscoveryFail(res)
    },
    complete: function (res) { }
  })
}

function xcx_stopBluetoothDevicesDiscovery() {
  console.log('停止搜索周边设备');
  wx.stopBluetoothDevicesDiscovery({
    success: function (res) {
      console.log(res)
    }
  })
}

function xcx_getBluetoothDevices() {
  wx.getBluetoothDevices({
    success: function (res) {
      console.log(res);
      for (var p in res.devices) {
        console.log('for devices:' + res.devices[p].name);
        if (res.devices[p].deviceId != deviceMAC){
          continue;
        }
        if (res.devices[p].name.search("未知设备") != -1) {
          continue;
        } else {
          if (getBluetoothDevicesSuccess(res.devices[p].name, res.devices[p].deviceId)) {
            break
          }
        }

      }
    },
    fail: function (res) {
      getBluetoothDevicesFail(res)
    },
    complete: function (res) {
      getBluetoothDevicesComplete();
      console.log('获取所有已发现的蓝牙设备complete:' + res)
    }
  })
}

function xcx_onBluetoothDeviceFound() {
  wx.onBluetoothDeviceFound(function (res) {
    try {
      if (onBluetoothDeviceFoundResult(res, res.deviceId, res.name, res.RSSI)) {
        return
      }
    } catch (err) { }
    try {
      for (var p in res.devices) {
        if (onBluetoothDeviceFoundResult(res, res.devices[p].deviceId, res.devices[p].name, res.devices[p].RSSI)) {
          return
        }
      }
    } catch (err) { }
  })
}

function xcx_getConnectedBluetoothDevices() {
  console.log(curLog);
  wx.getConnectedBluetoothDevices({
    success: function (res) {
      console.log('获取处于已连接状态的设备:' + res)
    },
    fail: function (res) {
      console.log('获取处于已连接状态的设备失败:' + res)
    },
    complete: function (res) {
      console.log('获取处于已连接状态的设备complete:' + res)
    }
  })
}

function xcx_createBLEConnection(_deviceId) {
  wx.createBLEConnection({
    deviceId: _deviceId,
    success: function (res) {
      createBLEConnectionSuccess(res, res.errMsg, _deviceId)
    },
    fail: function (res) {
      createBLEConnectionFail(res)
    },
    complete: function (res) {
      console.log('连接低功耗蓝牙设备complete:' + res)
    }
  })
}

function xcx_onBLECharacteristicValueChange() {
  wx.onBLECharacteristicValueChange(function (res) {
    console.log('监听低功耗蓝牙设备的特征值变化:' + res)
  })
}

function xcx_closeBLEConnection(_deviceId) {
  console.log('开始关闭蓝牙连接');
  wx.closeBLEConnection({
    deviceId: _deviceId,
    success: function (res) {
      closeBLEConnectionSccess(res)
    },
    fail: function (res) {
      closeBLEConnectionFail(res)
    },
    complete: function (res) {
      console.log('连接低功耗蓝牙设备complete:' + res)
    }
  })
}

function xcx_onBLEConnectionStateChanged() {
  console.log('注册监听低功耗蓝牙连接的错误事件，包括设备丢失，连接异常断开等等');
  wx.onBLEConnectionStateChanged(function (res) {
    onBLEConnectionStateChangedResult(res, res.deviceId, res.connected)
  })
}

function xcx_getBLEDeviceServices(_deviceId) {
  wx.getBLEDeviceServices({
    deviceId: _deviceId,
    success: function (res) {
      console.log('getBLEDeviceServices  success');
      for (var p in res.services) {
        {
          if (getBLEDeviceServicesSuccess(_deviceId, res.services[p].uuid)) {
            return
          }
        }
      }
    },
    fail: function (res) {
      getBLEDeviceServicesFail()
    },
    complete: function (res) {
      console.log('getBLEDeviceServices  complete')
    }
  })
}

function xcx_getBLEDeviceCharacteristics(_deviceId, _serviceId) {
  // 读特征码
  wx.getBLEDeviceCharacteristics({
    deviceId: _deviceId,
    serviceId: _serviceId,
    success: function (res) {
      for (var p in res.characteristics) {
        if (res.characteristics[p].properties.read) {
          getBLEDeviceReadCharacteristicsSuccess(res.characteristics[p].uuid)
        } else if (res.characteristics[p].properties.write) {
          getBLEDeviceWriteCharacteristicsSuccess(res.characteristics[p].uuid)
        }
      }
    },
    fail: function (res) {
      getBLEDeviceCharacteristicsFail(res)
    },
    complete: function (res) {
      console.log('getBLEDeviceCharacteristics  complete')
    }
  })

}

function xcx_readBLECharacteristicValue(_deviceId, _serviceId, _characteristicId) {
  wx.readBLECharacteristicValue({
    deviceId: _deviceId,
    serviceId: _serviceId,
    characteristicId: _characteristicId,
    success: function (res) {
      console.log('readBLECharacteristicValue:' + res)
    },
    fail: function (res) {
      console.log('readBLECharacteristicValue  fail' + res)
    },
    complete: function (res) {
      console.log('readBLECharacteristicValue  complete')
    }
  })
}

function xcx_notifyBLECharacteristicValueChange(_deviceId, _serviceId, _characteristicId) {
  wx.notifyBLECharacteristicValueChange({
    state: true,
    deviceId: _deviceId,
    serviceId: _serviceId,
    characteristicId: _characteristicId,
    success: function (res) {
      console.log('notifyBLECharacteristicValueChange success:' + res.errMsg)
    },
    fail: function (res) {
      console.log('notifyBLECharacteristicValueChange  fail:' + res)
    },
    complete: function (res) {
      console.log('notifyBLECharacteristicValueChange  complete')
    }
  })
}

function xcx_writeBLECharacteristicValue(_deviceId, _serviceId, _characteristicId, _buffervalue, _success, _fail) {
  wx.writeBLECharacteristicValue({
    deviceId: _deviceId,
    serviceId: _serviceId,
    characteristicId: _characteristicId,
    value: _buffervalue,
    success: function (res) {
      writeBLECharacteristicValueSuccess(_success)
    },

    fail: function (res) {
      console.log('writeBLECharacteristicValue  fail:' + res);
      writeBLECharacteristicValueFail(_fail)
    },
    complete: function (res) {
      console.log('writeBLECharacteristicValue  complete')
    }
  })
}

function xcx_setStorage(key, value) {
  wx.setStorage({
    key: key,
    data: value
  })
}

function xcx_printFail() {
  wx.showToast({
    title: "发送指令到蓝牙失败",
    duration: 5000
  })
}

function xcx_printOk() {
  wx.showToast({
    title: "发送指令到蓝牙成功",
    duration: 5000
  })
}

function xcx_platform() {
  var res = wx.getSystemInfoSync();
  return res.platform
}

function pos_ClearQueue() {
  try {
    pos.ClearQueue()
  } catch (err) { }
}

function pos_QueueWriteLength() {
  return pos.QueueWrite.length
}

function pos_QueueWriteShift() {
  return pos.QueueWrite.shift()
}

function pos_Mathceil(_len1, _len2) {
  return Math.ceil(_len1 / _len2)
}

function pos_BufferSlice(_buffer, _start, _end) {
  return _buffer.slice(_start, _end)
}

function Arry2Arry(arry1, arry2) {
  var b = new Uint8Array(arry1.length + arry2.length);
  b.set(arry1, 0);
  b.set(arry2, arry1.length);
  return b
}