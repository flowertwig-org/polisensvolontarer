(function () {
  'use strict';

  if ('serviceWorker' in navigator) {

    // Enable Service worker checkbox
    var cbServiceWorker = document.querySelector('#serviceworker');
    if (cbServiceWorker) {
      cbServiceWorker.disabled = false;
      // Remember setting
      if (sessionStorage.getItem('settings-serviceworker')) {
        cbServiceWorker.checked = false;
      }

      cbServiceWorker.addEventListener('change', function (event) {
        cbServiceWorker.disabled = true;
        if (cbServiceWorker.checked) {
          navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
            sessionStorage.setItem('settings-serviceworker', '1');
            cbServiceWorker.disabled = false;
          }, function (err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
            sessionStorage.removeItem('settings-serviceworker');
            cbServiceWorker.disabled = false;
          });
        } else {

        }
      });
    }
  }
})();