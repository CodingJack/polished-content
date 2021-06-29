/**
 * External dependencies.
 */
 import React from 'react';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;

const { Button, Icon } = wp.components;

const { forwardRef } = wp.element;

/**
 * Internal dependencies.
 */

import {
  namespace,
  selectOptions,
  defaultValues,
} from '../../../../../shared/js/data';

import { shouldAnimate, getPrevNextSelection } from '../utils';

import MySavePresetControl from './my-save-preset-control';

const { isRtl } = polishedContentGlobals; // eslint-disable-line no-undef

const MyPreviewControl = forwardRef( ( { block }, animatedElements ) => {
  const { props, state, updateState, updateFromPreset } = block;

  const { pcxMask, pcxGrayscale } = props;

  const { selectedPreset, hideCreatePresetBtn, showSavePresetModal } = state;

  const { el, container } = animatedElements;

  const { previewIsPlaying } = state;
  const { pcxPresets } = selectOptions;
  const values = pcxPresets.map( ( option ) => option.value );

  const playPause = () => {
    // if the preset dropdown is set to "Select a Preset", just play the next animateable preset
    if ( selectedPreset === 'PcxDefaults' ) {
      let selection = getPrevNextSelection(
        pcxPresets,
        values,
        'PcxDefaults',
        true
      );

      // the next preset could be "custom values", and there might not be anything to animate
      // so just move on to the next default preset in that case which will have animateable values
      if ( selection === 'PcxCustom' ) {
        const { pcxAnimations } = selectOptions;
        const newProps = {
          ...defaultValues,
          ...pcxAnimations[ selection ],
        };
        const animate = shouldAnimate( { ...newProps } );
        if ( ! animate ) {
          selection = getPrevNextSelection(
            pcxPresets,
            values,
            selection,
            true
          );
        }
      }

      updateFromPreset( selection );
      return;
    }

    updateState( ( prevState ) => {
      return { previewIsPlaying: ! prevState.previewIsPlaying };
    } );
  };

  const createPreset = () => {
    updateState( {
      previewIsPlaying: false,
      showSavePresetModal: true,
    } );
  };

  const onClickPrev = () => {
    const selection = getPrevNextSelection(
      pcxPresets,
      values,
      selectedPreset
    );
    updateFromPreset( selection );
  };

  const onClickNext = () => {
    const selection = getPrevNextSelection(
      pcxPresets,
      values,
      selectedPreset,
      true
    );
    updateFromPreset( selection );
  };

  const maskEnabed = pcxMask ? ' pcx-has-mask' : '';
  const isPlaying = previewIsPlaying ? ' is-playing' : '';
  const grayscale = parseInt( pcxGrayscale, 10 ) > 0 ? ' pcx-grayscale' : '';

  const playPauseDisabled =
    selectedPreset !== 'PcxDefaults' && ! shouldAnimate( { ...props } );
  const btnDisabled = showSavePresetModal || playPauseDisabled;

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
      <div className={ `${ namespace }-wrap` }>
        <div
          className={ `${ namespace }-preview-wrap` }
          ref={ container }
        >
          <div
            className={ `${ namespace }-preview-container${ maskEnabed }${ grayscale }` }
          >
            <span
              className={ `${ namespace }-preview-el` }
              ref={ el }
            >
              <Icon icon="text" size="72" />
            </span>
            { grayscale && (
              <svg
                className={ `${ namespace }-gradient` }
                xmlns="http://www.w3.org/2000/svg"
                width="72"
                height="72"
                viewBox="0 0 20 20"
              >
                <defs>
                  <linearGradient
                    id={ `${ namespace }-linear` }
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#59253a" />
                    <stop
                      offset="25%"
                      stopColor="#59253a"
                    />
                    <stop
                      offset="25%"
                      stopColor="#895061"
                    />
                    <stop
                      offset="50%"
                      stopColor="#895061"
                    />
                    <stop
                      offset="50%"
                      stopColor="#0677a1"
                    />
                    <stop
                      offset="75%"
                      stopColor="#0677a1"
                    />
                    <stop
                      offset="75%"
                      stopColor="#2d4159"
                    />
                    <stop
                      offset="100%"
                      stopColor="#2d4159"
                    />
                  </linearGradient>
                </defs>
              </svg>
            ) }
          </div>
        </div>
        { showSavePresetModal && (
          <MySavePresetControl block={ block } />
        ) }
      </div>
      <Button
        isSmall
        isPrimary
        className={ `${ namespace }-iconbtn` }
        onClick={ onClickPrev }
      >
        <Icon icon={ `arrow-${ iconLeft }-alt2` } size="16" />
      </Button>
      <Button
        isSmall
        isPrimary={ ! btnDisabled }
        isSecondary={ btnDisabled }
        disabled={ btnDisabled }
        className={ `${ namespace }-playpause ${ namespace }-iconbtn${ isPlaying }` }
        onClick={ playPause }
      >
        <Icon icon="controls-play" size="16" />
        <Icon icon="controls-pause" size="16" />
      </Button>
      <Button
        isSmall
        isPrimary
        className={ `${ namespace }-iconbtn` }
        onClick={ onClickNext }
      >
        <Icon icon={ `arrow-${ iconRight }-alt2` } size="16" />
      </Button>
      <Button
        isSmall
        isSecondary
        className={ `${ namespace }-create-preset` }
        onClick={ createPreset }
        aria-disabled={ hideCreatePresetBtn || showSavePresetModal }
      >
        { ' ' }
        { __( 'Create Preset', 'polished-content' ) }
      </Button>
    </>
  );
} );

export default MyPreviewControl;
