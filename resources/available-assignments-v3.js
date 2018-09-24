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

    function toValidArray(arrayOfIndexes, arrayOfNames) {
        var arr =  [];
        for (let index = 0; index < arrayOfIndexes.length; index++) {
            const indexData = arrayOfIndexes[index];
            var name = getValueFromArray(indexData, arrayOfNames);
            if (name) {
                var parsedIndex = parseInt(indexData);
                if (!isNaN(parsedIndex)) {
                    arr.push(parsedIndex);
                }
            }
        }
        return arr;
    }

    function convertToNames(arrayOfIndexes, arrayOfNames) {
        var arr =  [];
        for (let index = 0; index < arrayOfIndexes.length; index++) {
            const indexData = arrayOfIndexes[index];
            var name = getValueFromArray(indexData, arrayOfNames);
            if (name) {
                arr.push(name);
            }
        }
        return arr;
    }

    function convertToIndexes(arrayOfNames, arrayOfIndexes) {
        var arr =  [];
        for (let index = 0; index < arrayOfNames.length; index++) {
            const name = arrayOfNames[index];
            for (let typeIndex = 0; typeIndex < arrayOfIndexes.length; typeIndex++) {
                const typeName = arrayOfIndexes[typeIndex];
                if (name === typeName) {
                    arr.push(typeIndex.toString());
                }
            }
        }
        return arr;
    }

    function getValueFromArray(index, arrayToGetValueFrom) {
        var parsedIndex = parseInt(index);
        if (isNaN(parsedIndex)) {
            return "";
        }else {
            if (arrayToGetValueFrom.length > parsedIndex) {
                return arrayToGetValueFrom[parsedIndex];
            }else {
                return "";
            }
        }
    }

    function getTypeName(index) {
        return getValueFromArray(index, getTypes());
    }

    function getAreaName(index) {
        return getValueFromArray(index, getAreas());
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
                const typeName = getTypeName(filterSettings.AlwaysShowTypes[index]);
                if (assignment.category == typeName) {
                    // Assignment are protected
                    isProtected = true;
                    break;
                }
            }

            for (let index = 0; index < filterSettings.AlwaysShowAreas.length; index++) {
                const areaName = getAreaName(filterSettings.AlwaysShowAreas[index]);
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

            for (let index = 0; index < filterSettings.NeverShowTypes.length; index++) {
                const typeName = getTypeName(filterSettings.NeverShowTypes[index]);
                if (assignment.category == typeName) {
                    indexesToRemove.push(assignmentIndex);
                    itemsMarkedAsRemove = true;
                }
            }

            const isWeekend = dayOfWeekNumber >= 6;
            if (!isWeekend) {
                for (let index = 0; index < filterSettings.HideWorkDayTypes.length; index++) {
                    const typeName = getTypeName(filterSettings.HideWorkDayTypes[index]);
                    if (assignment.category == typeName) {
                        indexesToRemove.push(assignmentIndex);
                        itemsMarkedAsRemove = true;
                    }
                }
            } else {
                for (let index = 0; index < filterSettings.HideWeekendTypes.length; index++) {
                    const typeName = getTypeName(filterSettings.HideWeekendTypes[index]);
                    if (assignment.category == typeName) {
                        indexesToRemove.push(assignmentIndex);
                        itemsMarkedAsRemove = true;
                    }
                }
            }

            if (!itemsMarkedAsRemove) {
                for (let index = 0; index < filterSettings.NeverShowAreas.length; index++) {
                    const areaName = getAreaName(filterSettings.NeverShowAreas[index]);
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
        var maxAge = 60*60*24*30;
        document.cookie = key + "=" + value + ';max-age=' + maxAge + ';path=/;secure';
    }

    function getTypes() {
        // Order MUST remain (stored in user cookies), add more items last
        var types = [
            "Biträde vid utbildning /möte",
            "Brottsofferstöd",
            "Dagvandring",
            "Figurantuppdrag",
            "Fortbildning",
            "Informationsinsats",
            "Kvällsvandring",
            "Pass / Reception",
            "Volontärmöte",
            "Övrigt",
            "Cykel / Segway",
            "Föreläsning / Temakväll"
        ];
        return types;
    }

    function getAreas() {
        // Order MUST remain (stored in user cookies), add more items last
        var areas = [
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

        // 1. Validera och sanitera all input från kakor
        // 2. Konvertera eventuellt gamla värden till nya

        var pvAlwaysShowTypes = getSettingValue("FilterAlwaysShowTypes");
        if (pvAlwaysShowTypes) {
            var tmp = toValidArray(pvAlwaysShowTypes.split(','), getTypes());
            if (tmp.length > 0) {
                hasFilter = true;
                filterSettings.AlwaysShowTypes = tmp;
            }else {
                // convert old (AND VALID) filter values
                filterSettings.AlwaysShowTypes = convertToIndexes(tmp, getTypes());
                hasFilter = filterSettings.AlwaysShowTypes.length > 0;
            }
            // Update timestamp for cookie
            setSettingValue("FilterAlwaysShowTypes", filterSettings.AlwaysShowTypes.join(','));
        }

        var pvNeverShowTypes = getSettingValue("FilterNeverShowTypes");
        if (pvNeverShowTypes) {
            var tmp = toValidArray(pvNeverShowTypes.split(','), getTypes());
            if (tmp.length > 0) {
                hasFilter = true;
                filterSettings.NeverShowTypes = tmp;
            }else {
                // convert old (AND VALID) filter values
                filterSettings.NeverShowTypes = convertToIndexes(tmp, getTypes());
                hasFilter = filterSettings.NeverShowTypes.length > 0;
            }
            // Update timestamp for cookie
            setSettingValue("FilterNeverShowTypes", filterSettings.NeverShowTypes.join(','));
        }

        var pvWorkDayTypes = getSettingValue("FilterHideWorkDayTypes")
        if (pvWorkDayTypes) {
            var tmp = toValidArray(pvWorkDayTypes.split(','), getTypes());
            if (tmp.length > 0) {
                hasFilter = true;
                filterSettings.HideWorkDayTypes = tmp;
            }else {
                // convert old (AND VALID) filter values
                filterSettings.HideWorkDayTypes = convertToIndexes(tmp, getTypes());
                hasFilter = filterSettings.HideWorkDayTypes.length > 0;
            }
            // Update timestamp for cookie
            setSettingValue("FilterHideWorkDayTypes", filterSettings.HideWorkDayTypes.join(','));
        }

        var pvWeekendTypes = getSettingValue("FilterHideWeekendTypes");
        if (pvWeekendTypes) {
            var tmp = toValidArray(pvWeekendTypes.split(','), getTypes());
            if (tmp.length > 0) {
                hasFilter = true;
                filterSettings.HideWeekendTypes = tmp;
            }else {
                // convert old (AND VALID) filter values
                filterSettings.HideWeekendTypes = convertToIndexes(tmp, getTypes());
                hasFilter = filterSettings.HideWeekendTypes.length > 0;
            }
            // Update timestamp for cookie
            setSettingValue("FilterHideWeekendTypes", filterSettings.HideWeekendTypes.join(','));
        }

        var pvNeverShowAreas = getSettingValue("FilterNeverShowAreas");
        if (pvNeverShowAreas) {
            var tmp = toValidArray(pvNeverShowAreas.split(','), getAreas());
            if (tmp.length > 0) {
                hasFilter = true;
                filterSettings.NeverShowAreas = tmp;
            }else {
                // convert old (AND VALID) filter values
                filterSettings.NeverShowAreas = convertToIndexes(tmp, getAreas());
                hasFilter = filterSettings.NeverShowAreas.length > 0;
            }
            // Update timestamp for cookie
            setSettingValue("FilterNeverShowAreas", filterSettings.NeverShowAreas.join(','));
        }

        var pvAlwaysShowAreas = getSettingValue("FilterAlwaysShowAreas");
        if (pvAlwaysShowAreas) {
            var tmp = toValidArray(pvAlwaysShowAreas.split(','), getAreas());
            if (tmp.length > 0) {
                hasFilter = true;
                filterSettings.AlwaysShowAreas = tmp;
            }else {
                // convert old (AND VALID) filter values
                filterSettings.AlwaysShowAreas = convertToIndexes(tmp, getAreas());
                hasFilter = filterSettings.AlwaysShowAreas.length > 0;
            }
            // Update timestamp for cookie
            setSettingValue("FilterAlwaysShowAreas", filterSettings.AlwaysShowAreas.join(','));
        }

        if (hasFilter) {
            return filterSettings;
        } else {
            return null;
        }
    }

    function addItemsToList(listContainer, items) {
        listContainer.innerHTML = '';

        if (items.length) {
            for (let index = 0; index < items.length; index++) {
                const text = items[index];
                var li = document.createElement('li');
                li.textContent = text;
                listContainer.appendChild(li);
            }
        } else {
            listContainer.parentElement.remove();
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

            var types = getTypes();
            var areas = getAreas();

            if (filterSettings && filterSettings.AlwaysShowTypes) {
                for (let selectedIndex = 0; selectedIndex < filterSettings.AlwaysShowTypes.length; selectedIndex++) {
                    const selectedTypeName = getTypeName(filterSettings.AlwaysShowTypes[selectedIndex]);
                    for (let index = 0; index < types.length; index++) {
                        const typeName = types[index];
                        if (selectedTypeName == typeName) {
                            clone.querySelector('#show-type-' + index).checked = true;
                        }
                    }
                }
            }

            if (filterSettings && filterSettings.NeverShowTypes) {
                for (let selectedIndex = 0; selectedIndex < filterSettings.NeverShowTypes.length; selectedIndex++) {
                    const selectedTypeName = getTypeName(filterSettings.NeverShowTypes[selectedIndex]);
                    for (let index = 0; index < types.length; index++) {
                        const typeName = types[index];
                        if (selectedTypeName == typeName) {
                            clone.querySelector('#hide-type-' + index).checked = true;
                        }
                    }
                }
            }

            if (filterSettings && filterSettings.HideWorkDayTypes) {
                for (let selectedIndex = 0; selectedIndex < filterSettings.HideWorkDayTypes.length; selectedIndex++) {
                    const selectedTypeName = getTypeName(filterSettings.HideWorkDayTypes[selectedIndex]);
                    for (let index = 0; index < types.length; index++) {
                        const typeName = types[index];
                        if (selectedTypeName == typeName) {
                            clone.querySelector('#hide-workday-type-' + index).checked = true;
                        }
                    }
                }
            }

            if (filterSettings && filterSettings.HideWeekendTypes) {
                for (let selectedIndex = 0; selectedIndex < filterSettings.HideWeekendTypes.length; selectedIndex++) {
                    const selectedTypeName = getTypeName(filterSettings.HideWeekendTypes[selectedIndex]);
                    for (let index = 0; index < types.length; index++) {
                        const typeName = types[index];
                        if (selectedTypeName == typeName) {
                            clone.querySelector('#hide-weekend-day-type-' + index).checked = true;
                        }
                    }
                }
            }

            if (filterSettings && filterSettings.AlwaysShowAreas) {
                for (let selectedIndex = 0; selectedIndex < filterSettings.AlwaysShowAreas.length; selectedIndex++) {
                    const selectedAreaName = getAreaName(filterSettings.AlwaysShowAreas[selectedIndex]);
                    for (let index = 0; index < areas.length; index++) {
                        const areaName = areas[index];
                        if (selectedAreaName == areaName) {
                            clone.querySelector('#show-area-' + index).checked = true;
                        }
                    }
                }
            }

            if (filterSettings && filterSettings.NeverShowAreas) {
                for (let selectedIndex = 0; selectedIndex < filterSettings.NeverShowAreas.length; selectedIndex++) {
                    const selectedAreaName = getAreaName(filterSettings.NeverShowAreas[selectedIndex]);
                    for (let index = 0; index < areas.length; index++) {
                        const areaName = areas[index];
                        if (selectedAreaName == areaName) {
                            clone.querySelector('#hide-area-' + index).checked = true;
                        }
                    }
                }
            }

            var form = clone.querySelector('#available-assignments-filter-container');
            form.addEventListener('submit', function (event) {
                event.preventDefault();

                // Store options that user made
                //var types = getTypes();
                //var areas = getAreas();

                var showTypes = [];
                var hideType = [];
                var hideWorkdayType = [];
                var hideWeekendDayType = [];
                var showArea = [];
                var hideArea = [];

                var checkedOptions = document.querySelector('#available-assignments-filter-container').querySelectorAll('[type=checkbox]:checked');
                for (var i = 0; i < checkedOptions.length; i++) {
                    var option = checkedOptions[i];

                    if (!option.name) {
                        continue;
                    }

                    var position = parseInt(option.name.substr(option.name.lastIndexOf('-') + 1));

                    if (option.name.indexOf('-type-') != -1) {
                        //var typeName = types[position];
                        if (option.name.indexOf('show-type') != -1) {
                            showTypes.push(position);
                        } else if (option.name.indexOf('hide-type') != -1) {
                            hideType.push(position);
                        } else if (option.name.indexOf('hide-workday-type') != -1) {
                            hideWorkdayType.push(position);
                        } else if (option.name.indexOf('hide-weekend-day-type') != -1) {
                            hideWeekendDayType.push(position);
                        }
                    } else if (option.name.indexOf('-area-') != -1) {
                        //var areaName = areas[position];
                        if (option.name.indexOf('show-area') != -1) {
                            showArea.push(position);
                        } else {
                            hideArea.push(position);
                        }
                    }
                }

                setSettingValue('FilterAlwaysShowTypes', showTypes.toString());
                setSettingValue('FilterNeverShowTypes', hideType.toString());
                setSettingValue('FilterHideWorkDayTypes', hideWorkdayType.toString());
                setSettingValue('FilterHideWeekendTypes', hideWeekendDayType.toString());
                setSettingValue('FilterAlwaysShowAreas', showArea.toString());
                setSettingValue('FilterNeverShowAreas', hideArea.toString());

                updateFilterInterface(false);
                getItems();

                // Scroll to top (to ensure view)
                window.scroll(0, 0);
            });
        }
        else if (filterSettings) {
            // show filter settings that we use
            clone = document.importNode(templateFilterView.content, true);

            var listContainer = clone.querySelector('#FilterAlwaysShowTypes');
            addItemsToList(listContainer, convertToNames(filterSettings.AlwaysShowTypes, getTypes()));
            listContainer = clone.querySelector('#FilterNeverShowTypes');
            addItemsToList(listContainer, convertToNames(filterSettings.NeverShowTypes, getTypes()));
            listContainer = clone.querySelector('#FilterHideWorkDayTypes');
            addItemsToList(listContainer, convertToNames(filterSettings.HideWorkDayTypes, getTypes()));
            listContainer = clone.querySelector('#FilterHideWeekendTypes');
            addItemsToList(listContainer, convertToNames(filterSettings.HideWeekendTypes, getTypes()));
            listContainer = clone.querySelector('#FilterAlwaysShowAreas');
            addItemsToList(listContainer, convertToNames(filterSettings.AlwaysShowAreas, getAreas()));
            listContainer = clone.querySelector('#FilterNeverShowAreas');
            addItemsToList(listContainer, convertToNames(filterSettings.NeverShowAreas, getAreas()));

            var form = clone.querySelector('#available-assignments-filter-container');
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                updateFilterInterface(true);
            });
        } else {
            clone = document.importNode(templateFilterNone.content, true);
            var form = clone.querySelector('#available-assignments-filter-container');
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                updateFilterInterface(true);
            });
        }
        container.innerHTML = '';
        container.appendChild(clone);
    }

    function getItems() {
        var serviceUrl = 'https://polisens-volontarer-api.azurewebsites.net/api/AvailableAssignments';
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
            } else {
                window.location.assign('/?page=available-assignments');
            }
        }).then(function (array) {

            var info = {
                totalnOfItems: 0,
                filterednOfItems: 0,
                dayGroups: []
            };

            for (var index = 0; index < array.length; index++) {
                var firstItem = array[index][0];
                var items = array[index];

                // Let us know the total number of items
                info.totalnOfItems += items.length;

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
                info.filterednOfItems += items.length;

                const weHaveItemsToShowForDay = items.length > 0;
                if (weHaveItemsToShowForDay) {
                    info.dayGroups.push({
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
            return info;
        }).then(function (info) {
            if (!info.totalnOfItems) {
                window.location.assign('/?page=available-assignments');
                return info.dayGroups;
            }

            if ('content' in document.createElement('template')) {

                // Information om antal upp 
                var countInfoElement = document.querySelector('#showed-count-information');
                var countInfo = '';
                if (info.totalnOfItems != info.filterednOfItems) {
                    countInfo = info.filterednOfItems + ' av ' + info.totalnOfItems;
                }else {
                    countInfo = info.totalnOfItems;
                }
                countInfoElement.textContent = ' (' + countInfo + ')';

                var lastMonthName = false;
                var lastWeekNumber = false;
                var itemsContainer = document.querySelector("#items-container");
                itemsContainer.innerHTML = '';

                updateFilterInterface();

                var templateMonth = document.querySelector('#template-month');
                var templateWeek = document.querySelector('#template-week');
                var cloneWeek = document.importNode(templateWeek.content, true);
                var templateAssignment = document.querySelector('#template-assignment');

                var weekIndex = 1;
                for (let index = 0; index < info.dayGroups.length; index++) {
                    const day = info.dayGroups[index];

                    if (lastMonthName != day.monthName) {
                        // logic for when we are in same week but just changed month.
                        if (lastWeekNumber == day.weekNumber) {
                            if (lastWeekNumber) {
                                itemsContainer.appendChild(cloneWeek);
                                cloneWeek = document.importNode(templateWeek.content, true);
                            }
                            weekIndex++;
                        }

                    }
                    if (lastWeekNumber != day.weekNumber) {
                        if (lastWeekNumber) {
                            itemsContainer.appendChild(cloneWeek);
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
                        itemsContainer.appendChild(cloneMonth);

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

                itemsContainer.appendChild(cloneWeek);
            } else {
                // TODO: Show warning message to user that it requires template support
            }


        }).catch(function (ex) {
            console.log(ex);
        });
    }

    getItems();
})();