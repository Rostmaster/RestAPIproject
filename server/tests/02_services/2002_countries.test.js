const assert = require('assert')
const config = require('config');
const url = `http://localhost:${config.server.port}`
describe('countries Service CRUD methods tests:', () => {
  console.clear()
  let country = {
    name: 'Test'
  }

  it('should add a country to a DB and return country and status \'200\'', async () => {
    //Arrange

    //Act
    const countryCreateResult = await fetch(`${url}/api/countries/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ ...country })
    })

    result = await countryCreateResult.json()
    country.id = result.data.id
    //Assert
    assert.deepStrictEqual(result.data, country)
    assert.strictEqual(countryCreateResult.ok, true)

  })

  it('should get a country from DB and return it and status \'200\'', async () => {
    //Arrange
    //=============
    //Act
    const countryCreateResult = await fetch(`${url}/api/countries/${country.id}`)
    //Assert
    assert.strictEqual(countryCreateResult.ok, true)
    assert.deepStrictEqual((await countryCreateResult.json()).data, country)

  })

  it('should update a country and return id and status \'200\'', async () => {
    //Arrange
    country = {
      id: country.id,
      name: 'UpdateTest'
    }
    //Act
    
    const countryUpdateResult =await fetch(`${url}/api/countries/${country.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ ...country })
    })
    //Assert
    assert.strictEqual(countryUpdateResult.ok, true)
    assert.deepStrictEqual((await countryUpdateResult.json()).data, country)
  })

  it('should delete a country and return id and status \'200\'', async () => {
    //Arrange
    //==============
    //Act
    const countryDeleteResult = await fetch(`${url}/api/countries/${country.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    assert.strictEqual(countryDeleteResult.ok, true)

    // assert.deepStrictEqual(result.data, data.data.id)
  })
})
