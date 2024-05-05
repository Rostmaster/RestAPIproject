const assert = require('assert')
const flightsDal = require('../../dals/flights.js')

describe('flights DAL CRUD methods tests:', () => {

  let flight = {
    airline_id: 3,
    origin_country_id: 3,
    destination_country_id: 1,
    departure_time: '2019-01-01 00:00:00',
    landing_time: '2019-01-01 00:00:00',
    remaining_tickets: 333
  }

  it('should add a flight to a DB and return flight and status \'success\'', async () => {
    //Arrange
    //=============
    //Act
    const flightCreateResult = await flightsDal.add(flight)
    flight.id = flightCreateResult.data.id

    //Assert
    assert.strictEqual(flightCreateResult.status, 'success')
    assert.deepStrictEqual(flightCreateResult.data, flight)

  })

  it('should get a flight from DB and return it and status \'success\'', async () => {
    //Arrange
    //=============
    //Act
    const flightCreateResult = await flightsDal.get(flight.id)
    const flightWithoutDate = {...flight }
    delete flightWithoutDate.departure_time
    delete flightWithoutDate.landing_time

    delete flightCreateResult.data.departure_time
    delete flightCreateResult.data.landing_time

    //Assert
    assert.strictEqual(flightCreateResult.status, 'success')
    assert.deepStrictEqual(flightCreateResult.data, flightWithoutDate)

  })

  it('should update a flight and return id and status \'success\'', async () => {
    //Arrange
    flight = {
      airline_id: 1,
      origin_country_id: 1,
      destination_country_id: 2,
      departure_time: '2019-01-01 00:00:00',
      landing_time: '2019-01-01 00:00:00',
      remaining_tickets: 222,
      id: flight.id
    }
  
    //Act
    const flightPatchResult = await flightsDal.update(flight.id, flight)
    const flightWithoutDate = {...flight }

    delete flightWithoutDate.departure_time
    delete flightWithoutDate.landing_time
    delete flightPatchResult.data.departure_time
    delete flightPatchResult.data.landing_time
    //Assert
    assert.strictEqual(flightPatchResult.status, 'success')
    assert.deepStrictEqual(flightPatchResult.data, flightWithoutDate)
  })

  it('should patch a flight and return id and status \'success\'', async () => {
    //Arrange
    flight.airline_id= 5
    //Act
    const flightUpdateResult = await flightsDal.patch(flight.id, { airline_id: flight.airline_id })
    const flightWithoutDate = {...flight }

    delete flightWithoutDate.departure_time
    delete flightWithoutDate.landing_time
    delete flightUpdateResult.data.departure_time
    delete flightUpdateResult.data.landing_time
    //Assert
    assert.strictEqual(flightUpdateResult.status, 'success')
    assert.deepStrictEqual(flightUpdateResult.data, flightWithoutDate)
  })

  it('should delete a flight and return id and status \'success\'', async () => {
    //Arrange
    //==============
    //Act
    const flightDeleteResult = await flightsDal.delete(flight.id)

    //Assert
    assert.strictEqual(flightDeleteResult.status, 'success')
    assert.deepStrictEqual(flightDeleteResult.data, { id: flight.id })
  })
})
