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
                    case "2":
                        warningElement.innerText = 'Kunde inte logga in dig. Kontrollera att du angett rätt användarnamn och lösenord.';
                        break;
                    case "3":
                        warningElement.innerText = 'Du har antingen blivit utloggad pga inaktivitet eller så är din webbläsare inställd att inte tillåta tredjeparts kakor.';
                        break;
                    case "4":
                        warningElement.innerText = 'Okänt tekniskt fel inträffade, vänligen försök igen lite senare.';
                        break;
                }
                document.querySelector('main').insertAdjacentElement('afterbegin', warningElement);
                break;
        }
    }
})();