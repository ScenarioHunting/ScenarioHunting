#!/bin/bash

setup_board()
{
    echo Setting up miro dependencies
    sed -i 's|ExternalServices = createMockedDependencies|ExternalServices = createMiroDependencies|g' ./src/external-services.tsx 
}
