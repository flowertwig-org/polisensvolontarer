(function () {
    'use strict';

    var serviceUrl = 'https://polisens-volontarer-api.azurewebsites.net/api/MyAssignments';
    var inTestEnvironment = location.origin.indexOf('test-') != -1;
    if (inTestEnvironment) {
        serviceUrl = serviceUrl.replace("https://", "https://test-");
    }

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
        if (!myAssignments || !('confirms' in myAssignments)) {
            window.location.assign('/');
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
    
                    assignmentName.href = "/restricted/uppdragsrapport?name=" + assignment.name + "&date=" + date;
                    var assignmentWhen = templateAssignment.content.querySelector(".assignment-when");
                    assignmentWhen.textContent = date;
                    var assignmentType = templateAssignment.content.querySelector(".assignment-type");
                    assignmentType.textContent = assignment.category;
    
                    var cloneAssignment = document.importNode(templateAssignment.content, true);
                    main.appendChild(cloneAssignment);

                    document.querySelector('#my-assignments-reports').style.display = 'block';
                }

            } else {
                // TODO: Show warning message to user that it requires template support
            }
        }


    }).catch(function (ex) {
        console.log(ex);
    });
})();