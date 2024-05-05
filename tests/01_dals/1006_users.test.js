const assert = require('assert')
const usersDal = require('../../dals/users.js')

describe('Users DAL CRUD methods tests:', () => {

  let user = {
    username: 'Test',
    password: 'Test',
    email: 'Test'
  }

  it('should add a user to a DB and return user and status \'success\'', async () => {
    //Arrange
    //=============
    //Act
    const userCreateResult = await usersDal.add(user)
    user.id = userCreateResult.data.id

    //Assert
    assert.strictEqual(userCreateResult.status, 'success')
    assert.deepStrictEqual(userCreateResult.data, user)

  })

  it('should get a user from DB and return it and status \'success\'', async () => {
    //Arrange
    //=============
    //Act
    const userCreateResult = await usersDal.get(user.id)

    //Assert
    assert.strictEqual(userCreateResult.status, 'success')
    assert.deepStrictEqual(userCreateResult.data, user)

  })

  it('should update a user and return id and status \'success\'', async () => {
    //Arrange
    user = {
      username: 'PatchTest',
      password: 'PatchTest',
      email: 'PatchTest',
      id: user.id
    }
    //Act
    const userPatchResult = await usersDal.update(user.id, user)
    //Assert
    assert.strictEqual(userPatchResult.status, 'success')
    assert.deepStrictEqual(userPatchResult.data, user)
  })

  it('should patch a user and return id and status \'success\'', async () => {
    //Arrange
    user.password= 'UpdateTest'
    //Act
    const userUpdateResult = await usersDal.patch(user.id, { password: user.password })
    //Assert
    assert.strictEqual(userUpdateResult.status, 'success')
    assert.deepStrictEqual(userUpdateResult.data, user)
  })

  it('should delete a user and return id and status \'success\'', async () => {
    //Arrange
    //==============
    //Act
    const userDeleteResult = await usersDal.delete(user.id)

    //Assert
    assert.strictEqual(userDeleteResult.status, 'success')
    assert.deepStrictEqual(userDeleteResult.data, { id: user.id })
  })
})
