let url = 'http://localhost:9000'

let sign_up = async () => {
    event.preventDefault()
    window.location = (`${url}/signup`)
}

document.getElementById('sign_up_link').addEventListener('click', sign_up)
