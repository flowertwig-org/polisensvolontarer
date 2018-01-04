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
                switch (location.pathname) {
                    case '/restricted/assignment/':
                        window.location.assign('/login/?page=assignment&' + window.location.search.substr(1));
                        break;
                    case '/restricted/available-assignments/':
                        window.location.assign('/login/?page=available-assignments');
                        break;
                    default:
                        window.location.assign('/login/');
                        break;
                }
            }
        }).catch(function (ex) {

        });
    }

    makeKeepAliveCall();
    setInterval(function () {
        makeKeepAliveCall();
    }, 40000);
})();