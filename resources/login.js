(function () {
    'use strict';

    // If we where redirected from a page that required login, store info in login form so we can return to page later
    var keyValuePairs = location.search.substr(1).split('&');
    for (let index = 0; index < keyValuePairs.length; index++) {
        const pair = keyValuePairs[index].split('=');
        const key = pair[0];
        const value = pair[1];

        switch (key) {
            case 'page':
                document.querySelector('#page').value = value;
                break;
            case 'key':
                document.querySelector('#query').value = '?' + keyValuePairs[index];
                break;
        }
    }
})();