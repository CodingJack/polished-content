/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;

const {
	Button,
	Icon,
} = wp.components;

const {
	forwardRef,
} = wp.element;

/**
 * Internal dependencies.
 */

import {
	namespace,
	selectOptions,
} from '../../../../../shared/js/data';

import {
	shouldAnimate,
	getPrevNextSelection,
} from '../utils';

import MySavePresetControl from './my-save-preset-control';

const {
	isRtl,
} = polishedContentGlobals; // eslint-disable-line no-undef

const MyPreviewControl = forwardRef( ( { block }, animatedElements ) => {
	const {
		props,
		state,
		updateState,
		updateFromPreset,
	} = block;

	const {
		selectedPreset,
		hideSavePresetBtn,
		showSavePresetModal,
	} = state;

	const {
		el,
		container,
	} = animatedElements;

	const { previewIsPlaying } = state;
	const { pcxPresets } = selectOptions;
	const {
		pcxMask,
		pcxGrayscale,
	} = props;

	const values = pcxPresets.map( ( option ) => option.value );

	const playPause = () => {
		if ( selectedPreset === 'PcxDefaults' ) {
			onClickNext();
			return;
		}

		const { previewIsPlaying: previewPlaying } = state;
		updateState( { previewIsPlaying: ! previewPlaying } );
	};

	const togglePresetModal = ( show ) => {
		updateState( { showSavePresetModal: show } );
	};

	const createPreset = () => {
		updateState( { previewIsPlaying: false, showSavePresetModal: true } );
	};

	const onClickPrev = () => {
		const selection = getPrevNextSelection( pcxPresets, values, selectedPreset );
		updateFromPreset( selection );
	};

	const onClickNext = () => {
		const selection = getPrevNextSelection( pcxPresets, values, selectedPreset, true );
		updateFromPreset( selection );
	};

	const isPlaying = previewIsPlaying ? ' is-playing' : '';
	const maskEnabed = pcxMask ? ' pcx-has-mask' : '';
	const disabled = selectedPreset === 'PcxCustom' && ! previewIsPlaying && ! shouldAnimate( { ...props } );
	const grayscale = parseInt( pcxGrayscale, 10 ) > 0 ? ' pcx-grayscale' : '';

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
				<div className={ `${ namespace }-preview-wrap` } ref={ container } >
					<div className={ `${ namespace }-preview-container${ maskEnabed }${ grayscale }` } >
						<span className={ `${ namespace }-preview-el` } ref={ el } ><Icon icon="text" size="72" /></span>
						{ grayscale && (
							<svg className={ `${ namespace }-gradient` } xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 20 20">
								<defs>
									<linearGradient id={ `${ namespace }-linear` } x1="0" x2="0" y1="0" y2="1">
										<stop offset="0%" stopColor="#59253a" />
										<stop offset="25%" stopColor="#59253a" />
										<stop offset="25%" stopColor="#895061" />
										<stop offset="50%" stopColor="#895061" />
										<stop offset="50%" stopColor="#0677a1" />
										<stop offset="75%" stopColor="#0677a1" />
										<stop offset="75%" stopColor="#2d4159" />
										<stop offset="100%" stopColor="#2d4159" />
									</linearGradient>
								</defs>
							</svg>
						) }
					</div>
				</div>
				{ showSavePresetModal && (
					<MySavePresetControl block={ block } togglePresetModal={ togglePresetModal } />
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
				isPrimary={ ! disabled }
				disabled={ disabled }
				className={ `${ namespace }-playpause ${ namespace }-iconbtn ${ isPlaying }` }
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
				className={ `${ namespace }-create-preset` }
				onClick={ createPreset }
				aria-disabled={ hideSavePresetBtn || showSavePresetModal }
			> { __( 'Create Preset', 'polished-content' ) }</Button>
		</>
	);
} );

export default MyPreviewControl;

