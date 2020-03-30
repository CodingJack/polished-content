/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;

const { PanelRow } = wp.components;

/**
 * Internal dependencies.
 */
import MyRangeControl from '../components/my-range-control';
import MyPositionGridControl from '../components/my-position-grid-control';
import MySelectControl from '../components/my-select-control';
import MySelectWrapper from '../components/my-select-wrapper';

import { HelpSettingsLink } from '../components/my-tab-title-labels';

import { namespace } from '../../../../../shared/js/data';

const MyAdvancedPanel = ( { block } ) => {
	const { props, updateProp } = block;

	const {
		pcxLetterSpacing,
		pcxRotate,
		pcxRotateX,
		pcxRotateY,
		pcxSkewX,
		pcxSkewY,
		pcxTransformOrigin,
		pcxPerspective,
		pcxTransformReset,
	} = props;

	let letterSpacingHelp;
	if ( pcxLetterSpacing > 0 ) {
		letterSpacingHelp = __(
			'Letter Spacing is only compatible with text that would normally always appear on a single line',
			'polished-content'
		);
	}

	const perspective = pcxPerspective.toString().replace( 'vw', '' );
	const perspectHelpStart = __( 'vw would equal', 'polished-content' );
	const perspectHelpEnd = __( "% of the screen's width", 'polished-content' );
	const persepectiveHelp = `${ perspective }${ perspectHelpStart } ${ perspective }${ perspectHelpEnd }`;

	return (
		<>
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
			<div
				id={ `${ namespace }-transform-origin-wrap` }
				className={ `${ namespace }-positions polished-content-position-first` }
			>
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
				prop="pcxPerspective"
				label={ __( '3D Perspective', 'polished-content' ) }
				customLabel={ __(
					'Custom 3D Perspective',
					'polished-content'
				) }
				value={ pcxPerspective }
				callback={ updateProp }
				custom="custom"
				component="range"
				min={ 200 }
				max={ 5000 }
				step={ 50 }
				help={ persepectiveHelp }
			/>
			<MySelectWrapper
				prop="pcxTransformReset"
				label={ __(
					'Reset Transform Origin at...',
					'polished-content'
				) }
				customLabel={ __(
					'Transform Origin Reset Width',
					'polished-content'
				) }
				value={ pcxTransformReset }
				callback={ updateProp }
				custom="custom"
				component="text"
				help={
					<HelpSettingsLink
						text={ __(
							'Reset transform-origin to center at a certain screen width set in the ',
							'polished-content'
						) }
					/>
				}
			/>
		</>
	);
};

export default MyAdvancedPanel;
