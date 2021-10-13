#!/bin/bash

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
cd $SCRIPTPATH/../;

git checkout -b deployment
npm run build 
sed -i 's|ExternalServices = createMockedDependencies|ExternalServices = createMiroDependencies|g' ./src/external-services.tsx 
git add . 
git commit -m 'chore:Setup miro dependencies' 
npm run build 
npx gh-pages -d dist --repo https://github.com/ScenarioHunting/ScenarioHunting 
sed -i 's|ExternalServices = createMiroDependencies|ExternalServices = createMockedDependencies|g' ./src/external-services.tsx 
git add . 
git commit -m 'chore: setup development dependencies' 
git checkout deployment
git merge deployment
git branch -d deployment

cd -