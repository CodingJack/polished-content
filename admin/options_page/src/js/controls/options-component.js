/**
 * External dependencies.
 */

import React from 'react';

/**
 * Internal dependencies.
 */

import OptionColumns from './option-columns';
import ParseHTML from './primitives/parse-html';

const OptionsComponent = ( { props, options, title } ) => {
	const {
		namespace,
		defaultSettings,
		updateDefaults,
	} = props;

	// an "option" here can represent a group of combined options or a single option
	return options.map( ( option, index ) => {
		const {
			type,
			prop,
			label,
			description,
		} = option;

		let { [ prop ]: data } = defaultSettings;
		if ( Array.isArray( data ) ) {
			data = data.slice();
		}

		const toggleLabel = type === 'toggle' && ! option.list ? `${ namespace }-toggle-label` : null;
		const underbutton = description && type === 'checkbox' ? ` ${ namespace }-under-toggle` : '';
		const toggleWrap = toggleLabel ? ` ${ namespace }-toggle-${ prop }` : '';

		return (
			<div key={ `${ prop }-${ index }` } className={ `${ namespace }-container${ toggleWrap }` }>
				{ label && (
					<label htmlFor={ prop } className={ toggleLabel }>{ label }</label>
				) }
				<OptionColumns
					props={ props }
					option={ option }
					data={ data }
					callback={ updateDefaults }
					title={ title }
					description={ description }
				/>
				{ description && (
					<p className={ `${ namespace }-description${ underbutton }` }>
						<ParseHTML namespace={ namespace } text={ description } />
					</p>
				) }
			</div>
		);
	} );
};

export default OptionsComponent;

