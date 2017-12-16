import React from 'react';
import './Reactahead.scss';
/*
    formatedSuggestions have this form:
    { groupName: [{value: STRING, original: ANY}], groupName_2: ..., ...}

    filteredSuggestions have this form:
    { groupName: [{value: STRING, index: INT, orignal: ANY, stringsFound: []}], groupName_2: ..., ... }
*/

class Reactahead extends React.Component {
	constructor(props) {
		super(props);

		this.asynRequests = undefined;
		this.formatedSuggestions = {};

		// Init state
		this.state = {
			filteredSuggestions: {},    // The suggestions that are shown to the user
			currentValueRaw: ""         // The current input value of the user into the textfield
		};

		// Bind functions
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.clearInput = this.clearInput.bind(this);

		this.filterSuggestions = this.filterSuggestions.bind(this);
		this.selectSuggestion = this.selectSuggestion.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.boldString = this.boldString.bind(this);
	}

	componentDidMount(){
		this.props.api({
			clearInput: () => this.clearInput()
		});
	}
	componentWillUnmount(){
		this.props.api(null);
	}

	// This is the "entry point" for getting new suggestions based on the user input
	onChange(evt) {
		this.props.onChange(evt);

		let value = evt.target.value;
		this.setState({ currentValueRaw: value });

		if (value.length >= 1) {
			Object.keys(this.props.suggestions).forEach((key, index) => {
				this.formatedSuggestions[key] = this.props.suggestions[key];
				this.filterSuggestions(value, key);
			});


			// cancel all the current requests in timeout.
			clearTimeout(this.asynRequests);

			this.asynRequests = setTimeout(() => {
				Object.keys(this.props.asyncLoadingFuncs).forEach((key, index) => {
					this.props.asyncLoadingFuncs[key](value).then(res => {
						this.formatedSuggestions[key] = res;
						this.filterSuggestions(value, key);
					});
				});
			}, this.props.threshold);
		}
		else {
			this.formatedSuggestions = {};
			this.filterSuggestions("");
		}
	}

	filterSuggestions(searchString, group) {
		// ^ => start of line | $ => end of line | .* => Dot means any character, * means any amount of times
		//let regexp = new RegExp("^.*" + searchString + ".*$", 'i');
		//Note: str.indexOf() is 1.) faster and 2.) returns position which is needed
		let searchStringArray = searchString.toLowerCase().match(/\S+/g) || [];    // split on whitespace

		let filtered = [];
		let length = this.formatedSuggestions[group] !== undefined ? this.formatedSuggestions[group].length : 0;
		for (let i = 0; i < length; i++) {
			let searchIn = this.formatedSuggestions[group][i].value;
			let stringsFound = [];
			// Search each element of the search string inside the suggestions string
			for (let x = 0; x < searchStringArray.length; x++) {
				if (searchStringArray[x].length > 1) {
					var pos = searchIn.toLowerCase().indexOf(searchStringArray[x]);
					if (pos !== -1) {
						stringsFound.push({
							position: pos,
							searchString: searchStringArray[x]
						});
					}
				}
			}
			if (stringsFound.length > 0) {
				stringsFound.sort(function (a, b) {
					return a.position > b.position;
				});
				filtered.push({
					value: searchIn,
					index: i,
					original: this.formatedSuggestions[group][i].original,
					stringsFound: stringsFound
				});
			}
		}

		// true => swap | fals => keep a before b
		filtered.sort(function (a, b) {
			// Count how much letters are matched and compare that, if they are the same it depends on how much perecent got matched
			let scoreA = 0;
			let scoreB = 0;
			for (let i = 0; i < a.stringsFound.length; i++) {
				scoreA += a.stringsFound[i].searchString.length * 10;
				scoreA += a.stringsFound[i].searchString.length / a.value.length;
			}
			for (let i = 0; i < b.stringsFound.length; i++) {
				scoreB += b.stringsFound[i].searchString.length * 10;
				scoreB += b.stringsFound[i].searchString.length / b.value.length;
			}

			return scoreB > scoreA;
		});

		let filteredSuggestions = this.state.filteredSuggestions;
		filteredSuggestions[group] = filtered;

		if (Object.keys(filteredSuggestions).length === 0 && searchString.length >= 2) {
			filteredSuggestions["NO_RESULT"] = [{
				value: "No results",
				index: -1,
				stringsFound: []
			}];
		}

		this.setState({ filteredSuggestions: filteredSuggestions });
	}

	onSubmit(evt) {
		if (evt !== undefined && evt !== null)
			evt.preventDefault();

		let submitDone = false;
		// Via default send the first suggestion, otherwise send the raw value
		if (this.props.sendFirstSuggestionFlag) {
			// Get first suggestions that is found
			let first = undefined;
			let groupName;
			let keys = Object.keys(this.state.filteredSuggestions);
			for (let i = 0; i < keys.length; i++) {
				let group = this.state.filteredSuggestions[keys[i]];
				for (let x = 0; x < group.length; x++) {
					first = group[x];
					groupName = keys[i]
					break;
				}
			}

			if (first !== undefined) {
				let original = first.original;
				if (original !== undefined) {
					this.props.onSubmit(original, { isSuggestion: true, valueRaw: this.state.currentValueRaw, groupName: groupName });
					submitDone = true;
				}
			}
		}
		if(!submitDone) {
			this.props.onSubmit(null, { isSuggestion: false, valueRaw: this.state.currentValueRaw, suggestions: this.state.filteredSuggestions });
		}
	}

	selectSuggestion(mapValue, groupName) {
		let original = mapValue.original !== undefined ? mapValue.original : null;
		this.props.onSubmit(original, { isSuggestion: true, valueRaw: this.state.currentValueRaw, groupName: groupName });
	}

	handleKeyPress(evt, mapValue, groupName) {
		if (evt.key === 'Enter') {
			this.selectSuggestion(mapValue, groupName);
		}
	}

	clearInput() {
		this.setState({ currentValueRaw: "", filteredSuggestions: {} });
		this.props.onCancel();
	}

	boldString(str, results) {
		if (results === undefined || results.length === 0) {
			return { __html: str };
		}
		var returnStr = "";
		var toSplit = str;
		var offset = 0;
		for (var i = 0; i < results.length; i++) {
			var pos = results[i].position - offset;
			var length = results[i].searchString.length;
			var part1 = toSplit.slice(0, pos);
			var part2 = toSplit.slice(pos, pos + length);
			var part3 = toSplit.slice(pos + length);
			toSplit = part3;
			offset += pos + length;

			returnStr += part1 + "<b>" + part2 + "</b>";
		}
		returnStr += part3;
		return { __html: returnStr };
	}

	static defaultProps = {
		onChange: function () { },
		onSubmit: function () { },
		onCancel: function () { },
		threshold: 200,
		className: "",
		id: "",
		placeholder: "Search",
		showGroupNames: true,
		sendFirstSuggestionFlag: true,
		maxSuggestions: 20,     // max suggestions per groupname
		suggestions: {},        // must be { groupname: [{value: STRING, original: OBJECT}], ... } ('original' field is optional)
		asyncLoadingFuncs: {}    // must be { groupname: dataFunc(), ... } dataFunc must return value like for the 'suggestions' field
	}

	render() {
		let className = "reactahead " + this.props.className;

		let displaySuggestions = <div></div>;
		if (this.state.currentValueRaw.length > 0) {
			displaySuggestions = Object.keys(this.state.filteredSuggestions).map((key, index) => {
				let data = this.state.filteredSuggestions[key];
				let dataHtml = data.map((obj, i) => {
					return <div
						key={"reactahead_suggestion_" + i}
						className="reactahead-suggestion_field"
						onClick={() => this.selectSuggestion(obj, key)}
						tabIndex="0"
						onKeyPress={(evt) => this.handleKeyPress(evt, obj, key)}
					>
						<span dangerouslySetInnerHTML={this.boldString(obj.value, obj.stringsFound)} />
					</div>
				});
				if (this.props.showGroupNames && data.length > 0 && key !== "NO_RESULT") {
					return <div key={"reactahead_group_" + index} className="group_wrapper">
						<div className="reactahead-group_heading">{key}</div>
						{dataHtml}
					</div>
				}
				else {
					return dataHtml;
				}
			});
		}

		return (
			<div id={this.props.id} className={className}>
				<form onSubmit={(e) => this.onSubmit(e)}>
					<div className="reactahead-input-wrapper">

						<input
							className="reactahead-input"
							value={this.state.currentValueRaw}
							placeholder={this.props.placeholder}
							onChange={(evt) => this.onChange(evt)} >
						</input>

						<i className="reactahead-search material-icons" onClick={this.onSubmit}>search</i>
						<i className="reactahead-clear_input material-icons" onClick={this.clearInput}>close</i>

					</div>
					<div className="reactahead-suggestions-wrapper">

						{displaySuggestions}

					</div>
				</form>
			</div>
		);
	}
}

export default Reactahead