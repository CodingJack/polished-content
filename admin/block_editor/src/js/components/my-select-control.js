/* eslint jsx-a11y/no-onchange: 0 */

/**
 * WordPress dependencies.
 */

const { Button, Icon, BaseControl } = wp.components;

/**
 * Internal dependencies.
 */

import { namespace, selectOptions } from '../../../../../shared/js/data';

import { getPrevNextSelection } from '../utils';

const { isRtl } = polishedContentGlobals; // eslint-disable-line no-undef

const MySelectControl = ( {
	prop,
	label,
	value,
	callback,
	help,
	options,
	className,
	instanceId,
	buttons = true,
} ) => {
	const selectionOptions = options || selectOptions;
	const values = selectionOptions[ prop ].map( ( option ) => option.value );

	const onChange = ( e ) => {
		const val = e.target.value;
		callback( val, prop );
	};

	const onClickPrev = () => {
		const selection = getPrevNextSelection(
			selectionOptions[ prop ],
			values,
			value
		);
		callback( selection, prop );
	};

	const onClickNext = () => {
		const selection = getPrevNextSelection(
			selectionOptions[ prop ],
			values,
			value,
			true
		);
		callback( selection, prop );
	};

	const id = `inspector-select-control-${ instanceId }`;

	let iconLeft;
	let iconRight;

	if ( isRtl !== '1' ) {
		iconLeft = 'left';
		iconRight = 'right';
	} else {
		iconLeft = 'right';
		iconRight = 'left';
	}

	return (
		<>
			<div
				id={ `${ namespace }-${ prop }` }
				className={ `${ namespace }-wrapper ${ namespace }-select-wrap` }
			>
				<BaseControl
					label={ label }
					id={ id }
					help={ help }
					className={ className }
				>
					<select
						value={ value }
						className="components-select-control__input"
						onChange={ onChange }
					>
						{ selectionOptions[ prop ].map( ( option, index ) => {
							return (
								<option
									key={ `${ option.label }-${ option.value }-${ index }` }
									value={ option.value }
									disabled={ option.disabled }
								>
									{ option.label }
								</option>
							);
						} ) }
					</select>
				</BaseControl>
				{ buttons && (
					<div className={ `${ namespace }-small-btns` }>
						<Button
							isSmall
							isSecondary
							className={ `${ namespace }-iconbtn` }
							onClick={ onClickPrev }
						>
							<Icon
								icon={ `arrow-${ iconLeft }-alt2` }
								size="12"
							/>
						</Button>
						<Button
							isSmall
							isSecondary
							className={ `${ namespace }-iconbtn` }
							onClick={ onClickNext }
						>
							<Icon
								icon={ `arrow-${ iconRight }-alt2` }
								size="12"
							/>
						</Button>
					</div>
				) }
			</div>
		</>
	);
};

export default MySelectControl;
