(function () {
    'use strict';

    function setCookie(name,value,days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    function showWaitingMessage() {
        var templateWaiting = document.querySelector('#waiting');
        var clone = document.importNode(templateWaiting.content, true);

        var container = document.querySelector('#waiting-container');
        container.innerHTML = '';
        container.appendChild(clone);
    }

    function hideWaitingMessage() {
        var container = document.querySelector('#waiting-container');
        container.innerHTML = '';
    }

    var serviceUrl = 'https://polisens-volontarer-api.azurewebsites.net/api/MyAssignments';
    var inTestEnvironment = location.origin.indexOf('test-') != -1;
    if (inTestEnvironment) {
        serviceUrl = serviceUrl.replace("https://", "https://test-");
    }

    var cookieFailKey = sessionStorage.getItem('cookieFailKey');
    if (cookieFailKey) {
        serviceUrl += "?cookieFailKey=" + cookieFailKey;
    }

    showWaitingMessage();

    var result = fetch(serviceUrl, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors'
    });
    result.then(function (response) {
        if (response.ok) {
            return response.json();
            // TODO: Re enable this part when code is working as it should again
        } else {
            window.location.assign('/');
        }
    }).then(function (myAssignments) {
        if (!myAssignments.isLoggedIn) {
            // We are not logged in, cancel here.
            hideWaitingMessage();
            return myAssignments;
        }
        if (!myAssignments || !('confirms' in myAssignments)) {
            // We don't have a vaild object, cancel here
            //window.location.assign('/');
            hideWaitingMessage();
            return myAssignments;
        }

        // Dina intresse anmälningar
        var nOfInterests = myAssignments.interests.length;
        // Visa bara intressa anmälningar OM vi har några
        if (nOfInterests > 0) {
            document.querySelector('#my-assignments-interests-count').textContent = nOfInterests;

            var main = document.querySelector("#my-assignments-interests-items");
            if ('content' in document.createElement('template')) {
                var templateAssignment = document.querySelector('#template-my-assignments');

                for (let index = 0; index < nOfInterests; index++) {
                    const assignment = myAssignments.interests[index];
                    
                    var assignmentName = templateAssignment.content.querySelector(".assignment-name");
                    assignmentName.textContent = assignment.name;
    
                    assignmentName.href = "/restricted/assignment?key=" + assignment.id;
                    var assignmentWhen = templateAssignment.content.querySelector(".assignment-when");
                    assignmentWhen.textContent = assignment.date;
                    var assignmentType = templateAssignment.content.querySelector(".assignment-type");
                    assignmentType.textContent = assignment.category;
    
                    var cloneAssignment = document.importNode(templateAssignment.content, true);
                    main.appendChild(cloneAssignment);

                    document.querySelector('#my-assignments-interests').style.display = 'block';
                }

            } else {
                // TODO: Show warning message to user that it requires template support
            }
        }



        // Dina reservplatser
        var nOfReservations = myAssignments.reservations.length;
        // Visa bara reservplatser OM vi har några
        if (nOfReservations > 0) {
            document.querySelector('#my-assignments-reservations-count').textContent = nOfReservations;

            var main = document.querySelector("#my-assignments-reservations-items");
            if ('content' in document.createElement('template')) {
                var templateAssignment = document.querySelector('#template-my-assignments');

                for (let index = 0; index < nOfReservations; index++) {
                    const assignment = myAssignments.reservations[index];
                    
                    var assignmentName = templateAssignment.content.querySelector(".assignment-name");
                    assignmentName.textContent = assignment.name;
    
                    assignmentName.href = "/restricted/assignment?key=" + assignment.id;
                    var assignmentWhen = templateAssignment.content.querySelector(".assignment-when");
                    assignmentWhen.textContent = assignment.date;
                    var assignmentType = templateAssignment.content.querySelector(".assignment-type");
                    assignmentType.textContent = assignment.category;
    
                    var cloneAssignment = document.importNode(templateAssignment.content, true);
                    main.appendChild(cloneAssignment);

                    document.querySelector('#my-assignments-reservations').style.display = 'block';
                }

            } else {
                // TODO: Show warning message to user that it requires template support
            }
        }


        // Dina uppdrag
        var nOfConfirms = myAssignments.confirms.length;
        document.querySelector('#my-assignments-count').textContent = nOfConfirms;
        document.querySelector('#my-assignments').style.display = 'block';

        var main = document.querySelector("#my-assignments-confirms");
        if (nOfConfirms > 0) {
            if ('content' in document.createElement('template')) {
                var templateAssignment = document.querySelector('#template-my-assignments');

                for (let index = 0; index < nOfConfirms; index++) {
                    const assignment = myAssignments.confirms[index];
                    
                    var assignmentName = templateAssignment.content.querySelector(".assignment-name");
                    assignmentName.textContent = assignment.name;
    
                    assignmentName.href = "/restricted/assignment?key=" + assignment.id;
                    var assignmentWhen = templateAssignment.content.querySelector(".assignment-when");
                    assignmentWhen.textContent = assignment.date;
                    var assignmentType = templateAssignment.content.querySelector(".assignment-type");
                    assignmentType.textContent = assignment.category;
    
                    var cloneAssignment = document.importNode(templateAssignment.content, true);
                    main.appendChild(cloneAssignment);

                    var assignmentKey = btoa(assignment.name + assignment.date);
                    setCookie('assignment-' + assignmentKey, btoa(assignment.area), 14);
                }

            } else {
                // TODO: Show warning message to user that it requires template support
            }
        }else {
            main.innerHTML = '<p>Du är ej uttagen att medverka på några uppdrag</p>';
        }


        // Uppdrag att rapportera
        var nOfHistoryAssignments = myAssignments.history.length;
        // Visa bara rapport möjlighet OM vi har några
        if (nOfHistoryAssignments > 0) {
            document.querySelector('#my-assignments-reports-count').textContent = nOfHistoryAssignments;

            var main = document.querySelector("#my-assignments-reports-items");
            if ('content' in document.createElement('template')) {
                var templateAssignment = document.querySelector('#template-my-reports');

                for (let index = 0; index < nOfHistoryAssignments; index++) {
                    const assignment = myAssignments.history[index];
                    
                    var assignmentName = templateAssignment.content.querySelector(".assignment-name");
                    assignmentName.textContent = assignment.name;

                    var date = assignment.date;
                    var timeIndex = date.indexOf('T');
                    if (timeIndex > 0) {
                        date = date.substring(0, timeIndex);
                    }

                    var assignmentKey = btoa(assignment.name + ', ' + date);

                    var reportKey = getCookie('report-' + assignmentKey);
                    if (reportKey) {
                        // Användaren har redan rapporterat för detta uppdrag, ignorera denna.
                        continue;
                    }

                    var assignmentAreaKey = getCookie('assignment-' + assignmentKey);
                    var assignmentAreaKeyQuery = '';
                    if (assignmentAreaKey) {
                        assignmentAreaKeyQuery = "&areaKey=" + encodeURI(assignmentAreaKey);
                    }
    
                    assignmentName.href = "/restricted/uppdragsrapport?name=" + encodeURI(assignment.name) + "&date=" + encodeURI(date) + assignmentAreaKeyQuery;
                    var assignmentWhen = templateAssignment.content.querySelector(".assignment-when");
                    assignmentWhen.textContent = date;

                    var cloneAssignment = document.importNode(templateAssignment.content, true);
                    main.appendChild(cloneAssignment);

                    document.querySelector('#my-assignments-reports').style.display = 'block';
                }

            } else {
                // TODO: Show warning message to user that it requires template support
            }
        }

        hideWaitingMessage();
    }).catch(function (ex) {
        hideWaitingMessage();
        console.log(ex);
    });
})();