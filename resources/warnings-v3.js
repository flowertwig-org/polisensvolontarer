(function () {
    'use strict';

    function showWarning(code) {
        var warningElement = document.createElement('div');
        warningElement.className = 'warning';
        switch (code) {
            case "1":
                warningElement.innerHTML = 'Du använder ett vanligt använt lösenord och bör därför byta. <a href="/restricted/andra-losenord/">Ändra lösenord nu.</a>';
                break;
            case "2":
                warningElement.innerText = 'Kunde inte logga in dig. Vänligen kontrollera att du angett rätt användarnamn och lösenord.';
                break;
            case "3":
                warningElement.innerText = 'Du behöver logga in för att se denna information.';
                break;
            case "4":
                warningElement.innerText = 'Okänt tekniskt fel inträffade, vänligen försök igen lite senare.';
                break;
            case "5":
                warningElement.innerText = 'Din webbläsare är inställd att inte tillåta tredjeparts kakor. För att kunna logga in behöver du aktivera stöd för dessa.';
                break;
            case "6":
                warningElement.innerText = 'Kunde ej ändra lösenord. Nuvarande lösenordet är felaktigt.';
                break;
        }
        document.querySelector('main').insertAdjacentElement('afterbegin', warningElement);
    }

    // Listen for the event.
    document.body.addEventListener('warning', function (e) {
        // Calling showWarning with int fix (we require string)
        showWarning("" + e.detail);
    }, false);    

    var keyValuePairs = location.search.substr(1).split('&');
    for (let index = 0; index < keyValuePairs.length; index++) {
        const pair = keyValuePairs[index].split('=');
        const key = pair[0];
        const value = pair[1];

        switch (key) {
            case 'warning':
                showWarning(value);
                break;
        }
    }
})();