/**
 * External dependencies.
 */

import React from 'react';

const ToggleButton = ( {
	namespace,
	prop,
	data,
	value,
	callback,
	name,
	title,
	icons,
	index,
} ) => {
	const checked = value ? 'checked' : null;
	const isChecked = checked ? ' is-checked' : '';

	const onChange = () => {
		callback( prop, data, ! checked, 'toggle', index );
	};

	return (
		<>
			<span
				className={ `${ namespace }-input components-form-toggle${ isChecked }` }
			>
				<input
					className="components-form-toggle__input"
					onChange={ onChange }
					type="checkbox"
					checked
				/>
				<span className="components-form-toggle__track"></span>
				<span className="components-form-toggle__thumb"></span>
				{ ! checked && (
					<svg
						className="components-form-toggle__off"
						width="6"
						height="6"
						aria-hidden="true"
						role="img"
						focusable="false"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 6 6"
					>
						<path d="M3 1.5c.8 0 1.5.7 1.5 1.5S3.8 4.5 3 4.5 1.5 3.8 1.5 3 2.2 1.5 3 1.5M3 0C1.3 0 0 1.3 0 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"></path>
					</svg>
				) }
				{ checked && (
					<svg
						className="components-form-toggle__on"
						width="2"
						height="6"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 2 6"
						role="img"
						aria-hidden="true"
						focusable="false"
					>
						<path d="M0 0h2v6H0z"></path>
					</svg>
				) }
			</span>
			{ icons && (
				<span className={ `dashicons dashicons-${ name }` }></span>
			) }
			{ title && <span>{ title }</span> }
		</>
	);
};

const ToggleButtonColumn = ( {
	namespace,
	list,
	items,
	idx,
	prop,
	data,
	icons,
	callback,
} ) => {
	return Object.keys( items ).map( ( key ) => {
		const name = items[ key ];
		const index = idx.i;
		idx.i++;

		return (
			<div
				key={ `${ name }-${ index }` }
				className={ `${ namespace }-input ${ namespace }-input-flex ${ namespace }-input-toggle` }
			>
				<ToggleButton
					namespace={ namespace }
					prop={ prop }
					data={ data }
					value={ data[ index ] }
					callback={ callback }
					icons={ icons }
					index={ index }
					name={ name }
					title={ list[ name ] }
				/>
			</div>
		);
	} );
};

const ToggleButtons = ( {
	namespace,
	list,
	items,
	prop,
	data,
	icons,
	subColumns,
	callback,
} ) => {
	if ( items.length ) {
		const maxColumns = subColumns;
		const len = items.length;
		const numColumns = Math.max( len / maxColumns, 1 );

		const columns = [];
		for ( let i = 0; i < numColumns; i++ ) {
			columns[ i ] = i;
		}

		const idx = { i: 0 };
		return columns.map( ( i ) => {
			const subitems = Object.keys( list ).filter( ( item, index ) => {
				const count = maxColumns * i;
				return index >= count && index < count + maxColumns;
			} );

			return (
				<div
					key={ items[ i ] }
					className={ `${ namespace }-subcolumn` }
				>
					<ToggleButtonColumn
						items={ subitems }
						namespace={ namespace }
						prop={ prop }
						data={ data }
						callback={ callback }
						icons={ icons }
						list={ list }
						idx={ idx }
					/>
				</div>
			);
		} );
	}
	return (
		<ToggleButton
			namespace={ namespace }
			prop={ prop }
			data={ data }
			value={ data }
			callback={ callback }
		/>
	);
};

export default ToggleButtons;
