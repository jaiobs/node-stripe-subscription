module.exports = {
  openapi: '3.0.1',
  info: {
    title: 'Stripe Subscription Service',
    description: '**API documentation for Stripe Subscription Service**',
    version: '1.0.0',
  },
  servers: [
    {
      url: process.env.PAYMENT_SERVICE,
      description: `${process.env.NODE_ENV} environment`,
    },
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Basic Authentication',
    },
    {
      name: 'Payment',
      description: 'Payment methods',
    },
    {
      name: 'Subscription',
      description: 'Subscription methods',
    },
  ],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Create user',
        description: 'Register a new user.',
        operationId: 'createUser',
        requestBody: {
          description: 'Create User',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateUser',
              },
              examples: {
                NewUser: {
                  $ref: '#/components/examples/Register',
                },
              },
            },
          },
          required: true,
        },
        responses: {
          default: {
            description: 'unexpected error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '200': {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/BadRequest',
          },
          '401': {
            $ref: '#/components/responses/Unauthorized',
          },
          '422': {
            $ref: '#/components/responses/UnprocessableEntity',
          },
        },
        'x-codegen-request-body-name': 'body',
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Log in user',
        operationId: 'loginUser',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                properties: {
                  email: {
                    type: 'string',
                    description: 'User Email',
                  },
                  password: {
                    type: 'string',
                    description: 'Password for the account',
                  },
                },
              },
              examples: {
                Admin: {
                  $ref: '#/components/examples/Admin',
                },
                User: {
                  $ref: '#/components/examples/User',
                },
              },
            },
          },
          required: true,
        },
        responses: {
          '200': {
            description: 'Successfully logged in',
            content: {
              'application/json': {
                schema: {
                  properties: {
                    token: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/BadRequest',
          },
          '401': {
            $ref: '#/components/responses/Unauthorized',
          },
          '404': {
            $ref: '#/components/responses/NotFound',
          },
          '422': {
            $ref: '#/components/responses/UnprocessableEntity',
          },
        },
      },
    },
    '/payments/create_plan': {
      post: {
        tags: ['Payment'],
        summary: 'Creating a new stripe plan',
        description: 'Create new stripe plan.',
        operationId: 'createStripePlan',
        requestBody: {
          description: 'Create Stripe plan',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['product', 'plan'],
                properties: {
                  product: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                      name: {
                        type: 'string',
                      },
                      type: {
                        type: 'string',
                      },
                    },
                  },
                  plan: {
                    type: 'object',
                    required: ['amount', 'currency', 'interval'],
                    properties: {
                      name: {
                        type: 'string',
                      },
                      amount: {
                        type: 'string',
                      },
                      currency: {
                        type: 'string',
                      },
                      interval: {
                        type: 'string',
                      },
                      usage_type: {
                        type: 'string',
                        description: 'Usage Type',
                        enum: ['licensed', 'metered'],
                      },
                    },
                  },
                },
              },
              examples: {
                createPlan: {
                  $ref: '#/components/examples/createPlan',
                },
              },
            },
          },
          required: true,
        },
        responses: {
          default: {
            description: 'unexpected error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '200': {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    stripePlan: {
                      $ref: '#/components/schemas/StripePlan',
                    },
                  },
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/BadRequest',
          },
          '401': {
            $ref: '#/components/responses/Unauthorized',
          },
          '422': {
            $ref: '#/components/responses/UnprocessableEntity',
          },
        },
        'x-codegen-request-body-name': 'body',
        security: [
          {
            Authorization: [],
          },
        ],
      },
    },
    '/payments/publish_plan': {
      post: {
        tags: ['Payment'],
        summary: 'publish a stripe plan',
        description: 'Publish a stripe plan.',
        operationId: 'publishStripePlan',
        requestBody: {
          description: 'Publish a stripe plan',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PublishStripePlan',
              },
            },
          },
          required: true,
        },
        responses: {
          default: {
            description: 'unexpected error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '200': {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: 'string',
                  },
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/BadRequest',
          },
          '401': {
            $ref: '#/components/responses/Unauthorized',
          },
          '422': {
            $ref: '#/components/responses/UnprocessableEntity',
          },
        },
        'x-codegen-request-body-name': 'body',
        security: [
          {
            Authorization: [],
          },
        ],
      },
    },
    '/payments/edit_plan': {
      post: {
        tags: ['Payment'],
        summary: 'Edit a stripe plan',
        description: 'Edit a stripe plan.',
        operationId: 'editStripePlan',
        requestBody: {
          description: 'Update Stripe plan',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['product', 'plan'],
                properties: {
                  product: {
                    type: 'object',
                    required: ['id'],
                    properties: {
                      id: {
                        type: 'integer',
                      },
                      name: {
                        type: 'string',
                      },
                    },
                  },
                  plan: {
                    type: 'object',
                    required: ['amount', 'currency', 'interval'],
                    properties: {
                      id: {
                        type: 'integer',
                      },
                      name: {
                        type: 'string',
                      },
                      amount: {
                        type: 'string',
                      },
                      currency: {
                        type: 'string',
                      },
                      interval: {
                        type: 'string',
                      },
                      usage_type: {
                        type: 'string',
                        description: 'Usage Type',
                        enum: ['licensed', 'metered'],
                      },
                    },
                  },
                },
              },
              examples: {
                updatePlan: {
                  $ref: '#/components/examples/updatePlan',
                },
              },
            },
          },
          required: true,
        },
        responses: {
          default: {
            description: 'unexpected error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '200': {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    stripePlan: {
                      $ref: '#/components/schemas/EditStripePlan',
                    },
                  },
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/BadRequest',
          },
          '401': {
            $ref: '#/components/responses/Unauthorized',
          },
          '422': {
            $ref: '#/components/responses/UnprocessableEntity',
          },
        },
        'x-codegen-request-body-name': 'body',
        security: [
          {
            Authorization: [],
          },
        ],
      },
    },
    '/payments/list_all_plans': {
      get: {
        tags: ['Payment'],
        summary: 'List all stripe plans for subscription',
        description: 'List all plans.',
        operationId: 'listStripePlans',
        responses: {
          default: {
            description: 'unexpected error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '200': {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    stripePlans: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/StripePlan',
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/BadRequest',
          },
          '401': {
            $ref: '#/components/responses/Unauthorized',
          },
          '422': {
            $ref: '#/components/responses/UnprocessableEntity',
          },
        },
        'x-codegen-request-body-name': 'body',
        security: [
          {
            Authorization: [],
          },
        ],
      },
    },
    '/payments/list_plans': {
      get: {
        tags: ['Payment'],
        summary: 'List all stripe plans for users',
        description: 'List all plans.',
        operationId: 'stripePlanLists',
        responses: {
          default: {
            description: 'unexpected error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '200': {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    stripePlans: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/StripePlan',
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/BadRequest',
          },
          '401': {
            $ref: '#/components/responses/Unauthorized',
          },
          '422': {
            $ref: '#/components/responses/UnprocessableEntity',
          },
        },
      },
    },
    '/payments/view_plan/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'plan id',
          required: true,
          schema: {
            type: 'integer',
            format: 'int64',
          },
        },
      ],
      get: {
        tags: ['Payment'],
        summary: 'View stripe plan for users',
        description: 'View a plan Detail.',
        operationId: 'viewPlan',
        responses: {
          default: {
            description: 'unexpected error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '200': {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    stripePlans: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/StripePlan',
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/BadRequest',
          },
          '401': {
            $ref: '#/components/responses/Unauthorized',
          },
          '422': {
            $ref: '#/components/responses/UnprocessableEntity',
          },
        },
      },
    },
    '/payments/subscribe/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'plan id',
          required: true,
          schema: {
            type: 'integer',
            format: 'int64',
          },
        },
      ],
      post: {
        tags: ['Subscription'],
        summary: 'Subscribe stripe plan',
        operationId: 'subscribeStripePlan',
        responses: {
          '200': {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Subscription',
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/BadRequest',
          },
          '401': {
            $ref: '#/components/responses/Unauthorized',
          },
          '404': {
            $ref: '#/components/responses/NotFound',
          },
        },
        security: [
          {
            Authorization: [],
          },
        ],
      },
      delete: {
        tags: ['Subscription'],
        summary: 'Unsubscribe stripe plan',
        operationId: 'unsubscribeStripePlan',
        responses: {
          '200': {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/message',
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/BadRequest',
          },
          '401': {
            $ref: '#/components/responses/Unauthorized',
          },
          '404': {
            $ref: '#/components/responses/NotFound',
          },
        },
        security: [
          {
            Authorization: [],
          },
        ],
      },
    },
    '/payments/view_subscription': {
      get: {
        tags: ['Subscription'],
        summary: 'View subscription',
        description: 'view_subscription',
        operationId: 'View subscription',
        responses: {
          default: {
            description: 'unexpected error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '200': {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    stripePlans: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Subscription',
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/BadRequest',
          },
          '401': {
            $ref: '#/components/responses/Unauthorized',
          },
          '422': {
            $ref: '#/components/responses/UnprocessableEntity',
          },
        },
        security: [
          {
            Authorization: [],
          },
        ],
      },
    },
    '/payments/add_card': {
      post: {
        tags: ['Payment'],
        summary: 'Add a payment method.',
        operationId: 'addCardToStripe',
        requestBody: {
          description: 'Add new card',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['card'],
                properties: {
                  card: {
                    type: 'object',
                    required: ['number', 'exp_month', 'exp_year', 'cvc'],
                    properties: {
                      number: {
                        type: 'string',
                      },
                      exp_month: {
                        type: 'string',
                      },
                      exp_year: {
                        type: 'string',
                      },
                      cvv: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
          required: true,
        },
        responses: {
          '200': {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/BadRequest',
          },
          '401': {
            $ref: '#/components/responses/Unauthorized',
          },
          '404': {
            $ref: '#/components/responses/NotFound',
          },
        },
        security: [
          {
            Authorization: [],
          },
        ],
      },
    },
    '/payments/upgrade': {
      post: {
        tags: ['Subscription'],
        summary: 'upgrade subscription',
        operationId: 'upgradeSubscription',
        requestBody: {
          description: 'upgrade subscription',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/upgrade',
              },
            },
          },
          required: true,
        },
        responses: {
          '200': {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/message',
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/BadRequest',
          },
          '401': {
            $ref: '#/components/responses/Unauthorized',
          },
          '404': {
            $ref: '#/components/responses/NotFound',
          },
        },
        security: [
          {
            Authorization: [],
          },
        ],
      },
    },
  },
  components: {
    schemas: {
      CreateStripePlan: {
        allOf: [
          {
            type: 'object',
            properties: {
              planName: {
                type: 'string',
              },
              monthlyPrice: {
                type: 'string',
              },
              annualPrice: {
                type: 'string',
              },
            },
          },
        ],
      },
      EditStripePlan: {
        allOf: [
          {
            type: 'object',
            properties: {
              id: {
                type: 'string',
              },
              planName: {
                type: 'string',
              },
              amount: {
                type: 'string',
              },
              currency: {
                type: 'string',
              },
            },
          },
        ],
      },
      upgrade: {
        allOf: [
          {
            type: 'object',
            properties: {
              revenue: {
                type: 'string',
              },
              id: {
                type: 'string',
              },
            },
          },
        ],
      },
      Subscription: {
        allOf: [
          {
            type: 'object',
            properties: {
              subscriptionId: {
                type: 'string',
              },
              userId: {
                type: 'string',
              },
              subscriptionStatus: {
                type: 'string',
              },
              StripePlanId: {
                type: 'string',
              },
              subscribedDate: {
                type: 'string',
              },
            },
          },
        ],
      },
      PublishStripePlan: {
        allOf: [
          {
            type: 'object',
            properties: {
              plan: {
                type: 'object',
                properties: {
                  id: {
                    type: 'number',
                  },
                },
              },
              isPublished: {
                type: 'boolean',
              },
            },
          },
        ],
      },
      CreateUser: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
          line1: {
            type: 'string',
          },
          postal_code: {
            type: 'string',
          },
          city: {
            type: 'string',
          },
          state: {
            type: 'string',
          },
          country: {
            type: 'string',
          },
        },
      },
      User: {
        allOf: [
          {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                format: 'int64',
              },
            },
          },
          {
            $ref: '#/components/schemas/CreateUser',
          },
        ],
      },
      Error: {
        type: 'object',
        required: ['statusCode', 'message'],
        properties: {
          statusCode: {
            type: 'integer',
            format: 'int32',
          },
          message: {
            type: 'string',
          },
        },
      },
      message: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
        },
      },
      ValidationError: {
        required: ['message'],
        properties: {
          message: {
            type: 'object',
            required: ['name', 'message', 'statusCode', 'error', 'details'],
            properties: {
              name: {
                type: 'string',
                description: 'ValidationError',
              },
              message: {
                type: 'string',
                description: 'Validation Failed',
              },
              statusCode: {
                type: 'integer',
                description: 'This will be 422 for this type of error',
              },
              error: {
                type: 'string',
                description: 'Bad Request',
              },
              details: {
                type: 'array',
                items: {
                  type: 'string',
                  description: 'Validation failed fields will return',
                },
              },
            },
          },
          stack: {
            type: 'string',
            description: 'Error stack will return',
          },
        },
      },
    },
    securitySchemes: {
      Authorization: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
    examples: {
      Register: {
        value: {
          email: 'test2@yopmail.com',
          name: 'Test 2',
          password: 'Password1!',
          line1: '510 Townsend St',
          postal_code: '98140',
          city: 'San Francisco',
          state: 'CA',
          country: 'US',
        },
      },
      Admin: {
        value: {
          email: 'superadmin@yopmail.com',
          password: 'Password1!',
        },
      },
      User: {
        value: {
          email: 'example@yopmail.com',
          password: 'Password1!',
        },
      },
      createPlan: {
        value: {
          product: {
            name: 'Gold',
            type: 'service',
          },
          plan: {
            name: 'test',
            amount: '1000',
            currency: 'usd',
            interval: 'month',
            usage_type: 'licensed',
          },
        },
      },
      updatePlan: {
        value: {
          product: {
            id: 1,
            name: 'Gold',
          },
          plan: {
            id: 1,
            name: 'test',
            amount: '1000',
            currency: 'usd',
            interval: 'month',
            usage_type: 'licensed',
          },
        },
      },
    },
    responses: {
      NotFound: {
        description: 'The specified resource was not found',
        content: {
          'application/json': {
            schema: {
              allOf: [
                {
                  $ref: '#/components/schemas/Error',
                },
                {
                  type: 'object',
                  properties: {
                    statusCode: {
                      type: 'integer',
                      example: 404,
                    },
                  },
                },
              ],
            },
          },
        },
      },
      Unauthorized: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: {
              allOf: [
                {
                  $ref: '#/components/schemas/Error',
                },
                {
                  type: 'object',
                  properties: {
                    statusCode: {
                      type: 'integer',
                      example: 401,
                    },
                  },
                },
              ],
            },
          },
        },
      },
      BadRequest: {
        description: 'BadRequest',
        content: {
          'application/json': {
            schema: {
              allOf: [
                {
                  $ref: '#/components/schemas/Error',
                },
                {
                  type: 'object',
                  properties: {
                    statusCode: {
                      type: 'integer',
                      example: 400,
                    },
                  },
                },
              ],
            },
          },
        },
      },
      UnprocessableEntity: {
        description: 'Unprocessable Entity',
        content: {
          'application/json': {
            schema: {
              allOf: [
                {
                  $ref: '#/components/schemas/Error',
                },
                {
                  type: 'object',
                  properties: {
                    statusCode: {
                      type: 'integer',
                      example: 422,
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
  },
};
