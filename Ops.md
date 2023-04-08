## Running on the mocked board

This mode is for testing the app in local environments.
Change the `ExternalServices` to use mocked dependencies.
```ts
const ExternalServices = createMockedDependencies();
```

## Running the app
```bash
npm run build && npm run start
```
Then navigate to `http://localhost:3001/app.html`.

## Deploying to staging

