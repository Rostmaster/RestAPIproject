let api = 'http://localhost:3000/api'

let logout = async () => {
    let email = $('#email').val()
    let password = $('#password').val()
    console.log(email, password)
    let result = await fetch(`${api}/users/logout`)
    if (result.ok) window.location = ('http://localhost:3000/signup');
}
let switchUser = async () => {
    let result = await fetch(`${api}/users/new_user_request`)
    if (result.ok) window.location = ('http://localhost:3000/signup')
}

let getAllFlights = async () => {
    // let user = await fetch(`${api}/services/get_current_user`)
    // console.log(user.json(),'hello!')
    console.log(`${api}/services/get_customer_flights/`)
    let result =   await fetch(`${api}/services/get_customer_flights/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ user:{id:1}})
    })
    console.log(result.json(),'hello!')
}

document.getElementById('logout_btn').addEventListener('click', logout)
document.getElementById('switch_user_btn').addEventListener('click', switchUser)
document.getElementById('get_all_flights').addEventListener('click', getAllFlights)