/**
 * WordPress dependencies.
 */
const { Button, Icon } = wp.components;

const { useState } = wp.element;

/**
 * Internal dependencies.
 */
import { namespace, defaultValues } from '../../../../../shared/js/data';

const MyTextControl = ( {
	prop,
	label,
	value,
	help,
	validity,
	callback,
	defValue,
	min = 0,
	max = 100,
	type = 'number',
} ) => {
	const [ defaultValue, setDefault ] = useState( value );

	const disabled = value === defaultValues[ prop ];

	const undoEvent = () => {
		const def = defValue === undefined ? defaultValues[ prop ] : defValue;
		callback( def, prop );
	};

	const onFocus = ( e ) => {
		setDefault( e.target.value );
	};

	const onBlur = ( e ) => {
		const curVal = e.target.value;
		if ( type === 'number' ) {
			const val = parseInt( curVal, 10 );

			if ( isNaN( val ) || val < min || val > max ) {
				callback( defaultValue, prop );
			}
		} else if (
			validity === 'class' &&
			curVal !== '' &&
			! /^[a-z _-][a-z \d_-]*$/i.test( curVal )
		) {
			callback( defaultValue, prop );
		}
	};

	const onChange = ( e ) => {
		let val = e.target.value;

		if ( type === 'number' ) {
			val = parseInt( val, 10 );
			if ( isNaN( val ) ) {
				val = '';
			}
		}
		callback( val, prop );
	};
	return (
		<>
			<div
				className={ `${ namespace }-wrapper ${ namespace }-text-input` }
			>
				<div className="components-base-control">
					<div className="components-base-control__field">
						<label
							className="components-base-control__label"
							htmlFor={ `inspector-select-control-${ prop }` }
						>
							{ label }
						</label>
						<input
							name={ prop }
							className="components-text-control__input"
							type={ type }
							aria-label={ label }
							onChange={ onChange }
							onFocus={ onFocus }
							onBlur={ onBlur }
							value={ value }
						/>
					</div>
					{ help && (
						<p className="components-base-control__help">
							{ help }
						</p>
					) }
				</div>
				{ type === 'number' && (
					<div className={ `${ namespace }-small-btns` }>
						<Button
							isSmall
							isSecondary
							className={ `${ namespace }-iconbtn` }
							disabled={ disabled }
							onClick={ undoEvent }
						>
							<Icon icon="no-alt" size="12" />
						</Button>
					</div>
				) }
			</div>
		</>
	);
};

export default MyTextControl;
