const cl = console.log;

const commentForm = document.getElementById("commentForm");
const nameCtrl = document.getElementById("name");
const emailCtrl = document.getElementById("email");
const contentCtrl = document.getElementById("content");
const postIdCtrl = document.getElementById("postId");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const cardContainer = document.getElementById("cardContainer");
const loader = document.getElementById("loader")

const baseUrl = `https://jsonplaceholder.typicode.com`;
const commentUrl = `${baseUrl}/comments`;

const editComm = (ele) => {
   let editId = ele.closest(".card").id;
   localStorage.setItem("editId",editId);
   let editUrl = `${baseUrl}/comments/${editId}`;
   makeApiCall("GET",editUrl);
   window.scrollTo(0,0);
}

const deleteComm = (ele) => {
   Swal.fire({
      title: "Are you sure to delete comment?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
         let deleteId = ele.closest(".card").id;
         let deleteUrl = `${baseUrl}/comments/${deleteId}`;
         localStorage.setItem("deleteId",deleteId);
         makeApiCall("DELETE",deleteUrl);

        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
}

const createCommentCards = (arr) => {
   cardContainer.innerHTML = arr.map(comm => {
      return ` <div class="card my-3" id="${comm.id}">
                  <div class="card-header">
                     <h4 class="m-0">${comm.name}</h4>
                  </div>
                  <div class="card-body">
                     <h5 class="m-0">${comm.email}</h5>
                     <p class="m-0">${comm.body}</p>
                  </div>
                  <div class="card-footer d-flex justify-content-between">
                     <button class="btn btn-success" onclick="editComm(this)">Edit</button>
                     <button class="btn btn-danger" onclick="deleteComm(this)">Delete</button>
                  </div>
               </div>`
   }).join("");
}

const createCommets = (obj) => {
   let card = document.createElement("div");
   card.id = obj.id;
   card.className = `card my-3`;
   card.innerHTML = ` <div class="card-header">
                        <h4 class="m-0">${obj.name}</h4>
                     </div>
                     <div class="card-body">
                        <h5 class="m-0">${obj.email}</h5>
                        <p class="m-0">${obj.body}</p>
                     </div>
                     <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-success" onclick="editComm(this)">Edit</button>
                        <button class="btn btn-danger" onclick="deleteComm(this)">Delete</button>
                     </div>`;
   cardContainer.prepend(card);                   
}

const makeApiCall = (methodName,apiUrl,msgBody = null) => {
   loader.classList.remove("d-none");
   let xhr = new XMLHttpRequest();
   xhr.open(methodName,apiUrl);
   xhr.send(JSON.stringify(msgBody));

   xhr.onload = function(){
      if(xhr.status >= 200 && xhr.status < 300 && xhr.readyState === 4){
         let data = JSON.parse(xhr.response);
         if(methodName === "GET"){
            if(Array.isArray(data)){
               createCommentCards(data);
            }
            else{
               updateBtn.classList.remove("d-none");
               submitBtn.classList.add("d-none");

               nameCtrl.value = data.name;
               emailCtrl.value = data.name;
               contentCtrl.value = data.body;
               postIdCtrl.value = data.postId;
            }
         }
         else if(methodName === "POST"){
            msgBody.id = data.id;
            createCommets(msgBody);
         }
         else if(methodName === "PATCH"){
            let card = [...document.getElementById(msgBody.id).children];
            card[0].innerHTML = `<h4 class="m-0">${msgBody.name}</h4>`;
            card[1].innerHTML = `<h5 class="m-0">${msgBody.email}</h5>
                                  <p class="m-0">${msgBody.body}</p>`;
            commentForm.reset();
            updateBtn.classList.add("d-none");
            submitBtn.classList.remove("d-none");                     
         }
         else if(methodName === "DELETE"){
            let deleteId = localStorage.getItem("deleteId");
            let card = document.getElementById(deleteId);
            card.remove();
         }
      }
      loader.classList.add("d-none");
   }
   xhr.onerror = function(){
      loader.classList.add("d-none");
   }
}

makeApiCall("GET",commentUrl,null);

const submitComment = (eve) => {
   eve.preventDefault();
   let commObj = {
      name: nameCtrl.value,
      email: emailCtrl.value,
      body: contentCtrl.value,
      postId: postIdCtrl.value
   }
   cl(commObj);
   makeApiCall("POST",commentUrl,commObj);
   Swal.fire({
      title: `${commObj.name} comment added successfully`,
      icon: "success",
      timer: 3000
   })
   commentForm.reset();
}

const updateComment = () => {
   let updateId = localStorage.getItem("editId");
   let updateObj = {
      name: nameCtrl.value,
      email: emailCtrl.value,
      body: contentCtrl.value,
      postId: postIdCtrl.value,
      id: updateId
   }
   cl(updateObj);
   let updateUrl = `${baseUrl}/comments/${updateId}`;
   makeApiCall("PATCH",updateUrl,updateObj);
   Swal.fire({
      title: `${updateObj.name} comment updated successfully`,
      icon: "success",
      timer: 3000
   })
}

commentForm.addEventListener("submit",submitComment);
updateBtn.addEventListener("click",updateComment);