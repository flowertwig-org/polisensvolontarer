(function () {
    'use strict';

    function removeWarning(code) {
        // Calling removeWarning with int fix (we require string)
        code = '' + code;
        document.querySelectorAll('.warning-' + code).forEach(function (element) {
            element.remove();
        });
    }

    function showWarning(code) {
        // Calling showWarning with int fix (we require string)
        code = '' + code;
        var warningElement = document.createElement('div');
        warningElement.className = 'warning warning-' + code;
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
            case "7":
                warningElement.innerHTML = '<b>Kunde ej ändra lösenord.</b><br>Lösenordet som är angivet i <b>"Nytt lösenordet"</b> överensstämmer ej med det som är angivet i <b>"Upprepa nytt lösenord"</b>.';
                break;
            case "8":
                warningElement.innerHTML = '<b>Du har inte längre kontakt med Internet.</b><br>Information du ser kan vara inaktuell. <a href="/restricted/offline/">Du kan läsa mer om inaktuell information här</a>';
                break;
            case "9":
                warningElement.innerHTML = '<b>Din webbläsare uppfyller inte alla tekniska krav.</b><br>Din webbläsare har ej stöd för all funktionalitet som krävs för att denna webbplats skall fungera.<br>Försök igen med en annan webbläsare eller enhet.<br>Funktionalitet som saknas inkluderar en/flera av nedan:<ul><li><a href="https://caniuse.com/#search=sessionStorage">sessionStorage</a> - Används för att hålla dig inloggad</li><li><a href="https://caniuse.com/#search=localStorage">localStorage</a> - Används för att spara dina filtreringar och andra inställningar</li><li><a href="https://caniuse.com/#search=template">template</a> - Används för att uppdatera sidan med ny information</li><li><a href="https://caniuse.com/#feat=fetch">fetch</a> - Används för att hämta all information. Tex om uppdrag, inloggningar mm.</li></ul>';
                break;
        }
        document.querySelector('main').insertAdjacentElement('afterbegin', warningElement);
    }

    window.addEventListener('offline', function (e) {
        showWarning(8);
    });

    window.addEventListener('online', function (e) {
        removeWarning(8);
    });

    if (!navigator.onLine) {
        showWarning(8);
    }

    if (!('sessionStorage' in window)
    || !('localStorage' in window)
    || !('importNode' in document)
    || !('fetch' in window)) {
        showWarning(9);
    }


    // Listen for the event.
    document.body.addEventListener('warning', function (e) {
        showWarning(e.detail);
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