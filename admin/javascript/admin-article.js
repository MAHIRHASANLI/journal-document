import { getAllArticles, deleteArticles, postArticle, updateArticle } from "../api/article_request.js";

// LOGIN oldugunu yoxlayir
firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = "/admin/login/login.html";
    }
});

const articlesTableTbody = document.querySelector(".aeekInNumber-table--tbody");

// Get the modal
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
const modalBtn = document.querySelector(".modal-btn");

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


// addDateUI - UI 
// { title, text, img, date, id } = newNews
const addDateUI = (article) => {
    articlesTableTbody.innerHTML +=
        `<tr id="${article.id}">
 <td>${article.title}</td>
 <td>${article.description}</td>
 <td><button type="button" class="btn btn-success update" id="${article.id}">Güncəllə</button></td>
 <td><button type="button" class="btn btn-danger remove" id=${article.id}>Sil</button></td>
 </tr>`
}


// Get All Data
let ArticlesArray = [];
getAllArticles().then((articles) => {
    articles.forEach((res) => {
        ArticlesArray.push(res);
        addDateUI(res);
    })
});

// Delete request
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove")) {
        const deleteBtn = event.target;
        const fileElement = deleteBtn.parentElement.previousElementSibling.previousElementSibling.previousElementSibling;
        const thisDataName = fileElement.textContent.trim();
        const Id = deleteBtn.getAttribute('id');
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
                    await deleteArticles(Id);
                    fileElement.parentElement.remove();
                    SwalFire(`${thisDataName} - silindi.`, 'success');
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
    document.getElementsByClassName("title")[0].value = "";
    document.getElementsByClassName("description")[0].value = "";
    modalBtn.classList.add("post");
    modalBtn.classList.remove("update");
    modal.style.display = "block";
});

// Update - // Modal acilmasi;
document.addEventListener('click', function (event) {
    const clickedBtn = event.target;
    if (clickedBtn.classList.contains('update')) {
        document.getElementsByClassName("title")[0].value = clickedBtn.parentElement.previousElementSibling.previousElementSibling.textContent;
        document.getElementsByClassName("description")[0].value = clickedBtn.parentElement.previousElementSibling.textContent;
        modal.style.display = "block";
        modalBtn.classList.add("update");
        modalBtn.classList.remove("post");
        modalBtn.setAttribute("id", clickedBtn.getAttribute("id"));
    }
})


modalBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    if (modalBtn.className.includes("post")) {
        modal.style.display = "none";

        const title = document.getElementsByClassName("title")[0].value;
        const description = document.getElementsByClassName("description")[0].value;

        try {
            // POST FUNKSIYASI
            const res = await postArticle({ title, description });
            addDateUI({ title, description, id: res.id });
            ArticlesArray.push({ title, description, id: res.id })
            SwalFire(`${title} - əlavə olundu.`, 'success');
        } catch (error) {
            SwalFire(`${error}: ${title} əlavə olunmadı:`, 'error');
        }

    } else if (modalBtn.className.includes("update")) {
        modal.style.display = "none";

        const title = document.getElementsByClassName("title")[0].value;
        const description = document.getElementsByClassName("description")[0].value;

        const IdData = modalBtn.getAttribute("id");
        try {
            await updateArticle({ title, description }, IdData);

            const updateTask = ArticlesArray.map((item) => {
                if (String(item.id) === String(IdData)) {
                    return { id: item.id, title, description }
                }
                return item;
            });
            articlesTableTbody.innerHTML = "";
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
})

window.addEventListener("click", function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
})




