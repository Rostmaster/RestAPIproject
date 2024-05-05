let url = 'http://localhost:3000'
let activeCustomerId = 0
let activeAirlineId = 0

let userInfo = {}
let countries = []

let activeFlights = []
let activeFlightsResultsLimit = 5
let activeFlightsCurrentPage = 1

let customerFlights = []
let customerFlightsResultsLimit = 5
let customerFlightsCurrentPage = 1


//?Authentication
const logout = async () => {
    let result = await fetch(`http://localhost:3000/api/services/logout`)
    if (result.ok) window.location = ('http://localhost:3000/login');
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
const initCustomerFlights = async () => {
    if (userInfo.user.role_id === 3) {
        let result = await fetch(`http://localhost:3000/api/services/get_customer_flights/`)
        return await result.json()
    }

    if (userInfo.user.role_id === 1) {
        let result = await fetch(`http://localhost:3000/api/services/get_chosen_customer_flights/${activeCustomerId}`)
        result = await result.json()
        console.log(result)
        return result
    }
}
const initFieldsData = async () => {
    let result = await fetch(`http://localhost:3000/api/countries/`)
    return await result.json()
}
const initUser = async () => {
    userInfo = await fetch('http://localhost:3000/api/services/current_user_info')
    userInfo = (await userInfo.json()).data
}

//?Page actions
const switchAllFlightsPage = (event) => {
    activeFlightsCurrentPage = event.target.id
    renderAllFlightsPaginator()
    renderAllFlightsTable()
}
const switchCustomerFlightsPage = (event) => {
    customerFlightsCurrentPage = event.target.id
    renderCustomerFlightsPaginator()
    renderCustomerFlightsTable()
}
const buyTicket = async (event) => {
    let flight_id = event.target.id
    let customer = await (await fetch(`http://localhost:3000/api/services/get_current_user/`)).json()
    let result = await fetch(`http://localhost:3000/api/services/buy_ticket`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ flight_id, customer_id: customer.id })
    })
    //- const data = result.json()
    if (result.ok) window.location = ('http://localhost:3000/dashboard');
}
const cancelTicket = async (event) => {
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
const renderCustomerFlightsTable = () => {
    let flights_table = document.getElementById('customer_flights')
    let flights_to_render = customerFlights.slice(
        (customerFlightsCurrentPage - 1) * customerFlightsResultsLimit,
        customerFlightsCurrentPage * customerFlightsResultsLimit
    )
    if (flights_to_render.length > 0) {
        document.getElementById('customer_message').classList.add('hidden')
        document.getElementById('customer_flight_table').classList.remove('hidden')
        let content = `${flights_to_render.map(flight => {
            let departure_time = new Date(flight.departure_time)
            let landing_time = new Date(flight.landing_time)

            departure_time = departure_time.toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false, minute: '2-digit' })
            landing_time = landing_time.toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false, minute: '2-digit' })
            return `
        <tr>
            <td class='cell'>&nbsp;${flight.ticket_id}&nbsp;</td>
            <td class='cell'>&nbsp;${flight.id}&nbsp;</td>
            <td class='cell'>&nbsp;${flight.airline}&nbsp;</td>
            <td class='cell'>&nbsp;${flight.origin_country}&nbsp;</td>
            <td class='cell'>&nbsp;${departure_time}&nbsp;</td>
            <td class='cell'>&nbsp;${flight.destination_country}&nbsp;</td>
            <td class='cell'>&nbsp;${landing_time}&nbsp;</td>
            <td class='cell options'>&nbsp;
                <button class="cancel_btn" id="${flight.ticket_id}">Cancel</button>&nbsp;
            </td>
        </tr>`
        }).join('')}`
        flights_table.innerHTML = content
        const cancel_btns = document.querySelectorAll('.cancel_btn')
        cancel_btns.forEach(pageEl => pageEl.addEventListener('click', cancelTicket))
    }
    else {
        document.getElementById('customer_flight_table').classList.add('hidden')
        document.getElementById('customer_pagination').classList.add('hidden')
        document.getElementById('customer_message').classList.remove('hidden')
    }

}
const renderCustomerFlightsPaginator = async () => {
    customerFlights = (await initCustomerFlights()).data
    customerFlights.sort((a, b) => { return a.id - b.id });

    if (customerFlights.length > customerFlightsResultsLimit) {
        document.getElementById('customer_pagination').classList.remove('hidden')
        document.getElementById('customer_flight_table').classList.remove('hidden')

        let paginator = document.getElementById('customer-flights-pages_list')
        paginator.innerHTML = ''
        let content = ''
        for (let i = 1; i <= Math.ceil(customerFlights.length / customerFlightsResultsLimit); i++) {
            if (i == customerFlightsCurrentPage) {
                content += `<li class="customer-flight-page-item active" id="${i}">${i}</li>`
            } else {
                content += `<li class="customer-flight-page-item" id="${i}">${i}</li>`
            }
        }
        paginator.innerHTML = content
        const pageItems = document.querySelectorAll('.customer-flight-page-item')
        pageItems.forEach(pageEl => pageEl.addEventListener('click', switchCustomerFlightsPage))
    } else {
        document.getElementById('customer_pagination').classList.add('hidden')
        document.getElementById('customer_place').classList.remove('hidden')
    }
}
const renderAllFlightsTable = () => {
    let flights_table = document.getElementById('all_flights')
    let flights_to_render = activeFlights.slice((activeFlightsCurrentPage - 1) * activeFlightsResultsLimit, activeFlightsCurrentPage * activeFlightsResultsLimit)

    let content = `${flights_to_render.map(flight => {
        let departure_time = new Date(flight.departure_time)
        let landing_time = new Date(flight.landing_time)

        departure_time = departure_time.toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false, minute: '2-digit' })
        landing_time = landing_time.toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false, minute: '2-digit' })

        return `
        <tr>
            <td class='cell'>&nbsp;${flight.airline}&nbsp;</td>
            <td class='cell'>&nbsp;${flight.id}&nbsp;</td>
            <td class='cell'>&nbsp;${flight.origin_country}&nbsp;</td>
            <td class='cell'>&nbsp;${departure_time}&nbsp;</td>
            <td class='cell'>&nbsp;${flight.destination_country}&nbsp;</td>
            <td class='cell'>&nbsp;${landing_time}&nbsp;</td>
            <td class='remained_tickets cell'>&nbsp;
                <span>${flight.remaining_tickets}</span>
                <button class="buy_btn" id="${flight.id}">Buy</button>&nbsp;
            </td>
        </tr>`
    }).join('')}`
    flights_table.innerHTML = content

    const buy_btns = document.querySelectorAll('.buy_btn')
    buy_btns.forEach(pageEl => pageEl.addEventListener('click', buyTicket))

    const cancel_btns = document.querySelectorAll('.cancel_btn')
    cancel_btns.forEach(pageEl => pageEl.addEventListener('click', cancelTicket))
}
const renderAllFlightsPaginator = async () => {
    activeFlights = (await initAllFlights()).data
        .filter(flight => flight.remaining_tickets > 0)
    activeFlights.sort((a, b) => { return a.id - b.id });

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
    pageItems.forEach(pageEl => pageEl.addEventListener('click', switchAllFlightsPage))
}

const renderAirlinePanel = async () => {
    countries = (await initFieldsData()).data
    let departure_select = document.getElementById('origin_country_select');
    let destination_select = document.getElementById('destination_country_select');
    let country_id_select = document.getElementById('country_id_select');
    for (country of countries) {
        let opt1 = document.createElement('option');
        opt1.value = country.id;
        opt1.innerHTML = country.name;
        destination_select.appendChild(opt1);

        let opt2 = document.createElement('option');
        opt2.value = country.id;
        opt2.innerHTML = country.name;
        departure_select.appendChild(opt2);

        let opt3 = document.createElement('option');
        opt3.value = country.id;
        opt3.innerHTML = country.name;
        country_id_select.appendChild(opt3);
    }

    let customerFlights = document.getElementById('customer_flights_block')
    let airlineBlock = document.getElementById('airline_block');
    let flightBlock = document.getElementById('flight_block');
    let countryBlock = document.getElementById('country_block');

    if (userInfo.user.role_id === 1) customerFlights.classList.remove('hidden')
    airlineBlock.classList.remove('hidden')
    flightBlock.classList.remove('hidden')
    countryBlock.classList.remove('hidden')

}
const renderCustomerPanel = () => {

    let customerFlights = document.getElementById('customer_flights_block')
    let customerBlock = document.getElementById('customer_block');

    customerFlights.classList.remove('hidden')
    customerBlock.classList.remove('hidden')
}
const renderAdminPanel = () => {
    console.log(userInfo)
    let customers = userInfo.customers
    let airlines = userInfo.airlines

    let customers_select = document.getElementById('customer_id_select')
    let airlines_select = document.getElementById('airline_id_select')

    for (customer of customers) {
        let opt1 = document.createElement('option');
        opt1.value = customer.id;
        opt1.innerHTML = `ID:${customer.id} | ${customer.first_name} ${customer.last_name}`;
        customers_select.appendChild(opt1);
    }
    for (airline of airlines) {
        let opt2 = document.createElement('option');
        opt2.value = airline.id;
        opt2.innerHTML = `ID:${airline.id} | ${airline.name}`;
        airlines_select.appendChild(opt2);
    }

}
const renderFormFields = async () => {
    let headers = document.getElementById('header_title')
    let switch_user_btn = document.getElementById('register_btn')
    let messageBlock = document.getElementById('message_block');
    let customerFlights = document.getElementById('customer_flights_block')
    let customerBlock = document.getElementById('customer_block');
    let adminBlock = document.getElementById('admin_block');
    let airlineBlock = document.getElementById('airline_block');
    let flightBlock = document.getElementById('flight_block');
    let countryBlock = document.getElementById('country_block');

    messageBlock.classList.add('hidden')
    customerFlights.classList.add('hidden')
    customerBlock.classList.add('hidden')
    adminBlock.classList.add('hidden')
    airlineBlock.classList.add('hidden')
    flightBlock.classList.add('hidden')
    countryBlock.classList.add('hidden')

    activeFlightsResultsLimit = userInfo.user.role_id === 3 || userInfo.user.role_id === 1 ? 5 : 20
    let headerName = ''
    if (userInfo.user.role_id === 1) {//? Admin
        headerName = 'Admin Panel'
        renderAdminPanel()
    }
    if (userInfo.user.role_id === 2) {//? Airline
        headerName = 'Airline Panel'
    }
    if (userInfo.user.role_id === 3) {//? Customer
        headerName = 'Customer Panel'
    }
    if (userInfo.user.role_id === 4) {//? Guest
        headerName = 'Guest Panel'
        messageBlock.classList.remove('hidden')
        switch_user_btn.classList.remove('hidden')
    }
    headers.innerHTML = headerName

    if (userInfo.user.role_id === 1) {
        adminBlock.classList.remove('hidden')
        renderCustomerPanel()
        await renderAirlinePanel()
    }
    else if (userInfo.user.role_id === 3) renderCustomerPanel()
    else if (userInfo.user.role_id === 2) await renderAirlinePanel()
}

//? Helper functions
const customerChange = async () => {
    let selectElement = document.getElementById('customer_id_select');
    let customerFlightsHeading = document.getElementById('customer_flights_heading')
    customerFlightsHeading.innerHTML = `${selectElement.options[selectElement.selectedIndex].text}'s flights`
    activeCustomerId = selectElement.value

    await renderCustomerFlightsPaginator()
    await renderCustomerFlightsTable()
}
const airlineChange = () => {
    let selectElement = document.getElementById('airline_id_select');
    activeAirlineId = selectElement.value
}

window.onload = async (event) => {
    await initUser()
    await renderFormFields()
    customerChange()
    airlineChange()
    await renderAllFlightsPaginator()
    await renderAllFlightsTable()
    await renderCustomerFlightsPaginator()
    await renderCustomerFlightsTable()

};

document.getElementById('logout_btn').addEventListener('click', logout)
document.getElementById('switch_user_btn').addEventListener('click', switchUser)
document.getElementById('customer_id_select').addEventListener('change', customerChange)

