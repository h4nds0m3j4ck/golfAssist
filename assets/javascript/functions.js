//---------------------------------------------------------------------------------------//
//----------------------------       GLOBAL VARIABLES       -----------------------------//
//---------------------------------------------------------------------------------------//

var currentGolfCourse = null;
var currentShots = [];
var databaseRef = firebase.database();
var selectedGolfCourse = 'none';
var currentTee = '';
var map = null;
var prev_infowindow = false;


//---------------------------------------------------------------------------------------//
//-----------------------------       EVENT HANDLING       ------------------------------//
//---------------------------------------------------------------------------------------//

$(document).ready(function () {
    //POpulate Data Table
    showGames();

    $('#select-btn').on('click', function () {
        //Validate user entry
        if (selectedGolfCourse !== 'none') {
            //Show users name
            $('#player-name').text(localStorage.getItem('user_name'));

            //Show the custom score card
            showTee();
            showScoreCard();

            //Create dynamic Tee selector based on user selection
            createCustomTee(selectedGolfCourse);
        } else {
            //Error message a golf course needs to be selected
            informationModal('INPUT ERROR', 'Please select a golf course before to procced.');
        }

    });

    $('#change-tee-btn').on('click', function () {
        //Show warning message data will be lost on tee change
        decisionModal('POSSIBLE DATA LOSS!', 'All the current data will be loss if you decide to proceed.');
    });
    $('#complete-btn').on('click', function () {
        //Save to the database
        if (saveCurrentGame()) {
            //Do not allow more edits to the user
            $(document).find(".shots").prop('disabled', true);

            //Show message information message to the user
            informationModal('SUCCESSFUL TRANSACTION', 'Your game sumary was successfully saved.');

            //Hide controls
            hideCardControls();
        }
    });

    $('#ok-btn').on('click', function () {
        //Reset current game values
        resetGameValues();

        //Show the Tee radio button group
        showTee();

        //Hide modal
        $('#decision-modal').modal('hide')
    });

    //Menu other golf course
    $('#other-golf-course').on('click', function () {
        resetGameValues();
        showSelectionCard();
        $('.collapse').collapse('hide');
    });

    //Menu see history
    $('#see-history').on('click', function () {
        showHistoricalCard();
        $('.collapse').collapse('hide');
        //Create Data Table
        $('#history-table').DataTable();
    });

    $(document).on('click', '.custom-control-input', function () {
        //create dynamic table base on selected golf course.
        currentTee = ($('.custom-control-input:checked').val());
        createCustomCard($('.custom-control-input:checked').val());

        //Show score card table
        showScoreCardTable();
    });

    $(document).on('change', '.shots', function () {
        //validate the user entry
        if (Number.isInteger(parseInt($(this).val()))) {
            updateCurrentGame($(this).attr('local-index'), parseInt($(this).val()));
        } else {
            //Shor error message.
            informationModal('INPUT ERROR', 'Please type and integer value.');
            $(this).val(0);
        }
    });

    //Prevent the use of number
    $(document).on('keypress', '.shots', function (event) {
        if (event.key == 1 || event.key == 2 || event.key == 3 || event.key == 4 || event.key == 5
            || event.key == 6 || event.key == 7 || event.key == 8 || event.key == 9 || event.key == 0) {

        } else {
            event.preventDefault();
        }
    });
});

//---------------------------------------------------------------------------------------//
//-------------------------------       WEATHER API       -------------------------------//
//---------------------------------------------------------------------------------------//

function renderWeather(city_id) {
    if ($('#weather').children()) {
        $('#weather').children().remove();
    }
    console.log(city_id);
    window.myWidgetParam ? window.myWidgetParam : window.myWidgetParam = [];
    window.myWidgetParam.push({ id: 12, cityid: city_id, appid: '0722e157fffaac88706730b4c7ab6eb6', units: 'metric', containerid: 'weather', });
    (function () {
        var script = document.createElement('script');
        script.async = true;
        script.charset = "utf-8";
        script.src = "//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(script, s);
    })();
}


//---------------------------------------------------------------------------------------//
//-------------------------------       GOOGLE API        -------------------------------//
//---------------------------------------------------------------------------------------//

function initMap() {

    map = new google.maps.Map(document.getElementById('map-selection'), {
        zoom: 10,
        center: { lat: 25.761681, lng: -80.278107 },
        mapTypeId: 'roadmap'
    });

    var iconBase = "https://maps.google.com/mapfiles/kml/shapes/";
    var icons = {
        golf: {
            icon: iconBase + 'golf.png'
        }
    };

    var features = [
        {
            position: { lat: 25.6481, lng: -80.3476 },
            type: 'golf', ///BRIAN BAY
            URLPath: 'http://briarbaygolf.com/',
            name: 'Briar Bay',
            address: '9399 SW 134th Street',
            city: 'Miami',
            city_id: '4164138',
            zip: '33176',
            phone: '(305)-235-6667',
            desc: 'Briar Bay Golf Course is a par-31 Executive Golf Course, built on thirty acres, eight blocks west of US 1, north of SW 136th Street. Designed by Bruce Devlin and Robert Von Hagge, and built in 1974 by Real Estate Developer Alec Courtelis, it opened for play in January of 1975. The Parks Department acquired Briar Bay in 1979 and has operated it since that time. The course ambles west, north, east, west, south and finally east again as it winds its way back to the clubhouse.'
        }, {
            position: { lat: 25.943137, lng: -80.313405 },
            type: 'golf', //COUNTRY CLUB EAST
            URLPath: 'https://golfccmiami.com/',
            name: 'Country Club East',
            address: '6801 NW 186th Street',
            city: 'Hialeah',
            city_id: '4158476',
            zip: '33015',
            phone: '(305)-829-8456',
            desc: 'The Country Club of Miami East Course, a 6,353-yard par-70 layout with a slope of 124, requires shot placement and strategy from both the novice and serious golfer.'
        }, {
            position: { lat: 25.944592, lng: -80.319101 },
            type: 'golf', //COUNTRY CLUB WEST
            URLPath: 'https://golfccmiami.com/',
            name: 'Country Club West',
            address: '6801 NW 186th Street',
            city: 'Hialeah',
            city_id: '4158476',
            zip: '33015',
            phone: '(305)-829-8456',
            desc: 'The Country Club of Miami West Course, a 7,017-yard par-72 course with a slope of 132, hosted the 1991 Senior PGA Tour National Qualifying School. The bunkers, lush fairways, and rolling greens offer a challenging adventure. The course was the original site for the former National Airlines Open.'
        },
        {
            position: { lat: 25.7164, lng: -80.1569 },
            type: 'golf', //CRANDON
            URLPath: 'https://golfcrandon.com/',
            name: 'Crandon',
            address: '6700 Crandon Boulevard',
            city: 'Key Biscayne',
            zip: '33149',
            city_id: '4160789',
            phone: '(305)-361-9129',
            desc: 'Crandon Golf at Key Biscayne is a championship 18-hole golf course located on the island paradise of Key Biscayne, just 10 minutes from downtown Miami. It is the perfect alternative to civilization where you can spend a day enveloped by the tropics.'
        }, {
            position: { lat: 25.9389, lng: -80.1579 },
            type: 'golf', //GREYNOLDS
            URLPath: 'http://greynoldsgolf.com/',
            name: 'Greynolds Park',
            address: '17530 West Dixie Highway',
            city: 'North Miami Beach',
            city_id: '4166233',
            zip: '33160',
            phone: '(305)-949-1741',
            desc: "Greynolds Golf Course provides a 3,100-yard challenging layout. This par-36 course, designed by Mark Mahannah in 1964, is one of the county's most popular nine-hole designs for all levels of play."
        }, {
            position: { lat: 25.6266, lng: -80.3465 },
            type: 'golf', //PALMETTO
            URLPath: 'http://golfpalmetto.com/',
            name: 'Palmetto',
            address: '9300 SW 152nd Street',
            city: 'Miami',
            zip: '33157',
            city_id: '4164138',
            phone: '(305)-238-2922',
            desc: "Palmetto Golf Course is a Par-70 Championship Miami course, built on 121 acres, running parallel to US-1, south of SW 152nd Street. The 18-hole course, designed by Dick Wilson and built in 1959 by developers Porter, Russell and Wagor, was purchased by Miami-Dade County in 1967."
        }

    ];


    // CREATE MARKERS //
    features.forEach(function (feature) {
        var marker = new google.maps.Marker({
            position: feature.position,
            icon: { url: icons[feature.type].icon, scaledSize: new google.maps.Size(30, 30) },
            map: map,
            content: feature.desc,
            name: feature.name,
            title: feature.name,
            city_id: feature.city_id,
            animation: google.maps.Animation.DROP
        });

        marker.addListener('click', function () {
            var infowindow = new google.maps.InfoWindow({
                content: customInfo(feature)
            });

            if (prev_infowindow) {
                prev_infowindow.close();
            }

            prev_infowindow = infowindow;

            infowindow.open(map, marker);

            selectedGolfCourse = marker.name.toLowerCase().replace(' ', '_');

            renderWeather(marker.city_id);
        });

    });
}

function customInfo(feature) {
    var infoHTML = '<div class="d-box">';

    if (feature.URLPath.length > 0) {
        infoHTML += "<p class= 'mb-1'><a href='" + feature.URLPath + "' target='_blank'>" + feature.name + "</a></p>";
    }
    else {
        infoHTML += "<p class= 'mb-1'><span>" + feature.name + "</span></p>";
    }

    infoHTML += "<p class= 'mb-1'class= 'mb-1'>" + feature.address + "</p>";
    infoHTML += "<p>" + feature.city + ", FL " + feature.zip + "</p>";

    if (feature.desc.length > 180) {
        infoHTML += "<p'>" + feature.desc.substring(0, 180) + "...</p>";
    }
    else {
        infoHTML += "<p>" + feature.desc + "</p>";
    }

    infoHTML += "</div>";

    return infoHTML;
}

//---------------------------------------------------------------------------------------//
//-------------------------------     FIREBASE STORAGE    -------------------------------//
//---------------------------------------------------------------------------------------//

function saveCurrentGame() {
    //Validate data first
    if (validateGameInput()) {
        saveToDB(true);
        return true;
    } else {
        //Warning to the user game could be incomplete
        informationModal('MISSING DATA', "Please add missing data.");
        return false;
    }
}

function saveToDB(flag) {
    //check if the user exist on the database
    var databaseRef = firebase.database();
    databaseRef.ref("/users").child(localStorage.getItem('user_id')).once('value', function (snapshot) {
        if (snapshot.exists()) {
            databaseRef.ref('/users/' + localStorage.getItem('user_id') + '/games').push().set({
                date: (new Date()).toLocaleDateString("en-US"),
                location: currentGolfCourse.name,
                tee: currentTee,
                score: getFinalScore(),
                completed: flag
            });
        } else {
            databaseRef.ref('/users').child(localStorage.getItem('user_id')).set({
                games: [{
                    date: (new Date()).toLocaleDateString("en-US"),
                    location: currentGolfCourse.name,
                    tee: currentTee,
                    score: getFinalScore(),
                    completed: flag
                }]
            });
        }
    });

}

function validateGameInput() {
    var correct = true;
    currentShots.forEach(element => {
        if (element === 0) {
            correct = false;
        }
    });
    return correct;
}

function getFinalScore() {
    var par = 0;
    var shots = 0;



    if (currentGolfCourse.holes > 9) {
        shots = getTotalShots(0) + getTotalShots(9);
        par = getTotalPar(9, true);
    } else {
        shots = getTotalShots(0);
        par = getTotalPar(0, true);
    }

    return shots + '/' + par;
}

//---------------------------------------------------------------------------------------//
//----------------------------------      STORAGE     -----------------------------------//
//----------------------------------------------------------------------------------------//

function updateCurrentGame(index, value) {
    //update current shots.
    currentShots[index] = value;

    //update local storage

    //update totals
    $(document).find("#first9").text(getTotalShots(0));

    if (currentGolfCourse.holes > 9) {
        $(document).find("#second9").text(getTotalShots(0) + getTotalShots(9));
    }
}

function getTotalShots(start) {
    var total = 0;

    for (let index = start; index < (start + 9); index++) {
        total += currentShots[index];
    }
    return total;
}

function showGames() {

    if (databaseRef.ref("/users").child(localStorage.getItem('user_id')).child('games')) {
        databaseRef.ref("/users").child(localStorage.getItem('user_id')).child('games').on("child_added", function (snap) {
            console.log('Hello World!');
            //Populate table
            var tempRow = snap.val();
            var trTag = $('<tr>');

            var tdDateTag = $('<td>');
            var tdLocationTag = $('<td>');
            var tdTeeTag = $('<td>');
            var tdScoreTag = $('<td>');
            var tdCompletedTag = $('<td>');

            tdDateTag.text(tempRow.date);
            tdLocationTag.text(tempRow.location);
            tdTeeTag.text(tempRow.tee);
            tdScoreTag.text(tempRow.score);
            tdCompletedTag.text(tempRow.completed ? 'YES' : 'NO');

            trTag.append(tdDateTag);
            trTag.append(tdLocationTag);
            trTag.append(tdTeeTag);
            trTag.append(tdScoreTag);
            trTag.append(tdCompletedTag);

            $('#table-body').append(trTag);
        });
    } else {
        //No game to show
    }


}
//---------------------------------------------------------------------------------------//
//-------------------------------       SCORE CARD       --------------------------------//
//---------------------------------------------------------------------------------------//

function createCustomTee(pgolfCourse) {
    var queryURL = 'https://golfassist-cc729.firebaseio.com/data/' + pgolfCourse + '.json';

    //Delete everything inside tee
    $('#tee').children().remove();

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        currentGolfCourse = response;

        var existing_tees = response.availables_tees;

        initializeCurrentShots(currentGolfCourse.holes);

        for (let index = 0; index < existing_tees.length; index++) {
            var optionTag = $('<div>');
            optionTag.addClass('custom-control');
            optionTag.addClass('custom-radio');
            optionTag.addClass('custom-control-inline');

            var optionInputTag = $('<input>');
            optionInputTag.addClass('custom-control-input');
            optionInputTag.attr('type', 'radio');
            optionInputTag.attr('id', 'customRadioInline' + (index + 1));
            optionInputTag.attr('name', 'customRadioInline1');
            optionInputTag.attr('value', existing_tees[index]);


            var optionLabelTag = $('<label>');
            optionLabelTag.addClass('custom-control-label');
            optionLabelTag.attr('for', 'customRadioInline' + (index + 1));
            optionLabelTag.text(capitalize(existing_tees[index]) + ' Tee');

            optionTag.append(optionInputTag);
            optionTag.append(optionLabelTag);

            $('#tee').append(optionTag);
        }
    });
}

//Creates a custom tee option radio button based on user selection
function createCustomCard(tee) {
    //Delete everything inside card
    $('#score-card-table').children().remove();


    if (currentGolfCourse.holes === 9) {
        //need to create 9 holes card
        renderNineHolesCard(tee);
    } else {
        //need to create 18 holes card
        renderEighteenHolesCard(tee);
    }
}

//Creates a nine holes score card
function renderNineHolesCard(tee) {
    var basic = getCoreTable(0, tee, true)

    $('#score-card-table').append(basic);
}

//Creates a eighteen holes score card
function renderEighteenHolesCard(tee) {
    //First nine holes
    var basic = getCoreTable(0, tee, false)
    $('#score-card-table').append(basic);

    //Other nine holes
    var extra = getCoreTable(9, tee, true)
    $('#score-card-table').append(extra);
}

function getCoreTable(start, tee, final) {
    var containerTag = $('<div>');
    containerTag.addClass('table-responsive');

    var tableTag = $('<table>');
    tableTag.addClass('table');
    tableTag.addClass('table table-striped');
    tableTag.addClass('table-sm');

    var theadTag = $('<thead>');
    var bodyTag = $('<tbody>');

    var trHolesTag = $('<tr>');
    trHolesTag.addClass(getTeeColorBg(tee));
    trHolesTag.addClass(getTeeColorText(tee));

    var tryardsTag = $('<tr>');
    var trInputTag = $('<tr>');
    var trParTag = $('<tr>');

    //Add first column
    trHolesTag.append($('<th>HOLE</th>'));
    tryardsTag.append($('<th>YARDS</th>'));
    trInputTag.append($('<th></th>'));
    trParTag.append($('<th>PAR</th>'));

    for (let index = start; index < (start + 9); index++) {
        //Add hole number
        var thNumberTag = $('<th>');
        thNumberTag.text(index < 9 ? ('0' + (index + 1)) : (index + 1));
        trHolesTag.append(thNumberTag);

        //Add yards distance based on the hole
        var thDistanceTag = $('<th>');
        thDistanceTag.text(getHoleYards(tee, index));
        tryardsTag.append(thDistanceTag);

        //Add corresponding input
        var thInputTag = $('<th>');
        var inputTag = $('<input>');

        inputTag.addClass('shots');
        inputTag.attr('value', 0);
        inputTag.attr('local-index', index);
        inputTag.attr('id', 'hole-' + index);

        thInputTag.append(inputTag);
        trInputTag.append(thInputTag);

        //Add par  distance based on the hole
        var thParTag = $('<th>');
        thParTag.text(currentGolfCourse.par[index]);
        trParTag.append(thParTag);
    }
    //Add last column
    trHolesTag.append($('<th class ="text-center">' + ((start === 0) && (!final) ? 'FRONT' : 'TOTAL') + '/YARDS/PAR</th>'));
    tryardsTag.append($('<th class ="text-center">' + getTotalYards(tee, start, final) + '</th>'));
    trInputTag.append($('<th class ="text-center" id = "' + ((start === 0) ? 'first9' : 'second9') + '">0</th>'));
    trParTag.append($('<th class ="text-center">' + getTotalPar(start, final) + '</th>'));

    //Create table
    theadTag.append(trHolesTag);
    theadTag.append(tryardsTag);

    bodyTag.append(trInputTag);
    bodyTag.append(trParTag);

    tableTag.append(theadTag);
    tableTag.append(bodyTag);
    containerTag.append(tableTag);

    return containerTag;
}

function getTeeColorBg(tee) {
    var color = '';
    var selection = tee.trim().toLowerCase();

    if (selection === 'white') {
        color = 'bg-white';
    } else if (selection === 'blue') {
        color = 'bg-primary';
    } else if (selection === 'red') {
        color = 'bg-danger';
    } else if (selection === 'yellow') {
        color = 'bg-warning';
    } else if (selection === 'green') {
        color = 'bg-success';
    } else if (selection === 'gold') {
        color = 'bg-warning';
    } else if (selection === 'black') {
        color = 'bg-dark';
    } else {
        color = 'bg-secondary';
    }

    return color;
}

function getTeeColorText(tee) {
    var color = '';
    var selection = tee.trim().toLowerCase();

    if (selection === 'white' || selection === 'gold' || selection === 'yellow') {
        color = 'text-dark';
    } else {
        color = 'text-white';
    }

    return color;
}

function getHoleYards(tee, index) {
    var yards = '';
    var selection = tee.trim().toLowerCase();

    if (selection === 'white') {
        yards = currentGolfCourse.tees.white[index];
    } else if (selection === 'blue') {
        yards = currentGolfCourse.tees.blue[index];
    } else if (selection === 'red') {
        yards = currentGolfCourse.tees.red[index];
    } else if (selection === 'yellow') {
        yards = currentGolfCourse.tees.yellow[index];
    } else if (selection === 'green') {
        yards = currentGolfCourse.tees.green[index];
    } else if (selection === 'gold') {
        yards = currentGolfCourse.tees.gold[index];
    } else if (selection === 'black') {
        yards = currentGolfCourse.tees.black[index];
    } else {
        yards = currentGolfCourse.tees.handicap[index];
    }

    return yards;
}

function getTotalYards(tee, start, final) {
    var yardsArray = [];
    var totalYards = 0;
    var selection = tee.trim().toLowerCase();

    if (selection === 'white') {
        yardsArray = currentGolfCourse.tees.white;
    } else if (selection === 'blue') {
        yardsArray = currentGolfCourse.tees.blue;
    } else if (selection === 'red') {
        yardsArray = currentGolfCourse.tees.red;
    } else if (selection === 'yellow') {
        yardsArray = currentGolfCourse.tees.yellow;
    } else if (selection === 'green') {
        yardsArray = currentGolfCourse.tees.green;
    } else if (selection === 'gold') {
        yardsArray = currentGolfCourse.tees.gold;
    } else if (selection === 'black') {
        yardsArray = currentGolfCourse.tees.black;
    } else {
        yardsArray = currentGolfCourse.tees.handicap;
    }

    for (let index = 0; index < (!(final) ? (start + 9) : yardsArray.length); index++) {
        totalYards += yardsArray[index];
    }

    return totalYards;
}

function getTotalPar(start, final) {
    var parArray = currentGolfCourse.par;
    var totalPar = 0;

    for (let index = 0; index < (!(final) ? (start + 9) : parArray.length); index++) {
        totalPar += parArray[index];
    }

    return totalPar;
}

function resetGameValues() {
    currentTee = '';
    currentShots = [];
    selectedGolfCourse = 'none';

    for (let index = 0; index < currentShots.holes; index++) {
        currentShots[index] = 0;
    }
}

//---------------------------------------------------------------------------------------//
//-------------------------------    AUXILIAR FUNCTIONS   -------------------------------//
//---------------------------------------------------------------------------------------//

//Show selection card panel and hide everything else
function showSelectionCard() {
    $('#score-card').hide();
    $('#historical-card').hide();
    $('#selection-card').delay(300).fadeIn('slow');
}
//Show score card panel and hide everything else
function showScoreCard() {
    $('#selection-card').hide();
    $('#historical-card').hide();
    $('#score-card').delay(300).fadeIn('slow');
}
//Show historical card panel and hide everything else
function showHistoricalCard() {
    $('#selection-card').hide();
    $('#score-card').hide();

    $('#player').text('Welcome ' + localStorage.getItem('user_name'));
    $('#historical-card').delay(300).fadeIn('slow');
}
//Show historical card input and controls and hide the tee
function showScoreCardTable() {
    $('#tee').hide();
    $('#score-card-table').delay(300).fadeIn('slow');
    $('#complete-btn').delay(300).fadeIn('slow');
    $('#change-tee-btn').delay(300).fadeIn('slow');
}
//Show the tee and hide the score card input and controls
function showTee() {
    $('#score-card-table').hide();
    $('#complete-btn').hide();
    $('#change-tee-btn').hide();

    $('#tee').delay(300).fadeIn('slow');

    $('.custom-control-input').each(function (index) {
        $(this).prop('checked', false);
    });
}
//Show an informational modal with a personalized message.
function informationModal(outputTitle, outputMessage) {
    $('#modal-title-info').text(outputTitle);
    $('#modal-text-info').text(outputMessage);
    $('#infoModal').modal('show');
}
//Show a decision modal with a personalized message.
function decisionModal(outputTitle, outputMessage) {
    $('#modal-title-decision').text(outputTitle);
    $('#modal-text-decision').text(outputMessage);
    $('#decision-modal').modal('show');
}
//Hide game card controls
function hideCardControls() {
    $('#complete-btn').hide();
    $('#change-tee-btn').hide();
}
//Show game card controls
function showCardControls() {
    $('#complete-btn').show();
    $('#change-tee-btn').show();
}
//Capitalize the first letter of a word
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

//Initialize the current shots array
function initializeCurrentShots(size) {
    for (let index = 0; index < size; index++) {
        currentShots.push(0);

    }
}