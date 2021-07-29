git checkout -b release
npm run build 
sed -i 's|ExternalServices = createMockedDependencies|ExternalServices = createMiroDependencies|g' ./src/external-services.tsx 
git add . 
git commit -m 'chore:Setup miro dependencies' 
npm run build 
npx gh-pages -d dist --repo https://github.com/ScenarioHunting/ScenarioHunting 
sed -i 's|ExternalServices = createMiroDependencies|ExternalServices = createMockedDependencies|g' ./src/external-services.tsx 
git revert HEAD~1..HEAD
git checkout develop 
git merge release 
git branch -d release