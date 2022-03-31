const ref2 = firebase.database().ref("UserList");
const signupForm = document.querySelector("#signup-form");

signupForm.addEventListener("submit", event => {
    createUser(event);
});

const signupFeedback = document.querySelector('#feedback-msg-signup');
const signupModal = new bootstrap.Modal(document.querySelector('#modal-signup'));
// Create a password-based account
function createUser(event) {
    event.preventDefault();
    const email = signupForm['input-email-signup'].value;
    const pwd = signupForm['input-password-signup'].value;
    const nickname = signupForm['input-name-signup'].value;
    
    const user = firebase
        .auth()
        .createUserWithEmailAndPassword(email, pwd)
        .then(() => {
            signupFeedback.style = `color:green`;
            signupFeedback.innerText = `Sign up completed.`;
            setTimeout(function() {
                signupModal.hide();
            }, 1000);
            signupForm.reset();
            signupFeedback.innerHTML = ``
            const user = firebase.auth().currentUser;
        return user.updateProfile({
          displayName: nickname
        })
        })
        .catch((error) => {
            signupFeedback.style = `color:crimson`;
            signupFeedback.innerText = `${error.message}`;
            signupForm.reset();
        });

}


//Cancel
const btnCancel= document.querySelectorAll('.btn-cancel').forEach(btn => {
    btn.addEventListener('click', () => {
        signupForm.reset();
        signupFeedback.innerHTML = ``
        loginForm.reset();
        loginFeedback.innerHTML = ``
    })
});



firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log(user);
        
    } else {
        console.log('Unavailable user')
    }
});

const btnLogout = document.querySelector('#btnLogout');
btnLogout.addEventListener('click', () => {
    firebase.auth().signOut();
    console.log('Logout completed');
});

//Login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', loginUser);

const loginFeedback = document.querySelector('#feedback-msg-login');
const loginModal = new bootstrap.Modal(document.querySelector('#modal-login'));

function loginUser(event) {
    event.preventDefault();
    const email = loginForm['input-email-login'].value;
    const pwd = loginForm['input-password-login'].value;
    firebase
        .auth()
        .signInWithEmailAndPassword(email, pwd)
        .then(() => {
            loginFeedback.style = `color:green`;
            loginFeedback.innerText = `Login successed.`;
            setTimeout(function() {
                loginModal.hide();
            }, 1000);
            loginForm.reset();
            loginFeedback.innerHTML = ``
        })
        .catch((error) => {
            loginFeedback.style = `color:crimson`;
            loginFeedback.innerText = `${error.message}`;
            loginForm.reset();
        });
    
}

firebase.auth().onAuthStateChanged((user) => {
    console.log('User: ', user)
    setupUI(user)
})