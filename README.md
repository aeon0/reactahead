# Reactahead

[![Build Status](https://travis-ci.org/UdiliaInc/create-react-library.svg?branch=master)](https://travis-ci.org/UdiliaInc/create-react-library)
[![Dependencies](https://img.shields.io/david/udiliaInc/create-react-library.svg)]()
[![Dev Dependencies](https://img.shields.io/david/dev/udiliaInc/create-react-library.svg)]()

A lightweight yet powerful typeahead component for react.js. Key features include: 
- no npm dependencies
- tab through suggestions and submit with enter
- highlighting matching word for the suggestions
- async loading of data with a variable threshold  
- support for multiple groups
- easy to use and still flexible

Check out a Demo here: http://185.82.21.82:3350/

## Install
Install with npm: `npm install reactahead`</br></br>
If you want to use the code as base for your own typeahead component, feel free to take copy the code from /src/lib/component/Reactahead.js & Reactahead.scss into your own react app. Happy coding :)

## Dependencies
There are no module dependencies. But for the search and cancel icon, the google material icons (https://material.io/icons/) must be included like this to the index.html:
```html
<html>
  <head>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  ...
```

## Examples

The data for the suggestions and the async data must be provided in this format:</br>
`data = [{ value: STRING, original: ANY }, ...]`</br>
The 'value' string will be tested with the string the user is searching for. On submit both values will be provided.

### Basic
```javascript
<Reactahead
    onSubmit={this.onSubmit}
    suggestions={{
        "Citys": [
            { value: "Berlin (Germany)", original: { name: "Berlin", population: 3470000 } },
            { value: "New York (USA)", original: { name: "New York", population: 8538000 } },
            { value: "Rome (Italy)", original: { name: "Rom", population: 2868000 } },
            { value: "Regensburg (Germany)", original: { name: "Regensburg", population: 142292 } }
        ]
    }}
></Reactahead>
```

### Async
Often the data is fetched from an API in a totally different structure. The developer must bring the data in the desired structure. Here is an example:


```javascript
class App extends React.Component {

    onSubmit(originalObj, info){
    }

    asyncRequest(searchValue) {
        // 'searchValue' contains the user input in the search box
        return API.getSuggestions(searchValue).then((res) => {
            // e.g. res has this format: [{ name: { en: STRING }, population: NUMBER }, ...]
            // returnValue must have this structure: [{value: STRING, original: ANY}, ...]
            let returnValue = [];
            for (var i = 0; i < res.length; i++) {
                returnValue.push({
                    value: res[i].name.en + " (" + res[i].population ")",
                    original: res.json[i]
                });
            }
            return returnValue;
        });
    }

	  render() {
		    return (
            <Reactahead
                onSubmit={this.onSubmit}
                asyncLoadingFuncs={{
                    "Group Async": this.asyncRequest
                }}
            ></Reactahead>
		    );
	}
}

export default App
```

## Properties
There are different properties that can be passed to the component:

#### onChange
Callback for change events. Returns the key event of the input. 
```javascript
myChangeCb(evt){
    // evt has the key evt of the input field
}
render() {
    return (
         <Reactahead onChange={this.myChangeCb} ...></Reactahead>
    );
}
```
#### onSubmit
Callback for submit events. Submit events are fired if the user submits the input form. This can happen by pressing the Enter button while focusing the input field, pressing Enter while focusing one of the suggestions, clicking on one of the suggestions or clicking on the search button. The values that are passed to the callback are the original object and an info object. The info object contains these values: 
```javascript
{ 
    isSuggestion: BOOLEAN,  // True when user clicked on suggestion or focused suggestion while pressing enter
    valueRaw: STRING,       // The search value the user has typed into the search field
    groupName: STRING,      // Group which the suggestion is part of (undefined if it is not a suggestion)
    suggestions: []         // contains all suggestions for the current searchValue
}
```
```javascript
mySubmitCb(original, info){
}
render() {
    return (
         <Reactahead onSubmit={this.mySubmitCb} ...></Reactahead>
    );
}
```
#### onCancel
Callback for the cancel event which occurs if the user presses the cancel/close button 'X'. 
```javascript
myCancelCb(){
  // e.g. clear input like this: this.refs.reactahead.clearInput();
}
render() {
    return (
         <Reactahead ref="reactahead" onCancel={this.myCancelCb} ...></Reactahead>
    );
}
```
#### threshold
How long should the asyncRequest wait until it loads new data (in ms). That way the server is not being spamed after each keystroke. Default = 200
#### className
Adds additional class name(s) to the default one which is "reactahead"
#### id
Adds an id to the component
#### placeholder
Determines the placeholder for the input field. Default = "Search"
#### showGroups
Determines weather the suggestions groups should be shown or not. If there are no results for the group it is not shown regardless. Default = true
#### sendFirstSuggestionFlag
If it is set to true and the user is presses the search button or enter while focusing the search field, the first suggestion will be sent via the submit callback. On false the 1. argument of onSubmit will be null and all the suggestions will be in info["suggestions"]. Default = true
#### maxSuggestions
Max amount of suggestions shown per group. Default = 20
#### suggestions
Data for suggestions. Format is `suggestions: { groupname: [{value: STRING, original: ANY}, ...], ...}`
#### asyncLoadingFuncs
The functions to load data e.g. from an API. 'asyncLoadingFuncs: { groupname: myFunc, ... }'

</br></br>
This npm module is built with "Create-React-Library" (https://github.com/UdiliaInc/create-react-library)


