﻿(function () {
    'use strict';

    var callCount = 1;
    
    var serviceUrl = 'https://polisens-volontarer-api.azurewebsites.net/api/KeepAlive';
    var inTestEnvironment = location.origin.indexOf('test-') != -1;
    if (inTestEnvironment) {
        serviceUrl = serviceUrl.replace("https://", "https://test-");
    }

    function makeKeepAliveCall(localCallCount) {
        var result = fetch(serviceUrl + "?callCount=" + localCallCount, {
            method: 'GET',
            credentials: 'include',
            mode: 'cors'
        });
        result.then(function (response) {
            if (response.ok) {
                return response.json();
            }
        }).then(function(resultCode) {
            var warning = '';
            if (resultCode == 0) {
                warning = 'warning=3';
            }else if (resultCode < 0) {
                warning = 'warning=4';
            }

            if (resultCode <= 0) {
                // If we are not alive anymore, return to login page
                switch (location.pathname) {
                    case '/restricted/assignment/':
                        if (warning.length) {
                            window.location.assign('/?' + warning + '&page=assignment&' + window.location.search.substr(1));
                        }else {
                            window.location.assign('/?page=assignment&' + window.location.search.substr(1));
                        }
                        break;
                    case '/restricted/available-assignments/':
                        if (warning.length) {
                            window.location.assign('/?page=available-assignments&' + warning);
                        }else {
                            window.location.assign('/?page=available-assignments');
                        }
                        break;
                    default:
                        if (warning.length) {
                            window.location.assign('/?' + warning);
                        }else {
                            window.location.assign('/');
                        }
                        break;
                }
            }
        }).catch(function (ex) {

        });
    }

    makeKeepAliveCall(callCount++);
    setInterval(function () {
        makeKeepAliveCall(callCount++);
    }, 40000);
})();