# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Docker [Download & Install Docker](https://docs.docker.com/engine/install/).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone git@github.com:esvyridov/nodejs2023Q2-service.git
```

## Running application

```
docker-compose up
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all test with authorization

```
npm run test:auth
```

To run only one of all test suites

```
npm run test:auth -- <path to suite>
```

To test refresh token

```
npm run test:refresh
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging

### Docker Images

- [NestJS app image](https://hub.docker.com/repository/docker/eugenesv1/nodejs2023q2-service-backend/general)
