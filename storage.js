// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
}());

// 检测是否为隐私模式
function isLocalStorageNameSupported() {
    var testKey = 'test', storage = window.localStorage;
    try {
        storage.setItem(testKey, '1');
        storage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
}

// 如果不存在或不可用（隐私模式下不可用会报错）
if (!isLocalStorageNameSupported() || !window.localStorage) {
    console.log('重新定义localStorage')
    window.storage = new (function () {
        var aKeys = [], oStorage = {};
        Object.defineProperty(oStorage, "getItem", {
          value: function (sKey) { return sKey ? this[sKey] : null; },
          writable: false,
          configurable: false,
          enumerable: false
        });
        Object.defineProperty(oStorage, "key", {
          value: function (nKeyId) { return aKeys[nKeyId]; },
          writable: false,
          configurable: false,
          enumerable: false
        });
        Object.defineProperty(oStorage, "setItem", {
          value: function (sKey, sValue) {
            if(!sKey) { return; }
            document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
          },
          writable: false,
          configurable: false,
          enumerable: false
        });
        Object.defineProperty(oStorage, "length", {
          get: function () { return aKeys.length; },
          configurable: false,
          enumerable: false
        });
        Object.defineProperty(oStorage, "removeItem", {
          value: function (sKey) {
            if(!sKey) { return; }
            document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
          },
          writable: false,
          configurable: false,
          enumerable: false
        });
        this.get = function () {
          var iThisIndx;
          for (var sKey in oStorage) {
            iThisIndx = aKeys.indexOf(sKey);
            if (iThisIndx === -1) { oStorage.setItem(sKey, oStorage[sKey]); }
            else { aKeys.splice(iThisIndx, 1); }
            delete oStorage[sKey];
          }
          for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) { oStorage.removeItem(aKeys[0]); }
          for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
            aCouple = aCouples[nIdx].split(/\s*=\s*/);
            if (aCouple.length > 1) {
              oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
              aKeys.push(iKey);
            }
          }
          return oStorage;
        };
        this.configurable = false;
        this.enumerable = true;
        return oStorage;
    })()
} else {
    window.storage = window.localStorage
};
