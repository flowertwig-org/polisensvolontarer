Date.prototype.getWeekNumber = function(){
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
  };

(function () {
    'use strict';

    function getMaxDaysInMonth(date) {
        var tmpDate = new Date(date.getFullYear() + '-' + (date.getMonth() + 1)  + '-' + 31);
        if (tmpDate && tmpDate.getMonth() == date.getMonth()) {
            return 31;
        }

        var tmpDate = new Date(date.getFullYear() + '-' + (date.getMonth() + 1)  + '-' + 30);
        if (tmpDate && tmpDate.getMonth() == date.getMonth()) {
            return 30;
        }

        var tmpDate = new Date(date.getFullYear() + '-' + (date.getMonth() + 1)  + '-' + 29);
        if (tmpDate && tmpDate.getMonth() == date.getMonth()) {
            return 29;
        }

        var tmpDate = new Date(date.getFullYear() + '-' + (date.getMonth() + 1)  + '-' + 28);
        if (tmpDate && tmpDate.getMonth() == date.getMonth()) {
            return 28;
        }
    }

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

            var maxDaysInMonth = getMaxDaysInMonth(date);

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

            if (dayOfWeekNumber == 0) {
                dayOfWeekNumber = 7;
            }

            items.push({
                monthNumber: monthNumber,
                monthName: monthName,
                dayOfMonth: dayOfMonth,
                weekNumber: weekNumber,
                dayOfWeekNumber: dayOfWeekNumber,
                dayOfWeekName: dayOfWeekName,
                assignmentName: item.name,
                category: item.category,
                area: item.area,
                maxDaysInMonth: maxDaysInMonth
            });
        }
        return items;
    }).then(function(items) {
        console.log(items);

        if ('content' in document.createElement('template')) {
            var lastMonthName = false;
            var lastWeekNumber = false;
            var main = document.querySelector("main");
            var templateMonth = document.querySelector('#template-month');
            var templateWeek = document.querySelector('#template-week');
            var weekIndex = 1;
            for (let index = 0; index < items.length; index++) {
                const item = items[index];

                if (lastMonthName != item.monthName) {
                    // TODO: Add logic for when we are in same week but just changed month.
                    if (lastWeekNumber == item.weekNumber) {
                        if (lastWeekNumber) {
                            var cloneWeek = document.importNode(templateWeek.content, true);
                            main.appendChild(cloneWeek);
                        }
                        lastWeekNumber = item.weekNumber;
                        weekIndex++;
                    }
                        
                    var monthHeader = templateMonth.content.querySelector(".month-header");
                    monthHeader.textContent = item.monthName;

                    var cloneMonth = document.importNode(templateMonth.content, true);
                    main.appendChild(cloneMonth);

                    lastMonthName = item.monthName;
                }
                if (lastWeekNumber != item.weekNumber) {
                    if (lastWeekNumber) {
                        var cloneWeek = document.importNode(templateWeek.content, true);
                        main.appendChild(cloneWeek);
                    }
                    lastWeekNumber = item.weekNumber;
                    weekIndex++;
                }

                var weekContainer = templateWeek.content.querySelector(".week-container");
                if (weekIndex % 2 == 0) {
                    weekContainer.style.padding = '5px 15px';
                    weekContainer.style.backgroundColor = 'lightblue';
                }else {
                    weekContainer.style.padding = '5px';
                    weekContainer.style.backgroundColor = '';
                }

                var weekHeader = templateWeek.content.querySelector(".week-header");
                weekHeader.textContent = "Vecka " + item.weekNumber;

                for (let weekDayIndex = 1; weekDayIndex <= 7; weekDayIndex++) {
                    var dayHeader = templateWeek.content.querySelector(".weekday-date" + weekDayIndex);
                    var dayContainer = templateWeek.content.querySelector(".day-container" + weekDayIndex);
                    var assignmentName = templateWeek.content.querySelector(".day"  + weekDayIndex + "-assignment-name");
                    var assignmentWhen = templateWeek.content.querySelector(".day"  + weekDayIndex + "-assignment-when");
                    var assignmentArea = templateWeek.content.querySelector(".day"  + weekDayIndex + "-assignment-area");
                    var assignmentType = templateWeek.content.querySelector(".day"  + weekDayIndex + "-assignment-type");
                    
                    if (item.dayOfWeekNumber == weekDayIndex) {
                        dayHeader.textContent = item.dayOfMonth + "/" + item.monthNumber;
                        assignmentName.textContent = item.assignmentName;
                        assignmentWhen.textContent = '';
                        assignmentArea.textContent = item.area;
                        assignmentType.textContent = item.category;
                        dayContainer.style.borderBottom = 'solid 1px #000';
                        dayContainer.style.marginBottom = '10px';
                        dayContainer.style.height = 'auto';
                    }else {
                        var currentDayNumber = item.dayOfMonth - item.dayOfWeekNumber + weekDayIndex;
                        if (currentDayNumber >= 1 && currentDayNumber <= item.maxDaysInMonth) {
                            dayHeader.textContent = currentDayNumber + "/" + item.monthNumber;
                        } else {
                            dayHeader.textContent = '';
                        }
                        assignmentName.textContent = '';
                        assignmentWhen.textContent = '';
                        assignmentArea.textContent = '';
                        assignmentType.textContent = '';
                        dayContainer.style.borderBottom = '';
                        dayContainer.style.marginBottom = '';
                        dayContainer.style.height = '0';
                    }
                }
            }

            var cloneWeek = document.importNode(templateWeek.content, true);
            main.appendChild(cloneWeek);
        } else {
            // TODO: Show warning message to user that it requires template support
        }


    }).catch(function (ex) {
        console.log('failed', ex);
    });
})();