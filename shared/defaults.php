<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( !class_exists( 'PolishedContentDefaults' ) ) {

	final class PolishedContentDefaults {
		
		private static $instance = null;

		public static function instance() {
			
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}
		
		/*
		 * @returns current default settings for thue plugin
		 * @since 1.0.0
		*/
		public static function getDefaults() {
			
			$defaultSettings = get_option( 'polished_content_defaults' );

			if ( $defaultSettings !== false ) {
				try {
					$defaultSettings = json_decode( $defaultSettings, true );
				}
				catch( Exception $e ) {
					$defaultSettings = array();
				}
			}
			
			if ( empty( $defaultSettings ) ) {
				$defaultSettings = self::defaults();
			}
			
			return $defaultSettings;
				
		}
		
		/*
		 * @returns all original default settings for the plugin
		 * @since 1.0.0
		*/
		public static function defaults() {
			
			require_once plugin_dir_path( __FILE__ ) . '../admin/presets.php';

			$defaults = array(
				'panelOpen' => false,
				'inheritMargins' => false,
				'addOverflow' => true,
				'scriptLoading' => 'default',
				'defaultPresets' => PolishedContentPresets::defaults(),
				'viewportWidths' => array( 1240, 1024, 768, 480 ),
				'userRoles' => array('editor', 'author', 'contributor'),
				'allowedBlocks' => array(
					'core/heading', 
					'core/paragraph', 
					'core/image',
					'core/cover',
					'core/gallery',
					'core/list',
					'core/quote',
					'core/column',
					'core/video',
					'core/button',
					'core/columns',
					'core/media-text',
					'core/separator',
					'core/group'
				),
				'overrideFront' => false,
				'customJS' => '%2F*%0A%20*%20%20Add%20class%20name%20settings%20copied%20from%20the%20animation%20editor%20to%20any%20selector%20on%20the%20page%0A%20*%20%20When%20adding%20animations%20this%20way%20make%20sure%20to%20set%20the%20%22Plugin%20Script%20Loading%22%20option%0A%20*%20%20in%20the%20%22Settings%2FPresets%22%20tab%20above%20is%20set%20to%20%22Global%22%0A%2F*%0A%2F*%0A%20*%20polishedContent.add(%22.footer%22%2C%20%22pcxOpacity_0%20pcxZoom_0%22)%3B%0A*%2F',
				'customCSS' => '%2F*%0A%2F%2F%20outer%20wrapper%0A.pcx-wrap%20%7Bmargin%3A%2030px%200%7D%0A%0A%2F%2F%20outer%20wrapper%20with%20%22Content%20Mask%22%20applied%20to%20the%20animation%0A.pcx-mask%20%7Bmargin%3A%2030px%200%7D%0A%0A%2F%2F%20inner%20wrapper%3A%0A%2F%2F%20this%20is%20the%20element%20that%20gets%20animated%0A.pcx-inner%20%7Bposition%3A%20relative%7D%0A%0A%2F%2F%20your%20block%3A%0A.pcx-inner%20%3E%20*%20%7Bdisplay%3A%20flex%7D%0A*%2F%20'
			);

			return array_merge( $defaults, self::frontDefaults() );
				
		}
		
		/*
		 * @returns original default settings applicable to the frontend
		 * @since 1.0.0
		*/
		private static function frontDefaults( $front = false ) {
			
			if ( $front ) {
				$viewports = array(
					'pcxDesktop' => true,
					'pcxTablet' => true,
					'pcxLaptop' => true,
					'pcxSmartphone' => true
				);
			} else {
				$viewports = array( 'viewportsEnabled' => array( true, true, true, true ) );
			}
			
			$defaults = array(
				'pcxScrollStagger' => false,
				'pcxScrollType' => 'in',
				'pcxPercentageIn' => 25,
				'pcxPercentageInStagger' => 15,
				'pcxReverse' => false
			);
			
			return array_merge( $defaults, $viewports );
		
		}
		
		/*
		 * @desc overrides here are set in the post's settings panel
		 * @returns post overrides for the front-end
		 * @since 1.0.0
		*/
		public static function getPostOverrides() {
			
			global $post;
			$overrides = array();
			$prefix = '_polished_content_';
			
			$metas = array(
				$prefix . 'scroll_type',
				$prefix . 'percentage_in',
				$prefix . 'percentage_in_stagger',
				$prefix . 'scroll_stagger',
				$prefix . 'desktop',
				$prefix . 'laptop',
				$prefix . 'tablet',
				$prefix . 'smartphone'
			);
			
			foreach( $metas as $meta ) {
				$key = str_replace( '_polished_content_', '', $meta ); 
				$key = str_replace( '_', '', ucwords( $key, '_' ) );
				$overrides[ 'pcx' . $key ] = $post->{ $meta };
			}
			
			return $overrides;
			
		}
		
		/*
		 * @returns user override settings that are printed on the frontend
		 * @since 1.0.0
		*/
		public static function getFrontOverrides( $defaults, $fromPost = false ) {
			
			if ( $fromPost ) {
				$overrides = self::getPostOverrides();
			} else {
				$overrides = $defaults;
				$screens = array( 'pcxDesktop', 'pcxTablet', 'pcxLaptop', 'pcxSmartphone' );
				$viewports = $overrides['viewportsEnabled'];
				$viewports = array_combine( $screens, $viewports );
				$overrides = array_merge( $overrides, $viewports );
			}
			
			$frontDefaults = self::frontDefaults( true );
			
			foreach( $overrides as $key => $override ) {
				if ( array_key_exists( $key, $frontDefaults ) ) {
					$frontDefaults[$key] = $override;
				}
			}
			
			return $frontDefaults;
		}
		
		public function __construct() {}
		
	}
	
	PolishedContentDefaults::instance();
	
}
