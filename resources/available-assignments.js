Date.prototype.getWeekNumber = function () {
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
};

(function () {
    'use strict';

    function getMaxDaysInMonth(date) {
        var tmpDate = new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + 31);
        if (tmpDate && tmpDate.getMonth() == date.getMonth()) {
            return 31;
        }

        var tmpDate = new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + 30);
        if (tmpDate && tmpDate.getMonth() == date.getMonth()) {
            return 30;
        }

        var tmpDate = new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + 29);
        if (tmpDate && tmpDate.getMonth() == date.getMonth()) {
            return 29;
        }

        var tmpDate = new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + 28);
        if (tmpDate && tmpDate.getMonth() == date.getMonth()) {
            return 28;
        }
    }

    function filterItems(items, dayOfWeekNumber) {

        var filterSettings = getFilterSettings();
        if (!filterSettings) {
            // User has not specified filter, return all items
            return items;
        }

        // filters out items that we are not interested in
        var indexesToRemove = [];
        for (let assignmentIndex = 0; assignmentIndex < items.length; assignmentIndex++) {
            const assignment = items[assignmentIndex];

            var isProtected = false;

            for (let index = 0; index < filterSettings.AlwaysShowTypes.length; index++) {
                const typeName = filterSettings.AlwaysShowTypes[index];
                if (assignment.category == typeName) {
                    // Assignment are protected
                    isProtected = true;
                    break;
                }
            }

            for (let index = 0; index < filterSettings.AlwaysShowAreas.length; index++) {
                const areaName = filterSettings.AlwaysShowAreas[index];
                if (assignment.area == areaName) {
                    // Assignment are protected
                    isProtected = true;
                    break;
                }
            }

            if (isProtected) {
                continue;
            }

            let itemsMarkedAsRemove = false;
            const isWeekend = dayOfWeekNumber >= 6;
            if (!isWeekend) {
                for (let index = 0; index < filterSettings.HideWorkDayTypes.length; index++) {
                    const typeName = filterSettings.HideWorkDayTypes[index];
                    if (assignment.category == typeName) {
                        indexesToRemove.push(assignmentIndex);
                        itemsMarkedAsRemove = true;
                    }
                }
            } else {
                for (let index = 0; index < filterSettings.HideWeekendTypes.length; index++) {
                    const typeName = filterSettings.HideWeekendTypes[index];
                    if (assignment.category == typeName) {
                        indexesToRemove.push(assignmentIndex);
                        itemsMarkedAsRemove = true;
                    }
                }
            }

            if (!itemsMarkedAsRemove) {
                for (let index = 0; index < filterSettings.NeverShowAreas.length; index++) {
                    const areaName = filterSettings.NeverShowAreas[index];
                    if (assignment.area == areaName) {
                        indexesToRemove.push(assignmentIndex);
                        itemsMarkedAsRemove = true;
                    }
                }
            }
        }

        if (indexesToRemove.length) {
            indexesToRemove.reverse();

            for (let removeIndex = 0; removeIndex < indexesToRemove.length; removeIndex++) {
                const indexToRemove = indexesToRemove[removeIndex];
                items.splice(indexToRemove, 1);
            }
        }
        return items;
    }

    function getSettingValue(key) {
        var arr = document.cookie.split('; ');
        for (let index = 0; index < arr.length; index++) {
            const pair = arr[index];
            var setting = pair.split('=');
            var settingKey = setting[0];
            var settingValue = setting[1];

            if (key == settingKey) {
                return settingValue;
            }
        }
        return null;
    }

    function setSettingValue(key, value) {
        document.cookie = key + "=" + value;
    }

    function getTypes() {
        var types = [
            "Biträde vid utbildning /möte",
            "Brottsofferstöd",
            "Dagvandring",
            "Figurantuppdrag",
            "Informationsinsats",
            "Kvällsvandring",
            "Pass / Reception",
            "Volontärmöte",
            "Övrigt"
        ];     
        return types;  
    }

    function getAreas() {
        var areas =[
            // City
            "Norrmalm",
            "Södermalm",

            // Syd
            "Farsta",
            "Globen",
            "Skärholmen",
            "Botkyrka",
            "Huddinge",
            "Haninge-Nynäshamn",
            "Nacka",
            "Södertälje",

            // Nord
            "Järfälla",
            "Sollentuna",
            "Täby",
            "Norrtälje",
            "Solna",
            "Rinkeby",
            "Vällingby",

            // Centrala uppdrag
            "Operativa enheten",
            "Nattknappen",

            // Gotland
            "Gotland",

            // Gränspolisenheten
            "Arlanda"
        ];
        return areas;
    }

    function getFilterSettings() {
        var hasFilter = false;
        var filterSettings = {
            'AlwaysShowTypes': [],
            'NeverShowTypes': [],
            'HideWorkDayTypes': [],
            'HideWeekendTypes': [],
            'NeverShowAreas': [],
            'AlwaysShowAreas': []
        };

        var pvAlwaysShowTypes = getSettingValue("FilterAlwaysShowTypes");
        if (pvAlwaysShowTypes) {
            hasFilter = true;
            filterSettings.AlwaysShowTypes = pvAlwaysShowTypes.split(',');
        }

        var pvNeverShowTypes = getSettingValue("FilterNeverShowTypes");
        if (pvNeverShowTypes) {
            hasFilter = true;
            filterSettings.NeverShowTypes = pvNeverShowTypes.split(',');
        }

        var pvWorkDayTypes = getSettingValue("FilterHideWorkDayTypes")
        if (pvWorkDayTypes){
            hasFilter = true;
            filterSettings.HideWorkDayTypes = pvWorkDayTypes.split(',');
        }

        var pvWeekendTypes = getSettingValue("FilterHideWeekendTypes");
        if (pvWeekendTypes) {
            hasFilter = true;
            filterSettings.HideWeekendTypes = pvWeekendTypes.split(',');
        }

        var pvNeverShowAreas = getSettingValue("FilterNeverShowAreas");
        if (pvNeverShowAreas) {
            hasFilter = true;
            filterSettings.NeverShowAreas = pvNeverShowAreas.split(',');
        }

        var pvAlwaysShowAreas = getSettingValue("FilterAlwaysShowAreas");
        if (pvAlwaysShowAreas) {
            hasFilter = true;
            filterSettings.AlwaysShowAreas = pvAlwaysShowAreas.split(',');
        }

        if (hasFilter) {
            return filterSettings;
        }else {
            return null;
        }
    }

    function updateFilterInterface(showChangeFilter) {

        var container = document.querySelector('#filter-container');

        var templateFilterNone = document.querySelector('#filter-none');
        var templateFilterChange = document.querySelector('#filter-change-options');
        var templateFilterView = document.querySelector('#filter-view-options');

        var filterSettings = getFilterSettings();

        var clone = null;
        if (showChangeFilter) {
            clone = document.importNode(templateFilterChange.content, true);
        }
        else if (filterSettings) {
            // TODO: show filter settings that we use
            clone = document.importNode(templateFilterView.content, true);
        }else {
            clone = document.importNode(templateFilterNone.content, true);
            var form = clone.querySelector('#available-assignments-filter-container');
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                updateFilterInterface(true);
            });
        }
        container.innerHTML = '';
        container.appendChild(clone);
    }

    var result = fetch('https://polisens-volontarer-api.azurewebsites.net/api/AvailableAssignments', {
        method: 'GET',
        credentials: 'include',
        mode: 'cors'
    });
    result.then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            window.location.assign('/login/?page=available-assignments');
        }
    }).then(function (array) {
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
        if (!dayGroups || !dayGroups.length) {
            window.location.assign('/login/?page=available-assignments');
            return dayGroups;
        }

        if ('content' in document.createElement('template')) {
            var lastMonthName = false;
            var lastWeekNumber = false;
            var main = document.querySelector("main");

            updateFilterInterface();

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
                        weekIndex++;
                    }

                }
                if (lastWeekNumber != day.weekNumber) {
                    if (lastWeekNumber) {
                        main.appendChild(cloneWeek);
                        cloneWeek = document.importNode(templateWeek.content, true);
                    }
                    weekIndex++;
                }

                if (lastWeekNumber != day.weekNumber) {
                    lastWeekNumber = day.weekNumber;
                }
                
                if (lastMonthName != day.monthName) {
                    var monthHeader = templateMonth.content.querySelector(".month-header");
                    monthHeader.textContent = day.monthName;
                    var cloneMonth = document.importNode(templateMonth.content, true);
                    main.appendChild(cloneMonth);                    

                    lastMonthName = day.monthName;
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