(function () {
    'use strict';

    // If we are in test environment, change all form actions
    var inTestEnvironment = location.origin.indexOf('test-') != -1;
    if (inTestEnvironment) {
        var forms = document.querySelectorAll('form');
        if (forms.length) {
            for (var i = 0; i < forms.length; i++) {
                var form = forms[i];
                form.action = form.action.replace("https://", "https://test-");
            }
        }
    }
})();