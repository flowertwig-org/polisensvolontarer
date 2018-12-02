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

    var form = document.querySelector('#login-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        submitForm(
            document.querySelector('#username').value,
            document.querySelector('#password').value,
            document.querySelector('#page').value,
            document.querySelector('#query').value
        );
    });

    showForm();

    checkLoginStatus();

    function checkLoginStatus() {
        // This function will warmup the API before it is called AND if we are logged in alredy, redirect us directly to page
        var serviceUrl = 'https://polisens-volontarer-api.azurewebsites.net/api/login';
        var inTestEnvironment = location.origin.indexOf('test-') != -1;
        if (inTestEnvironment) {
            serviceUrl = serviceUrl.replace("https://", "https://test-");
        }

        var result = fetch(serviceUrl, {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
        });
        result.then(function (response) {
            if (response.ok) {
                return response.json();
            }
        }).then(function (response) {
            if (response) {
                window.location.assign('/restricted/');
            }
        });
    }

    function showWaitingMessage() {
        var templateWaiting = document.querySelector('#waiting');
        var clone = document.importNode(templateWaiting.content, true);

        var container = document.querySelector('#login-form');
        container.innerHTML = '';
        container.appendChild(clone);
    }

    function showForm() {
        var templateForm = document.querySelector('#form');
        var clone = document.importNode(templateForm.content, true);

        var container = document.querySelector('#login-form');
        container.innerHTML = '';
        container.appendChild(clone);
    }

    function submitForm(username, password, page, query) {
        showWaitingMessage();

        var serviceUrl = 'https://polisens-volontarer-api.azurewebsites.net/api/login';
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
            body: "username=" + encodeURI(username) + "&password=" + encodeURI(password) + "&page=" + encodeURI(page) + "&query=" + encodeURI(query)
        });
        result.then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                ShowForm();
                window.location.assign('/?warning=4');
            }
        }).then(function (response) {
            if (response.isSuccess) {
                // TODO: check if login status still true (To verify cookie support)

                var result = fetch(serviceUrl, {
                    method: 'GET',
                    credentials: 'include',
                    mode: 'cors'
                });
                result.then(function (response2) {
                    if (response2.ok) {
                        return response2.json();
                    } else {
                        ShowForm();
                        window.location.assign('/?warning=4');
                    }
                }).then(function (response3) {
                    if (response3) {
                        // Browser supports cookies, continue
                        window.location.assign(response.redirectUrl);
                    } else {
                        ShowForm();
                        window.location.assign('/?warning=5');
                    }
                });
            } else {
                ShowForm();
                window.location.assign('/?warning=2');
            }
        });
    }
})();