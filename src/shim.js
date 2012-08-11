/** 
  * requestAnimationFrame shim
  * take from: https://developer.mozilla.org/en-US/docs/DOM/window.requestAnimationFrame
  */
;(function() {
  var requestAnimationFrame = 
    window.requestAnimationFrame 
    || window.mozRequestAnimationFrame 
    || window.webkitRequestAnimationFrame 
    || window.msRequestAnimationFrame
  window.requestAnimationFrame = requestAnimationFrame
})();