## Running on the mocked board

This mode is for testing the app in local environments.
Change the `ExternalServices` to use **mocked** dependencies.
```ts
const ExternalServices = createMockedDependencies();
```

## Running the app
```bash
npm run build && npm run start
```
Then navigate to `http://localhost:3001/app.html`.

## Deploying to staging
* Add and commit the changes into the feature branch.
* Switch to develop branch and merge the feature branch.
* Change the `ExternalServices` to use **miro** dependencies.
* Run `npm run stage`
* Navigate to `https://scenariohunting.github.io/sh-stage/app.html` and you should see the app working.
* Install the staging version on a preferably separate miro board and test it.
* If it works correctly, you can deploy it to production repo.

