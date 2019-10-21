/**
 * External dependencies.
 */

import React from 'react';

const {
	useState,
} = React;

const InputRange = ( {

	namespace,
	type,
	prop,
	data,
	value,
	name,
	icons,
	title,
	ranges,
	callback,
	index,

} ) => {
	const [
		def,
		setDefault,
	] = useState( value );

	const {
		min,
		max,
	} = ranges;

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

		if ( isNaN( val ) || val < min || val > max ) {
			callback( prop, data, def, type, index );
		}
	};

	return (
		<div className={ `${ namespace }-input ${ namespace }-input-flex` }>
			<input
				type={ type }
				value={ value }
				onChange={ onChange }
				min={ min }
				max={ max }
				className="components-range-control__slider"
			/>
			<input
				type="number"
				onFocus={ onFocus }
				onBlur={ onBlur }
				value={ value }
				onChange={ onChange }
				className="components-range-control__number"
			/>
			{ icons && (
				<span className={ `dashicons dashicons-${ name }` }></span>
			) }
			<span>{ title }</span>
		</div>
	);
};

const InputRanges = ( { namespace, list, items, prop, data, type, icons, ranges, callback } ) => {
	return Object.keys( items ).map( ( key, index ) => {
		const value = data[ index ] || data;
		const name = items[ key ];

		return (
			<InputRange
				key={ `${ name }-${ index }` }
				namespace={ namespace }
				type={ type }
				prop={ prop }
				data={ data }
				value={ value }
				name={ name }
				icons={ icons }
				callback={ callback }
				title={ list[ name ] }
				index={ index }
				ranges={ ranges }
			/>
		);
	} );
};

export default InputRanges;
