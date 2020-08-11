import * as React from 'react';
import { globalBoard, globalStepNavigator, Givens } from './Given';
import * as ReactDOM from 'react-dom';
import { WhenStep } from './When';
import { ThenStep } from './Then';
class Root extends React.Component {
	constructor(props) {
		super(props);
		this.updateWhen = this.updateWhen.bind(this);
		this.updateThen = this.updateThen.bind(this);
	}
	async componentDidMount() {
		await globalBoard.unselectAll();
		globalStepNavigator.start();
	}

	state = {
		boardTitle: '',
		given: {},
		when: {
			widget: null,
			step: '?'
		},
	};


	async getBoardTitle() {
		let boardInfo = await miro.board.info.get();
		this.setState({ boardTitle: boardInfo.title });
	}
	test = {
		givenCollection: [],
		when: {
			title: null,
			example: null
		},
		then: {
			title: null,
			example: null
		},
	};

	onGivenCollectionChanged(collection) {
		this.test.givenCollection = collection;
	}
	updateWhen(when) {
		this.test.when.title = when.title;
		console.log('when changed: new title:' + when.title + '\n'
			+ 'new example:' + when.example);
	}
	updateThen(when) {
		this.test.when.title = when.title;
		console.log(when.title);
	}
	updateGiven(when) {
		this.test.when.title = when.title;
		console.log(when.title);
	}
	render() {
		// className="container"
		return (
			<div>

				<Givens onChange={this.onGivenCollectionChanged}
						/>


				<WhenStep onChange={this.updateWhen}
					// canEdit={s => this.test?.when?.title != null} 
					/>

				<ThenStep onChange={this.updateThen}
					// canEdit={s => this.test?.then?.title != null
					// 	&& this.test?.when?.example != null} 
						/>
			</div>
		);
	}
}
ReactDOM.render(
	<Root />,
	document.getElementById('react-app')
)