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
    document.getElementById('btn_update').addEventListener('click', editPoste(key), false);
  })
}

function editPoste(e,key) {
  let title = document.getElementById("title").value;
  let content = CKEDITOR.instances.editor1.getData();
  let datetime = new Date().toLocaleString();

  firebase.database().ref('posts/'+key).update({
    title: title,
    content: content,
    publishedOn: datetime
  });
}
