
//---------------------------------------------------------------------------------------//
//----------------------------       GLOBAL VARIABLES       -----------------------------//
//---------------------------------------------------------------------------------------//

var currentGolfCourse = null;

//---------------------------------------------------------------------------------------//
//-----------------------------       EVENT HANDLING       ------------------------------//
//---------------------------------------------------------------------------------------//

$(document).ready(function () {

    $('#select-btn').on('click', function () {
        //Validate user entry
        if (true) {
             //Show the custom score card
             showScoreCard();

            //Create dynamic Tee selector based on user selection
            createCustomTee("crandon");
           
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
        //Validate all the data
        if (false) {
            //Show message with changes required or show incorrect fields

        } else {
            //Save to the database

            //Do not allow more edits to the user
            $(document).find(".shots").prop('disabled', true);

            //Show message information message to the user
            informationModal('SUCCESSFUL TRANSACTION', 'Your game sumary was successfully saved.');

            //Hide controls
            hideCardControls();
        }
    });

    $('#ok-btn').on('click', function () {
        //Delete everything inside historical-data-table

        //Delete everything from sessionStorage

        //Show the Tee radia button group
        showTee();

        //Hide modal
        $('#decision-modal').modal('hide')
    });

    $('#other-golf-course').on('click', function () {
        showSelectionCard();
    });

    $('#see-history').on('click', function () {
        showHistoricalCard();
    });

    $(document).on('click', '.custom-control-input', function () {
        //create dynamic table base on selected golf course.
        createCustomCard($('.custom-control-input:checked').val());

        //Show score card table
        showScoreCardTable();
    });
});

//---------------------------------------------------------------------------------------//
//-------------------------------       WEATHER API       -------------------------------//
//---------------------------------------------------------------------------------------//




//---------------------------------------------------------------------------------------//
//-------------------------------       GOOGLE API        -------------------------------//
//---------------------------------------------------------------------------------------//


//---------------------------------------------------------------------------------------//
//-------------------------------       YOUTUBE API       -------------------------------//
//---------------------------------------------------------------------------------------//


//---------------------------------------------------------------------------------------//
//-------------------------------     FIREBASE STORAGE    -------------------------------//
//---------------------------------------------------------------------------------------//


//---------------------------------------------------------------------------------------//
//-------------------------------     SESSION STORAGE     -------------------------------//
//---------------------------------------------------------------------------------------//


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
        inputTag.attr('id', 'hole-' + index);

        thInputTag.append(inputTag);
        trInputTag.append(thInputTag);

        //Add par  distance based on the hole
        var thParTag = $('<th>');
        thParTag.text(currentGolfCourse.par[index]);
        trParTag.append(thParTag);
    }
    //Add last column
    trHolesTag.append($('<th class ="text-center">'+((start === 0) && (!final) ? 'FRONT':'TOTAL')+'/YARDS/PAR</th>'));
    tryardsTag.append($('<th class ="text-center">'+getTotalYards(tee,start, final)+'</th>'));
    trInputTag.append($('<th class ="text-center">0</th>'));
    trParTag.append($('<th class ="text-center">'+getTotalPar(start, final)+'</th>'));

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
    }  else if (selection === 'black') {
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

function getTotalYards(tee,start, final){
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
    }else if (selection === 'black') {
        yardsArray = currentGolfCourse.tees.black;
    } else {
        yardsArray = currentGolfCourse.tees.handicap;
    }

    for (let index = 0; index < (!(final) ? (start + 9) : yardsArray.length); index++) {
        totalYards += yardsArray[index];
    }

    return totalYards;
}

function getTotalPar(start, final){
    var parArray = currentGolfCourse.par;
    var totalPar = 0;
    
    for (let index = 0; index < (!(final) ? (start + 9) : parArray.length); index++) {
        totalPar += parArray[index];
    }

    return totalPar;
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
    $('#historical-card').delay(300).fadeIn('slow');
}
//Show historical card input and controls and hide the tee
function showScoreCardTable() {
    $('#tee').hide();
    $('#score-card-table').delay(300).fadeIn('slow');
    $('#complete-btn').delay(300).fadeIn('slow');
    $('#change-tee-btn').delay(300).fadeIn('slow');
}
//Show the tee and hide the historical card input and controls
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
//Capitalize the first letter of a word
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}