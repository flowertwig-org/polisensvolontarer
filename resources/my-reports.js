(function () {
    'use strict';

    // If we where redirected from a page that required login, store info in login form so we can return to page later
    var keyValuePairs = location.search.substr(1).split('&');

    var assignmentName = '';
    var assignmentDate = '';

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
        }
    }

    if (assignmentName && assignmentDate) {
        document.querySelector('#assignmentOrDate').value = assignmentName + ', ' + assignmentDate;
    }else if (assignmentName || assignmentDate) {
        document.querySelector('#assignmentOrDate').value = assignmentName + assignmentDate;
    }

    var form = document.querySelector('#assignment-report-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        submitForm(
            document.querySelector('#name').value,
            document.querySelector('#email').value,
            document.querySelector('#assignmentOrDate').value,
            document.querySelector('#areaIndex').value,
            document.querySelector('#feedback1').value,
            document.querySelector('#feedback2').value,
            document.querySelector('#feedback3').value
        );
    });

    function submitForm(name, email, assignmentOrDate, areaIndex, feedback1, feedback2, feedback3) {
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
            body: "name=" + encodeURI(name) + "&email=" + encodeURI(email) + "&assignmentOrDate=" + encodeURI(assignmentOrDate) + "&areaIndex=" + encodeURI(areaIndex) + "&feedback1=" + encodeURI(feedback1) + "&feedback2=" + encodeURI(feedback2) + "&feedback3=" + encodeURI(feedback3)
        });
        result.then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                window.location.assign('/?warning=4');
            }
        }).then(function (response) {
            if (response.isSuccess) {
            }
        });
    }


})();