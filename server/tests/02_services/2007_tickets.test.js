const assert = require('assert')
const config = require('config');
const url = `http://localhost:${config.server.port}`

describe('tickets Service CRUD methods tests:', () => {
  console.clear()
  let ticket = {
    flight_id: 1,
    customer_id: 1
  }

  it('should add a ticket to a DB and return ticket and status \'200\'', async () => {
    //Arrange

    //Act
    const ticketCreateResult = await fetch(`${url}/api/tickets/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ ...ticket })
    })

    result = await ticketCreateResult.json()
    ticket.id = result.data.id
    //Assert
    assert.deepStrictEqual(result.data, ticket)
    assert.strictEqual(ticketCreateResult.ok, true)

  })

  it('should get a ticket from DB and return it and status \'200\'', async () => {
    //Arrange
    //=============
    //Act
    const ticketCreateResult = await fetch(`${url}/api/tickets/${ticket.id}`)
    //Assert
    assert.strictEqual(ticketCreateResult.ok, true)
    assert.deepStrictEqual((await ticketCreateResult.json()).data, ticket)

  })

  it('should update a ticket and return id and status \'200\'', async () => {
    //Arrange
    ticket = {
      id: ticket.id,
      flight_id: 2,
      customer_id: 2
    }
    //Act
    
    const ticketUpdateResult =await fetch(`${url}/api/tickets/${ticket.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ ...ticket })
    })
    //Assert
    assert.strictEqual(ticketUpdateResult.ok, true)
    assert.deepStrictEqual((await ticketUpdateResult.json()).data, ticket)
  })

  it('should patch a ticket and return id and status \'200\'', async () => {
    //Arrange
    ticket.flight_id= 3
    //Act
    const ticketPatchResult =await fetch(`${url}/api/tickets/${ticket.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ ...ticket })
    })
    //Assert
    assert.strictEqual(ticketPatchResult.ok, true)
    assert.deepStrictEqual((await ticketPatchResult.json()).data, ticket)
  })

  it('should delete a ticket and return id and status \'200\'', async () => {
    //Arrange
    //==============
    //Act
    const ticketDeleteResult = await fetch(`${url}/api/tickets/${ticket.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    assert.strictEqual(ticketDeleteResult.ok, true)

    // assert.deepStrictEqual(result.data, data.data.id)
  })
})
