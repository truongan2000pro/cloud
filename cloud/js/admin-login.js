window.onload = init;

async function init() {
  await firebase.auth().onAuthStateChanged(function (user){
    if(user && user.uid == "JlAdj4fPUMhra1YdTOX2n9x6Mdw1"){
      window.location = "admin.html"
    }
  });
  let formLogIn = document.getElementById("form-log-in");
  formLogIn.onsubmit = handerler;

  async function handerler(e) {
    e.preventDefault();
    let email = formLogIn.email.value;
    let pass = formLogIn.password.value;

    console.log(email);
    console.log(pass);
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, pass)
      .then((user) => {
        console.log(user)
        window.location.reload();
      });
  }
}
