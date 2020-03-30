<?php
/**
 * Plugin Name: Polished Content
 * Plugin URI: https://github.com/CodingJack/polished-content
 * Description: Add customized scroll-based animations to your Gutenberg Blocks 
 * Author: CodingJack
 * Author URI: http://www.codingjack.com
 * Version: 1.1.0
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
 
if ( ! is_admin() ) {
	require_once plugin_dir_path( __FILE__ ) . 'front/front.php';
} else {
	require_once plugin_dir_path( __FILE__ ) . 'admin/admin.php';
}

require_once plugin_dir_path( __FILE__ ) . 'shared/post_meta.php';

/*
 * @desc remove database options when the plugin is uninstalled
 * @since 1.0.0
*/
function polished_content_uninstall() {
	delete_option( 'polished_content_presets' );
	delete_option( 'polished_content_defaults' );
}

/*
 * @desc add custom links to plugin's listing on plugins page
 * @since 1.0.0
*/
function polished_content_settings_link( $links ) {
    $settings_link = '<a href="options-general.php?page=polished-content%2Fadmin%2Fadmin.php">' . __( 'Settings' ) . '</a>';
    array_push( $links, $settings_link );
  	return $links;
}

/*
 * @desc plugin activation hook that adds default options to database and registers uninstall hook
 * @since 1.0.0
*/
function polished_content_activate() {
	$defaults = get_option( 'polished_content_defaults' );
	
	if ( $defaults === false ) {
		require_once plugin_dir_path( __FILE__ ) . 'shared/defaults.php';
		$defaults = PolishedContentDefaults::defaults();
		update_option( 'polished_content_defaults', json_encode( $defaults ) );
	}
    
	register_uninstall_hook( __FILE__, 'polished_content_uninstall' );
}

register_activation_hook( __FILE__, 'polished_content_activate' );
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'polished_content_settings_link' );
