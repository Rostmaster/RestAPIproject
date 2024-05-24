const assert = require('assert')
const AirlinesDal = require('../../dals/airlines.js')

describe('Airlines DAL CRUD methods tests:', () => {

  let airline = {
    name: 'Test',
    country_id: 1,
    user_id: 1
  }

  it('should add a airline to a DB and return airline and status \'success\'', async () => {
    //Arrange
    //=============
    //Act
    const airlineCreateResult = await AirlinesDal.add(airline)
    airline.id = airlineCreateResult.data.id

    //Assert
    assert.strictEqual(airlineCreateResult.status, 'success')
    assert.deepStrictEqual(airlineCreateResult.data, airline)

  })

  it('should get a airline from DB and return it and status \'success\'', async () => {
    //Arrange
    //=============
    //Act
    const airlineCreateResult = await AirlinesDal.get(airline.id)

    //Assert
    assert.strictEqual(airlineCreateResult.status, 'success')
    assert.deepStrictEqual(airlineCreateResult.data, airline)

  })

  it('should update a airline and return id and status \'success\'', async () => {
    //Arrange
    airline = {
      name: 'UpdateTest',
      country_id: 2,
      user_id: 2,
      id: airline.id
    }
  
    //Act
    const airlinePatchResult = await AirlinesDal.update(airline.id, airline)
    //Assert
    assert.strictEqual(airlinePatchResult.status, 'success')
    assert.deepStrictEqual(airlinePatchResult.data, airline)
  })

  it('should patch a airline and return id and status \'success\'', async () => {
    //Arrange
    airline.name= 'PatchTest'
    //Act
    const airlineUpdateResult = await AirlinesDal.patch(airline.id, { name: airline.name })
    //Assert
    assert.strictEqual(airlineUpdateResult.status, 'success')
    assert.deepStrictEqual(airlineUpdateResult.data, airline)
  })

  it('should delete a airline and return id and status \'success\'', async () => {
    //Arrange
    //==============
    //Act
    const airlineDeleteResult = await AirlinesDal.delete(airline.id)

    //Assert
    assert.strictEqual(airlineDeleteResult.status, 'success')
    assert.deepStrictEqual(airlineDeleteResult.data, { id: airline.id })
  })
})
