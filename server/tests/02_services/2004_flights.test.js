const assert = require('assert')
const config = require('config');
const url = `http://localhost:${config.server.port}`
describe('flights Service CRUD methods tests:', () => {
  console.clear()
  let flight = {
    airline_id: 3,
    origin_country_id: 3,
    destination_country_id: 1,
    departure_time: '2019-01-01 00:00:00',
    landing_time: '2019-01-01 00:00:00',
    remaining_tickets: 333
  }

  it('should add a   to a DB and return flight and status \'200\'', async () => {
    //Arrange

    //Act
    const flightCreateResult = await fetch(`${url}/api/flights/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ ...flight })
    })

    result = await flightCreateResult.json()
    flight.id = result.data.id
    //Assert
    assert.deepStrictEqual(result.data, flight)
    assert.strictEqual(flightCreateResult.ok, true)

  })

  it('should get a flight from DB and return it and status \'200\'', async () => {
    //Arrange
    let testFlight = {
      id: flight.id, airline_id: flight.airline_id,
      origin_country_id: flight.origin_country_id,
      destination_country_id: flight.destination_country_id,
      remaining_tickets: flight.remaining_tickets
    }
    //Act
    const flightCreateResult = await fetch(`${url}/api/flights/${flight.id}`)
    //Assert
    assert.strictEqual(flightCreateResult.ok, true)
    let flightResultWithNoDates = await flightCreateResult.json()
    flightResultWithNoDates = flightResultWithNoDates.data
    delete flightResultWithNoDates.departure_time
    delete flightResultWithNoDates.landing_time
    assert.deepStrictEqual(flightResultWithNoDates, testFlight)

  })

  it('should update a flight and return id and status \'200\'', async () => {
    //Arrange
    flight = {
      id: flight.id,
      airline_id: 1,
      origin_country_id: 1,
      destination_country_id: 2,
      departure_time: '2019-01-01 00:00:00',
      landing_time: '2019-01-01 00:00:00',
      remaining_tickets: 222,
    }
    let testFlight = {
      id: flight.id, airline_id: flight.airline_id,
      origin_country_id: flight.origin_country_id,
      destination_country_id: flight.destination_country_id,
      remaining_tickets: flight.remaining_tickets
    }

    //Act

    const flightUpdateResult = await fetch(`${url}/api/flights/${flight.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ ...flight })
    })
    //Assert
    assert.strictEqual(flightUpdateResult.ok, true)
    let flightResultWithNoDates = await flightUpdateResult.json()
    flightResultWithNoDates = flightResultWithNoDates.data
    delete flightResultWithNoDates.departure_time
    delete flightResultWithNoDates.landing_time
    assert.deepStrictEqual(flightResultWithNoDates, testFlight)
  })

  it('should patch a flight and return id and status \'200\'', async () => {
    //Arrange
    flight.airline_id = 5
    let testFlight = {
      id: flight.id, airline_id: flight.airline_id,
      origin_country_id: flight.origin_country_id,
      destination_country_id: flight.destination_country_id,
      remaining_tickets: flight.remaining_tickets
    }
    //Act
    const flightPatchResult = await fetch(`${url}/api/flights/${flight.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ ...flight })
    })
    //Assert
    assert.strictEqual(flightPatchResult.ok, true)
    let flightResultWithNoDates = await flightPatchResult.json()
    flightResultWithNoDates = flightResultWithNoDates.data
    delete flightResultWithNoDates.departure_time
    delete flightResultWithNoDates.landing_time
    assert.deepStrictEqual(flightResultWithNoDates, testFlight)
  })

  it('should delete a flight and return id and status \'200\'', async () => {
    //Arrange
    //==============
    //Act
    const flightDeleteResult = await fetch(`${url}/api/flights/${flight.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    assert.strictEqual(flightDeleteResult.ok, true)

    // assert.deepStrictEqual(result.data, data.data.id)
  })
})