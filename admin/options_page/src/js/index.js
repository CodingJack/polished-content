require('../scss/polished-content.scss');

/**
 * External dependencies.
 */
import React from 'react';
import ReactDOM from 'react-dom';

const { Component } = React;

const { __ } = wp.i18n;

/**
 * Internal dependencies.
 */
import { namespace } from '../../../../shared/js/data';

const { settingsDefaults, screenshotsDirectory } = polishedContentGlobals; // eslint-disable-line no-undef

import pages from './data';
import MainDisplay from './controls/main-display';

class Settings extends Component {
  constructor() {
    super( ...arguments );
    this.state = {
      screenshotsActive: false,
      defaultSettings: { ...settingsDefaults },
    };
  }

  activateScreenshots = ( e, active ) => {
    if ( e ) {
      e.preventDefault();
    }

    if ( active ) {
      document.body.classList.add( `${ namespace }-screenshots` );
    } else {
      document.body.classList.remove( `${ namespace }-screenshots` );
    }
    this.setState( { screenshotsActive: active } );
  };

  /*
   * @desc update the state when a user option is changed
   * @param string prop - the option name that was modified
   * @param boolean/number/array value - the option's value that was modified
   * @since 1.0.0
   */
  updateProp( prop, value ) {
    const { defaultSettings } = this.state;

    const settings = { [ prop ]: value };
    const newProps = { ...defaultSettings, ...settings };

    this.setState( { defaultSettings: newProps } );
  }

  /*
   * @desc handles all user option changes
   * @param string prop - the option name that was modified
   * @param boolean/number/array data - the option's original value
   * @param boolean/number/array value - the option's new value
   * @param string type - the option's input type
   * @param boolean/number checkedIndex - "checked" or the prop's index in the original data
   * @since 1.0.0
   */
  updateDefaults = ( prop, data, value, type, checkedIndex ) => {
    let newValue = value;

    // some options are grouped together in arrays and some are single values
    switch ( type ) {
      case 'checkbox':
        value.split( ' ' ).forEach( ( val ) => {
          const arIndex = data.indexOf( val );
          if ( ! checkedIndex ) {
            if ( arIndex !== -1 ) {
              data.splice( arIndex, 1 );
            }
          } else if ( arIndex === -1 ) {
            data.push( val );
          }
        } );

        newValue = data;
        break;
      default:
        if ( Array.isArray( data ) ) {
          data.splice( checkedIndex, 1, value );
          newValue = data;
        }
    }

    this.updateProp( prop, newValue );
  };

  /*
   * @desc fade in the page's full content when the app has loaded (some content exists from php)
   * @since 1.0.0
   */
  componentDidMount() {
    document
      .getElementById( `${ namespace }-settings` )
      .classList.add( 'fade-in' );

    document.querySelectorAll( '.submit' ).forEach( ( btn ) => {
      btn.classList.add( 'fade-in' );
    } );
  }

  render() {
    const { state, props, updateDefaults, activateScreenshots } = this;

    const { defaultSettings, screenshotsActive } = state;

    const { maxColumnItems } = props;

    const defaults = {
      namespace,
      updateDefaults,
      defaultSettings,
      maxColumnItems,
      activateScreenshots,
    };

    const settings = JSON.stringify( defaultSettings );

    return (
      <>
        <MainDisplay props={ defaults } pages={ pages } />
        <input
          type="hidden"
          id="polished_content_defaults"
          name="polished_content_defaults"
          value={ settings }
        />
        { screenshotsActive && (
          <>
            <iframe
              title={ __(
                'Polished Content Screenshots',
                'polished-content'
              ) }
              className={ `${ namespace }-iframe` }
              src={ `${ screenshotsDirectory }/index.html` }
            ></iframe>
            <button
              className={ `${ namespace }-close-iframe` }
              href="#"
              onClick={ activateScreenshots }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path fill="none" d="M0 0h20v20H0z" />
                <path d="M12.12 10l3.53 3.53-2.12 2.12L10 12.12l-3.54 3.54-2.12-2.12L7.88 10 4.34 6.46l2.12-2.12L10 7.88l3.54-3.53 2.12 2.12z" />
              </svg>
            </button>
          </>
        ) }
      </>
    );
  }
}

ReactDOM.render(
  <Settings maxColumnItems={ 13 } />,
  document.getElementById( `${ namespace }-settings` )
);
