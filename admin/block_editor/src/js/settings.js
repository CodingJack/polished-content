/**
 * WordPress dependencies.
 */
const { dispatch, withSelect } = wp.data;

/**
 * Internal dependencies.
 */
import MySettingsPanel from './components/my-settings-panel';
import { toConvertedProp } from './utils';

import {
	namespace,
	coreDefaults,
	defaultValues,
} from '../../../../shared/js/data';

let metaAdded;
const prefix = `_${ namespace.replace( '-', '_' ) }_`;

let defaultSettings = {
	[ `${ prefix }meta_added` ]: true,
	[ `${ prefix }disable_all` ]: false,
	[ `${ prefix }override_all` ]: false,
};

coreDefaults.forEach( ( def ) => {
	defaultSettings[ `${ prefix }${ def }` ] =
		defaultValues[ toConvertedProp( def ) ];
} );

/*
 * global onchange for all settings
 */
const updateProp = ( value, prop ) => {
	let val = value;
	if ( val === undefined ) {
		val = defaultValues[ toConvertedProp( prop ) ];
	}

	defaultSettings[ `${ prefix }${ prop }` ] = val;
	dispatch( 'core/editor' ).editPost( {
		meta: { [ `${ prefix }${ prop }` ]: val },
	} );
};

/*
 * oh the humanity to get default values into this..
 */
const PolishedContentSettings = withSelect( ( selector ) => {
	const meta = selector( 'core/editor' ).getEditedPostAttribute( 'meta' );
	const props = {
		prefix,
		updateProp,
	};

	if ( ! metaAdded ) {
		metaAdded = true;
		if ( ! meta[ `${ prefix }meta_added` ] ) {
			dispatch( 'core/editor' ).editPost( {
				meta: { ...defaultSettings },
			} );
		} else {
			defaultSettings = { ...meta };
		}
	} else if ( ! meta[ `${ prefix }meta_added` ] ) {
		return { ...props, ...defaultSettings };
	}

	return { ...props, ...meta };
} )( MySettingsPanel );

export default PolishedContentSettings;
