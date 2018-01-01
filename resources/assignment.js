﻿(function () {
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
        //} else {
        //    window.location.pathname = '/login/';
        }
    }).then(function (array) {
        console.log('result.then', array);
        return;
        var dayGroups = [];
        for (var index = 0; index < array.length; index++) {
            var firstItem = array[index][0];
            var items = array[index];
            var date = new Date(firstItem.date);
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

            items = filterItems(items, dayOfWeekNumber);

            const weHaveItemsToShowForDay = items.length > 0;
            if (weHaveItemsToShowForDay) {
                dayGroups.push({
                    monthNumber: monthNumber,
                    monthName: monthName,
                    dayOfMonth: dayOfMonth,
                    weekNumber: weekNumber,
                    dayOfWeekNumber: dayOfWeekNumber,
                    dayOfWeekName: dayOfWeekName,
                    maxDaysInMonth: maxDaysInMonth,
                    items: items
                });
            }
        }
        return dayGroups;
    }).then(function (dayGroups) {
        //if (!dayGroups || !dayGroups.length) {
        //    window.location.pathname = '/login/';
        //    return dayGroups;
        //}

        if ('content' in document.createElement('template')) {
            var lastMonthName = false;
            var lastWeekNumber = false;
            var main = document.querySelector("main");
            var templateMonth = document.querySelector('#template-month');
            var templateWeek = document.querySelector('#template-week');
            var cloneWeek = document.importNode(templateWeek.content, true);
            var templateAssignment = document.querySelector('#template-assignment');

            var weekIndex = 1;
            for (let index = 0; index < dayGroups.length; index++) {
                const day = dayGroups[index];

                if (lastMonthName != day.monthName) {
                    // logic for when we are in same week but just changed month.
                    if (lastWeekNumber == day.weekNumber) {
                        if (lastWeekNumber) {
                            main.appendChild(cloneWeek);
                            cloneWeek = document.importNode(templateWeek.content, true);
                        }
                        lastWeekNumber = day.weekNumber;
                        weekIndex++;
                    }

                    var monthHeader = templateMonth.content.querySelector(".month-header");
                    monthHeader.textContent = day.monthName;

                    var cloneMonth = document.importNode(templateMonth.content, true);
                    main.appendChild(cloneMonth);

                    lastMonthName = day.monthName;
                }
                if (lastWeekNumber != day.weekNumber) {
                    if (lastWeekNumber) {
                        main.appendChild(cloneWeek);
                        cloneWeek = document.importNode(templateWeek.content, true);
                    }
                    lastWeekNumber = day.weekNumber;
                    weekIndex++;
                }

                

                var weekContainer = cloneWeek.querySelector(".week-container");
                if (weekIndex % 2 == 0) {
                    weekContainer.style.padding = '5px 15px';
                    weekContainer.style.backgroundColor = 'lightblue';
                } else {
                    weekContainer.style.padding = '5px';
                    weekContainer.style.backgroundColor = '';
                }

                var weekHeader = cloneWeek.querySelector(".week-header");
                weekHeader.textContent = "Vecka " + day.weekNumber;

                for (let weekDayIndex = 1; weekDayIndex <= 7; weekDayIndex++) {
                    var dayHeader = cloneWeek.querySelector(".weekday-date" + weekDayIndex);
                    var dayContainer = cloneWeek.querySelector(".day-container" + weekDayIndex);

                    var assignmentName = templateAssignment.content.querySelector(".assignment-name");
                    var assignmentWhen = templateAssignment.content.querySelector(".assignment-when");
                    var assignmentArea = templateAssignment.content.querySelector(".assignment-area");
                    var assignmentType = templateAssignment.content.querySelector(".assignment-type");

                    if (day.dayOfWeekNumber == weekDayIndex) {
                        if (day.items.length) {
                            for (let assignmentIndex = 0; assignmentIndex < day.items.length; assignmentIndex++) {
                                const assignment = day.items[assignmentIndex];

                                dayHeader.textContent = day.dayOfMonth + "/" + day.monthNumber;

                                assignmentName.textContent = assignment.name;
                                assignmentName.href = "/restricted/assignment?key=" + assignment.id;
                                assignmentWhen.textContent = '';
                                assignmentArea.textContent = assignment.area;
                                assignmentType.textContent = assignment.category;

                                var cloneAssignment = document.importNode(templateAssignment.content, true);
                                dayContainer.appendChild(cloneAssignment);
                            }
                            //dayContainer.className = 'day-container day-container' + weekDayIndex;
                        } else {
                            //dayContainer.className = 'day-container day-container' + weekDayIndex + ' mobile-hide';
                        }
                    } else {
                        var currentDayNumber = day.dayOfMonth - day.dayOfWeekNumber + weekDayIndex;
                        if (currentDayNumber >= 1 && currentDayNumber <= day.maxDaysInMonth) {
                            dayHeader.textContent = currentDayNumber + "/" + day.monthNumber;
                        } else {
                            dayHeader.textContent = '';
                        }
                        //dayContainer.className = 'day-container day-container' + weekDayIndex + ' mobile-hide';
                    }
                }
            }

            main.appendChild(cloneWeek);
        } else {
            // TODO: Show warning message to user that it requires template support
        }


    }).catch(function (ex) {
        console.log(ex);
    });
})();