(function () {
    'use strict';

    var result = fetch('https://polisens-volontarer-api.azurewebsites.net/api/AvailableAssignments');
    result.then(function (response) {
        console.log('response', response);
        console.log('header', response.headers.get('Content-Type'));
        return response.text();
    }).then(function (text) {
        console.log('got text', text);
        var output = document.querySelector('#output');
        output.innerHTML = (text);
    }).catch(function (ex) {
        console.log('failed', ex);
    });
})();