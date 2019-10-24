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
import MyRangeControl from '../components/my-range-control';
import MySelectControl from '../components/my-select-control';
import MyPositionGridControl from '../components/my-position-grid-control';
import MyToggleControl from '../components/my-toggle-control';

import {
	namespace,
} from '../../../../../shared/js/data';

const MyBasicsPanel = ( { block } ) => {
	const {
		props,
		updateProp,
	} = block;

	const {
		pcxOpacity,
		pcxBlur,
		pcxGrayscale,
		pcxZoom,
		pcxStrength,
		pcxPosition,
		pcxClip,
		pcxMask,
	} = props;

	return (
		<>
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
		</>
	);
};

export default MyBasicsPanel;
