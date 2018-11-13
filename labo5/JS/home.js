(function () {    
    let blogpostRef = firebase.database().ref('posts/');
    blogpostRef.on('value', function (snapshot) {
      snapshot.forEach(function (data) {
        showPost(data);
      });
    });
  })();
  
  let author = sessionStorage.getItem('person');
  function publishPost(e) {
    e.preventDefault();
  
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
    elem.innerHTML = "<h2 class=\"title\">" + postData.title + "</h2>" + "<i class=\" publish\">Published on " + postData.publishedOn + "</i><hr>" + postData.content+"<strong>Author: "+postData.author+"</strong>";
    document.getElementById("blogpost").appendChild(elem);
    };
    
  
