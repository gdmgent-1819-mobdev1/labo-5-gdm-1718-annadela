(function () {
    document.getElementById("btn_login").addEventListener('click', login, false);
    document.getElementById("btn_forgot").addEventListener('click', forgot, false);

    requestNotificationPermission();
})();

function login(e) {
    e.preventDefault();

    let email = document.getElementById("login_email").value;
    sessionStorage.setItem("person", email);
    let password = document.getElementById("login_password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (response) {
            sendNotification('you are now logged in successfully');
            showUserInfo(response.user);
            window.location.replace('blog.html');
        })
        .catch(function (error) {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode, errorMessage);
            document.getElementById('login_error').innerHTML = errorCode + " - " + errorMessage;

        });

}

function forgot() {
    let emailAddress = document.getElementById('login_email').value;

    firebase.auth().sendPasswordResetEmail(emailAddress).then(function () {
        console.log('send email')
    }).catch(function (error) {
        document.getElementById('user_info').innerHTML="vul uw emailadress eerst in"
    });
}



function sendVerificationEmail(user) {
    user.sendEmailVerification()
        .then(function () {
            //email sent
        })
        .catch(function (error) {
            //Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;

            console.log(errorCode, errorMessage);
        })
}

function sendNotification(msg) {
    let notif = new Notification(msg);
}

function requestNotificationPermission() {
    if (Notification && Notification.permission === 'default') {
        Notification.requestPermission(function (permission) {
            if (!('permission' in Notification)) {
                Notification.permission = permission;
            }
        });
    }
}

function showUserInfo(user) {
    document.getElementById('user_info').innerHTML = "<h1>Welcome " + user.email + "! </h1>";
}