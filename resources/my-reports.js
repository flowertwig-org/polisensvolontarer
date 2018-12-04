(function () {
    'use strict';

    var form = document.querySelector('#assignment-report-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        submitForm(
            document.querySelector('#assignmentOrDate').value,
            document.querySelector('#areaIndex').value,
            document.querySelector('#feedback1').value,
            document.querySelector('#feedback2').value,
            document.querySelector('#feedback3').value,
            document.querySelector('#anonymous').checked
        );
    });

    showForm();

    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function showWaitingMessage() {
        var templateWaiting = document.querySelector('#waiting');
        var clone = document.importNode(templateWaiting.content, true);

        var container = document.querySelector('#assignment-report-form');
        container.innerHTML = '';
        container.appendChild(clone);
    }

    function showThanksMessage() {
        var templateThanks = document.querySelector('#thanks');
        var clone = document.importNode(templateThanks.content, true);

        var container = document.querySelector('#assignment-report-form');
        container.innerHTML = '';
        container.appendChild(clone);
    }

    function showForm() {
        var templateForm = document.querySelector('#form');
        var clone = document.importNode(templateForm.content, true);

        var container = document.querySelector('#assignment-report-form');
        container.innerHTML = '';
        container.appendChild(clone);


        var query = location.search.substr(1);
        if (query) {
            // If we where redirected from a page that required login, store info in login form so we can return to page later
            var keyValuePairs = query.split('&');

            var assignmentName = '';
            var assignmentDate = '';
            var assignmentAreaNameKey = '';

            for (let index = 0; index < keyValuePairs.length; index++) {
                const pair = keyValuePairs[index].split('=');
                const key = pair[0];
                let value = pair[1];

                if (value.indexOf('%') != -1) {
                    value = decodeURI(value);
                }

                switch (key) {
                    case 'name':
                        assignmentName = value;
                        break;
                    case 'date':
                        assignmentDate = value
                        break;
                    case 'areaKey':
                        assignmentAreaNameKey = value;
                        break;
                }
            }

            if (assignmentName && assignmentDate) {
                document.querySelector('#assignmentOrDate').value = assignmentName + ', ' + assignmentDate;
            } else if (assignmentName || assignmentDate) {
                document.querySelector('#assignmentOrDate').value = assignmentName + assignmentDate;
            }
            if (assignmentAreaNameKey) {
                var assignmentAreaName = atob(assignmentAreaNameKey);

                var select = document.querySelector('#areaIndex');
                var options = document.querySelectorAll('#areaIndex option');
                for (let index = 0; index < options.length; index++) {
                    const option = options[index];
                    const optionText = option.text;
                    const optionValue = option.value;
                    if (optionText == assignmentAreaName) {
                        select.value = optionValue;
                        break;
                    }
                }
            }
        }
    }

    function showWarning(code) {
        var event = new CustomEvent('warning', { detail: code });
        document.body.dispatchEvent(event);
    }

    function submitForm(assignmentOrDate, areaIndex, feedback1, feedback2, feedback3, anonymous) {
        showWaitingMessage();

        var serviceUrl = 'https://polisens-volontarer-api.azurewebsites.net/api/AssignmentReport';
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
            body: "assignmentOrDate=" + encodeURI(assignmentOrDate) + "&areaIndex=" + encodeURI(areaIndex) + "&feedback1=" + encodeURI(feedback1) + "&feedback2=" + encodeURI(feedback2) + "&feedback3=" + encodeURI(feedback3) + "&anonymous=" + encodeURI(anonymous)
        });
        result.then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                showForm();
                showWarning(4);
                //window.location.assign('/?warning=4');
            }
        }).then(function (response) {
            if (response.isSuccess) {
                var key = btoa(assignmentOrDate);
                setCookie('report-' + key, '1', 15);
                showThanksMessage();
            } else {
                showForm();
                showWarning(4);
                //alert('Kunde inte skicka rapporten');
                //window.location.reload(true);
            }
        });
    }


})();