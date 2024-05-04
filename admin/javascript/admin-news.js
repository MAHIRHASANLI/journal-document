import { PostNews, UpdateNews, deleteNews, getAllNews } from "../api/news_required.js";

const datePickerId = document.getElementsByClassName("date")[0]
const today = new Date();
const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // Bir sonrakı günün tarixi

datePickerId.min = minDate.toISOString().split("T")[0];

// LOGIN oldugunu yoxlayir
firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "/admin/login/login.html";
  }
});

// Submit -MODAL
const modalBtn = document.getElementById("modal-btn");
// Get the modal
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

// postAndUpdateSwal - Swall gosterilmesi
const SwalFire = (swalContent, icon) => {
  Swal.fire({
    position: "center",
    icon: icon,
    title: swalContent,
    showConfirmButton: false,
    timer: 1500,
  });
};



// // // LOGOUT
const logOutBtn = document.querySelector('.dropdown-item')
logOutBtn.addEventListener('click', function () {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await firebase.auth().signOut().then(() => {
        SwalFire('Log Out successfully!', 'success');
      }).catch((error) => {
        SwalFire(`${error}:log Out error!!`, 'error');

      });
    }
  });
});
// addDateUI - UI
// { title, text, img, date, id } = newNews
const newsTableTbody = document.querySelector(".news-table--tbody");
const addDateUI = (newNews) => {
  newsTableTbody.innerHTML += `<tr id="${newNews.id}">
    <td>
        <img src="${newNews.img}" alt="${newNews.title}"/>
    </td>
     <td>${newNews.title}</td>
     <td class="news-text">${newNews.text}</td>
     <td>${newNews.date}</td>
     <td><button type="button" class="btn btn-success update" id=${newNews.id}>Güncəllə</button></td>
     <td><button type="button" class="btn btn-danger remove" id=${newNews.id}>Sil</button></td>
    </tr>`;
};

// Get All Data
let newsArray = [];
getAllNews().then((news) => {
  news.forEach((res) => {
    newsArray.push(res)
    addDateUI(res)
  })
});


// Delete request
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove")) {
    const deleteBtn = event.target;
    const fileElement = deleteBtn.parentElement.previousElementSibling.previousElementSibling;
    const thisDataName = fileElement.textContent.trim();
    const news_Id = deleteBtn.getAttribute('id');

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteNews(news_Id);
          fileElement.parentElement.remove();
          SwalFire(`${thisDataName} - adlı Partnyor silindi.`, 'success');
        } catch (error) {
          SwalFire(`${error}: silinmə uğursuz oldu.`, 'error');
        }
      }
    });
  }
});


// Post - // Modal acilmasi;
const postBtn = document.querySelector(".post-data--btn");
postBtn.addEventListener("click", function () {
  document.getElementsByClassName("image")[0].value = "";
  document.getElementsByClassName("title")[0].value = "";
  document.getElementsByClassName("text")[0].value = "";
  document.getElementsByClassName("date")[0].value = "";
  modalBtn.classList.add("post");
  modalBtn.classList.remove("update");
  modal.style.display = "block";
});

// Update - // Modal acilmasi;
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("update")) {
    const clickedBtn = event.target;

    if (clickedBtn.classList.contains('update')) {
      document.getElementsByClassName("title")[0].value =
        clickedBtn.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
      document.getElementsByClassName("image")[0].value =
        clickedBtn.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.children[0].getAttribute("src");
      document.getElementsByClassName("text")[0].value =
        clickedBtn.parentElement.previousElementSibling.previousElementSibling.textContent;
      document.getElementsByClassName("date")[0].value =
        clickedBtn.parentElement.previousElementSibling.textContent;

      modal.style.display = "block";
      modalBtn.classList.add("update");
      modalBtn.classList.remove("post");
      modalBtn.setAttribute("id", clickedBtn.getAttribute("id"));
    }
  }
});

// Submit -MODAL - Update and Post
modalBtn.addEventListener("click", async function (e) {
  e.preventDefault();
  if (modalBtn.className.includes("post")) {
    modal.style.display = "none";

    const title = document.getElementsByClassName("title")[0].value;
    const img = document.getElementsByClassName("image")[0].value;
    const date = document.getElementsByClassName("date")[0].value;
    const text = document.getElementsByClassName("text")[0].value;

    try {
      // POST FUNKSIYASI
      const res = await PostNews({ title, img, date, text });

      addDateUI({ title, img, date, text, id: res.id });
      newsArray.push({ title, img, date, text, id: res.id })
      SwalFire(`${title} - əlavə olundu.`, 'success');
    } catch (error) {
      SwalFire(`${error}: ${title} əlavə olunmadı:`, 'error');
    }

  } else if (modalBtn.className.includes("update")) {
    modal.style.display = "none";

    const title = document.getElementsByClassName("title")[0].value;
    const img = document.getElementsByClassName("image")[0].value;
    const date = document.getElementsByClassName("date")[0].value;
    const text = document.getElementsByClassName("text")[0].value;

    const IdData = modalBtn.getAttribute("id");
    try {
      await UpdateNews({ title, img, date, text }, IdData);

      const updateTask = newsArray.map((item) => {
        if (String(item.id) === String(IdData)) {
          return { id: item.id, title, img, date, text }
        }
        return item;
      });
      newsTableTbody.innerHTML = "";
      updateTask.forEach((newNews) => addDateUI(newNews));
      // swall
      SwalFire(`${title} - yeniləndi.`, 'success');
    } catch (error) {
      SwalFire(`${error}: ${title} yenilənmədi.`, 'error');
    }
  } else console.error("Invalid data");
});


span.addEventListener("click", function () {
  modal.style.display = "none";
});

window.addEventListener("click", function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});
