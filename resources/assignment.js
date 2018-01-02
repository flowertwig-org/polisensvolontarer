(function () {
    'use strict';

    var result = fetch('https://polisens-volontarer-api.azurewebsites.net/api/Assignment' + location.search, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors'
    });
    result.then(function (response) {
        if (response.ok) {
            return response.json();
            // TODO: Re enable this part when code is working as it should again
        } else {
            window.location.pathname = '/login/';
        }
    }).then(function (assignment) {
        if (!assignment || !('id' in assignment)) {
            window.location.pathname = '/login/';
            return assignment;
        }

        if ('content' in document.createElement('template')) {
            var lastMonthName = false;
            var lastWeekNumber = false;
            var main = document.querySelector("main");
            var templateAssignment = document.querySelector('#template-assignment');

            var assignmentName = templateAssignment.content.querySelector(".assignment-name");
            assignmentName.textContent = assignment.name;
            var assignmentWhen = templateAssignment.content.querySelector(".assignment-when");
            assignmentWhen.textContent = assignment.date;
            var assignmentArea = templateAssignment.content.querySelector(".assignment-area");
            assignmentArea.textContent = assignment.area;
            var assignmentType = templateAssignment.content.querySelector(".assignment-type");
            assignmentType.textContent = assignment.category;
            var assignmentDescription = templateAssignment.content.querySelector(".assignment-description");
            assignmentDescription.textContent = assignment.description;

            var cloneAssignment = document.importNode(templateAssignment.content, true);
            main.appendChild(cloneAssignment);
        } else {
            // TODO: Show warning message to user that it requires template support
        }


    }).catch(function (ex) {
        console.log(ex);
    });
})();