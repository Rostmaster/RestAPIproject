const assert = require('assert')
const usersDal = require('../../dals/users.js')

describe('Users DAL', () => {
    beforeEach(async () => {
        await usersDal.dropTable()
        await usersDal.createTable()
        await usersDal.fillTable()
    })


    it('should return 3 users and status \'success\'', async () => {
        //Arrange
        console.clear()

        //Act
        const result = await usersDal.getAll()
        //Assert
        assert.strictEqual(result.status, 'success')
        assert.equal(result.data.length, 3)

    })
    it('should create user and check it', async () => {
        //Arrange
        await usersDal.dropTable()
        await usersDal.createTable()
        await usersDal.fillTable()
        //Act
        const new_user = {
            username: 'testUser',
            password: 'passTest',
            email: 'testUser@passTest.com'
        }
        const result = await usersDal.add(new_user)
        const created_user = await usersDal.get(result.data.id)
        //Assert
        assert.strictEqual(result.status, 'success')
        assert.deepEqual(result.data, created_user.data)
    })
})
