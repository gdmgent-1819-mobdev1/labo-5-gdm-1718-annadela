(function (){
    document.getElementById("btn_signup").addEventListener('click', signup, false);

    requestNotificationPermission();
})();

//function bij event signup
function signup(e){
    //zorgt dat de normale normen niet doorgaan
    e.preventDefault();

    //de waarde in de email en paswoord opvragen
    let email = document.getElementById("signup_email").value;
    let password = document.getElementById("signup_password").value;

    firebase.auth().createUserWithEmailAndPassword(email,password)
    .then(function(response){
        sendNotification('Thanks for signing in!');
        sendVerificationEmail(response.user);
        window.location.replace('login.html');
    })
    .catch(function(error){
        let errorCode= error.code;
        let errorMessage = error.message;

        console.log(errorCode, errorMessage);
        document.getElementById('signup_error').innerHTML = errorCode + " - " + errorMessage;
    });
}


function sendVerificationEmail(user){
    user.sendEmailVerification()
    .then(function(){
        //email sent
    })
    .catch(function (error){
        //Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;

        console.log(errorCode, errorMessage);
    })
}

function sendNotification(msg){
    let notif = new Notification(msg);
}

function requestNotificationPermission(){
    if(Notification && Notification.permission === 'default'){
        Notification.requestPermission(function (permission){
            if (!('permission' in Notification)){
                Notification.permission = permission;
            }
        });
    }
}