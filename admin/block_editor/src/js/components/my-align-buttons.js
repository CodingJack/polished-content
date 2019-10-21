/**
 * WordPress dependencies.
 */
const {
	ButtonGroup,
	Button,
	Icon,
} = wp.components;

/**
 * Internal dependencies.
 */

import {
	namespace,
	selectOptions,
} from '../../../../../shared/js/data';

const {
	isRtl,
} = polishedContentGlobals; // eslint-disable-line no-undef

const {
	pcxAlign,
	pcxAlignRtl,
} = selectOptions;

const aligntButtons = ! isRtl ? pcxAlign : pcxAlignRtl;

const MyAlignButtons = ( { prop, value, callback } ) => {
	return (
		<div className={ `${ namespace }-align-btns` }>
			<ButtonGroup>
				{ aligntButtons.map( ( val ) => {
					return (
						<Button
							key={ val }
							className={ `${ namespace }-align-btn is-button is-default` }
							isPrimary={ value === val }
							onClick={ () => callback( val, prop ) }
						>
							<Icon icon={ `editor-align${ val }` } size="20" />
						</Button>
					);
				} ) }
			</ButtonGroup>
		</div>
	);
};

export default MyAlignButtons;
