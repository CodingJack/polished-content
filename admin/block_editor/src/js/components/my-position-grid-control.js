/**
 * WordPress dependencies.
 */
const { ButtonGroup, Button } = wp.components;

/**
 * Internal dependencies.
 */

import { namespace, selectOptions } from '../../../../../shared/js/data';

const { pcxPosition } = selectOptions;

const MyPositionGridControl = ( { prop, value, callback } ) => {
	return (
		<div className={ `${ namespace }-points` }>
			<ButtonGroup>
				{ pcxPosition.map( ( val ) => {
					return (
						<Button
							isSmall
							key={ val }
							className={ `${ namespace }-position-btn` }
							isSecondary={ value !== val }
							isPrimary={ value === val }
							onClick={ () => callback( val, prop ) }
						/>
					);
				} ) }
			</ButtonGroup>
		</div>
	);
};

export default MyPositionGridControl;
