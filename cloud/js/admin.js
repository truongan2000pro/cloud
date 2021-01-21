window.onload = init;

async function init() {
  let db = firebase.firestore();
  let bodyTable = document.getElementsByClassName("body-tag")[0];
  let user = await firebase.auth().onAuthStateChanged(function (user) {
    if (user && user.uid == "JlAdj4fPUMhra1YdTOX2n9x6Mdw1") {
      return user;
    } else {
      window.location = "admin-login.html";
    }
  });
  if (user) {
    await db
      .collection("posts")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          let idUpdate = doc.id + "update";
          let idDelete = doc.id;
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          bodyTable.innerHTML += `<tr >
              <td>${doc.id}</td>
              <td>${doc.data().title}</td>
              <td>${doc.data().createdAt}</td>
              <td>${doc.data().description}</td>
              <td>${doc.data().img}</td>
              <td>
          <ul>
            <li class="edit-update" id=${idUpdate} >Sửa</li>
            <li class="edit-delete" id=${idDelete} >Xóa</li>
          </ul>
              </td>
          
          </tr>`;
        });
      });

    let editUpdate = document.getElementsByClassName("edit-update");
    let editDelete = document.getElementsByClassName("edit-delete");
    for (let i = 0; i < editUpdate.length; i++) {
      // console.log(editUpdate[i])
      editUpdate[i].onclick = async function () {
        let id = editUpdate[i].id.split("update")[0];
        // console.log(id)
        document.getElementById("id02").style.display = "block";
        let formUpdate = document.getElementById("form-update");
        formUpdate.onsubmit = async function (e) {
          e.preventDefault();
          let files = formUpdate.img.files;
          let file = files[0];
          let link = await upload(file);

          let title = formUpdate.title.value;
          let content = formUpdate.content.value;
          firebase
            .firestore()
            .collection("posts")
            .doc(id)
            .update({
              createdAt: new Date().toLocaleDateString(),
              description: content,
              img: link,
              title: title,
            })
            .then(() => {
              window.location.reload();
            });
        };
      };
    }

    for (let i = 0; i < editDelete.length; i++) {
      editDelete[i].onclick = async function () {
        let id = editDelete[i].id;
        console.log(id);
        firebase
          .firestore()
          .collection("posts")
          .doc(id)
          .delete()
          .then(() => {
            window.location.reload();
          });
      };
    }
  }
  //   if (!user) {
  //     window.location = "admin-login.html";
  //   }
  async function upload(file) {
    let fileName = file.name;
    let filePath = `upload/${fileName}`;
    let fileRef = firebase.storage().ref().child(filePath);
    await fileRef.put(file);
    let linkImg = getFileUrl(fileRef);

    return linkImg;
  }

  function getFileUrl(fileRef) {
    return `https://firebasestorage.googleapis.com/v0/b/${fileRef.bucket}/o/${encodeURIComponent(
      fileRef.fullPath
    )}?alt=media`;
  }
}
