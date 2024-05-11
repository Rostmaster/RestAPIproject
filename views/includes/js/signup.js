
let loginRedirect = (event) => {
    event.preventDefault()
    window.location = ('http://localhost:3000/login');
}
document.getElementById('sign_up').addEventListener('click', (event) => {
    let id = event.target.id
    console.dir(id);
    if (id ==='login') loginRedirect(event)
})

document.getElementById('name').value = ""
document.getElementById('email').value = ""
document.getElementById('password').value = ""