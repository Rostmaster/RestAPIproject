let login = async () => {
    // let email = $('#email').val()
    // let password = $('#password').val()
    // let result = await fetch(`http://localhost:3000/api/users/login`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //     },
    //     body: JSON.stringify({ email, password })
    // })
    // //- const data = result.json()
     window.location = ('http://localhost:3000/dashboard');
}

let sign_up = async () => {
    window.location = ('http://localhost:3000/signup')
}

document.getElementById('login').addEventListener('click', (event) => {
    let id = event.target.id
    // if (id === 'login_btn') login()
    // if (id === 'sign_up_link') sign_up()
})
