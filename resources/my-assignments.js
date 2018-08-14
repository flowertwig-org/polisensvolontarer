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
            window.location.assign('/login/');
        }
    }).then(function (myAssignments) {
        if (!myAssignments || !('confirms' in myAssignments)) {
            window.location.assign('/login/');
            return myAssignments;
        }

        // Dina intresse anmälningar
        var nOfInterests = myAssignments.interests.length;
        document.querySelector('#my-assignments-interests-count').textContent = nOfInterests;
        document.querySelector('#my-assignments-interests').style.display = 'block';

        var main = document.querySelector("#my-assignments-interests-items");
        if (nOfInterests > 0) {
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
                }

            } else {
                // TODO: Show warning message to user that it requires template support
            }
        }else {
            main.innerHTML = '<p>Du har inga intresseanmälningar</p>';
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


    }).catch(function (ex) {
        console.log(ex);
    });
})();