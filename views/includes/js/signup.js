let submit = async () => {
    let username = $('#username').val()
    let email = $('#email').val()
    let password = $('#password').val()
    let result = await fetch(`http://localhost:3000/api/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    })
    //- const data = result.json()
    console.log(`result : ${result.ok}`)
    if (result.ok) window.location = ('http://localhost:3000/login');
}

document.getElementById('sign_up').addEventListener('click', (event) => {
    let id = event.target.id
    console.dir(id);
    if (id === 'submit') submit()
})
