/**
 * External dependencies.
 */
import React from 'react';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;

class ErrorBoundary extends Component {
	constructor() {
		super( ...arguments );
		this.state = { hasError: false };
	}

	static getDerivedStateFromError( error ) {
		return { hasError: error };
	}

	render() {
		const { hasError } = this.state;
		if ( hasError ) {
			return (
				<p>
					{ __(
						'Something went wrong.  Please ',
						'polished-content'
					) }
					<br />
					<a href="https://github.com/CodingJack/polished-content/issues/new">
						{ __( 'report', 'polished-content' ) }
					</a>
					{ __( ' the error below.', 'polished-content' ) }
					<br />
					<br />
					<p style={ { fontStyle: 'italic' } }>
						{ hasError.toString() }
					</p>
				</p>
			);
		}

		const { children } = this.props;
		return children;
	}
}

export default ErrorBoundary;
