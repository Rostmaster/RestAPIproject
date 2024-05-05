const assert = require('assert')
const customersDal = require('../../dals/customers.js')

describe('customers DAL CRUD methods tests:', () => {
  let customer = {
    first_name: 'Test',
    last_name: 'Test',
    address: 'Test',
    phone_number: '123',
    credit_card: '1234',
    user_id: 8
  }

  it('should add a customer to a DB and return customer and status \'success\'', async () => {
    //Arrange
    //=============
    //Act
    const customerCreateResult = await customersDal.add(customer)
    customer.id = customerCreateResult.data.id

    //Assert
    assert.strictEqual(customerCreateResult.status, 'success')
    assert.deepStrictEqual(customerCreateResult.data, customer)

  })

  it('should get a customer from DB and return it and status \'success\'', async () => {
    //Arrange
    //=============
    //Act
    const customerCreateResult = await customersDal.get(customer.id)

    //Assert
    assert.strictEqual(customerCreateResult.status, 'success')
    assert.deepStrictEqual(customerCreateResult.data, customer)

  })

  it('should update a customer and return id and status \'success\'', async () => {
    //Arrange
    customer = {
      id: customer.id,
      first_name: 'UpdateTest',
      last_name: 'UpdateTest',
      address: 'UpdateTest',
      phone_number: '456',
      credit_card: '5678',
      user_id: 8
    }

      //Act
      const customerPatchResult = await customersDal.update(customer.id, customer)

      //Assert
      assert.strictEqual(customerPatchResult.status, 'success')
      assert.deepStrictEqual(customerPatchResult.data, customer)
    })

    it('should patch a customer and return id and status \'success\'', async () => {
      //Arrange
      customer.first_name= 'PatchTest'
      //Act
      const customerUpdateResult = await customersDal.patch(customer.id, { first_name: customer.first_name })
      //Assert
      assert.strictEqual(customerUpdateResult.status, 'success')
      assert.deepStrictEqual(customerUpdateResult.data, customer)
    })

    it('should delete a customer and return id and status \'success\'', async () => {
      //Arrange
      //==============
      //Act
      const customerDeleteResult = await customersDal.delete(customer.id)

      //Assert
      assert.strictEqual(customerDeleteResult.status, 'success')
      assert.deepStrictEqual(customerDeleteResult.data, { id: customer.id })
    })
  })
