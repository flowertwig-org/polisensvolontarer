(function () {
  'use strict';

  if ('serviceWorker' in navigator) {

    // Enable Service worker checkbox
    var cbServiceWorker = document.querySelector('#serviceworker');
    if (cbServiceWorker) {
      cbServiceWorker.disabled = true;

      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        var isRegistred = false;
        for (let registration of registrations) {
          isRegistred = true;
        }

        // Remember setting
        cbServiceWorker.checked = isRegistred;
        cbServiceWorker.disabled = false;
      });

      cbServiceWorker.addEventListener('change', function (event) {
        cbServiceWorker.disabled = true;
        if (cbServiceWorker.checked) {
          navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
            // Registration was successful
            cbServiceWorker.disabled = false;
          }, function (err) {
            // registration failed :(
            cbServiceWorker.disabled = false;
          });
        } else {
          // uninstall serviceworker
          navigator.serviceWorker.getRegistrations().then(function (registrations) {
            for (let registration of registrations) {
              registration.unregister();
            }
            cbServiceWorker.disabled = false;
          });
        }
      });
    }
  }
})();