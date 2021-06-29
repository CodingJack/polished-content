/**
 * External dependencies.
 */
 import React from 'react';

/**
 * WordPress dependencies.
 */

const { __ } = wp.i18n;

const { IconButton } = wp.components;

/**
 * External dependencies.
 */
import axios from 'axios';
import qs from 'qs';

/**
 * Internal dependencies.
 */
import { removePreset } from '../utils';

import { namespace } from '../../../../../shared/js/data';

import MySelectControl from './my-select-control';

const { ajaxNonce } = polishedContentGlobals; // eslint-disable-line no-undef

const MyPresetsControl = ( { block } ) => {
  const { state, updateFromPreset } = block;

  const { hideDeleteBtn, selectedPreset } = state;

  const style = { visibility: hideDeleteBtn ? 'hidden' : 'visible' };

  const deletePreset = () => {
    if ( typeof ajaxurl === 'undefined' ) {
      return;
    }
    if (
      /* eslint-disable */
      window.confirm(
        __( 'Delete this Custom Preset Option?', 'polished-content' )
      )
      /* eslint-enable */
    ) {
      const { updateState } = block;

      const releaseAjax = () => {
        updateState( {
          ajaxLoading: false,
          showSavePresetModal: false,
        } );
      };

      // guarantee that the settings panel has recieved the "ajax is loading" class
      updateState( { ajaxLoading: true }, () => {
        /* eslint-disable */
        axios
          .post(
            ajaxurl,
            qs.stringify( {
              action: 'polished_content',
              nonce: ajaxNonce,
              addremove: 'remove',
              name: selectedPreset,
            } )
          )
          .then( ( st ) => {
            if ( st.data === 'success' ) {
              const { props } = block;
              removePreset( selectedPreset, { ...props } );
            } else {
              console.log( st );
            }
            releaseAjax();
          } )
          .catch( () => {
            console.log(
              __(
                'Polished Content Ajax Request Failed',
                'polished-content'
              )
            );
            releaseAjax();
          } );
        /* eslint-enable */
      } );
    }
  };

  return (
    <>
      <div className={ `${ namespace }-presets` }>
        <MySelectControl
          label="Settings from Preset"
          prop="pcxPresets"
          value={ selectedPreset }
          callback={ updateFromPreset }
          buttons={ false }
        />
        <IconButton
          className={ `${ namespace }-delete ${ namespace }-iconbtn is-button is-default is-small` }
          style={ style }
          icon="no-alt"
          onClick={ deletePreset }
        />
      </div>
    </>
  );
};

export default MyPresetsControl;
