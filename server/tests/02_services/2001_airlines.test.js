const assert = require('assert')
const config = require('config');
const url = `http://localhost:${config.server.port}`

describe('airlines Service CRUD methods tests:', () => {
  console.clear()
  let airline = {
    name: 'Test',
    country_id: 5,
    user_id: 8
  }

  it('should add a airline to a DB and return airline and status \'200\'', async () => {
    //Arrange

    //Act
    const airlineCreateResult = await fetch(`${url}/api/airlines/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ ...airline })
    })

    result = await airlineCreateResult.json()
    airline.id = result.data.id
    //Assert
    assert.deepStrictEqual(result.data, airline)
    assert.strictEqual(airlineCreateResult.ok, true)

  })

  it('should get a airline from DB and return it and status \'200\'', async () => {
    //Arrange
    //=============
    //Act
    const airlineCreateResult = await fetch(`${url}/api/airlines/${airline.id}`)
    //Assert
    assert.strictEqual(airlineCreateResult.ok, true)
    assert.deepStrictEqual((await airlineCreateResult.json()).data, airline)

  })

  it('should update a airline and return id and status \'200\'', async () => {
    //Arrange
    airline = {
      id: airline.id,
      name: 'UpdateTest',
      country_id: 5,
      user_id: 8
    }
    //Act
    
    const airlineUpdateResult =await fetch(`${url}/api/airlines/${airline.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ ...airline })
    })
    //Assert
    assert.strictEqual(airlineUpdateResult.ok, true)
    assert.deepStrictEqual((await airlineUpdateResult.json()).data, airline)
  })

  it('should patch a airline and return id and status \'success\'', async () => {
    //Arrange
    airline.name= 'PatchTest'
    //Act
    const airlinePatchResult =await fetch(`${url}/api/airlines/${airline.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ ...airline })
    })
    //Assert
    assert.strictEqual(airlinePatchResult.ok, true)
    assert.deepStrictEqual((await airlinePatchResult.json()).data, airline)
  })

  it('should delete a airline and return id and status \'200\'', async () => {
    //Arrange
    //==============
    //Act
    const airlineDeleteResult = await fetch(`${url}/api/airlines/${airline.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    assert.strictEqual(airlineDeleteResult.ok, true)

    // assert.deepStrictEqual(result.data, data.data.id)
  })
})
