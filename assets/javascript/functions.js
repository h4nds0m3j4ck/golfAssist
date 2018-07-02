//---------------------------------------------------------------------------------------//
//------------------------------- FIREBASE AUTHENTICATION -------------------------------//
//---------------------------------------------------------------------------------------//
var config = {
    apiKey: "AIzaSyCzlDqCG0H9P4les0AZdidvJZPqRg0boew",
    authDomain: "golfassist-cc729.firebaseapp.com",
    databaseURL: "https://golfassist-cc729.firebaseio.com",
    projectId: "golfassist-cc729",
    storageBucket: "golfassist-cc729.appspot.com",
    messagingSenderId: "352272717648"
};
firebase.initializeApp(config);

//---------------------------------------------------------------------------------------//
//----------------------------       GLOBAL VARIABLES       -----------------------------//
//---------------------------------------------------------------------------------------//

var golfCourse = '';

//---------------------------------------------------------------------------------------//
//-----------------------------       EVENT HANDLING       ------------------------------//
//---------------------------------------------------------------------------------------//

$(document).ready(function () {

    $('#select-btn').on('click', function () {
        //Validate user entry
        if (true) {
            //Create dynamic Tee selector based on user selection
            createCustomTee("userSelection");

            //Show the custom score card
            showScoreCard();
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

    $(".custom-control-input").on('click', function () {
        //create dynamic table base on selected golf course.
        createCustomCard(golfCourse, $('.custom-control-input:checked').val());
        console.log($('.custom-control-input:checked').val());

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

function createCustomTee(pgolfCourse){
    golfCourse = pgolfCourse;

    //Delete everything inside score-card
    //$('#score-card').children().remove();

    //Create the Tee based on the user selection
}

function createCustomCard(pgolfCourse, Tee) {

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