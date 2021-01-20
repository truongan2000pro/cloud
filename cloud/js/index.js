window.onload = init;

async function init() {
  let db = firebase.firestore();
  let getData = await db.collection("posts").get();
  // console.log(a)

  let getDocs = await getData.docs;

  // firebase.firestore().collection("posts").add({
  //     createdAt:new Date().toLocaleDateString()
  //     ,
  //     img:"https://drop.ndtv.com/albums/COOKS/pasta-vegetarian/pastaveg_640x480.jpg",
  //     title:"Cơm cháy chà bông sài gòn ngon",
  //     description:"Dù có được ăn bao nhiêu sơn hào hải vị trên đời thì xin cá rằng với rất nhiều người,             chúng cũng chẳng thể bằng một mâm cơm nhà va",
  //     owner:"hoangtoviet803@gmail.com"
  // })
  let contentContainer = document.getElementsByClassName(
    "content-container"
  )[0];

  await getDocs.forEach((element) => {
    // console.log(element.id);
    contentContainer.innerHTML += `

<div class="contents" id="${element.id}">
        <div>
          <img src="${element.data().img}" alt="" />
        </div>
        <div class="main-content">
          <div class="title-food">${element.data().title}</div>
          <div class="created-at"><i class="far fa-calendar-alt"></i>20/01/2021</div>
          <div class="descrip">
            ${element.data().description}
          </div>
        </div>
      </div>
`;
  });
  let contentsTag = document.getElementsByClassName("contents");
  for (let i = 0; i < contentsTag.length; i++) {
    contentsTag[i].onclick = async function () {
      console.log(contentsTag[i].id);
      window.location = `detail.html?id=${contentsTag[i].id}`;
    };
  }
  let formPost = document.getElementById("form-post");
  let formLogIn = document.getElementById("form-log-in");
  let formRegister = document.getElementById("form-register");

  formRegister.onsubmit = async function (e) {
    e.preventDefault();
    let name = formRegister.name.value;
    let email = formRegister.usrname.value;
    let pass = formRegister.psw.value;
    firebase
      .auth()
      .createUserWithEmailAndPassword(`${email}`, `${pass}`)
      .then(function (result) {
        return result.user
          .updateProfile({
            displayName: `${name}`,
          })
          .then(() => {
            window.location.reload();
          });
      });
  };
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
