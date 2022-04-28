# Scaper

This project is a Chrome Extension similar to Selenium IDE designed to automate web scraping processes.

## Introduction

This project is a work in progress and is part of my Thesis __"Herramienta Interactiva Para Automatizar Los Procesos De Extraccion De Información Web"__.

I, unfortunately, was not able to include the part of Selenium IDE that allowed me to interact with the page alone without expending too much time trying to understand how it all worked, I discovered that for the browser extension they tried to reuse some code from the main Selenium project and they were importing that code with something called `closure-loader` which made things for me quite difficult setup.

Either way, I didn't want to get my project bloated, so I thought it might be better to implement the interactions by myself. It might be a good idea to create a library to do just that!

## Installation

You should have `NODE` and `yarn` installed.

Once you have those installed just install the dependencies doing `yarn install`.

To build the project run `yarn run build`.

To install the extension go to your Chrome Extensions tab and click __"Load unpacked"__ and select the `dist` folder that was generated on the build step.

## TODO

- [x] Improve commands UX to remove
- [x] Switch to manifest v3
- [x] Improve webpack config file
- [x] Migrate project to TypeScript
- [x] Allow to drag and drop commands
- [x] Add property on command to set the name of the data being extracted
- [x] Add reducers to change command status
- [x] Add visual clues to understand the extraction is running
- [x] Add play, pause and stop functionality
- [x] Show errors on UI
- [x] Add command autocomplete
- [x] Add preview result
- [x] Add way to run single command
- [ ] Add export feature
- [ ] Improve select element on document
- [ ] Show matches count
- [ ] Implement ability detect a selector shared in multiple elements
- [ ] Highlight elements being selected by query
- [ ] Show sample of data extracted below selector parameters
- [ ] Make commands required to run and allow a command to run isolated
- [ ] Add recipes to Redux state
- [ ] Create default test recipe
