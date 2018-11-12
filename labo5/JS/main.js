//LOG IN / SIGN UP
//directe functie die 2 eventen aanmaakt
(function (){
    document.getElementById("btn_signup").addEventListener('click', signup, false);
    document.getElementById("btn_login").addEventListener('click', login, false);

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
    })
    .catch(function(error){
        let errorCode= error.code;
        let errorMessage = error.message;

        console.log(errorCode, errorMessage);
        document.getElementById('signup_error').innerHTML = errorCode + " - " + errorMessage;
    });
}

//function bij event login
function login(e){
    //zorgt dat de normale normen niet doorgaan
    e.preventDefault();

    //de waarde in de email en paswoord opvragen
    let email = document.getElementById("login_email").value;
    let password = document.getElementById("login_password").value;

    firebase.auth().signInWithEmailAndPassword(email,password)
    .then(function(response){
        sendNotification('you are now logged in successfully');
        showUserInfo(response.user);
        window.location.replace('blog.html');
    })
    .catch(function(error){
        let errorCode= error.code;
        let errorMessage = error.message;

        console.log(errorCode, errorMessage);
        document.getElementById('login_error').innerHTML = errorCode + " - " + errorMessage;
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

function showUserInfo(user){
    document.getElementById('user_info').innerHTML = "<h1>Welcome " +user.email + "! </h1>";
}

//BLOG
(function () {
    CKEDITOR.replace('editor1');
  
    document.getElementById('btn_publish').addEventListener('click', publishPost, false);
  
    let blogpostRef = firebase.database().ref('posts/');
    blogpostRef.on('value', function (snapshot) {
      document.getElementById("blogposts").innerHTML = '';
      snapshot.forEach(function (data) {
        showPost(data);
      });
    });
  })();
  
  function publishPost(e) {
    e.preventDefault();
  
    let title = document.getElementById("title").value;
    let content = CKEDITOR.instances.editor1.getData();
    let datetime = new Date().toLocaleString();
  
    firebase.database().ref('posts/').push({
      title: title,
      content: content,
      publishedOn: datetime
    });
  }
  
  function showPost(post) {
    let key = post.key;
    console.log(key);
    let postData = post.val();
    console.log(post);
    let elem = document.createElement('div');
    elem.className = 'blogpost';
    elem.innerHTML = "<h2 class=\"title\">" + postData.title + "</h2>" + "<p>Published on " + postData.publishedOn + "</p><hr>" + postData.content+"<button id='delete_"+key+"'>delete</button>"+"<button id='edit_"+key+"'>edit</button>";
    document.getElementById("blogposts").appendChild(elem);
    // console.log(delbtn);
    document.getElementById('delete_'+key).addEventListener('click',function (){
      del(key);
    });
    document.getElementById('edit_'+key).addEventListener('click',function (){
      ed(key);
    });
    
  }

function del(key){
    console.log(key);
    firebase.database().ref('posts/' + key).remove();
    
    
}

function ed(key){
  let titlefield= document.getElementById('title');
  let contentfield = document.getElementById('editor1');
  firebase.database().ref('posts/' + key).once('value').then(function(snapshot) {
    let edittitle = snapshot.val();
    titlefield.value=edittitle.title;
    CKEDITOR.instances.editor1.setData(edittitle.content);
    document.getElementById('updateBtn').innerHTML="<button type='submit' id='btn_update'>Update</button>"
    document.getElementById('btn_update').addEventListener('click', function() {editPoste(key)}, false);
  })
}

function editPoste(key) {
  console.log(key);
  let title = document.getElementById("title").value;
  let content = CKEDITOR.instances.editor1.getData();
  let datetime = new Date().toLocaleString();

  firebase.database().ref('posts/'+key).update({
    title: title,
    content: content,
    publishedOn: datetime
  });
}
