(function () {
    'use strict';
    
    var serviceUrl = 'https://polisens-volontarer-api.azurewebsites.net/api/KeepAlive';
    var inTestEnvironment = location.origin.indexOf('test-') != -1;
    if (inTestEnvironment) {
        serviceUrl = serviceUrl.replace("https://", "https://test-");
    }

    function makeKeepAliveCall() {
        var result = fetch(serviceUrl, {
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
                        window.location.assign('/?page=assignment&' + window.location.search.substr(1));
                        break;
                    case '/restricted/available-assignments/':
                        window.location.assign('/?page=available-assignments');
                        break;
                    default:
                        window.location.assign('/');
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