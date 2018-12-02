(function () {
    'use strict';

    var form = document.querySelector('#change-password-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // TODO: Validate new password

        submitForm(
            document.querySelector('#currentPassword').value,
            document.querySelector('#newPassword').value
        );
    });

    showForm();

    function showWaitingMessage() {
        var templateWaiting = document.querySelector('#waiting');
        var clone = document.importNode(templateWaiting.content, true);

        var container = document.querySelector('#change-password-form');
        container.innerHTML = '';
        container.appendChild(clone);
    }

    function showThanksMessage() {
        var templateThanks = document.querySelector('#thanks');
        var clone = document.importNode(templateThanks.content, true);

        var container = document.querySelector('#change-password-form');
        container.innerHTML = '';
        container.appendChild(clone);
    }

    function showForm() {
        var templateForm = document.querySelector('#form');
        var clone = document.importNode(templateForm.content, true);

        var container = document.querySelector('#change-password-form');
        container.innerHTML = '';
        container.appendChild(clone);
    }

    function submitForm(currentPassword, newPassword) {
        showWaitingMessage();

        var serviceUrl = 'https://polisens-volontarer-api.azurewebsites.net/api/ChangePassword';
        var inTestEnvironment = location.origin.indexOf('test-') != -1;
        if (inTestEnvironment) {
            serviceUrl = serviceUrl.replace("https://", "https://test-");
        }

        var result = fetch(serviceUrl, {
            method: 'POST',
            credentials: 'include',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "currentPassword=" + encodeURI(currentPassword) + "&newPassword=" + encodeURI(newPassword)
        });
        result.then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                window.location.assign('/?warning=4');
            }
        }).then(function (response) {
            if (response.isSuccess) {
                showThanksMessage();
            } else {
                var event = new CustomEvent('warning', { code: response.warning });
                document.body.dispatchEvent(event);
            }
        });
    }
})();