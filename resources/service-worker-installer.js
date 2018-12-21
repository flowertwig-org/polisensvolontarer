(function () {
  'use strict';

  if ('serviceWorker' in navigator) {

    // Enable Service worker checkbox
    var cbServiceWorker = document.querySelector('#serviceworker');
    if (cbServiceWorker) {
      cbServiceWorker.disabled = false;
      // Remember setting
      if (localStorage.getItem('settings-serviceworker')) {
        cbServiceWorker.checked = true;
      }

      cbServiceWorker.addEventListener('change', function (event) {
        cbServiceWorker.disabled = true;
        if (cbServiceWorker.checked) {
          navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
            localStorage.setItem('settings-serviceworker', '1');
            cbServiceWorker.disabled = false;
          }, function (err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
            localStorage.removeItem('settings-serviceworker');
            cbServiceWorker.disabled = false;
          });
        } else {
          // uninstall serviceworker
          navigator.serviceWorker.getRegistrations().then(function (registrations) {
            for (let registration of registrations) {
              registration.unregister()
            }
            localStorage.removeItem('settings-serviceworker');
            cbServiceWorker.disabled = false;
          });

        }
      });
    }
  }
})();