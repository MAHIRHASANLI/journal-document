
const firebaseConfig = {
    apiKey: "AIzaSyCYR9dpSpIAZxBLvIfOP3LqPTX1C9U9Bhc",
    authDomain: "journal-project-482cb.firebaseapp.com",
    projectId: "journal-project-482cb",
    storageBucket: "journal-project-482cb.appspot.com",
    messagingSenderId: "563013898617",
    appId: "1:563013898617:web:f927910ba5dcbe47d7dfa8",
    measurementId: "G-WGQ69QZN3W"
  };

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
// Firestore referansı
export const firestore = firebase.firestore();


// LOGIN oldugunu yoxlayir
// firebase.auth().onAuthStateChanged((user) => {
//     if (!user) {
//         window.location.href = "/admin/login/login.html";
//     }
// });


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
// const logOutBtn = document.querySelector('.dropdown-item')
// logOutBtn.addEventListener('click', function () {
//     Swal.fire({
//         title: "Are you sure?",
//         text: "You won't be able to revert this!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Yes, delete it!",
//     }).then(async (result) => {
//         if (result.isConfirmed) {
//             await firebase.auth().signOut().then(() => {
//                 SwalFire('Log Out successfully!', 'success');
//             }).catch((error) => {
//                 SwalFire(`${error}:log Out error!!`, 'error');

//             });
//         }
//     });
// });