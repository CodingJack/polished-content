<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'PolishedContentAdmin' ) ) {

	final class PolishedContentAdmin {
		
		private static $instance = null;
		private $version = '1.1.0';
		
		public static function instance() {
			
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
			
		}
		
		public function __construct() {
			
			add_action( 'admin_menu', array( $this, 'add_menu' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_settings_scripts' ) );
			add_action( 'wp_ajax_polished_content', array( $this, 'save_remove_preset' ) );
			
			// a high priority is needed for 3rd party plugins for the registerBlockType filter
			add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_scripts' ), 1 );
			
		}
		
		/*
		 * @desc Add settings page link to WP Settings menu
		 * @since 1.0.0
		*/
		public function add_menu() {
			
			add_options_page(
				'Polished Content', 
				'Polished Content', 
				'administrator', 
				__FILE__, 
				array( $this, 'load_settings_page' )
			);
			
			add_action( 'admin_init', array( $this, 'register_settings' ) );
			
		}
		
		/*
		 * @desc Output options page HTML
		 * @since 1.0.0
		*/
		public function load_settings_page() {
			require_once plugin_dir_path( __FILE__ ) . 'options_page.php';
		}
		
		/*
		 * @desc Register settings page option group
		 * @since 1.0.0
		*/
		public function register_settings() {
			register_setting( 'polished-content-option-group', 'polished_content_defaults' );
		}
		
		/*
		 * @desc a list of tested blocks that are supported by the plugin
		 * @since 1.0.0
		*/
		private function getDefaults() {
			require_once plugin_dir_path( __FILE__ ) . '../shared/defaults.php';
			return PolishedContentDefaults::getDefaults();
		}
		
		/*
		 * @desc see who can use the plugin
		 * @since 1.0.0
		*/
		private function userCanUse( $defaultSettings ) {
		
			$userCanUse = false;
			$canuse = array( 'administrator' );
			
			if ( is_array( $defaultSettings['userRoles'] ) ) {
				$canuse = array_merge( $canuse, $defaultSettings['userRoles'] );
			}
			
			$user = wp_get_current_user();
			$roles = ( array )$user->roles;
			
			foreach( $canuse as $role ) {
				if ( in_array( $role, $roles ) ) {
					$userCanUse = true;
					break;
				}
			}
			
			return $userCanUse;
		}
		
		/*
		 * @desc updates lists of allowed and supported blocks based on external plugins being active or not
		 * @returns possibly modified allowedBlocks and supportedBlocks arrays
		 * @since 1.0.0
		*/
		private function filterBlocks( $defaultSettings ) {
			
			require_once plugin_dir_path( __FILE__ ) . 'allowed_blocks.php';
			require_once plugin_dir_path( __FILE__ ) . '../shared/filter_blocks.php';
			
			$allowedBlocks = $defaultSettings['allowedBlocks'];
			$allowedBlocks = implode( ' ', $defaultSettings['allowedBlocks'] );
			
			$supportedBlocks = PolishedContentBlocks::supported_blocks();
			$filteredBlocks = PolishedContentFilterBlocks::filterSupportedAdmin( $allowedBlocks, $supportedBlocks );

			return $filteredBlocks;
			
		}
		
		/*
		 * @desc Settings Page scripts
		 * @since 1.0.0
		*/
		public function enqueue_settings_scripts( $hook ) {
			
			if ( strpos( $hook, 'settings_page_polished-content' ) !== false ) {

				$defaultSettings = $this->getDefaults();
				$filteredBlocks = $this->filterBlocks( $defaultSettings );
				$defaultSettings['allowedBlocks'] = explode( ' ', $filteredBlocks['allowedBlocks'] );
				
				wp_enqueue_style( 'wp-components' );
				wp_enqueue_style( 'wp-edit-post' );
				wp_enqueue_style( 'wp-codemirror' );
				wp_enqueue_style( 'wp-i18n' );

				wp_enqueue_style(
					'polished-content-css', 
					plugins_url( 'options_page/dist/css/polished-content.css', __FILE__ ), 
					array( 'wp-components', 'wp-edit-post' ), 
					$this->version
				);

				wp_enqueue_script( 'wp-theme-plugin-editor' );			
				
				wp_enqueue_script(
					'polished-content-settings', 
					plugins_url( 'options_page/dist/js/polished-content.min.js', __FILE__ ),
					array( 'wp-i18n' ), 
					$this->version,
					true 
				);			
				
				wp_localize_script(
					'polished-content-settings',
					'polishedContentGlobals', 
					array(
						'settingsDefaults' => $defaultSettings,
						'supportedBlocks' => $filteredBlocks['supportedBlocks'],
						'screenshotsDirectory' => plugins_url( 'screenshots/dist/', __FILE__ ),
						'codeMirrorCSS' => wp_enqueue_code_editor( array( 'type' => 'text/css' ) ),
						'codeMirrorJS' => wp_enqueue_code_editor( array( 'type' => 'text/javascript' ) )
					)
				);
			}
		}
		
		/*
		 * @desc Block editor scripts
		 * @since 1.0.0
		*/
		public function enqueue_block_scripts() {
			
			$defaultSettings = $this->getDefaults();
			$userCanUse = $this->userCanUse( $defaultSettings );
			
			$filteredBlocks = $this->filterBlocks( $defaultSettings );
			$defaultSettings['allowedBlocks'] = explode( ' ', $filteredBlocks['allowedBlocks'] );
			
			if ( $userCanUse ) {
				
				wp_enqueue_style(
					'polished-content-css', 
					plugins_url( 'block_editor/dist/css/polished-content.css', __FILE__ ), 
					array( 'wp-edit-blocks' ), 
					$this->version
				);
				
				wp_enqueue_script(
					'polished-content-js', 
					plugins_url( 'block_editor/dist/js/polished-content.min.js', __FILE__ ),
					array( 'wp-hooks', 'wp-compose', 'wp-components', 'wp-plugins', 'wp-edit-post', 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-data' ), 
					$this->version,
					false 
				);

				wp_localize_script(
					'polished-content-js',
					'polishedContentGlobals', 
					array(
						'ajaxNonce' => wp_create_nonce( 'polished_content' ),
						'customPresets' => get_option( 'polished_content_presets' ),
						'chunkDirectory' => plugins_url( 'block_editor/dist/js/', __FILE__ ),
						'defaultSettings' => $defaultSettings,
						'initialTab' => 'basics',
						'currentTab' => 'basics',
						'isRtl' => is_rtl()
					)
				);
			}
		}
		
		/*
		 * @desc Ajax custom preset save/delete
		 * @since 1.0.0
		*/
		public function save_remove_preset() {
			
			if ( !isset( $_POST['nonce'] ) || !wp_verify_nonce( $_POST['nonce'], 'polished_content' ) ) {	
				die( __( 'Polished Content Ajax Error', 'polished-content' ) );
			}
			
			$custom_presets = get_option( 'polished_content_presets' );
			if ( $custom_presets === false ) $custom_presets = array();
			
			if ( isset( $_POST['name'] ) && isset( $_POST['addremove'] ) ) {
				
				$title = $_POST['name'];
				$name = preg_replace('/\s+/', '', $title);
				$name = strtolower( $name );
				
				// save a preset
				if ( $_POST['addremove'] === 'add' ) {
					if ( isset( $_POST['settings'] ) ) {
						if ( array_key_exists( $name, $custom_presets ) ) {
							$name .= rand();
						}				
						$custom_presets[$name] = array(
							'title' => $title,
							'settings' => json_decode( stripslashes( $_POST['settings'] ), true )
						);
						update_option( 'polished_content_presets', $custom_presets );
						_e( 'success', 'polished-content' );	
					} else {
						_e( 'preset settings did not exist', 'polished-content' );
					}
				} else {
					if ( array_key_exists( $name, $custom_presets ) ) {
						unset( $custom_presets[$name] );
						update_option( 'polished_content_presets', $custom_presets );
						_e( 'success', 'polished-content' );	
					} else {
						_e( 'settings key did not exist', 'polished-content' );
					}
				}
			} else {
				_e( 'ajax post params not correct', 'polished_content' );
			}
			
			// always die to live another day
			die();
		}
		
	}
	
	PolishedContentAdmin::instance();
	
}
