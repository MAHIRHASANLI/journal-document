
import { PostPartner, UpdatePartner, deletePartner, getAllPartners } from '../api/about_request.js'

// LOGIN oldugunu yoxlayir
firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "/admin/login/login.html";
  }
});

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

const SwalFire = (swalContent, icon) => {
  Swal.fire({
    position: "center",
    icon: icon,
    title: swalContent,
    showConfirmButton: false,
    timer: 1500,
  });
};

const aboutAdminPageUI = document.querySelector(".partner-table--tbody");
const addDateUI = (newPartner) => {
  aboutAdminPageUI.innerHTML += `<tr id="${newPartner.id}">
       <td><img src="${newPartner.img}" alt="${newPartner.title}"/></td>
       <td>${newPartner.title}</td>
       <td class="about-description">${newPartner.description}</td>
       <td><button type="button" class="btn btn-success update" id=${newPartner.id}>Güncəllə</button></td>
    </tr>`;
};

// // Get All Data
let partnerArray = [];
getAllPartners().then((aboutdata) => {
  aboutdata.forEach((res) => {
    console.log(aboutdata);
    partnerArray.push(res)
    addDateUI(res)
  })
})


// // Delete - Data;
// document.addEventListener("click", function (event) {
//   if (event.target.classList.contains("remove")) {
//     const deleteBtn = event.target;
//     const fileElement = deleteBtn.parentElement.previousElementSibling.previousElementSibling;
//     const thisDataName = fileElement.textContent.trim();
//     const partner_Id = deleteBtn.getAttribute('id');
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         // Koleksiyon referansı ve belge referansı
//         try {
//           await deletePartner(partner_Id);
//           fileElement.parentElement.remove();
//           SwalFire(`${thisDataName} - adlı Partnyor silindi.`, 'success');
//         } catch (error) {
//           SwalFire(`${error}: Silinmə uğursuz oldu.`, 'error');
//         }
//       }
//     });
//   }
// });

// // Get the modal
const modal = document.getElementById("myModal");

// // Submit -MODAL
const modalBtn = document.querySelector(".modal-btn");

// Post - // Modal acilmasi;
// const postBtn = document.querySelector(".post-data--btn");
// postBtn.addEventListener("click", function () {
//   document.getElementsByClassName("title")[0].value = "";
//   document.getElementsByClassName("description")[0].value = "";
//   document.getElementsByClassName("image")[0].value = "";
//   modalBtn.classList.add("post");
//   modalBtn.classList.remove("update");
//   modal.style.display = "block";
// });

// // Update - // Modal acilmasi;
document.addEventListener("click", function (event) {
  const clickedBtn = event.target;

  if (clickedBtn.classList.contains('update')) {
    document.getElementsByClassName("title")[0].value = clickedBtn.parentElement.previousElementSibling.previousElementSibling.textContent;
    document.getElementsByClassName("description")[0].value = clickedBtn.parentElement.previousElementSibling.textContent;
    document.getElementsByClassName("image")[0].value = clickedBtn.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.children[0].getAttribute("src");;
    modal.style.display = "block";
    modalBtn.classList.add("update");
    // modalBtn.classList.remove("post");
    modalBtn.setAttribute("id", clickedBtn.getAttribute("id"));
  }
});

// // Modal baglanmasi
const span = document.getElementsByClassName("close")[0];
span.addEventListener("click", function () {
  modal.style.display = "none";
});

window.addEventListener("click", function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});


//POST VE UPDATE
modalBtn.addEventListener("click", async function (e) {
  // Firestore'daki 'cities' koleksiyonunu temsil eden bir referans alın
  e.preventDefault();
  if (modalBtn.className.includes("post")) {
    modal.style.display = "none";
    const title = document.getElementsByClassName("name")[0].value;
    const description = document.getElementsByClassName("name")[0].value;
    const img = document.getElementsByClassName("image")[0].value;
    try {
      // POST FUNKSIYASI
      const res = await PostPartner({ title, description, img });
      addDateUI({ title, description, img, id: res.id });
      partnerArray.push({ title, description, img, id: res.id })
      SwalFire(`${title} - əlavə olundu.`, 'success');
    } catch (error) {
      SwalFire(`${error}: əlavə olunmadı:`, 'error');
    }
  } else if (modalBtn.className.includes("update")) {
    modal.style.display = "none";
    const description = document.getElementsByClassName("description")[0].value;
    const title = document.getElementsByClassName("title")[0].value;
    const img = document.getElementsByClassName("image")[0].value;

    const IdData = modalBtn.getAttribute("id");
    try {
      //UPDATE FUNKSIYASI
      await UpdatePartner({ title, description, img }, IdData);
      const updateTask = partnerArray.map((item) => {
        if (String(item.id) === String(IdData)) {
          return { id: item.id, title, description, img };
        }
        return item;
      });
      aboutAdminPageUI.innerHTML = "";
      updateTask.forEach((data) => addDateUI(data));
      SwalFire(`${title} - yeniləndi.`, 'success');
    } catch (error) {
      SwalFire(`${error}: yenilənmədi.`, 'error');
    }
  } else console.error("Invalid data");
});
