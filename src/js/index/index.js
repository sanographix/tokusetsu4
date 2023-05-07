/*@license
 *
 * Tokusetsu 4:
 *   licenses: MIT
 *   Copyright (c) 2022 sanographix
 *   https://github.com/sanographix/tokusetsu4
 * vanilla-tilt.js:
 *   licenses: MIT
 *   Copyright (c) 2017 Șandor Sergiu
 *   https://github.com/micku7zu/vanilla-tilt.js
*/

// gallery
(function() {
  window.addEventListener("load", function () {
    const samples = document.querySelectorAll('.js-gallery-item');
    const lightboxes = document.querySelectorAll('.js-gallery-lightbox');
    if (samples.length < 1) { return false; }
    Array.prototype.forEach.call(samples, function (sampleElem) {
      sampleElem.addEventListener('click', function () {
        const sampleIndex = sampleElem.dataset['index'];
        const lightbox = document.querySelector('.js-gallery-lightbox[data-index="' + sampleIndex + '"]');
        lightbox.classList.add('is-open');
        document.body.classList.add('is-lightbox-opened');
      });
    });
    Array.prototype.forEach.call(lightboxes, function (lightboxElem) {
      lightboxElem.addEventListener('click', function () {
        lightboxElem.classList.remove('is-open');
        document.body.classList.remove('is-lightbox-opened');
      })
    })
  });
})();

// prebuildバナー
(function() {
  window.addEventListener("load", function () {
    const banner = document.querySelector('.js-prebuild');
    const toggleBtn = document.querySelector('.js-prebuild-toggle');
    // バナーが存在するときはトグルで最小化できる
    if (banner) {
      toggleBtn.addEventListener('click', function(){
        banner.classList.toggle('is-minimize');
      });
    }
  });
}());
