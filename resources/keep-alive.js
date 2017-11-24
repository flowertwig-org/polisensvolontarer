(function () {
    'use strict';

    function makeKeepAliveCall() {
        var result = fetch('https://polisens-volontarer-api.azurewebsites.net/api/KeepAlive', {
            method: 'GET',
            credentials: 'include',
            mode: 'cors'
        });
        result.then(function (response) {
            if (response.ok) {
                return response.json();
            }
        }).then(function(isAlive) {
            if (!isAlive) {
                // If we are not alive anymore, return to login page
                window.location.pathname = '/login/';            
            }
        }).catch(function (ex) {

        });
    }

    makeKeepAliveCall();
    setInterval(function () {
        makeKeepAliveCall();
    }, 40000);
})();