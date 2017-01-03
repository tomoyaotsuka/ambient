export function fadeOutUI() {
  let $target = $('#header, #interval, #open');
  TweenLite.to($target, 0.4, { autoAlpha: 0, display: 'none' });
  TweenLite.set('body', { cursor: 'none' });
}

export function getQuery() {
  const array = [];
  let hash;
  const hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

  for (let i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    array.push(hash[0]);
    array[hash[0]] = hash[1];
  }

  return array;
}

export function elementRequestFullscreen(e) {
  const list = [
    "requestFullscreen",
    "webkitRequestFullScreen",
    "mozRequestFullScreen",
    "msRequestFullscreen"
  ];
  const num = list.length;

  for (let i = 0; i < num; i++) {
    if (e[list[i]]) {
      e[list[i]]();
      return true;
    }
  }
  return false;
}
