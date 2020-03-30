/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { PanelBody } = wp.components;

/**
 * Internal dependencies.
 */
import MyToggleControl from './my-toggle-control';
import MyRangeControl from './my-range-control';
import MySelectControl from './my-select-control';

import { namespace, selectOptions } from '../../../../../shared/js/data';

import { HelpSettingsLink, ViewportText } from './my-tab-title-labels';

const { pcxScrollType } = selectOptions;

const scrollOptions = { scroll_type: pcxScrollType };

const MySettingsPanel = ( {
	prefix,
	updateProp,
	[ `${ prefix }disable_all` ]: disableAll,
	[ `${ prefix }override_all` ]: overrideAll,
	[ `${ prefix }scroll_type` ]: scrollType,
	[ `${ prefix }percentage_in` ]: percentageIn,
	[ `${ prefix }percentage_in_stagger` ]: percentageInStagger,
	[ `${ prefix }reverse` ]: reverse,
	[ `${ prefix }scroll_stagger` ]: scrollStagger,
	[ `${ prefix }desktop` ]: desktop,
	[ `${ prefix }laptop` ]: laptop,
	[ `${ prefix }tablet` ]: tablet,
	[ `${ prefix }smartphone` ]: smartphone,
} ) => {
	return (
		<PanelBody>
			<div
				className={ `${ namespace } ${ namespace }-sidebar edit-post-settings-sidebar__panel-block` }
			>
				<div
					className={ `${ namespace }-settings components-panel__body` }
				>
					<div className="components-button-group">
						<MyToggleControl
							prop="disable_all"
							label={ __(
								'Disable All Animations',
								'polished-content'
							) }
							checked={ disableAll }
							callback={ updateProp }
							help={ __(
								'Disable all plugin animations on the page regardless of their individual status',
								'polished-content'
							) }
						/>
						{ ! disableAll && (
							<>
								<MyToggleControl
									className={ `${ namespace }-override` }
									prop="override_all"
									label={ __(
										'Activate Front-end Overrides',
										'polished-content'
									) }
									checked={ overrideAll }
									callback={ updateProp }
									help={ __(
										'Override all Block Animations on the front-end with these settings.  Useful for batch-testing.',
										'polished-content'
									) }
								/>
								{ overrideAll && (
									<PanelBody
										title={ __(
											'Front-end Overrides',
											'polished-content'
										) }
										icon="admin-tools"
										initialOpen={ true }
									>
										<MySelectControl
											prop="scroll_type"
											label={ __(
												'Animate Content',
												'polished-content'
											) }
											value={ scrollType }
											options={ scrollOptions }
											callback={ updateProp }
										/>
										<MyRangeControl
											prop="percentage_in"
											metaProp="pcxPercentageIn"
											label={ __(
												'Percentage In View',
												'polished-content'
											) }
											value={ percentageIn }
											callback={ updateProp }
											max={ 50 }
											step={ 1 }
										/>
										<MyRangeControl
											prop="percentage_in_stagger"
											metaProp="pcxPercentageInStagger"
											label={ __(
												'Stagger % In View',
												'polished-content'
											) }
											value={ percentageInStagger }
											callback={ updateProp }
											max={ 25 }
											step={ 1 }
											help={ __(
												"Animate when inside this percentage of the screen's viewport",
												'polished-content'
											) }
										/>
										<MyToggleControl
											prop="reverse"
											label={ __(
												'Auto Reverse',
												'polished-content'
											) }
											className={ `${ namespace }-scroll-option` }
											checked={ reverse }
											callback={ updateProp }
											help={ __(
												'Movements, wipes, rotations and skews will be reversed when scrolled up and out of view',
												'polished-content'
											) }
										/>
										<MyToggleControl
											prop="scroll_stagger"
											label={ __(
												'Stagger on Scroll',
												'polished-content'
											) }
											className={ `${ namespace }-scroll-option` }
											checked={ scrollStagger }
											callback={ updateProp }
											help={ __(
												"The block will animate in relation to the page's scroll position",
												'polished-content'
											) }
										/>
										<div
											className={ `${ namespace }-viewports` }
										>
											<label htmlFor="desktop">
												{ __(
													'Enable/Disable Animation for...',
													'polished-content'
												) }
											</label>
											<MyToggleControl
												prop="desktop"
												label={
													<ViewportText
														title={ __(
															'Desktop',
															'polished-content'
														) }
														index={ 0 }
													/>
												}
												checked={ desktop }
												callback={ updateProp }
											/>
											<MyToggleControl
												prop="laptop"
												label={
													<ViewportText
														title={ __(
															'Laptop',
															'polished-content'
														) }
														index={ 1 }
													/>
												}
												checked={ laptop }
												callback={ updateProp }
											/>
											<MyToggleControl
												prop="tablet"
												label={
													<ViewportText
														title={ __(
															'Tablet',
															'polished-content'
														) }
														index={ 2 }
													/>
												}
												checked={ tablet }
												callback={ updateProp }
											/>
											<MyToggleControl
												prop="smartphone"
												label={
													<ViewportText
														title={ __(
															'Smartphone',
															'polished-content'
														) }
														index={ 3 }
													/>
												}
												checked={ smartphone }
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
									</PanelBody>
								) }
							</>
						) }
					</div>
				</div>
			</div>
		</PanelBody>
	);
};

export default MySettingsPanel;
