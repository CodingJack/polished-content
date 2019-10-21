/* eslint jsx-a11y/no-onchange: 0 */

/**
 * WordPress dependencies.
 */
const {
	useState,
} = wp.element;

/**
 * Internal dependencies.
 */

import {
	selectOptions,
} from '../../../../../shared/js/data';

import MySelectControl from './my-select-control';
import MyTextControl from './my-text-control';
import MyRangeControl from './my-range-control';

const components = {
	text: MyTextControl,
	range: MyRangeControl,
};

/*
	This component allows the user to choose "Custom Value" in a select
	dropdown and then enter a custom value from an additional field
	All controlled by a single prop/value
*/
const MySelectWrapper = ( {

	prop,
	label,
	customLabel,
	value,
	callback,
	custom,
	help,
	min = 100,
	max = 9999,
	step = 1,
	defValue = '1000',
	component = 'text',
	type = 'number',

} ) => {
	const Component = components[ component ];
	const allValues = selectOptions[ prop ].map( ( itm ) => itm.value );
	const isSelection = allValues.indexOf( value ) !== -1 && value !== custom;
	const selectValue = isSelection ? value : custom;
	const textValue = ! isSelection ? value : defValue;

	const [
		customValue,
		setCustomValue,
	] = useState( textValue );

	const [
		customVisible,
		setCustomVisible,
	] = useState( ! isSelection );

	const onChange = ( entry ) => {
		let val = entry.toString();
		if ( val === custom ) {
			if ( ! customVisible ) {
				val = customValue;
				setCustomValue( val );
				setCustomVisible( true );
			}
		} else if ( allValues.indexOf( val ) !== -1 ) {
			setCustomVisible( false );
		} else {
			setCustomValue( val );
		}

		callback( val, prop );
	};

	return (
		<>
			<MySelectControl
				prop={ prop }
				label={ label }
				value={ selectValue }
				callback={ onChange }
				help={ ! customVisible ? help : null }
			/>
			{ customVisible && (
				<Component
					type={ type }
					prop={ prop }
					label={ customLabel }
					value={ customValue }
					defValue={ textValue }
					callback={ onChange }
					min={ min }
					max={ max }
					step={ step }
				/>
			) }
		</>
	);
};

export default MySelectWrapper;
