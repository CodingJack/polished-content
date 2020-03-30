/**
 * Internal dependencies.
 */
import PolishedContentSettings from './settings';
import { namespace } from '../../../../shared/js/data';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { registerPlugin } = wp.plugins;

const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;

const sidebar = `${ namespace }-sidebar`;

registerPlugin( sidebar, {
	icon: 'text',
	render: () => {
		return (
			<>
				<PluginSidebarMoreMenuItem target={ sidebar }>
					{ __( 'Polished Content Settings', 'polished-content' ) }
				</PluginSidebarMoreMenuItem>
				<PluginSidebar
					name={ sidebar }
					title={ __(
						'Polished Content Settings',
						'polished-content'
					) }
				>
					<PolishedContentSettings />
				</PluginSidebar>
			</>
		);
	},
} );
