let url = 'http://localhost:3000'

let activeFlights = []
let activeFlightsResultsLimit = 3
let activeFlightsCurrentPage = 1

let userFlights = []
let userFlightsResultsLimit = 7
let userFlightsCurrentPage = 1

//?Authentication
const logout = async () => {
    let email = $('#email').val()
    let password = $('#password').val()
    console.log(email, password)
    let result = await fetch(`${url}/api/users/logout`)
    if (result.ok) window.location = ('http://localhost:3000/signup');
}
const switchUser = async () => {
    let result = await fetch(`${url}/api/users/new_user_request`)
    if (result.ok) window.location = ('http://localhost:3000/signup')
}
//?Initialization
const initAllFlights = async () => {
    let result = await fetch(`http://localhost:3000/api/services/get_active_flights/`)
    return await result.json()
}
//?Page actions
const switchPage = (event) => {
    console.log(event.target.id, 'page was clicked')
    activeFlightsCurrentPage = event.target.id
    renderPaginator()
    renderFlights()
}

const buyTicket = async (event) => {
    let flight_id = event.target.id
    let customer = await (await fetch(`http://localhost:3000/api/services/get_current_user/`)).json()
    console.log(customer.id, 'customer_id', flight_id, 'flight_id')
    let result = await fetch(`http://localhost:3000/api/services/buy_ticket`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ flight_id, customer_id:customer.id })
    })
    //- const data = result.json()
    if (result.ok) window.location = ('http://localhost:3000/dashboard');
}

const cancelTicket = async (event) => {
    console.log(event.target.id, 'ticket_id')
    let result = await fetch(`http://localhost:3000/api/services/cancel_ticket`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ ticket_id: event.target.id })
    })
    if (result.ok) window.location = ('http://localhost:3000/dashboard');
}

//? Rendering
const renderFlights = () => {
    let flights_table = document.getElementById('all_flights')
    let flights_to_render = activeFlights.slice((activeFlightsCurrentPage - 1) * activeFlightsResultsLimit, activeFlightsCurrentPage * activeFlightsResultsLimit)
    let content = `${flights_to_render.map(flight => {
        return `
        <tr>
            <td>${flight.airline}</td>
            <td>${flight.id}</td>
            <td>${flight.origin_country}</td>
            <td>${flight.departure_time}</td>
            <td>${flight.destination_country}</td>
            <td>${flight.landing_time}</td>
            <td class='remained_tickets'>
                ${flight.remaining_tickets}
                <button class="buy_btn" id="${flight.id}">Buy</button
            </td>
        </tr>`
    }).join('')}`
    flights_table.innerHTML = content

    const buy_btns = document.querySelectorAll('.buy_btn')
    buy_btns.forEach(pageEl => pageEl.addEventListener('click', buyTicket))

    const cancel_btns = document.querySelectorAll('.cancel_btn')
    cancel_btns.forEach(pageEl => pageEl.addEventListener('click', cancelTicket)) 
}
const renderPaginator = async () => {
    activeFlights = (await initAllFlights()).data
        .filter(flight => flight.remaining_tickets > 0)
    let paginator = document.getElementById('active-flights-pages_list')
    paginator.innerHTML = ''
    let content = ''
    for (let i = 1; i <= Math.ceil(activeFlights.length / activeFlightsResultsLimit); i++) {
        if (i == activeFlightsCurrentPage) {
            content += `<li class="active-flight-page-item active" id="${i}">${i}</li>`
        } else {
            content += `<li class="active-flight-page-item" id="${i}">${i}</li>`
        }
    }
    paginator.innerHTML = content
    const pageItems = document.querySelectorAll('.active-flight-page-item')
    pageItems.forEach(pageEl => pageEl.addEventListener('click', switchPage))
}
window.onload = async (event) => {
    await renderPaginator()
    await renderFlights()
};

document.getElementById('logout_btn').addEventListener('click', logout)
document.getElementById('switch_user_btn').addEventListener('click', switchUser)

