import swaggerJsdoc from "swagger-jsdoc";
//swager config
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
        name: "Authentication",
        description: "Authentication related endpoints",
      },
      {
        name: "Users",
        description: "User management endpoints",
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
      schemas: {
        User: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              description: "User's full name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            password: {
              type: "string",
              format: "password",
              description: "User's password",
            },
            role: {
              type: "string",
              enum: ["user", "admin", "owner"],
              default: "user",
              description: "User's role",
            },
            phoneNumber: {
              type: "string",
              description: "User's phone number",
            },
          },
        },
        LoginCredentials: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
            },
            password: {
              type: "string",
              format: "password",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
            },
            message: {
              type: "string",
            },
            token: {
              type: "string",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
            },
            message: {
              type: "string",
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Path to the API routes
};

export const specs = swaggerJsdoc(options);
