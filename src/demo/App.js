import React from 'react';
import './App.scss';
import Reactahead from '../lib/components/Reactahead';

class App extends React.Component {

	constructor(props) {
		super(props);

		this.onSubmit = this.onSubmit.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onChange = this.onChange.bind(this);

		this.loadCountries = this.loadCountries.bind(this);
		this.loadContinents = this.loadContinents.bind(this);

		this.state = {
			cbInfo: null,
			cbObj: null,
			cbType: null
		}

		this.simpleSuggestions = [
			"Test",
			"Test2",
			"Test3",
			"Test4"
		]

		this.testSuggestions = [
			{ value: "A Test Value Berlin Germa", original: { title: "A Test Value" } },
			{ value: "another_test_value Rome", original: { title: "another_test_value" } },
			{ value: "random title Regen", original: { title: "random title" } },
			{ value: "as", original: { title: "as" } },
			{ value: "asdf", original: { title: "asdf" } },
		];
		this.citySuggestions = [
			{ value: "Berlin (Germany)", original: { name: "Berlin", population: 3470000 } },
			{ value: "New York (USA)", original: { name: "New York", population: 8538000 } },
			{ value: "Rome (Italy)", original: { name: "Rom", population: 2868000 } },
			{ value: "London (England)", original: { name: "London", population: 142292 } },
			{ value: "Madird (Spain)", original: { name: "Madird", population: 3165235 } },
			{ value: "Paris (France)", original: { name: "Paris", population: 2241346 } },
			{ value: "Hamburg (Germany)", original: { name: "Hamburg", population: 1748916 } },
			{ value: "Munich (Germany)", original: { name: "Munich", population: 1521678 } }
		];

		// Data to mock an api request
		this.countries = [
			{ name: { en: "Germany" }, population: 123 },
			{ name: { en: "Italy" }, population: 123 },
			{ name: { en: "USA" }, population: 123 },
			{ name: { en: "Spain" }, population: 123 },
			{ name: { en: "France" }, population: 123 },
			{ name: { en: "Norway" }, population: 123 },
			{ name: { en: "England" }, population: 123 },
			{ name: { en: "Russia" }, population: 123 },
			{ name: { en: "Sweden" }, population: 123 },
			{ name: { en: "Poland" }, population: 123 },
		];
		this.continents = [
			{ name: "Asia", population: '4,46 bil' },
			{ name: "America", population: '323,1 mio' },
			{ name: "Africa", population: '1,216 bil' },
			{ name: "Europe", population: '743,1 mio' }
		];
	}

	onSubmit(obj, info = {}) {
		// called when user is submiting the from, either by pressing Enter, clicking on a suggestion or click the search btn
		console.log("Submit Callback with value");
		console.log(obj);
		console.log(info);
		this.setState({
			cbInfo: JSON.stringify(info),
			cbType: "onSubmit",
			cbObj: JSON.stringify(obj)
		});
		this.reactahead.clearInput();
	}

	onCancel() {
		// called when user is pressing the 'X' button
		console.log("Cancel Callback");
	}

	onChange(evt) {
		// access change evt from the input box
	}

	loadCountries(searchValue) {
		// 'searchValue' is the string the user is currently searching for

		// mock a http request
		return new Promise((resolve) => {
			setTimeout(() => {
				let formatedData = [];
				for (let i = 0; i < this.countries.length; i++) {
					formatedData.push({
						value: this.countries[i].name.en,
						original: this.countries[i]
					});
				}
				resolve(formatedData);
			}, 200);
		});
	}

	loadContinents(searchValue) {
		// 'searchValue' is the string the user is currently searching for

		// mock a http request
		return new Promise((resolve) => {
			setTimeout(() => {
				let formatedData = [];
				for (let i = 0; i < this.continents.length; i++) {
					formatedData.push({
						value: this.continents[i].name + " (Populiation: " + this.continents[i].population + ")",
						original: this.continents[i]
					});
				}
				resolve(formatedData);
			}, 200);
		});
	}

	render() {
		return (
			<div id="wrapper">
				<h2>Reactahead Demo</h2>

				<div className="info_box">
					Search for Citys (Berlin, Rome, New York, ...), Contries (USA, Germany, ...) or Continents.
					Open the Console to check out the submit callback values
					<br></br><br></br>
					Visit the Github Page here: <a href="https://github.com/j-o-d-o/reactahead">Github</a><br></br>
					Visit the NPM Page here: <a href="https://www.npmjs.com/package/reactahead">NPM</a><br></br>
				</div>

				<Reactahead
					api={api => this.reactahead = api}
					onSubmit={this.onSubmit}
					onCancel={this.onCancel}
					onChange={this.onChange}
					showGroupNames={true}
					suggestions={{
						"Suggestions Group 1": this.testSuggestions,
						"Citys": this.citySuggestions
					}}
					asyncLoadingFuncs={{
						"Countries (async)": this.loadCountries,
						"Continents (async)": this.loadContinents
					}}
				></Reactahead>

				{this.state.cbType !== null &&
					<div className="cb_wrapper">
						<h4>Callback</h4>
						<div className="section"><span><b>Type: </b></span>{this.state.cbType}</div>
						<div className="section">
							<div><b>Info: </b></div> {this.state.cbInfo}
						</div>
						<div className="section">
							<div><b>Object: </b></div> {this.state.cbObj}
						</div>
					</div>
				}
				
				{/*
				<Reactahead
					asyncLoadingFuncs={this.loadContinents}
				></Reactahead>

				<Reactahead
					suggestions={this.simpleSuggestions}
				></Reactahead>
				*/}

			</div>
		);
	}
}

export default App