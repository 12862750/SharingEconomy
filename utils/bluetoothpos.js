import util from './bluetoothutil.js';
var QueueWrite = new Array();//等待写入蓝牙的执行队列
module.exports = {
  InitPos: InitPos,
  Print: Print,
  QueueWrite: QueueWrite,//发送队列
  ClearQueue: ClearQueue,//清空待执行队列
  AddPrintQueue: AddPrintQueue,//添加到发送指令队列
  PrintText: PrintText,//发送指令普通文字（从左至右，不加粗）
} 
function AddLongBuffer(writeBf) {
  var maxlen = 20;
  var count = Math.ceil(writeBf.length / maxlen);
  console.log("AddLongBuffer count", count);
  for (var i = 0; i < count; i++) {
    var _lenStart = i * maxlen;
    var _lenEnd = _lenStart + maxlen;
    if (_lenStart >= writeBf.length) {
      break;
    }
    if (_lenEnd > writeBf.length) {
      _lenEnd = writeBf.length;
    }
    var tempBf = writeBf.slice(i * maxlen, _lenEnd);
    console.log("QueueWrite.push tempBf", tempBf);
    QueueWrite.push(tempBf);
  }
}

function PrintNameValue(name, value) {
  AddPrintQueue('InitPos');
  AddPrintQueue('Bold');
  AddPrintQueue('WriteText', name);
  AddPrintQueue('UnBold');
  AddPrintQueue('Print', value);
}
function PrintBigTitle(text) {
  AddPrintQueue('InitPos');
  AddPrintQueue('Bold');
  AddPrintQueue('FontDouble');
  AddPrintQueue('AlignMiddle');
  //Underline(2);
  AddPrintQueue('Print', text);
  AddPrintQueue('UnBold');
  AddPrintQueue('UnFontDouble');
  AddPrintQueue('AlignLeft');

}
function PrintTitle(text) {
  AddPrintQueue('InitPos');
  AddPrintQueue('Bold');
  AddPrintQueue('FontHighDouble');
  AddPrintQueue('AlignMiddle');
  //Underline(2);
  AddPrintQueue('Print', text);
  AddPrintQueue('UnBold');
  AddPrintQueue('UnFontHighDouble');
  AddPrintQueue('AlignLeft');

}
function PrintMiddleTextBold(text) {
  AddPrintQueue('InitPos');
  AddPrintQueue('AlignMiddle');
  AddPrintQueue('Bold');
  AddPrintQueue('Print', text);
  AddPrintQueue('AlignLeft');
  AddPrintQueue('UnBold');

}
function PrintJumpLines(n) {
  AddPrintQueue('PrintJumpLine', n);
}
function PrintMiddleText(text) {
  AddPrintQueue('InitPos');
  AddPrintQueue('AlignMiddle');
  AddPrintQueue('Print', text);
  AddPrintQueue('AlignLeft');

}
function PrintText(text) {
  AddPrintQueue('InitPos');
  AddPrintQueue('Print', text);
}
function PrintTextMarginLeft(nL, nH, text) {
  AddPrintQueue('InitPos');
  QueueWrite.push(SetLeftMargin(nL, nH0));
  QueueWrite.push(Print());
  AddPrintQueue('Print', text);
}
function ClearQueue() {
  QueueWrite.splice(0, QueueWrite.length);//清空队列 
}
function AddPrintQueue(key, value) {
  var bf = null;
  switch (key.toLowerCase()) {
    case 'InitPos'.toLowerCase():
      QueueWrite.push(InitPos());//初始化蓝牙发送指令
      break;
    case 'Print'.toLowerCase()://发送指令
      var hexstr = util.encodeToGb2312(value);
      var _tempbuf = util.Arry2Arry(Hex2Arry(hexstr), Print());
      AddLongBuffer(_tempbuf);
      break;
    case 'CharSet'.toLowerCase()://设置字符集
      QueueWrite.push(CharSet(0));
      break;
    default:
      break;
  }
}

function Print() {
  return LF;
  //return FF;
  //return CR;
}

function InitPos() {
  return ESC_ALT.slice(0);
}

//设置字符集
function CharSet(nCharSet) {
  console.log('CharSetAndCodePage');
  ESC_R_n[2] = 15;// nCharSet;
  return ESC_R_n.slice(0);
}

function Hex2Arry(str) {
  var sa = str.split("%");
  var b = new Uint8Array(sa.length - 1);
  for (var i = 1; i < sa.length; i++) {
    b[i - 1] = parseInt(sa[i], 16);
  }
  return b;
}

//是否缺纸
var Lack_Paper = new Uint8Array([29, 114, 1]);

var DES_SETKEY = new Uint8Array([31, 31, 0, 8, 0, 1, 1, 1, 1, 1, 1, 1, 1]);
var DES_ENCRYPT = new Uint8Array([31, 31, 1]);
var DES_ENCRYPT2 = new Uint8Array([31, 31, 2]);
var ERROR = new Uint8Array([0]);
//初始化
var ESC_ALT = new Uint8Array([27, 64]);
//发送指令并走纸 n 点行
var ESC_J_n = new Uint8Array([27, 74, 0]);
//发送指令并走纸 n 行
var ESC_d_n = new Uint8Array([27, 100, 0]);
//
var ESC_L = new Uint8Array([27, 76]);
//
var ESC_CAN = new Uint8Array([24]);
//发送指令缓冲区的数据并进纸到下一个黑标位置
var FF = new Uint8Array([12]);
//（页模式命令）发送指令缓冲区的数据并进纸到下一个黑标位置
var ESC_FF = new Uint8Array([27, 12]);
//
var ESC_S = new Uint8Array([27, 83]);
//
var GS_P_x_y = new Uint8Array([29, 80, 0, 0]);
//选择国际字符集 (该指令暂不支持)USA
var ESC_R_n = new Uint8Array([27, 82, 0]);
//选择字符代码页
var ESC_t_n = new Uint8Array([27, 116, 0]);
//发送指令并换行
var LF = new Uint8Array([10]);
//发送指令并换行
var CR = new Uint8Array([13]);
//设置行间距为 n 点行
var ESC_3_n = new Uint8Array([27, 51, 0]);
//设置字符间距
var ESC_SP_n = new Uint8Array([27, 32, 0]);
//
var DLE_DC4_n_m_t = new Uint8Array([16, 20, 1, 0, 1]);
//
var GS_V_m = new Uint8Array([29, 86, 0]);
//
var GS_V_m_n = new Uint8Array([29, 86, 66, 0]);
//
var GS_W_nL_nH = new Uint8Array([29, 87, 118, 2]);
//
var ESC_dollors_nL_nH = new Uint8Array([27, 36, 0, 0]);
//设置输出对齐方式 缺省：左对齐 左对齐：n=0,48  居中对齐：n=1,49 右对齐 ：n=2,50
var ESC_a_n = new Uint8Array([27, 97, 0]);
//用于设置发送指令字符的方式。默认值是 0,位 1：1：字体反白,位 2：1：字体上下倒置,位 3：1：字体加粗,位 4：1：双倍高度,位 5：1：双倍宽度,位 6：1：删除线
//设置发送指令字符双倍宽度
var GS_exclamationmark_n = new Uint8Array([29, 33, 0]);
//
var ESC_M_n = new Uint8Array([27, 77, 0]);
//设置取消发送指令字体是否加粗,n 最低位有效,等于 0 时取消字体加粗,非 0 时设置字体加粗
var GS_E_n = new Uint8Array([27, 69, 0]);
//n=0-2,下划线的高度,默认：0
var ESC_line_n = new Uint8Array([27, 45, 0]);
//n=1:设置字符上下倒置,n=0:取消字符上下倒置
var ESC_lbracket_n = new Uint8Array([27, 123, 0]);
//n=1:设置字符反白发送指令,n=0:取消字符反白发送指令
var GS_B_n = new Uint8Array([29, 66, 0]);
//
var ESC_V_n = new Uint8Array([27, 86, 0]);
//发送指令下装点图
var GS_backslash_m = new Uint8Array([29, 47, 0]);
//发送指令下载到 FLASH  中的位图
var FS_p_n_m = new Uint8Array([28, 112, 1, 0]);
 

//
var ESC_W_xL_xH_yL_yH_dxL_dxH_dyL_dyH = new Uint8Array([27, 87, 0, 0, 0, 0, 72, 2, -80, 4]);
//
var ESC_T_n = new Uint8Array([27, 84, 0]);
//
var GS_dollors_nL_nH = new Uint8Array([29, 36, 0, 0]);
//
var GS_backslash_nL_nH = new Uint8Array([29, 92, 0, 0]);
//
var FS_line_n = new Uint8Array([28, 45, 0]);
 
