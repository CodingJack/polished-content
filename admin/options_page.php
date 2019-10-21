<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/*
 * @desc the HTML for the options page.  
 * @since 1.0.0
*/
if ( !class_exists( 'PolishedContentSettings' ) ) {

	final class PolishedContentSettings {
		
		private static $instance = null;

		public static function instance() {
			
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}
		
		/*
		 * @desc converts 3 letter hex values to 6
		 * @since 1.0.0
		*/
		private function fullhex( $hex ) {
			
			$hex = trim( str_replace( '#', '' , $hex ) );
			if ( strlen( $hex ) === 3 ) {
			    $hex[5] = $hex[2]; 
			    $hex[4] = $hex[2]; 
			    $hex[3] = $hex[1]; 
			    $hex[2] = $hex[1]; 
			    $hex[1] = $hex[0]; 
			}
			return $hex;
		}
		
		/*
		 * @desc determines text color based on the background color
		 * @since 1.0.0
		*/
		private function rgba( $hex ){
			
			$hex = $this->fullhex( $hex );
			$hex = trim( str_replace( '#', '' , $hex ) );
			$r = hexdec( substr( $hex, 0, 2 ) );
	      	$g = hexdec( substr( $hex, 2, 2 ) );
	      	$b = hexdec( substr( $hex, 4, 2 ) );
			
	      	return $r * 0.299 + $g * 0.587 + $b * 0.114 > 150 ? '#23282d' : '#fff';
		}
		
		/*
		 * @desc verifies that the global $_wp_admin_css_colors contains the user's color scheme as expected
		 * @since 1.0.0
		*/
		private function verify_scheme( $scheme ) {
			
			global $_wp_admin_css_colors;
			
			return $scheme !== false && 
				   is_string( $scheme ) && 
			       is_array( $_wp_admin_css_colors ) ? $_wp_admin_css_colors[$scheme] : false;
			
		
		}
		
		/*
		 * @desc attempts to get the primary color of the current user's color scheme
		 * @since 1.0.0
		*/
		private function verify_color( $colors ) {
		
			return is_array( $colors['colors'] ) && 
				   is_string( $colors['colors'][1] ) &&
				   !empty( $colors['colors'][1] ) ? $colors['colors'][1] : '#FFF';
		
		}
		
		/*
		 * @desc Attempt to set the admin colors to the current user's color scheme
		 * @since 1.0.0
		*/
		private function admin_colors() {
			
			$scheme = get_user_option( 'admin_color' );
			$colors = $this->verify_scheme( $scheme );
			
			if ( $colors ) {
				$colors = (array)$colors;
				
				if ( !empty( $colors ) ) {
					switch( $scheme ) {
						case 'light':
							$background = '#888888';
						break;
						case 'fresh':
							$background = '#32373c';
						break;
						default:
							$background = $this->verify_color( $colors );
						// end default
					}
					$len = strlen( $background );
					$hex_len = $len === 4 || $len === 7;
					
					if ( $hex_len && strpos( $background, '#' ) !== false ) {
						$fontcolor = $this->rgba( $background );
						
						?>
						<style type="text/css">
							.polished-content-colors {
								background: <?php echo $background; ?> !important; 
								color: <?php echo $fontcolor; ?> !important;
							}
						</style>
						<?php
						
					}
				}
			}
		}
		
		/*
		 * @desc the HTML for the options page.  Form elements are added/controlled via the React app
		 * @since 1.0.0
		*/
		public function __construct() {
			
			$this->admin_colors();
			
			?>
			<div id="polished-content-wrapper">
				<form method="post" action="options.php">
					<header>
						<h1 style="display: flex; align-items: center">
							<span class="dashicons dashicons-text" style="margin-right: 10px"></span><?php _e( 'Polished Content Settings', 'polished-content' ); ?>
						</h1>
						<p><?php _e( 'Modify plugin/preset defaults and choose which block-types should be enabled for the plugin', 'polished-content' ); ?></p>
						<?php submit_button(); ?>
					</header>
					<div class="wrap components-modal__content">
						<h2 style="display: none"></h2>
						<?php settings_fields( 'polished-content-option-group' ); ?>
						<?php do_settings_sections( 'polished-content-option-group' ); ?>
						
						<div id="polished-content-settings"><!-- React App Here --></div>
						
						<div class="clear"></div>
						<?php submit_button(); ?>
					</div>
				</form>
			</div>
		<?php
		}
		
	}
	
	PolishedContentSettings::instance();
	
}
