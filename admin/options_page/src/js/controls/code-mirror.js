/**
 * External dependencies.
 */

import React from 'react';

const {
	Component,
	createRef,
} = React;

const {
	codeEditor,
} = wp; // eslint-disable-line no-undef

/**
 * Internal dependencies.
 */
const {
	codeMirrorJS,
	codeMirrorCSS,
} = polishedContentGlobals; // eslint-disable-line no-undef

const stripDoubleLines = ( st ) => {
	return st.replace( /\n\s*\n\s*\n/g, '\n\n' );
};

class CodeMirror extends Component {
	constructor() {
		super( ...arguments );

		this.ref = createRef();
		const { mode } = this.props;

		if ( mode === 'js' ) {
			this.config = codeMirrorJS;
		} else {
			this.config = codeMirrorCSS;
		}
	}

	// react needs an on change event for the textarea
	onChange = () => {};

	onBlur = ( codemirror ) => {
		codemirror.save();

		const {
			prop,
			data,
			callback,
		} = this.props;

		const value = stripDoubleLines( this.ref.current.value );
		callback( prop, data, encodeURIComponent( value ) );
	};

	componentWillUnmount() {
		this.codeMirror.save();
		this.codeMirror.off( 'blur', this.onBlur );

		const {
			prop,
			data,
			callback,
		} = this.props;

		const value = stripDoubleLines( this.ref.current.value );
		callback( prop, data, encodeURIComponent( value ) );

		this.codeMirror.toTextArea();
		this.ref.current = null;
	}

	componentDidMount() {
		let codeMirror = codeEditor.initialize( this.ref.current, this.config );
		codeMirror = codeMirror.codemirror;

		codeMirror.on( 'blur', this.onBlur );
		this.codeMirror = codeMirror;
	}

	render() {
		return (
			<textarea
				value={ decodeURIComponent( this.props.data ) }
				onChange={ this.onChange }
				onBlur={ this.onBlur }
				ref={ this.ref }
			></textarea>
		);
	}
}

export default CodeMirror;
