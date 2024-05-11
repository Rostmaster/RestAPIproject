
let sign_up = async () => {
    event.preventDefault()
    window.location = ('http://localhost:3000/signup')
}

document.getElementById('sign_up_link').addEventListener('click', sign_up)
