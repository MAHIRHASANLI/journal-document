
const firebaseConfig = {
    apiKey: "AIzaSyCYR9dpSpIAZxBLvIfOP3LqPTX1C9U9Bhc",
    authDomain: "journal-project-482cb.firebaseapp.com",
    projectId: "journal-project-482cb",
    storageBucket: "journal-project-482cb.appspot.com",
    messagingSenderId: "563013898617",
    appId: "1:563013898617:web:f927910ba5dcbe47d7dfa8",
    measurementId: "G-WGQ69QZN3W"
  };


firebase.initializeApp(firebaseConfig);

const adminLoginForm = document.getElementById('admin-login-form');

adminLoginForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const email = document.getElementById("email-signIn").value;
    const password = document.getElementById("password-signIn").value;
    // await initializeFirebase();

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Giriş başarılı olduğunda yapılacak işlemler
            // const user = userCredential.user;
            // console.log("Giriş başarılı, kullanıcı:", user);
            window.location.href = "/admin/admin.html";
        })
        .catch((error) => {
            // Girişte hata oluştuğunda yapılacak işlemler
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Hata:", errorCode, errorMessage);
        });
});


// firebase.auth().onAuthStateChanged((user) => {
//     if (user) {
//         window.location.href = "/admin/admin.html";
//     } else {
//         console.log("Kullanıcı oturumu kapattı.");
//     }
// });