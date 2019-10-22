/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;

const {
	PanelRow,
} = wp.components;

/**
 * Internal dependencies.
 */
import MyRangeControl from './components/my-range-control';
import MyTextControl from './components/my-text-control';
import MySelectControl from './components/my-select-control';
import MyPositionGridControl from './components/my-position-grid-control';
import MyToggleControl from './components/my-toggle-control';
import MyAlignButtons from './components/my-align-buttons';
import MySelectWrapper from './components/my-select-wrapper';
import MyClassesControl from './components/my-classes-control';
import MyTabPanelControl from './components/my-tab-panel-control';

import {
	HelpSettingsLink,
	ViewportText,
} from './components/my-tab-title-labels';

import {
	namespace,
} from '../../../../shared/js/data';

/*
* Main settings oanel with all the controls
*/
const MyTabPanels = ( { block } ) => {
	const {
		props,
		currentTab,
		updateProp,
		updateState,
	} = block;

	const {
		pcxOpacity,
		pcxZoom,
		pcxStrength,
		pcxPosition,
		pcxInherit,
		pcxClip,
		pcxMask,
		pcxAlign,
		pcxInline,
		pcxReverse,
		pcxBlur,
		pcxFloat,
		pcxClass,
		pcxGrayscale,
		pcxRotate,
		pcxRotateX,
		pcxRotateY,
		pcxSkewX,
		pcxSkewY,
		pcxLetterSpacing,
		pcxPerspective,
		pcxDuration,
		pcxDelay,
		pcxDelayReverse,
		pcxDelayBreak,
		pcxEasing,
		pcxEaseDirection,
		pcxEaseReverse,
		pcxScrollType,
		pcxPercentageIn,
		pcxScrollStagger,
		pcxPercentageInStagger,
		pcxTransformOrigin,
		pcxTransformReset,
		pcxDesktop,
		pcxLaptop,
		pcxTablet,
		pcxSmartphone,
	} = props;

	let easingMessage;
	const easeCheck = pcxEasing === 'Back' || pcxEasing === 'Elastic';
	const letterSpacingHelp = pcxLetterSpacing > 0 ? __( 'Letter Spacing is only compatible with text that would normally always appear on a single line', 'polished-content' ) : null;

	const perspective = pcxPerspective.toString().replace( 'vw', '' );
	const perspectHelpStart = __( 'vw would equal', 'polished-content' );
	const perspectHelpEnd = __( '% of the screen\'s width', 'polished-content' );
	const persepectiveHelp = `${ perspective }${ perspectHelpStart } ${ perspective }${ perspectHelpEnd }`;

	if ( easeCheck && pcxReverse && pcxScrollType !== 'in' ) {
		easingMessage = __( 'This easing function can be visually glitchy when combined with the "Auto Reverse" option', 'polished-content' );
	}

	const onSelect = ( tabName ) => {
		const selectedTab = tabName.replace( `${ namespace }-`, '' );
		updateState( { currentTab: selectedTab }, () => {
			polishedContentGlobals.currentTab = selectedTab; // eslint-disable-line no-undef
		} );
	};

	return (
		<MyTabPanelControl className={ `${ namespace }-tabs components-button-group` }
			activeClass="is-primary"
			currentTab={ `${ namespace }-${ currentTab }` }
			onSelect={ onSelect }
			tabs={ [
				{
					name: `${ namespace }-basics`,
					className: 'is-button is-default is-small dashicons dashicons-admin-settings',
					container: (
						<div className={ `${ namespace }-tab ${ namespace }-basics-tab` }>
							<MyRangeControl
								prop="pcxOpacity"
								label={ __( 'Opacity', 'polished-content' ) }
								value={ pcxOpacity }
								callback={ updateProp }
							/>
							<MyRangeControl
								prop="pcxBlur"
								label={ __( 'Blur', 'polished-content' ) }
								value={ pcxBlur }
								callback={ updateProp }
								max={ 30 }
								step={ 1 }
							/>
							<MyRangeControl
								prop="pcxGrayscale"
								label={ __( 'Grayscale', 'polished-content' ) }
								value={ pcxGrayscale }
								callback={ updateProp }
							/>
							<MyRangeControl
								prop="pcxZoom"
								label={ __( 'Zoom', 'polished-content' ) }
								value={ pcxZoom }
								callback={ updateProp }
								max={ 300 }
							/>
							<div className={ `${ namespace }-positions polished-content-position-first` }>
								<PanelRow>
									<MySelectControl
										prop="pcxStrength"
										label={ __( 'Movements', 'polished-content' ) }
										value={ pcxStrength }
										callback={ updateProp }
										buttons={ true }
									/>
									<MyPositionGridControl
										prop="pcxPosition"
										value={ pcxPosition }
										callback={ updateProp }
									/>
								</PanelRow>
							</div>
							<div className={ `${ namespace }-positions` }>
								<PanelRow>
									<MySelectControl
										label={ __( 'Content Wipes', 'polished-content' ) }
										prop="pcxClip"
										value={ pcxClip }
										callback={ updateProp }
									/>
									<MyPositionGridControl
										prop="pcxClip"
										value={ pcxClip }
										callback={ updateProp }
									/>
								</PanelRow>
							</div>
							<MyToggleControl
								prop="pcxMask"
								label={ __( 'Content Mask', 'polished-content' ) }
								checked={ pcxMask }
								callback={ updateProp }
								help={ __( 'Useful for Blur Filter and Movements without 3D Rotations but may impact collapsing margins', 'polished-content' ) }
							/>
						</div>
					),
				},
				{
					name: `${ namespace }-advanced`,
					className: 'is-button is-default is-small dashicons dashicons-admin-plugins',
					container: (
						<div className={ `${ namespace }-tab ${ namespace }-advanced-tab` }>
							<MyRangeControl
								prop="pcxLetterSpacing"
								label={ __( 'Letter Spacing', 'polished-content' ) }
								value={ pcxLetterSpacing }
								callback={ updateProp }
								min={ 0 }
								max={ 100 }
								step={ 1 }
								help={ letterSpacingHelp }
							/>
							<MyRangeControl
								prop="pcxRotate"
								label={ __( '2D Rotation', 'polished-content' ) }
								value={ pcxRotate }
								callback={ updateProp }
								min={ -360 }
								max={ 360 }
							/>
							<MyRangeControl
								prop="pcxRotateX"
								label={ __( '3D RotationX', 'polished-content' ) }
								value={ pcxRotateX }
								callback={ updateProp }
								min={ -360 }
								max={ 360 }
							/>
							<MyRangeControl
								prop="pcxRotateY"
								label={ __( '3D RotationY', 'polished-content' ) }
								value={ pcxRotateY }
								callback={ updateProp }
								min={ -360 }
								max={ 360 }
							/>
							<MyRangeControl
								prop="pcxSkewX"
								label={ __( 'SkewX', 'polished-content' ) }
								value={ pcxSkewX }
								callback={ updateProp }
								min={ -180 }
								max={ 180 }
							/>
							<MyRangeControl
								prop="pcxSkewY"
								label={ __( 'SkewY', 'polished-content' ) }
								value={ pcxSkewY }
								callback={ updateProp }
								min={ -180 }
								max={ 180 }
							/>
							<div id={ `${ namespace }-transform-origin-wrap` } className={ `${ namespace }-positions polished-content-position-first` }>
								<PanelRow>
									<MySelectControl
										prop="pcxTransformOrigin"
										label={ __( 'Transform Origin', 'polished-content' ) }
										value={ pcxTransformOrigin }
										callback={ updateProp }
									/>
									<MyPositionGridControl
										prop="pcxTransformOrigin"
										value={ pcxTransformOrigin }
										callback={ updateProp }
									/>
								</PanelRow>
							</div>
							<MySelectWrapper
								component={ 'range' }
								prop="pcxPerspective"
								label={ __( '3D Perspective', 'polished-content' ) }
								customLabel={ __( 'Custom 3D Perspective', 'polished-content' ) }
								value={ pcxPerspective }
								callback={ updateProp }
								custom="custom"
								min={ 200 }
								max={ 5000 }
								step={ 50 }
								help={ persepectiveHelp }
							/>
							<MySelectWrapper
								component={ 'text' }
								prop="pcxTransformReset"
								label={ __( 'Reset Transform Origin at...', 'polished-content' ) }
								customLabel={ __( 'Transform Origin Reset Width', 'polished-content' ) }
								value={ pcxTransformReset }
								callback={ updateProp }
								custom="custom"
								help={ (
									<HelpSettingsLink text={ __( 'Reset transform-origin to center at a certain screen width set in the ', 'polished-content' ) } />
								) }
							/>
						</div>
					),
				},
				{
					name: `${ namespace }-timing`,
					className: 'is-button is-default is-small dashicons dashicons-dashboard',
					container: (
						<div className={ `${ namespace }-tab ${ namespace }-timing-tab` }>
							<MySelectControl
								prop="pcxEasing"
								label={ __( 'Easing Function', 'polished-content' ) }
								value={ pcxEasing }
								callback={ updateProp }
								help={ easingMessage }
							/>
							<MyTextControl
								prop="pcxDuration"
								label={ __( 'Animation Duration (ms)', 'polished-content' ) }
								value={ pcxDuration }
								callback={ updateProp }
								min={ 200 }
								max={ 50000 }
								step={ 50 }
							/>
							<MySelectControl
								prop="pcxEaseDirection"
								label={ __( 'Easing Type', 'polished-content' ) }
								value={ pcxEaseDirection }
								callback={ updateProp }
							/>
							<div className={ `${ namespace }-spacer` }>
								<PanelRow>
									<MyTextControl
										prop="pcxDelay"
										label={ __( 'Timing Delay', 'polished-content' ) }
										value={ pcxDelay }
										callback={ updateProp }
										min={ 0 }
										max={ 10000 }
										step={ 50 }
									/>
									<MyTextControl
										prop="pcxDelayReverse"
										label={ __( 'Reverse Delay', 'polished-content' ) }
										value={ pcxDelayReverse }
										callback={ updateProp }
										min={ 0 }
										max={ 10000 }
										step={ 50 }
									/>
								</PanelRow>
							</div>
							<MySelectWrapper
								component={ 'text' }
								prop="pcxDelayBreak"
								label={ __( 'Disable Delays at...', 'polished-content' ) }
								customLabel={ __( 'Disable Delay Width', 'polished-content' ) }
								value={ pcxDelayBreak }
								callback={ updateProp }
								custom="custom"
								help={ (
									<HelpSettingsLink text={ __( 'Remove delays at a certain viewport width set in the plugin\'s', 'polished-content' ) } />
								) }
							/>
							{ pcxEaseDirection !== 'easeInOut' && (
								<MyToggleControl
									prop="pcxEaseReverse"
									label={ __( 'Reverse Easing', 'polished-content' ) }
									checked={ pcxEaseReverse }
									callback={ updateProp }
									help={ __( 'easeOut will become easeIn when animating out and vice versa', 'polished-content' ) }
								/>
							) }
						</div>
					),
				},
				{
					name: `${ namespace }-formatting`,
					className: 'is-button is-default is-small dashicons dashicons-art',
					container: (
						<div className={ `${ namespace }-tab ${ namespace }-formatting-tab` }>
							<MyToggleControl
								prop="pcxInherit"
								label={ __( 'Inherit Margins', 'polished-content' ) }
								checked={ pcxInherit }
								callback={ updateProp }
								help={ __( 'Removes margins from the Block allowing the animated wrapper to inherit them instead.', 'polished-content' ) }
							/>
							<MyToggleControl
								prop="pcxInline"
								label={ __( 'Animate as Inline Block', 'polished-content' ) }
								checked={ pcxInline }
								callback={ updateProp }
								help={ __( 'Useful for Buttons and other content that is not intended to appear full-width.', 'polished-content' ) }
							/>
							{ pcxInline && (
								<MyAlignButtons
									prop="pcxAlign"
									value={ pcxAlign }
									callback={ updateProp }
								/>
							) }
							<MySelectControl
								prop="pcxFloat"
								label={ __( 'CSS Float', 'polished-content' ) }
								value={ pcxFloat }
								callback={ updateProp }
								help={ __( 'Useful if your content is normally meant to display inline', 'polished-content' ) }
							/>
							<MyTextControl
								type="text"
								validity="class"
								prop="pcxClass"
								label={ __( 'Wrapper Class', 'polished-content' ) }
								value={ pcxClass }
								callback={ updateProp }
								help={ __( 'Add an optional class name to the animation\'s outer wrapper', 'polished-content' ) }
							/>
							<MyClassesControl block={ block } />
						</div>
					),
				},
				{
					name: `${ namespace }-settings`,
					className: 'is-button is-default is-small dashicons dashicons-admin-generic',
					container: (
						<div className={ `${ namespace }-tab ${ namespace }-settings-tab` }>
							<MySelectControl
								prop="pcxScrollType"
								label={ __( 'Animate Content', 'polished-content' ) }
								value={ pcxScrollType }
								callback={ updateProp }
							/>
							{ ! pcxScrollStagger && (
								<MyRangeControl
									prop="pcxPercentageIn"
									label={ __( 'Percentage In View', 'polished-content' ) }
									value={ pcxPercentageIn }
									callback={ updateProp }
									max={ 50 }
									step={ 1 }
									help={ __( 'Animate when inside this percentage of the screen\'s viewport', 'polished-content' ) }
								/>
							) }
							{ pcxScrollStagger && (
								<MyRangeControl
									prop="pcxPercentageInStagger"
									label={ __( 'Stagger % In View', 'polished-content' ) }
									value={ pcxPercentageInStagger }
									callback={ updateProp }
									max={ 25 }
									step={ 1 }
									help={ __( 'Animate when inside this percentage of the screen\'s viewport', 'polished-content' ) }
								/>
							) }
							{ pcxScrollType !== 'in' && (
								<MyToggleControl
									prop="pcxReverse"
									label={ __( 'Auto Reverse', 'polished-content' ) }
									className={ `${ namespace }-scroll-option` }
									checked={ pcxReverse }
									callback={ updateProp }
									help={ __( 'Movements, wipes, rotations and skews will be reversed when scrolled up and out of view', 'polished-content' ) }
								/>
							) }
							<MyToggleControl
								prop="pcxScrollStagger"
								label={ __( 'Stagger on Scroll', 'polished-content' ) }
								className={ `${ namespace }-scroll-option` }
								checked={ pcxScrollStagger }
								callback={ updateProp }
								help={ __( 'The block will animate in relation to the page\'s scroll position', 'polished-content' ) }
							/>
							<div className={ `${ namespace }-viewports` }>
								<label htmlFor="pcxDesktop">{ __( 'Enable/Disable Animation for...', 'polished-content' ) }</label>
								<MyToggleControl
									prop="pcxDesktop"
									label={ (
										<ViewportText title={ __( 'Desktop', 'polished-content' ) } index={ 0 } />
									) }
									checked={ pcxDesktop }
									callback={ updateProp }
								/>
								<MyToggleControl
									prop="pcxLaptop"
									label={ (
										<ViewportText title={ __( 'Laptop', 'polished-content' ) } index={ 1 } />
									) }
									checked={ pcxLaptop }
									callback={ updateProp }
								/>
								<MyToggleControl
									prop="pcxTablet"
									label={ (
										<ViewportText title={ __( 'Tablet', 'polished-content' ) } index={ 2 } />
									) }
									checked={ pcxTablet }
									callback={ updateProp }
								/>
								<MyToggleControl
									prop="pcxSmartphone"
									label={ (
										<ViewportText title={ __( 'Smartphone', 'polished-content' ) } index={ 3 } />
									) }
									checked={ pcxSmartphone }
									callback={ updateProp }
									help={ (
										<HelpSettingsLink text={ __( 'Viewport widths can be adjusted from the plugin\'s', 'polished-content' ) } />
									) }
								/>
							</div>
						</div>
					),
				},
			] }>
			{
				( tab ) => tab.container
			}
		</MyTabPanelControl>
	);
};

export default MyTabPanels;
