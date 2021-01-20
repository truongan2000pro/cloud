window.onload = init;
async function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const myParam = urlParams.get("id");
  console.log(myParam);
  let db = firebase.firestore();
  let getData = await db.collection("posts").doc(myParam).get();
  let data = await getData.data();
  console.log(data);
  let titleWrapper = document.getElementsByClassName("title-wrapper")[0];
  let contentWrapper = document.getElementsByClassName("content-wrapper")[0];
  titleWrapper.innerHTML = ` <h4>${data.title} </h4>
  <div class="time-owner-wrapper">
     <div class="owner-wrapper">
         Bởi <i class="fas fa-user-circle"></i>
         ${data.owner}
     </div>
     <div class="time-wrapper">
      <i class="far fa-calendar-alt"></i>
      ${data.createdAt}
     </div>
  </div>
  <img class="line-decor" alt="họa tiết cet" src="https://cdn.cet.edu.vn/wp-content/uploads/2017/12/hoa-tiet-cet.png" class="i-amphtml-fill-content i-amphtml-replaced-content">
`;
  contentWrapper.innerHTML = `  <figure>
<img decoding="async" alt="nguyên liệu tươi ngon" sizes="(max-width: 600px) 100vw, 600px" src="${data.img}" >
<figcaption> Hình minh họa: ${data.title}</figcaption>
</figure>
<p>${data.description}</p>

<div class="line-bottom" ></div>`;
  let formPost = document.getElementById("form-post");
  let formLogIn = document.getElementById("form-log-in");

  formPost.onsubmit = async function (e) {
    e.preventDefault();
    let files = formPost.img.files;
    let file = files[0];
    let link = await upload(file);

    let title = formPost.title.value;
    let content = formPost.content.value;
    firebase
      .firestore()
      .collection("posts")
      .add({
        createdAt: new Date().toLocaleDateString(),
        img: `${link}`,
        title: `${title}`,
        description: `${content}`,
        owner: `${firebase.auth().currentUser.email}`,
      })
      .then(() => {
        window.location.reload();
      });
  };
  formLogIn.onsubmit = async function (e) {
    e.preventDefault();
    let email = formLogIn.usrname.value;
    let pass = formLogIn.psw.value;
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, pass)
      .then(() => {
        window.location.reload();
      });
  };
  //check login
  var user = firebase.auth().currentUser;

  if (user) {
    let userSection = document.getElementsByClassName("user-section")[0];
    let signOutBtn = document.getElementById("sign-out-btn");
    console.log(signOutBtn);
    userSection.innerHTML = `<h3> Xin chào ${user.email} </h3>`;
    signOutBtn.innerText = "Đăng Xuất";
    signOutBtn.onclick = function () {
      firebase
        .auth()
        .signOut()
        .then(() => {
          window.location.reload();
        });
    };
  } else {
    // No user is signed in.
  }
  let btn = document.getElementById("myBtn");

  let btnPost = document.getElementById("btnPost");
  let btnWeb = document.getElementById("myBtnWeb");

  let btnPostWeb = document.getElementById("btnPostWeb");
  let register = document.getElementById("register");
  let signInBtn = document.getElementById("sign-in");

  // When the user clicks on the button, open the modal
  if (register) {
    register.onclick = function () {
      document.getElementById("id01").style.display = "none";
      document.getElementById("id03").style.display = "block";
    };
  }
  signInBtn.onclick = function () {
    document.getElementById("id03").style.display = "none";
    document.getElementById("id01").style.display = "block";
  };
  btn.onclick = function () {
    document.getElementById("id01").style.display = "block";
  };

  btnPost.onclick = function () {
    document.getElementById("id02").style.display = "block";
    console.log(user);
    if (user) {
      document.getElementById("error").style.display = "none";
      document.getElementById("form-post").style.display = "block";
    } else {
      document.getElementById("form-post").style.display = "none";
      document.getElementById("error").style.display = "block";
      // document.getElementById("id02").innerHTML = "<div>jeje</div>";
    }
  };
  btnWeb.onclick = function () {
    document.getElementById("id01").style.display = "block";
  };

  btnPostWeb.onclick = function () {
    document.getElementById("id02").style.display = "block";
    console.log(user);

    if (user) {
      document.getElementById("form-post").style.display = "block";
      document.getElementById("error").style.display = "none";
    } else {
      document.getElementById("form-post").style.display = "none";
      document.getElementById("error").style.display = "block";
      // document.getElementById("id02").innerHTML = "<div>jeje</div>";
    }
  };
}

async function upload(file) {
  let fileName = file.name;
  let filePath = `upload/${fileName}`;
  let fileRef = firebase.storage().ref().child(filePath);
  await fileRef.put(file);
  let linkImg = getFileUrl(fileRef);

  return linkImg;
}

function getFileUrl(fileRef) {
  return `https://firebasestorage.googleapis.com/v0/b/${
    fileRef.bucket
  }/o/${encodeURIComponent(fileRef.fullPath)}?alt=media`;
}
