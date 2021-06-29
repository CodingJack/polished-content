/**
 * External dependencies.
 */
 import React from 'react';

/**
 * Internal dependencies.
 */
import MyTabPanelControl from './components/my-tab-panel-control';
import MyBasicsPanel from './panels/my-basics-panel';
import MyAdvancedPanel from './panels/my-advanced-panel';
import MyTimingPanel from './panels/my-timing-panel';
import MyFormattingPanel from './panels/my-formatting-panel';
import MySettingsPanel from './panels/my-settings-panel';

import { namespace } from '../../../../shared/js/data';

const tabs = [
  {
    slug: 'basics',
    icon: 'admin-settings',
    component: MyBasicsPanel,
  },
  {
    slug: 'advanced',
    icon: 'admin-plugins',
    component: MyAdvancedPanel,
  },
  {
    slug: 'timing',
    icon: 'dashboard',
    component: MyTimingPanel,
  },
  {
    slug: 'formatting',
    icon: 'art',
    component: MyFormattingPanel,
  },
  {
    slug: 'settings',
    icon: 'admin-generic',
    component: MySettingsPanel,
  },
];

const MyPanel = ( { slug, icon, component: Component }, block ) => {
  return {
    name: `${ namespace }-${ slug }`,
    className: `is-button is-default is-small dashicons dashicons-${ icon }`,
    container: (
      <div
        className={ `${ namespace }-tab ${ namespace }-${ slug }-tab` }
      >
        <Component block={ block } />
      </div>
    ),
  };
};

/*
 * Main settings oanel with all the controls
 */
const MyTabPanels = ( { block } ) => {
  const { currentTab, updateState } = block;

  const onSelect = ( tabName ) => {
    const selectedTab = tabName.replace( `${ namespace }-`, '' );

    updateState( { currentTab: selectedTab }, () => {
      polishedContentGlobals.currentTab = selectedTab; // eslint-disable-line no-undef
    } );
  };

  return (
    <MyTabPanelControl
      className={ `${ namespace }-tabs components-button-group` }
      activeClass="is-primary"
      currentTab={ `${ namespace }-${ currentTab }` }
      onSelect={ onSelect }
      tabs={ tabs.map( ( tab ) => MyPanel( tab, block ) ) }
    >
      { ( tab ) => tab.container }
    </MyTabPanelControl>
  );
};

export default MyTabPanels;
