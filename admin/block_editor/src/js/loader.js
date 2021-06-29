/**
 * External dependencies.
 */
 import React from 'react';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const { Spinner } = wp.components;

class Loader extends Component {
	constructor() {
		super( ...arguments );
		this.state = { Module: null };

		this.timeout = this.timeout.bind( this );
		this.startTime = new Date().getTime();
	}

	timeout() {
		this.setState( { Module: this.module } );
	}

	async componentDidMount() {
		const { resolve } = this.props;
		const { default: Module } = await resolve();
		const { loaded } = polishedContentGlobals; // eslint-disable-line no-undef

		if ( ! loaded ) {
			polishedContentGlobals.loaded = true; // eslint-disable-line no-undef

			const totalTime = new Date().getTime() - this.startTime;
			const { bufferTime } = this.props;

			// minimum load time for graceful views
			if ( totalTime < bufferTime ) {
				this.module = Module;
				this.timer = setTimeout( this.timeout, bufferTime - totalTime );
				return;
			}
		}

		this.setState( { Module } );
	}

	componentWillUnmount() {
		clearTimeout( this.timer );
		this.module = null;
	}

	render() {
		const { namespace } = this.props;
		const { Module } = this.state;

		if ( ! Module ) {
			return (
				<div className={ `${ namespace }-loading` }>
					<Spinner />
					{ __( 'Loading Settings...', 'polished-content' ) }
				</div>
			);
		}

		const { setAttributes, attributes } = this.props;

		return (
			<Module setAttributes={ setAttributes } attributes={ attributes } />
		);
	}
}

export default Loader;
