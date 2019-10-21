/**
 * WordPress dependencies.
 */

const {
	BaseControl,
	Button,
	Dashicon,
} = wp.components;

const {
	useState,
} = wp.element;

const {
	compose,
	withInstanceId,
} = wp.compose;

import classnames from 'classnames';

/*
* Modified from:
* https://github.com/WordPress/gutenberg/blob/master/packages/components/src/range-control/index.js
*/
const InputRange = ( {

	className,
	label,
	value,
	onChange,
	onReset,
	max,
	min,
	step,
	beforeIcon,
	afterIcon,
	allowReset,
	disabled,
	help,
	instanceId,

} ) => {
	const [
		defaultValue,
		setDefault,
	] = useState( value );

	const id = `inspector-range-control-${ instanceId }`;

	const resetValue = () => {
		onReset();
	};

	const onFocus = ( e ) => {
		setDefault( e.target.value );
	};

	const onBlur = ( e ) => {
		const val = parseInt( e.target.value, 10 );

		if ( isNaN( val ) || val < min || val > max ) {
			onChange( defaultValue );
		}
	};

	const onChangeValue = ( e ) => {
		if ( ! e.target.checkValidity() ) {
			return;
		}

		let val = e.target.value;
		val = parseInt( val, 10 );

		if ( isNaN( val ) ) {
			val = '';
		}

		onChange( val );
	};

	return (
		<BaseControl
			label={ label }
			id={ id }
			help={ help }
			className={ classnames( 'components-range-control', className ) }
		>
			{ beforeIcon && <Dashicon icon={ beforeIcon } /> }
			<input
				className="components-range-control__slider"
				type="range"
				value={ value }
				onChange={ onChangeValue }
				aria-describedby={ help ? id + '__help' : undefined }
				min={ min }
				max={ max }
				step={ step }
			/>
			{ afterIcon && allowReset &&
				<Button
					isSmall
					className="polished-content-iconbtn"
					disabled={ disabled }
					onClick={ resetValue }
				>
					<Dashicon icon={ afterIcon } />
				</Button>
			}
			<input
				className="components-range-control__number"
				type="number"
				aria-label={ label }
				onChange={ onChangeValue }
				onFocus={ onFocus }
				onBlur={ onBlur }
				value={ value }
			/>
		</BaseControl>
	);
};

const MyInputRange = compose( [
	withInstanceId,
] )( InputRange );

export default MyInputRange;

