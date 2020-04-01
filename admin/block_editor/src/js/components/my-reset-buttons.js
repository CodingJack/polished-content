/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;

const { Button } = wp.components;

import { namespace } from '../../../../../shared/js/data';

const MyResetButtons = ( { onClear, onUndo, originalSettings } ) => {
	const undoEvent = () => {
		onUndo( false, originalSettings );
	};

	if ( onClear || onUndo ) {
		return (
			<div className={ `${ namespace }-reset-btns` }>
				{ onClear && (
					<Button isSmall isSecondary onClick={ onClear }>
						{ ' ' }
						{ __( 'Reset to Defaults', 'polished-content' ) }
					</Button>
				) }
				{ onUndo && (
					<Button isSmall isSecondary onClick={ undoEvent }>
						{ ' ' }
						{ __( 'Undo All Changes', 'polished-content' ) }
					</Button>
				) }
			</div>
		);
	}

	return null;
};

export default MyResetButtons;
