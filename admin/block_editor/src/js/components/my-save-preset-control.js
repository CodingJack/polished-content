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

const MySavePresetControl = ( { block } ) => {
	const [
		disabled,
		setDisabled,
	] = useState( true );

	const [
		presetTitle,
		updateTitle,
	] = useState( '' );

	const {
		state,
		updateState,
	} = block;

	const { rcMenuActive } = state;

	const savePreset = () => {
		if ( ! presetTitle || typeof ajaxurl === 'undefined' ) {
			return;
		}

		// guarantee that the settings panel has recieved the "ajax is loading" class
		updateState( { ajaxLoading: true }, () => {
			const { props } = block;
			const obj = { ...props };

			// strip out block props not related to plugin and also props nthat equal defaults
			Object.keys( obj ).forEach( ( key ) => {
				if ( defaultValues[ key ] === undefined || obj[ key ] === defaultValues[ key ] ) {
					delete obj[ key ];
				}
			} );

			const releaseAjax = () => {
				updateState( {
					ajaxLoading: false,
					showSavePresetModal: false,
				} );
			};

			axios.post( ajaxurl, qs.stringify( { // eslint-disable-line no-undef
				action: 'polished_content',
				nonce: ajaxNonce,
				addremove: 'add',
				name: presetTitle,
				settings: JSON.stringify( obj ),
			} ) ).then( ( st ) => {
				if ( st.data === 'success' ) {
					addPreset( presetTitle, obj );
				} else {
					console.log( st ); // eslint-disable-line no-console
				}
				releaseAjax();
			} ).catch( () => {
				console.log( __( 'Polished Content Ajax Request Failed', 'polished-content' ) ); // eslint-disable-line no-console
				releaseAjax();
			} );
		} );
	};

	return (
		<>
			<div className={ `${ namespace }-save-preset` }>
				<div>
					<input
						type="text"
						className={ `${ namespace }-preset-name` }
						onChange={ ( e ) => updateTitle( e.target.value ) }
						onKeyUp={ ( e ) => setDisabled( ! e.target.value ) }
						placeholder={ __( 'Custom Preset Name', 'polished-content' ) }
						ref={ ( input ) => ! rcMenuActive && input && input.focus() }
					/>
					<Button className={ `${ namespace }-save-btn` } isPrimary disabled={ disabled } onClick={ savePreset }>
						<span className={ `${ namespace }-save-text` }>{ __( 'Save Preset', 'polished-content' ) }<Spinner /></span>
					</Button>
				</div>
				<IconButton className={ `${ namespace }-mini-icon` } icon="no" size="24" onClick={ () => updateState( { showSavePresetModal: false } ) } />
			</div>
		</>
	);
};

export default MySavePresetControl;
