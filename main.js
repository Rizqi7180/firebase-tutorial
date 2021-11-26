const auth = firebase.auth();
const rdb = firebase.database();
const stg = firebase.storage();

function registerBtn() {

    var email = document.getElementById('register-email');
    var password = document.getElementById('register-password');
    var name = document.getElementById('register-name');
    var bio = document.getElementById('register-bio');


    var data = {
        "Nama": name.value,
        "Bio": bio.value,
        "Email": email.value,
        "Password": password.value
    }

    if (email.value == '' || password.value == '' || name.value == '' || bio.value == '') {
        alert('Harap isi semua bidang')
    } else {
        auth.createUserWithEmailAndPassword(email.value, password.value)
            .then(cred => {
                rdb.ref('users').child(cred.user.uid).set(data);

                var fotoLink = 'https://raw.githubusercontent.com/devanka761/firebase-tutorial/main/profil.jpg';
                var fotoPath = `users/${cred.user.uid}/profil.jpg`;

                fetch(fotoLink).then(res => {
                    return res.blob();
                }).then(blob => {
                    stg.ref(fotoPath).put(blob);
                })

                alert("Berhasil Membuat Akun");
                setTimeout(() => {
                    window.location.reload();
                }, 5000)
            })
            .catch(error => {
                alert(error.message);
            })
    }
}

auth.onAuthStateChanged(user => {
    if (user) {
        var nama = document.getElementById('profil-nama');
        var bio = document.getElementById('profil-bio');
        var email = document.getElementById('profil-email');
        var foto = document.getElementById('profil-foto');

        var fotoPath = `users/${auth.currentUser.uid}/profil.jpg`;

        stg.ref(fotoPath).getDownloadURL().then(imgURL => {
            rdb.ref(`users`).child(auth.currentUser.uid).update({
                "Foto": imgURL
            });
        });

        rdb.ref('users').child(auth.currentUser.uid).on('value', data => {
            nama.innerHTML = data.val().Nama;
            email.innerHTML = data.val().Email;
            bio.innerHTML = data.val().Bio;
            foto.style.backgroundImage = `url('${data.val().Foto}')`
        });

        document.getElementById('auth').style.display = 'none';
        document.getElementById('profil').style.display = 'block';
    }
})

function loginBtn() {
    var email = document.getElementById('login-email');
    var password = document.getElementById('login-password');

    if (email.value == '' || password.value == '') {
        alert('Harap isi semua bidang!')
    } else {
        auth.signInWithEmailAndPassword(email.value, password.value)
            .catch(error => {
                alert(error.message);
            })
    }
}

function logout() {
    auth.signOut();
    alert('Berhasil keluar dari akun kamu');
    window.location.reload()
}