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

})
