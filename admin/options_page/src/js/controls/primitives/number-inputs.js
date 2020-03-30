/**
 * External dependencies.
 */

import React from 'react';

const { useState } = React;

const NumberInput = ( {
	namespace,
	type,
	prop,
	data,
	value,
	name,
	icons,
	list,
	callback,
	index,
} ) => {
	const [ def, setDefault ] = useState( value );

	const onChange = ( e ) => {
		let val = e.target.value;
		val = parseInt( val, 10 );

		if ( isNaN( val ) ) {
			val = '';
		}
		callback( prop, data, val, type, index );
	};

	const onFocus = ( e ) => {
		setDefault( parseInt( e.target.value, 10 ) );
	};

	const onBlur = ( e ) => {
		const val = parseInt( e.target.value, 10 );

		if ( isNaN( val ) || val < 100 || val > 9999 ) {
			callback( prop, data, def, type, index );
		}
	};

	return (
		<div className={ `${ namespace }-input ${ namespace }-input-flex` }>
			<input
				type={ type }
				value={ value }
				onChange={ onChange }
				onFocus={ onFocus }
				onBlur={ onBlur }
			/>
			{ icons && (
				<span className={ `dashicons dashicons-${ name }` }></span>
			) }
			{ list[ name ] }
		</div>
	);
};

const NumberInputs = ( {
	namespace,
	list,
	items,
	prop,
	data,
	type,
	icons,
	callback,
} ) => {
	return Object.keys( items ).map( ( key, index ) => {
		const value = data[ index ];
		const name = items[ key ];

		return (
			<NumberInput
				key={ `${ name }-${ index }` }
				namespace={ namespace }
				type={ type }
				prop={ prop }
				data={ data }
				value={ value }
				name={ name }
				icons={ icons }
				callback={ callback }
				list={ list }
				index={ index }
			/>
		);
	} );
};

export default NumberInputs;
