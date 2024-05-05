const assert = require('assert')

describe('customers Service CRUD methods tests:', () => {
  console.clear()
  let customer = {
    first_name: 'Test',
    last_name: 'Test',
    address: 'Test',
    phone_number: '123',
    credit_card: '1234',
    user_id: 8
  }

  it('should add a   to a DB and return customer and status \'200\'', async () => {
    //Arrange

    //Act
    const customerCreateResult = await fetch(`http://localhost:3000/api/customers/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ ...customer })
    })

    result = await customerCreateResult.json()
    customer.id = result.data.id
    //Assert
    assert.deepStrictEqual(result.data, customer)
    assert.strictEqual(customerCreateResult.ok, true)

  })

  it('should get a customer from DB and return it and status \'200\'', async () => {
    //Arrange
    //=============
    //Act
    const customerCreateResult = await fetch(`http://localhost:3000/api/customers/${customer.id}`)
    //Assert
    assert.strictEqual(customerCreateResult.ok, true)
    assert.deepStrictEqual((await customerCreateResult.json()).data, customer)

  })

  it('should update a customer and return id and status \'200\'', async () => {
    //Arrange
    customer = {
      id: customer.id,
      first_name: 'UpdateTest',
      last_name: 'UpdateTest',
      address: 'UpdateTest',
      phone_number: '456',
      credit_card: '5679',
      user_id: 8
    }
    //Act
    
    const customerUpdateResult =await fetch(`http://localhost:3000/api/customers/${customer.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ ...customer })
    })
    //Assert
    assert.strictEqual(customerUpdateResult.ok, true)
    assert.deepStrictEqual((await customerUpdateResult.json()).data, customer)
  })

  it('should patch a customer and return id and status \'success\'', async () => {
    //Arrange
    customer.first_name= 'PatchTest'
    //Act
    const customerPatchResult =await fetch(`http://localhost:3000/api/customers/${customer.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ ...customer })
    })
    //Assert
    assert.strictEqual(customerPatchResult.ok, true)
    assert.deepStrictEqual((await customerPatchResult.json()).data, customer)
  })

  it('should delete a customer and return id and status \'200\'', async () => {
    //Arrange
    //==============
    //Act
    const customerDeleteResult = await fetch(`http://localhost:3000/api/customers/${customer.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    assert.strictEqual(customerDeleteResult.ok, true)

    // assert.deepStrictEqual(result.data, data.data.id)
  })
})
