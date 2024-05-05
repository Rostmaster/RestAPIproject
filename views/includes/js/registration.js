let countries = []

const initFieldsData = async () => {
  let result = await fetch(`http://localhost:3000/api/countries/`)
  return await result.json()
}

const initView = () => {
  document.getElementById('customer_block').classList.remove('hidden')
  document.getElementById('airline_block').classList.add('hidden')
  document.getElementById('customer_header').classList.add('customer_form_active')
  document.getElementById('airline_header').classList.remove('airline_form_active')
}

const renderCountries = async () => {
  countries = (await initFieldsData()).data
  let country_id_select = document.getElementById('country_id');
  for (country of countries) {
      let opt1 = document.createElement('option');
      opt1.value = country.id;
      opt1.innerHTML = country.name;
      country_id_select.appendChild(opt1);
  }
}

const continueAsGuest = async (event) => {
  event.preventDefault()
  window.location = ('http://localhost:3000/login');
}
const isAirlineFormSwitch = document.getElementById('switch')
isAirlineFormSwitch.addEventListener('change', (event) => {
  if(!event.currentTarget.checked) {
    document.getElementById('customer_block').classList.remove('hidden')
    document.getElementById('airline_block').classList.add('hidden')
    document.getElementById('customer_header').classList.add('customer_form_active')
    document.getElementById('airline_header').classList.remove('airline_form_active')
  }
  else {
    document.getElementById('customer_block').classList.add('hidden')
    document.getElementById('airline_block').classList.remove('hidden')
    document.getElementById('customer_header').classList.remove('customer_form_active')
    document.getElementById('airline_header').classList.add('airline_form_active')
  }
})

document.getElementById('guest_btn').addEventListener('click',continueAsGuest)

window.onload = async () => {
  await renderCountries()
  document.getElementById('switch').checked = false
  initView()
};