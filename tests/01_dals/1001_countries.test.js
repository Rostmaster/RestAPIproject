const assert = require('assert')
const countriesDal = require('../../dals/countries.js')

describe('countries DAL CRUD methods tests:', () => {

  let country = {
    name: 'Test',
  }

  it('should add a country to a DB and return country and status \'success\'', async () => {
    //Arrange
    //=============
    //Act
    const countryCreateResult = await countriesDal.add(country)
    country.id = countryCreateResult.data.id
    //Assert
    assert.strictEqual(countryCreateResult.status, 'success')
    assert.deepStrictEqual(countryCreateResult.data, country)

  })

  it('should get a country from DB and return it and status \'success\'', async () => {
    //Arrange
    //=============
    //Act
    const countryCreateResult = await countriesDal.get(country.id)
    //Assert
    assert.strictEqual(countryCreateResult.status, 'success')
    assert.deepStrictEqual(countryCreateResult.data, country)

  })

  it('should update a country and return id and status \'success\'', async () => {
    //Arrange
    country = {
      name: 'UpdateTest',
      id: country.id
    }
    //Act
    const countryPatchResult = await countriesDal.update(country.id, country)
    //Assert
    assert.strictEqual(countryPatchResult.status, 'success')
    assert.deepStrictEqual(countryPatchResult.data, country)
  })

  it('should delete a country and return id and status \'success\'', async () => {
    //Arrange
    //==============
    //Act
    const countryDeleteResult = await countriesDal.delete(country.id)
    //Assert
    assert.strictEqual(countryDeleteResult.status, 'success')
    assert.deepStrictEqual(countryDeleteResult.data, { id: country.id })
  })
})
