(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _lib = require('./lib');

var lib = _interopRequireWildcard(_lib);

var _Overlay = require('./component/Overlay');

var _Overlay2 = _interopRequireDefault(_Overlay);

var _Range = require('./component/Range');

var _Range2 = _interopRequireDefault(_Range);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var TOKEN = "AbgKoIEs6qRMtTBvkmvdphaT-FzgFJQi6KtH1zJDMwZebwBD1AAAAAA";
var INTERVAL = 5000;

var userName = "tomoyaotsuka";
var boardName = "ad";
var fetchImage = "https://api.pinterest.com/v1/boards/" + userName + "/" + boardName + "/pins/?access_token=" + TOKEN + "&fields=image,counts";
var fetchCount = "https://api.pinterest.com/v1/boards/" + userName + "/" + boardName + "/?access_token=" + TOKEN + "&fields=counts";

var pinsNum = 0;
var totalNum = 0;

var counter = void 0;
var request = void 0;
var queryVal = void 0;
var pinsTimer = void 0;
var mouseTimer = void 0;

var $window = $(window);
var $loadStatus = $('#loadStatus');
var $pins = $('#pins');

$(function () {
  new _Overlay2.default();
  new _Range2.default();

  queryVal = decodeURI(lib.getQuery().val);
  if (queryVal) {
    fetchImage = "https://api.pinterest.com/v1/boards/" + queryVal + "/pins/?access_token=" + TOKEN + "&fields=image";
    fetchCount = "https://api.pinterest.com/v1/boards/" + queryVal + "/?access_token=" + TOKEN + "&fields=counts";
  }

  getPins(fetchImage, fetchCount);

  $window.on('mousemove', function () {
    var $target = $('#header, #interval, #open');
    TweenLite.to($target, 0.4, { autoAlpha: 1, display: 'block' });
    TweenLite.set('body', { cursor: 'default' });

    clearTimeout(mouseTimer);
    mouseTimer = setTimeout(lib.fadeOutUI, 5000);
  });
  // $.ajax({
  //   url: 'https://api.pinterest.com/v1/oauth/token?grant_type=authorization_code&client_id=4842213928157063902&client_secret=c8e5458c634b2d84b599da21ef7c6a5aea504d27ba82a8591a019814a4ed7e36&code=' + lib.getQuery().code,
  //   type: 'POST',
  //   dataType: 'json',
  //   success: function(data) {
  //     console.log(data.access_token);
  //   },
  //   error: function() {
  //     console.log('error');
  //   }
  // });
});

function getPins(url, count) {
  getCounts(count);

  if (url !== undefined && url !== null && url !== "") {
    request = $.getJSON(url).done(function (res) {
      res.data.forEach(function (elm) {
        $pins.append('<img src="' + elm.image.original.url + '" class="item">');
        pinsNum++;
        $loadStatus.text(Math.ceil(pinsNum / totalNum * 100) + "%");
      });
      getPins(res.page.next);
    });
  } else {
    airPlay();
    return [];
  }
}

function getCounts(url) {
  $.getJSON(url).done(function (res) {
    totalNum = res.data.counts.pins;
  });
}

function requestPins() {
  pinsNum = 0;
  request.abort();
  TweenLite.to($loadStatus, 1, { autoAlpha: 1, display: 'block' });
  $pins.empty();
  fetchImage = "https://api.pinterest.com/v1/boards/" + $('#input').val() + "/pins/?access_token=" + TOKEN + "&fields=image";
  fetchCount = "https://api.pinterest.com/v1/boards/" + $('#input').val() + "/?access_token=" + TOKEN + "&fields=counts";
  getPins(fetchImage, fetchCount);
}

function airPlay() {
  counter = 0;
  TweenLite.to($loadStatus, 1, { autoAlpha: 0, display: 'none' });
  startTimer();
}

function startTimer() {
  var $item = $('.item');
  var length = $item.length;
  pinsTimer = setInterval(function () {
    switch (counter) {
      case 0:
        TweenLite.to($item.eq(counter), 1, { autoAlpha: 1, display: 'block' });
        counter++;
        break;
      case length:
        counter = 0;
      default:
        TweenLite.to($item.eq(counter), 1, { autoAlpha: 1, display: 'block' });
        TweenLite.to($item.eq(counter - 1), 1, { autoAlpha: 0, display: 'none' });
        counter++;
        break;
    }
  }, INTERVAL);
}

function stopTimer() {
  clearInterval(pinsTimer);
}

var open = document.getElementById('open');
open.addEventListener('click', function () {
  if (!this.classList.contains('is-opened')) {
    open.classList.add('is-opened');
    openOverlay();
  } else {
    open.classList.remove('is-opened');
    closeOverlay();
  }
}, false);

var overlay = document.getElementById('overlay');
var input = document.getElementById('input');
var submit = document.getElementById('submit');

input.addEventListener('keydown', function () {
  if (window.event.keyCode == 13) {
    open.classList.remove('is-opened');
    closeOverlay();
    requestPins();
  }
}, false);

submit.addEventListener('click', function () {
  requestPins();
  closeOverlay();
}, false);

function openOverlay() {
  TweenLite.to(overlay, 1, { autoAlpha: 1, display: 'block' });
}

function closeOverlay() {
  TweenLite.to(overlay, 1, { autoAlpha: 0, display: 'none' });
}

var range = document.getElementById('range');
var rangeValue = document.getElementById('rangeValue');

range.addEventListener('input', function () {
  INTERVAL = this.value;
  rangeValue.textContent = this.value + "ms";
  TweenLite.set($('#rangeActive'), { width: 160 * Math.ceil((this.value - 1000) / 9000 * 100) / 100 });
  TweenLite.to(rangeValue, 0.1, { y: (50 - Math.ceil((this.value - 1000) / 9000 * 100)) * 1.5 });
}, false);

range.addEventListener('change', function () {
  stopTimer();
  startTimer();
}, false);

},{"./component/Overlay":2,"./component/Range":3,"./lib":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function _class() {
  _classCallCheck(this, _class);
};

exports.default = _class;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function _class() {
  _classCallCheck(this, _class);
};

exports.default = _class;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fadeOutUI = fadeOutUI;
exports.getQuery = getQuery;
exports.elementRequestFullscreen = elementRequestFullscreen;
function fadeOutUI() {
  var $target = $('#header, #interval, #open');
  TweenLite.to($target, 0.4, { autoAlpha: 0, display: 'none' });
  TweenLite.set('body', { cursor: 'none' });
}

function getQuery() {
  var array = [];
  var hash = void 0;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    array.push(hash[0]);
    array[hash[0]] = hash[1];
  }

  return array;
}

function elementRequestFullscreen(e) {
  var list = ["requestFullscreen", "webkitRequestFullScreen", "mozRequestFullScreen", "msRequestFullscreen"];
  var num = list.length;

  for (var i = 0; i < num; i++) {
    if (e[list[i]]) {
      e[list[i]]();
      return true;
    }
  }
  return false;
}

},{}]},{},[1]);
