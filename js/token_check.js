let appkey = "f6789bd4e2afde24";
const key = CryptoJS.enc.Utf8.parse(appkey); //appkey
const iv = CryptoJS.enc.Utf8.parse('3ec165b2df78f8'); //密钥偏移量
$(function () {

  //解密方法
  window.Decrypt = function (word) {
    let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  }

  window.token_check = function (token, callback) {
    let state = {
      CanUse: true,
      Expiration: "随便",
      Type: "已激活",
    }
    try {
      chrome.storage.local.get(['uuid', 'token'], (param) => {
        if (token == null) {
          token = param.token;
        }
        if (token) {
          let info = Decrypt(token);
          console.log(info)
          let obj = JSON.parse(info);
          let uuid = param.uuid;
          // if (obj.key == appkey && obj.targetId == uuid) {
          //   state.Expiration = new Date(Number(obj.Expiration)).toLocaleString("zh", {
          //     hour12: false
          //   });
          //   // if (Number(obj.Expiration) < new Date().getTime()) {
          //   //   state.Type = "已过期"
          //   // } else {
          //     state.CanUse = true;
          //     state.Type = "已激活"
          //   // }
          // }

          state.Expiration = "随便"
          state.CanUse = true;
          state.Type = "已激活"
        }
        callback(state)
      })
    } catch (error) {
      // console.log(error)
      callback(state)
    }
  }
})

;