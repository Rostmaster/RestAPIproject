const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Flight API",
      version: "1.0.0",
      description: "API for Flight App",
    },
    servers: [
      {
        url: "/",
        description: "Dev server",
      },
    ],
    components: {
      schemas: {
        Airline: {
          type: "object",
          required: ["name", "country_id", "user_id"],
          properties: {
            name: {
              type: "string",
              describen: "Name of the airline",
            },
            country_id: {
              type: "integer",
              description: "Id of the country",
            },
            user_id: {
              type: "integer",
              description: "Id of the user",
            },
          },
        }
      },
      responses: {
        400: {
          description: "Bad Request",
          contents: 'application/json'
        },
        401: {
          description: "Unauthorized",
          contents: 'application/json'
        },
        404: {
          description: "Not Found",
          contents: 'application/json'
        }

      },
    },
  },
  apis: ["./routers/*.js"],
}

module.exports = options;