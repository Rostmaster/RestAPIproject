const assert = require('assert')
const securityService = require('../../services/security.js')
describe('countries Service CRUD methods tests:', () => {
  console.clear()
  let country = {
    name: 'Test'
  }

  it('should encrypt the password and than compare the encrypted one and original', async () => {
    //Arrange
    const password = 'wJIi@d1%agf3@9@!5'
    //Act
    const encryptedPassword = await securityService.toEncrypt(password)
    const result = await securityService.compare(password, encryptedPassword)
    //Assert
    assert.strictEqual(result, true)

  })

})
