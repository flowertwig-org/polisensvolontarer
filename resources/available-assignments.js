(function () {
    'use strict';

    var result = fetch('https://polisens-volontarer-api.azurewebsites.net/api/AvailableAssignments', {
        method: 'GET',
        credentials: 'include'
    });
    result.then(function (response) {
        console.log('response', response);
        console.log('header', response.headers.get('Content-Type'));
        return response.json();
    }).then(function (json) {
        console.log('got text', json);
        var output = document.querySelector('#output');
        output.innerHTML = (text);
    }).catch(function (ex) {
        console.log('failed', ex);
    });
})();