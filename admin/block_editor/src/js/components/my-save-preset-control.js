/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;

const {
	Button,
	IconButton,
	Spinner,
} = wp.components;

const {
	useState,
} = wp.element;

/**
 * External dependencies.
 */
import axios from 'axios';
import qs from 'qs';

/**
 * Internal dependencies.
 */
import {
	addPreset,
} from '../utils';

import {
	namespace,
	defaultValues,
} from '../../../../../shared/js/data';

const {
	ajaxNonce,
} = polishedContentGlobals; // eslint-disable-line no-undef

const MySavePresetControl = ( { block, togglePresetModal } ) => {
	const [
		disabled,
		setDisabled,
	] = useState( true );

	const [
		presetTitle,
		updateTitle,
	] = useState( '' );

	const { state } = block;
	const { rcMenuActive } = state;

	const savePreset = () => {
		if ( ! presetTitle || typeof ajaxurl === 'undefined' ) {
			return;
		}

		const { props, updateState } = block;

		// guarantee that the settings panel has recieved the "ajax is loading" class
		updateState( { ajaxLoading: true }, () => {
			const obj = { ...props };

			// strip out block props not related to plugin
			Object.keys( obj ).forEach( ( key ) => {
				if ( defaultValues[ key ] === undefined ) {
					delete obj[ key ];
				}
			} );

			// only store values different than defaults
			for ( const [ key, defValue ] of Object.entries( defaultValues ) ) {
				if ( obj[ key ] === defValue ) {
					delete obj[ key ];
				}
			}

			axios.post( ajaxurl, qs.stringify( { // eslint-disable-line no-undef

				action: 'polished_content',
				nonce: ajaxNonce,
				addremove: 'add',
				name: presetTitle,
				settings: JSON.stringify( obj ),

			} ) ).then( ( st ) => {
				if ( st.data === 'success' ) {
					const key = addPreset( presetTitle, obj );
					const { updateFromPreset } = block;

					updateFromPreset( key, true );
					togglePresetModal( false );
				} else {
					console.log( st ); // eslint-disable-line no-console
					updateState( { ajaxLoading: false } );
				}
			} ).catch( () => {
				updateState( { ajaxLoading: false } );
				console.log( __( 'Polished Content Ajax Request Failed', 'polished-content' ) ); // eslint-disable-line no-console
			} );
		} );
	};

	const onChange = ( e ) => updateTitle( e.target.value );
	const onKeyUp = ( e ) => setDisabled( ! e.target.value );
	const onClick = () => togglePresetModal( false );
	const ref = ( input ) => ! rcMenuActive && input && input.focus();

	return (
		<>
			<div className={ `${ namespace }-save-preset` }>
				<div>
					<input
						type="text"
						className={ `${ namespace }-preset-name` }
						onChange={ onChange }
						onKeyUp={ onKeyUp }
						placeholder={ __( 'Custom Preset Name', 'polished-content' ) }
						ref={ ref }
					/>
					<Button className={ `${ namespace }-save-btn` } isPrimary disabled={ disabled } onClick={ savePreset }>
						<span className={ `${ namespace }-save-text` }>{ __( 'Save Preset', 'polished-content' ) }<Spinner /></span>
					</Button>
				</div>
				<IconButton className={ `${ namespace }-mini-icon` } icon="no" size="24" onClick={ onClick } />
			</div>
		</>
	);
};

export default MySavePresetControl;
