let url = 'http://localhost:3000'

let logout = async () => {
    let email = $('#email').val()
    let password = $('#password').val()
    console.log(email, password)
    let result = await fetch(`${url}/api/users/logout`)
    if (result.ok) window.location = ('http://localhost:3000/signup');
}
let switchUser = async () => {
    let result = await fetch(`${url}/api/users/new_user_request`)
    if (result.ok) window.location = ('http://localhost:3000/signup')
}

const initAllFlights = async () => {
    let result = await fetch(`http://localhost:3000/api/services/get_active_flights/`)
    .then((response) => response.json())
    .then((responseJSON) => {return responseJSON})
    .catch((error) => console.log('Error:', error))

}

let getAllFlights = async () => {
    let result = await fetch(`${url}/dashboard`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ allFlightsPage: 2 })
    })
    console.log('dashboard:',result.json(), 'hello!')
}

let switchPage = async () => {
    let result = await fetch(`${url}/dashboard`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ allFlightsPage: { id: 2 } })
    })
}

window.onload = async (event) => {
   let activeFlights =  await initAllFlights()

   console.log(activeFlights)
};

document.getElementById('logout_btn').addEventListener('click', logout)
document.getElementById('switch_user_btn').addEventListener('click', switchUser)
document.getElementById('get_all_flights').addEventListener('click', getAllFlights)
