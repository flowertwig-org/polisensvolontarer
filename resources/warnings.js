(function () {
    'use strict';

    var keyValuePairs = location.search.substr(1).split('&');
    for (let index = 0; index < keyValuePairs.length; index++) {
        const pair = keyValuePairs[index].split('=');
        const key = pair[0];
        const value = pair[1];

        switch (key) {
            case 'warning':
                var warningElement = document.createElement('div');
                warningElement.className = 'warning';
                switch (value) {
                    case "1":
                        warningElement.innerText = 'Du använder ett vanligt använt lösenord och bör därför byta. Just nu kan du bara göra detta på: http://volontar.polisen.se';
                        break;
                    }
                document.querySelector('main').insertAdjacentElement('afterbegin', warningElement);
                break;
        }
    }
})();