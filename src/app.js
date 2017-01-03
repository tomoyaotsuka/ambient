import * as lib from './lib';
import Overlay from './component/Overlay';
import Range from './component/Range';

let TOKEN    = "AbgKoIEs6qRMtTBvkmvdphaT-FzgFJQi6KtH1zJDMwZebwBD1AAAAAA";
let INTERVAL = 5000;

let userName   = "tomoyaotsuka";
let boardName  = "ad";
let fetchImage = "https://api.pinterest.com/v1/boards/" + userName + "/" + boardName + "/pins/?access_token=" + TOKEN + "&fields=image,counts";
let fetchCount = "https://api.pinterest.com/v1/boards/" + userName + "/" + boardName + "/?access_token=" + TOKEN + "&fields=counts";

let pinsNum  = 0;
let totalNum = 0;

let counter;
let request;
let queryVal;
let pinsTimer;
let mouseTimer;

const $window = $(window);
const $loadStatus = $('#loadStatus');
const $pins = $('#pins');


$(function() {
  new Overlay();
  new Range();

  queryVal = decodeURI(lib.getQuery().val);
  if (queryVal) {
    fetchImage = "https://api.pinterest.com/v1/boards/" + queryVal + "/pins/?access_token=" + TOKEN + "&fields=image";
    fetchCount = "https://api.pinterest.com/v1/boards/" + queryVal + "/?access_token=" + TOKEN + "&fields=counts";
  }

  getPins(fetchImage,fetchCount);

  $window.on('mousemove', function(){
    let $target = $('#header, #interval, #open');
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


function getPins(url,count) {
  getCounts(count);

  if (url !== undefined && url !== null && url !== "") {
    request = $.getJSON(url)
      .done(function(res) {
        res.data.forEach(elm => {
          $pins.append('<img src="' + elm.image.original.url + '" class="item">');
          pinsNum++;
          $loadStatus.text(Math.ceil(pinsNum / totalNum * 100) + "%");
        });
        getPins(res.page.next);
      });
  }
  else {
    airPlay();
    return [];
  }
}


function getCounts(url) {
  $.getJSON(url).done(function(res) {
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
  getPins(fetchImage,fetchCount);
}


function airPlay() {
  counter = 0;
  TweenLite.to($loadStatus, 1, { autoAlpha: 0, display: 'none' });
  startTimer();
}

function startTimer() {
  const $item = $('.item');
  const length = $item.length;
  pinsTimer = setInterval(function() {
    switch (counter) {
      case 0:
        TweenLite.to($item.eq(counter), 1, { autoAlpha: 1, display: 'block' });
        counter++;
        break;
      case length:
        counter = 0;
      default:
        TweenLite.to($item.eq(counter), 1, { autoAlpha: 1, display: 'block' });
        TweenLite.to($item.eq(counter-1), 1, { autoAlpha: 0, display: 'none' });
        counter++;
        break;
    }
  }, INTERVAL);
}

function stopTimer() {
  clearInterval(pinsTimer);
}





const open = document.getElementById('open');
open.addEventListener('click', function() {
  if (!this.classList.contains('is-opened')) {
    open.classList.add('is-opened');
    openOverlay();
  }
  else {
    open.classList.remove('is-opened');
    closeOverlay();
  }
}, false);


const overlay = document.getElementById('overlay');
const input   = document.getElementById('input');
const submit  = document.getElementById('submit');

input.addEventListener('keydown', () => {
  if (window.event.keyCode == 13) {
    open.classList.remove('is-opened');
    closeOverlay();
    requestPins();
  }
}, false);

submit.addEventListener('click', () => {
  requestPins();
  closeOverlay();
}, false);



function openOverlay() {
  TweenLite.to(overlay, 1, { autoAlpha: 1, display: 'block' });
}

function closeOverlay() {
  TweenLite.to(overlay, 1, { autoAlpha: 0, display: 'none' });
}




const range = document.getElementById('range');
const rangeValue = document.getElementById('rangeValue');

range.addEventListener('input', function() {
  INTERVAL = this.value;
  rangeValue.textContent = this.value + "ms";
  TweenLite.set($('#rangeActive'), { width: 160 * Math.ceil((this.value-1000)/9000*100) / 100 })
  TweenLite.to(rangeValue, 0.1, { y: (50 - Math.ceil((this.value-1000)/9000*100)) * 1.5 });
}, false);

range.addEventListener('change', function() {
  stopTimer();
  startTimer();
}, false);
