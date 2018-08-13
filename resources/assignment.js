﻿(function () {
    'use strict';

    var serviceUrl = 'https://polisens-volontarer-api.azurewebsites.net/api/Assignment';
    var inTestEnvironment = location.origin.indexOf('test-') != -1;
    if (inTestEnvironment) {
        serviceUrl = serviceUrl.replace("https://", "https://test-");
    }

    var result = fetch(serviceUrl + location.search, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors'
    });
    result.then(function (response) {
        if (response.ok) {
            return response.json();
            // TODO: Re enable this part when code is working as it should again
        } else {
            window.location.assign('/login/?page=assignment&' + window.location.search.substr(1));
        }
    }).then(function (assignment) {
        if (!assignment || !('id' in assignment)) {
            window.location.assign('/login/?page=assignment&' + window.location.search.substr(1));
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
            assignmentWhen.textContent = assignment.time;
            var assignmentArea = templateAssignment.content.querySelector(".assignment-area");
            assignmentArea.textContent = assignment.area;
            var assignmentType = templateAssignment.content.querySelector(".assignment-type");
            assignmentType.textContent = assignment.category;
            var assignmentDescription = templateAssignment.content.querySelector(".assignment-description");
            assignmentDescription.innerHTML = assignment.description;
            var assignmentAdded = templateAssignment.content.querySelector(".assignment-added");
            assignmentAdded.textContent = assignment.currentNumberOfPeople;
            var assignmentRequested = templateAssignment.content.querySelector(".assignment-requested");
            assignmentRequested.textContent = assignment.wantedNumberOfPeople;
            var assignmentWhenAndWhere = templateAssignment.content.querySelector(".assignment-when-where");
            assignmentWhenAndWhere.innerHTML = "<a target='_blank' href='https://www.google.se/maps/search/" + encodeURI(assignment.meetupPlace.replace('Lokalpolisen', '').replace('lokalpolisen', '') + ', sweden') + "'>" + assignment.meetupPlace + "</a> den " + assignment.meetupTime + ".";

            var assignmentLastRequestDate = templateAssignment.content.querySelector(".assignment-last-request-date");
            assignmentLastRequestDate.textContent = assignment.lastRequestDate;

            var assignmentContact = templateAssignment.content.querySelector(".assignment-contactinfo");
            assignmentContact.innerHTML = assignment.contactInfo;

            var assignmentCalendar = templateAssignment.content.querySelector(".assignment-calendar-google");
            assignmentCalendar.href = assignment.googleCalendarEventUrl;

            var assignmentInterestForm = templateAssignment.content.querySelector("#assignment-interest-form");
            if (assignment.interestsValues.length) {
                assignmentInterestForm.className = '';
            }
            

            var cloneAssignment = document.importNode(templateAssignment.content, true);
            main.appendChild(cloneAssignment);
        } else {
            // TODO: Show warning message to user that it requires template support
        }


    }).catch(function (ex) {
        console.log(ex);
    });
})();