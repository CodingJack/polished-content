/**
 * Internal dependencies.
 */
import MyTabPanelControl from './components/my-tab-panel-control';
import MyBasicsPanel from './panels/my-basics-panel';
import MyAdvancedPanel from './panels/my-advanced-panel';
import MyTimingPanel from './panels/my-timing-panel';
import MyFormattingPanel from './panels/my-formatting-panel';
import MySettingsPanel from './panels/my-settings-panel';

import {
	namespace,
} from '../../../../shared/js/data';

const panels = {
	basics: MyBasicsPanel,
	advanced: MyAdvancedPanel,
	timing: MyTimingPanel,
	formatting: MyFormattingPanel,
	settings: MySettingsPanel,
};

const Panel = ( { panel, block } ) => {
	const Component = panels[ panel ];
	return (
		<div className={ `${ namespace }-tab ${ namespace }-${ panel }-tab` }>
			<Component block={ block } />
		</div>
	);
};

/*
* Main settings oanel with all the controls
*/
const MyTabPanels = ( { block } ) => {
	const {
		currentTab,
		updateState,
	} = block;

	const onSelect = ( tabName ) => {
		const selectedTab = tabName.replace( `${ namespace }-`, '' );

		updateState( { currentTab: selectedTab }, () => {
			polishedContentGlobals.currentTab = selectedTab; // eslint-disable-line no-undef
		} );
	};

	const myPanel = ( panel, icon ) => {
		return {
			name: `${ namespace }-${ panel }`,
			className: `is-button is-default is-small dashicons dashicons-${ icon }`,
			container: <Panel panel={ panel } block={ block } />,
		};
	};

	return (
		<MyTabPanelControl className={ `${ namespace }-tabs components-button-group` }
			activeClass="is-primary"
			currentTab={ `${ namespace }-${ currentTab }` }
			onSelect={ onSelect }
			tabs={ [
				myPanel( 'basics', 'admin-settings' ),
				myPanel( 'advanced', 'admin-plugins' ),
				myPanel( 'timing', 'dashboard' ),
				myPanel( 'formatting', 'art' ),
				myPanel( 'settings', 'admin-generic' ),
			] }>
			{
				( tab ) => tab.container
			}
		</MyTabPanelControl>
	);
};

export default MyTabPanels;
