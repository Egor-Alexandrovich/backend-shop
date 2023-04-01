# Serverless - AWS Node.js Typescript

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS

## Test your service

- Run `npm run test` to run test

### Locally with serverless-offline

- `sls offline start`

### Locally

In order to test the hello function locally, run the following command:

- `npx sls invoke local -f getProductsById`  if you're using NPM
- `yarn sls invoke local -f getProductsById ` if you're using Yarn

Check the [sls invoke local command documentation](https://www.serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/) for more information.


## Template features

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:
- `const` - containing shared constants
- `event` - containing mock API Gateway proxy event
- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas
- `tests` - containing unit test

```
.
├── src
│   ├── functions               # Lambda configuration and source code folder
│   │   ├── getProductsById
│   │   │   ├── handler.ts      # `getProductsById` lambda source code
│   │   │   └── index.ts        # `getProductsById` lambda Serverless configuration
|   |   ├── getProductsList
│   │   │   ├── handler.ts      # `getProductsList` lambda source code
│   │   │   └── index.ts        # `getProductsList` lambda Serverless configuration
│   │   │
│   │   └── index.ts            # Import/export of all lambda configurations
│   │
│   └── libs                    # Lambda shared code
│       └── handlerResolver.ts  # Sharable library for resolving lambda handlers
│
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── tsconfig.paths.json         # Typescript paths
└── webpack.config.js           # Webpack configuration
```

### 3rd party libraries

- [@serverless/typescript](https://github.com/serverless/typescript) - provides up-to-date TypeScript definitions for your `serverless.ts` service file

### Advanced usage

Any tsconfig.json can be used, but if you do, set the environment variable `TS_NODE_CONFIG` for building the application, eg `TS_NODE_CONFIG=./tsconfig.app.json npx serverless webpack`


endpoints:
  GET - https://0dey54hzz5.execute-api.us-east-1.amazonaws.com/products
  GET - https://0dey54hzz5.execute-api.us-east-1.amazonaws.com/products/{productId}
  GET - https://0dey54hzz5.execute-api.us-east-1.amazonaws.com/swagger
  GET - https://0dey54hzz5.execute-api.us-east-1.amazonaws.com/swagger.json
functions:
  getProductsList: product-service-dev-getProductsList (1.9 kB)
  getProductsById: product-service-dev-getProductsById (2.4 kB)
  swaggerUI: product-service-dev-swagger-ui (2.6 kB)
  swaggerJSON: product-service-dev-swagger-json (2.4 kB)