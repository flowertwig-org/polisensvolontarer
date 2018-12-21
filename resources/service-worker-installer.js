(function () {
  'use strict';

  if ('serviceWorker' in navigator) {

    // Enable Service worker checkbox
    var cbServiceWorker = document.querySelector('#serviceworker');
    if (cbServiceWorker) {
      cbServiceWorker.disabled = false;

      cbServiceWorker.addEventListener('change', function (event) {
        cbServiceWorker.disabled = true;
        if (cbServiceWorker.checked) {
          navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
            cbServiceWorker.disabled = false;
          }, function (err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
            cbServiceWorker.disabled = false;
          });
        } else {

        }
      });
    }
  }
})();