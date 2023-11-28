# Miro extension for Scenario Hunting
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

### An implementation of [Scenario Hunting](https://www.scenariohunting.com) framework as an extension to Miro whiteboard.

Scenario Hunting is a set of steps to implement high-quality automated tests based on visual modeling artifacts (such as Event Storming and Event Modeling sticky notes). 
Following the steps keeps implementation on track and protects the design from distortion while coding.

By [installing](https://miro.com/oauth/authorize/?response_type=code&client_id=3074457356753256770&redirect_uri=%2Fconfirm-app-install%2F) this extension to your Miro board, you can hunt for test scenarios from visual models on your Miro boards.


![Hunting for scenarios from event storming artifacts](header-image.png)

## Features
* **Template Studio:** The builtin code editor for repl driving test templates
* **Scenario Builder:** Helps scenario hunters build abstract visual scenarios by clicking on widgets on the whiteboard.
* **Scenario Compiler:** The backend component that translates the abstract scenario to concrete test code based on the template of choice.



##  How it works

The following 5 Minute demo explains hunting scenarios from Event Storming artifacts.

[![Scenario Hunting quick demo](https://img.youtube.com/vi/Ou_TkeMsfXs/0.jpg)](https://www.youtube.com/embed/Ou_TkeMsfXs)


## How to install
Simply click [here](https://miro.com/oauth/authorize/?response_type=code&client_id=3074457356753256770&redirect_uri=%2Fconfirm-app-install%2F) to install the [Miro](https://miro.com) addon. 

## Steps:
* Visually extract a test scenario from models
* Save the scenario as test code
* Pass the test
* Refactor
* Update the model
* Repeate

## Documentation
[See](https://docs.scenariohunting.com) the documentation.

## License

Licensed under the [apache](LICENSE) license version 2.0. 
