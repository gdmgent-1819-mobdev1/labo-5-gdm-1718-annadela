(function () {
  document.getElementById("btn_logout").addEventListener('click', logout, false);
})();

//function bij event log out
function logout(e) {
  firebase.auth().signOut()
    .then(function () {
      window.location.replace('index.html');
    })
    .catch(function (error) {
      let errorCode = error.code;
      let errorMessage = error.message;
    })
}

document.getElementById('person').innerHTML = 'Welkom ' + sessionStorage.getItem('person');

//BLOG

let counter=0;

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
  let author = sessionStorage.getItem('person');

  firebase.database().ref('posts/').push({
    title: title,
    content: content,
    publishedOn: datetime,
    author: author
  });
}

function showPost(post) {
  let key = post.key;
  console.log(key);
  let postData = post.val();
  console.log(post);
  let elem = document.createElement('div');
  elem.className = 'blogpost';
  elem.innerHTML = "<h2 class=\"title\">" + postData.title + "</h2>" + "<p>Published on " + postData.publishedOn + "</p><hr>" + postData.content + "<p>Author: <strong id='"+counter+"'>" + postData.author + "</strong></p>";
  document.getElementById("blogposts").appendChild(elem);
  console.log(document.getElementById(counter).innerHTML);
  if((document.getElementById(counter).innerHTML)==sessionStorage.getItem('person')){
    elem.innerHTML += "<div class='littleLayout'><button class='gray btn_clean little' id='delete_" + key + "'>delete</button>" + "<a href='blog.html#head'><button class='in gray btn_clean little' id='edit_" + key + "'>edit</button></a></div>";  
    console.log(document.getElementById('delete_'+key));
  document.getElementById('delete_'+key).addEventListener('click',function(){del(key)});
  document.getElementById('edit_'+key).addEventListener('click',function(){ed(key)});
  }

  


  counter++;

}

function del(key) {
  console.log(key);
  firebase.database().ref('posts/' + key).remove();


}

function ed(key) {
  let titlefield = document.getElementById('title');
  let contentfield = document.getElementById('editor1');
  firebase.database().ref('posts/' + key).once('value').then(function (snapshot) {
    let edittitle = snapshot.val();
    titlefield.value = edittitle.title;
    CKEDITOR.instances.editor1.setData(edittitle.content);
    document.getElementById('add').innerHTML = "<button class='in gray btn_clean' type='submit' id='btn_update'>Update</button>"
    document.getElementById('btn_update').addEventListener('click', function () {
      editPoste(key)
    }, false);
  })
}

function editPoste(key) {
  console.log(key);
  let title = document.getElementById("title").value;
  let content = CKEDITOR.instances.editor1.getData();
  let datetime = new Date().toLocaleString();

  firebase.database().ref('posts/' + key).update({
    title: title,
    content: content,
    publishedOn: datetime
  });
}