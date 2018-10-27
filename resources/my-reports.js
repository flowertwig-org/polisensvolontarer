(function () {
    'use strict';

    // If we where redirected from a page that required login, store info in login form so we can return to page later
    var keyValuePairs = location.search.substr(1).split('&');

    var assignmentName = '';
    var assignmentDate = '';

    for (let index = 0; index < keyValuePairs.length; index++) {
        const pair = keyValuePairs[index].split('=');
        const key = pair[0];
        const value = pair[1];

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
        document.querySelector('#assignmentOrDate').value = assignmentName + ' / ' + assignmentDate;
    }else if (assignmentName || assignmentDate) {
        document.querySelector('#assignmentOrDate').value = assignmentName + assignmentDate;
    }
})();