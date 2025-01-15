import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "e-badal API Documentation",
      version: "1.0.0",
      description: "API documentation for e-badal exchange ",
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "Users",
        description: "User management endpoints",
      },
      {
        name: "Admin Management",
        description: "Admin creation and management endpoints",
      },
      {
        name: "Transactions",
        description: "Transaction management endpoints",
      },
      {
        name: "Fees",
        description: "Fee management endpoints",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // Path to the API routes
};

export const specs = swaggerJsdoc(options);
