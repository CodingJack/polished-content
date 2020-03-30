/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies.
 */
import MyRangeControl from '../components/my-range-control';
import MySelectControl from '../components/my-select-control';
import MyToggleControl from '../components/my-toggle-control';

import {
	HelpSettingsLink,
	ViewportText,
} from '../components/my-tab-title-labels';

import { namespace } from '../../../../../shared/js/data';

const MySettingsPanel = ( { block } ) => {
	const { props, updateProp } = block;

	const {
		pcxScrollType,
		pcxPercentageIn,
		pcxScrollStagger,
		pcxPercentageInStagger,
		pcxReverse,
		pcxDesktop,
		pcxLaptop,
		pcxTablet,
		pcxSmartphone,
	} = props;

	return (
		<>
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
					help={ __(
						"Animate when inside this percentage of the screen's viewport",
						'polished-content'
					) }
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
					help={ __(
						"Animate when inside this percentage of the screen's viewport",
						'polished-content'
					) }
				/>
			) }
			{ pcxScrollType !== 'in' && (
				<MyToggleControl
					prop="pcxReverse"
					label={ __( 'Auto Reverse', 'polished-content' ) }
					className={ `${ namespace }-scroll-option` }
					checked={ pcxReverse }
					callback={ updateProp }
					help={ __(
						'Movements, wipes, rotations and skews will be reversed when scrolled up and out of view',
						'polished-content'
					) }
				/>
			) }
			<MyToggleControl
				prop="pcxScrollStagger"
				label={ __( 'Stagger on Scroll', 'polished-content' ) }
				className={ `${ namespace }-scroll-option` }
				checked={ pcxScrollStagger }
				callback={ updateProp }
				help={ __(
					"The block will animate in relation to the page's scroll position",
					'polished-content'
				) }
			/>
			<div className={ `${ namespace }-viewports` }>
				<label htmlFor="pcxDesktop">
					{ __(
						'Enable/Disable Animation for...',
						'polished-content'
					) }
				</label>
				<MyToggleControl
					prop="pcxDesktop"
					label={
						<ViewportText
							title={ __( 'Desktop', 'polished-content' ) }
							index={ 0 }
						/>
					}
					checked={ pcxDesktop }
					callback={ updateProp }
				/>
				<MyToggleControl
					prop="pcxLaptop"
					label={
						<ViewportText
							title={ __( 'Laptop', 'polished-content' ) }
							index={ 1 }
						/>
					}
					checked={ pcxLaptop }
					callback={ updateProp }
				/>
				<MyToggleControl
					prop="pcxTablet"
					label={
						<ViewportText
							title={ __( 'Tablet', 'polished-content' ) }
							index={ 2 }
						/>
					}
					checked={ pcxTablet }
					callback={ updateProp }
				/>
				<MyToggleControl
					prop="pcxSmartphone"
					label={
						<ViewportText
							title={ __( 'Smartphone', 'polished-content' ) }
							index={ 3 }
						/>
					}
					checked={ pcxSmartphone }
					callback={ updateProp }
					help={
						<HelpSettingsLink
							text={ __(
								"Viewport widths can be adjusted from the plugin's",
								'polished-content'
							) }
						/>
					}
				/>
			</div>
		</>
	);
};

export default MySettingsPanel;
