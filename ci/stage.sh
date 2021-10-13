#!/bin/bash

SCRIPT_PATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
cd $SCRIPT_PATH/../;

if [[ `git status --porcelain` ]]; then
    echo -e ERROR: Cannot deploy because unstaged changes detected!
    git status
    exit 1
fi

GIT_REMOTE=https://github.com/ScenarioHunting/sh-stage #Staging git repo
configDeployment(){
    echo Setting external services up
    #Try:
    GIT_REMOTE=https://github.com/ScenarioHunting/sh-stage && #Staging git repo
    cp -f ./stage-dependencies/README.md dist && # Copy staging's readme to dist folder
    sed -i 's|d="M15|d="M10|g' ./src/index.ts && #=>Change the staging app's icon
    sed -i 's|= noLog|= console|g' ./src/external-services.tsx &&  #=>Enable console logging at staging
   
    sed -i 's|ExternalServices = createMockedDependencies|ExternalServices = createMiroDependencies|g' ./src/external-services.tsx && 
    echo External services are set up || 
    #Catch:
    echo ERROR: Failed to setup external services!
}

#Try:
#  echo Runnung Tests
# && npm run build
# && npm run test &&

git checkout -b stage-build && 

configDeployment && 
echo Building for Production && 
npm run build && 

git add . 
git commit -m 'chore(external-services.tsx): Setup miro dependencies' 

git add --force dist
git commit -m 'chore(dist): Build dist for production'

echo Deploying to the server with git remote: $GIT_REMOTE &&
git push $GIT_REMOTE `git subtree split --prefix dist stage-build`:master --force &&
echo Deployment completed successfully || 
#Catch:
echo Deployment failed!

#Finally:
git checkout develop
git branch -D stage-build

cd -