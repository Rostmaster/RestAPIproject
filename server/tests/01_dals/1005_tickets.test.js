const assert = require('assert')
const ticketsDal = require('../../dals/tickets.js')

describe('tickets DAL CRUD methods tests:', () => {
  console.clear()
  let ticket = {
    flight_id: 1,
    customer_id: 7
  }

  it('should add a ticket to a DB and return ticket and status \'success\'', async () => {
    //Arrange
    //=============
    //Act
    const ticketCreateResult = await ticketsDal.add(ticket)
    ticket.id = ticketCreateResult.data.id

    //Assert
    assert.strictEqual(ticketCreateResult.status, 'success')
    assert.deepStrictEqual(ticketCreateResult.data, ticket)

  })

  it('should get a ticket from DB and return it and status \'success\'', async () => {
    //Arrange
    //=============
    //Act
    const ticketCreateResult = await ticketsDal.get(ticket.id)

    //Assert
    assert.strictEqual(ticketCreateResult.status, 'success')
    assert.deepStrictEqual(ticketCreateResult.data, ticket)

  })

  it('should update a ticket and return id and status \'success\'', async () => {
    //Arrange
    ticket = {
      id: ticket.id,
      flight_id: 2,
      customer_id: 7,
    }
  
    //Act
    const ticketPatchResult = await ticketsDal.update(ticket.id, ticket)

    //Assert
    assert.strictEqual(ticketPatchResult.status, 'success')
    assert.deepStrictEqual(ticketPatchResult.data, ticket)
  })

  it('should patch a ticket and return id and status \'success\'', async () => {
    //Arrange
    ticket.customer_id= 2
    //Act
    const ticketUpdateResult = await ticketsDal.patch(ticket.id, { customer_id: ticket.customer_id })

    //Assert
    assert.strictEqual(ticketUpdateResult.status, 'success')
    assert.deepStrictEqual(ticketUpdateResult.data, ticket)
  })

  it('should delete a ticket and return id and status \'success\'', async () => {
    //Arrange
    //==============
    //Act
    const ticketDeleteResult = await ticketsDal.delete(ticket.id)

    //Assert
    assert.strictEqual(ticketDeleteResult.status, 'success')
    assert.deepStrictEqual(ticketDeleteResult.data, { id: ticket.id })
  })
})
