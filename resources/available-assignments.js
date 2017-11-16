Date.prototype.getWeekNumber = function(){
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
  };

(function () {
    'use strict';

    var result = fetch('https://polisens-volontarer-api.azurewebsites.net/api/AvailableAssignments', {
        method: 'GET',
        credentials: 'include'
    });
    result.then(function (response) {
        return response.json();
    }).then(function (array) {
        var items = [];
        for (var index = 0; index < array.length; index++) {
            var item = array[index];
            var date = new Date(item.date);
            var monthNumber = date.getMonth() + 1;
            var dayOfMonth = date.getDate();
            var dayOfWeekNumber = date.getDay();
            var weekNumber = date.getWeekNumber();

            var dayOfWeekName = '';
            switch (dayOfWeekNumber) {
                case 1:
                    dayOfWeekName = 'Måndag';
                    break;
                case 2:
                    dayOfWeekName = 'Tisdag';
                    break;
                case 3:
                    dayOfWeekName = 'Onsdag';
                    break;
                case 4:
                    dayOfWeekName = 'Torsdag';
                    break;
                case 5:
                    dayOfWeekName = 'Fredag';
                    break;
                case 6:
                    dayOfWeekName = 'Lördag';
                    break;
                case 0:
                    dayOfWeekName = 'Söndag';
                    break;
            }

            var monthName = '';
            switch (monthNumber) {
                case 1:
                    monthName = 'Januari';
                    break;
                case 1:
                    monthName = 'Januari';
                    break;
                case 2:
                    monthName = 'Februari';
                    break;
                case 3:
                    monthName = 'Mars';
                    break;
                case 4:
                    monthName = 'April';
                    break;
                case 5:
                    monthName = 'Maj';
                    break;
                case 6:
                    monthName = 'Juni';
                    break;
                case 7:
                    monthName = 'Juli';
                    break;
                case 8:
                    monthName = 'Augusti';
                    break;
                case 9:
                    monthName = 'September';
                    break;
                case 10:
                    monthName = 'Oktober';
                    break;
                case 11:
                    monthName = 'November';
                    break;
                case 12:
                    monthName = 'December';
                    break;
            }

            items.push({
                monthName: monthName,
                weekNumber: weekNumber,
                dayOfWeekNumber: dayOfWeekNumber,
                dayOfWeekName: dayOfWeekName,
                assignmentName: item.name,
                category: item.category,
                area: item.area
            });
        }
        console.log('items', items);
        //var output = document.querySelector('#output');
        //output.innerHTML = (json);
        return items;
    }).then(function(items) {
        console.log(items);

        if ('content' in document.createElement('template')) {
            for (let index = 0; index < items.length; index++) {
                const item = items[index];

                var template = document.querySelector('#template-month'),
                var monthHeader = t.content.querySelector(".month-header");
                monthHeader.textContent = item.monthName;
              
                var filterContainer = document.querySelector("#available-assignments-filter-container");
                var clone = document.importNode(template.content, true);
                filterContainer.insertAdjacentElement('afterend', clone);
            }

        }else {
            // TODO: Show warning message to user that it requires template support
        }


    }).catch(function (ex) {
        console.log('failed', ex);
    });
})();