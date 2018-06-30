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

// FirebaseUI config.
var uiConfig = {
    signInSuccessUrl: 'main.html', //<url-to-redirect-to-on-success>
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>'
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);


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
//-------------------------------    AUXILIAR FUNCTIONS   -------------------------------//
//---------------------------------------------------------------------------------------//