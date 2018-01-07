(function () {
    'use strict';

    var result = fetch('https://polisens-volontarer-api.azurewebsites.net/api/MyAssignments', {
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

        var nOfConfirms = myAssignments.confirms.length;
        document.querySelector('#my-assignments-count').textContent = nOfConfirms;
        document.querySelector('#my-assignments').style.display = 'block';

        var main = document.querySelector("#my-assignments-confirms");
        if (nOfConfirms > 0) {
            if ('content' in document.createElement('template')) {
                var templateAssignment = document.querySelector('#template-my-assignment');

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