<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'PolishedContentFront' ) ) {
	
	final class PolishedContentFront {
	
		private static $instance = null;
		private $version = '1.1.0';
		private $globalScript;
		private $scriptUrl;
		private $defaults;
		private $post;

		public static function instance() {
			
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}
		
		public function __construct() {
			
			require_once plugin_dir_path( __FILE__ ) . '../shared/defaults.php';
			
			$this->defaults = PolishedContentDefaults::getDefaults();
			$this->globalScript = $this->defaults[ 'scriptLoading' ] === 'global';
			$this->scriptUrl = plugins_url( 'dist/js/polished-content.min.js', __FILE__ );
			
			if ( $this->globalScript ) {
				add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
				add_action( 'wp_footer', array( $this, 'add_footer_script' ), 21 );
			}
			
			add_action( 'wp_head', array( $this, 'inline_style' ), 999 );
			add_filter( 'the_content', array( $this, 'filter_content' ) );
		}
		
		/*
		 * @desc inline CSS for the "wp_head" action
		 * @since 1.0.0
		*/
		private function inlineCSS() {
			
			return '
				polished-content{display:block;position:relative}
				[class*="polished-content"]{visibility:hidden}
				.pcx-overflow,.pcx-overflow body{overflow-x:hidden !important}
				.pcx-overflow body{height:auto !important;overflow-y:hidden !important}
				.pcx-mask{overflow:hidden !important}
				.pcx-inherit>*{margin:0 !important}
				.pcx-inline{display:table !important}
				.pcx-align{margin-left:auto !important}
				.pcx-center{margin-right:auto !important}
				.pcx-inner:after{content:"";clear:both;display:table}
				.pcx-float-left{float:left}
				.pcx-float-right{float:right}
				.pcx-transform{transform-origin:center !important}
				[class*="pcx-float-"]>.pcx-inner>*{float:none !important}
				.pcx-chars{position:relative !important;left:50%;transform:translateX(-50%)}
				.pcx-chars>.pcx-inner *{letter-spacing:inherit !important;white-space:nowrap !important}
			';
		}
		
		/*
		 * @desc enqueues the main script if user option "Script Loading" is set to "global"
		 * @since 1.0.0
		*/
		public function enqueue_scripts() {
			
			wp_enqueue_script(
				'polished-content-js', 
				$this->scriptUrl,
				array(),
				$this->version,
				true 
			);
			
		}
		
		/*
		 * @desc Add front-end styles to the page
		 * @since 1.0.0
		*/
		public function inline_style() {

			global $post;
			$disableAll = false;
			
			if ( isset ( $post ) ) {
				$disableAll = $post->_polished_content_disable_all;
			}
			
			if ( ! $disableAll ) {
				$viewportWidths = $this->defaults['viewportWidths'];
				
				$css = $this->inlineCSS();
				$views = array( 'Desktop', 'Laptop', 'Notebook', 'Smartphone' );
				
				foreach( $viewportWidths as $index => $width ) {
					$css .= '@media only screen and (min-width:' . $width . 'px){.pcx' . $views[$index] . '_false{visibility:visible !important}}';
				}
				
				echo '<style type="text/css" id="polished-content-css">';
				echo preg_replace( '/\r|\n|\t/', '', $css);
				echo '</style>' . "\n";
			}
			
			if ( $this->globalScript ) {
				echo $this->customCSS();
			}
		
		}
		
		/*
		 * @desc get string representation of allowed blocks
		 * @since 1.0.0
		*/
		private function allowedBlocks() {
			
			require_once plugin_dir_path( __FILE__ ) . '../shared/filter_blocks.php';
			
			$allowedBlocks = $this->defaults['allowedBlocks'];
			$allowedBlocks = implode( ' ', $this->defaults['allowedBlocks'] );
			$allowedBlocks = PolishedContentFilterBlocks::filterSupportedFront( $allowedBlocks );
			$allowedBlocks = str_replace( '/', '-', $allowedBlocks );
			
			return trim( $allowedBlocks );
			
		}
		
		/*
		 * @desc get string representation of viewport width numbers
		 * @since 1.0.0
		*/
		private function viewportWidths() {
			
			$viewportWidths = implode( ',', $this->defaults['viewportWidths'] );
			return trim( $viewportWidths );
			
		}
		
		/*
		 * @desc checks if front-end settings should be overridden
		 * @since 1.0.0
		*/
		private function overrides( $content ) {
			
			global $post;
			
			$overrides = '';
			$globalOverride = $this->defaults['overrideFront'];
			$postOverride = $post->_polished_content_override_all;
			
			if ( $postOverride || $globalOverride ) {
				
				if ( $globalOverride ) {
					$frontDefaults = PolishedContentDefaults::getFrontOverrides( $this->defaults );
				} else if ( $postOverride ) {
					$frontDefaults = PolishedContentDefaults::getFrontOverrides( false, true );
				}
				
				$views = array( 'Desktop', 'Tablet', 'Laptop', 'Smartphone' );
				$classes = '';
				
				foreach( $views as $view ) {
					$prefix = 'pcx' . $view;
					$content = str_replace( ' ' . $prefix . '_false', '', $content );
					
					if ( ! $frontDefaults[$prefix] ) {
						$classes .= $prefix . '_false ';
					}
					unset( $frontDefaults[$prefix] );
				}

				$content = str_replace( 'polished-content_', $classes . 'polished-content_', $content );
				$overrides = json_encode( $frontDefaults );
			}
			
			return array(
				'overrides' => $overrides,
				'content' => $content
			);
			
		}
		
		/*
		 * @desc removes class names from content if the block is not supported
		 *       either by the user's choice or if a 3rd party plugin has been disabled
		 * @since 1.0.0
		*/
		private function removeDisabledBlocks( $allowedBlocks, $content ) {
			
			$allowedBlocks = explode( ' ', $allowedBlocks );
			preg_match_all("/\bpolished-content_(?=\S*['-])([a-zA-Z'-]+)/", $content, $blocks);
			
			if ( is_array( $blocks ) && is_array( $blocks[0] ) && is_array( $blocks[1] ) ) {
				$classes = $blocks[0];
				$blocks = $blocks[1];

				foreach( $blocks as $index => $block ) {
					if ( ! in_array( $block, $allowedBlocks ) ) {
						$content = str_replace( $classes[$index] . ' ', '', $content );
					}
				}
			}
			
			return $content;
			
		}
		
		/*
		 * @desc removes plugin classes when animations are disabled for any given page
		 * @since 1.0.0
		*/
		private function removeAllClasses( $content ) {
			
			preg_match_all("/\bpcx([a-zA-Z0-9'\w|\-]+)/", $content, $blocks);
			
			if ( is_array( $blocks ) && is_array( $blocks[0] ) && is_array( $blocks[1] ) ) {
				$classes = $blocks[0];
				$blocks = $blocks[1];

				foreach( $blocks as $index => $block ) {
					$content = str_replace( ' ' . $classes[ $index ], '', $content );
				}
			}
			
			$content = $this->removeDisabledBlocks( array(), $content );
			return str_replace( ' class=""', '', $content );
			
		}
		
		private function sanitizeCode( $code ) {
			
			$code = rawurldecode(  $code );
			$code = preg_replace( '!/\*[^*]*\*+([^/][^*]*\*+)*/!' , '' , $code );
			$code = preg_replace( '/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/', '', $code);
			
			return trim( $code );

		}
		
		/*
		 * @desc adds any custom CSS to what gets printed
		 * @since 1.0.0
		*/
		private function customCSS() {
			
			$css = $this->defaults[ 'customCSS' ];
			if ( $css ) {
				$css = $this->sanitizeCode( $css );
				if ( ! empty( $css ) ) {
					return '<style type="text/css">' . $css . '</style>';
				}
			}
			
			return '';
		}
		
		/*
		 * @desc adds any custom JavaScript to what gets printed
		 * @since 1.0.0
		*/
		private function customJS() {
			
			$js = $this->defaults[ 'customJS' ];
			if ( $js ) {
				$js = $this->sanitizeCode( $js );
				if ( ! empty( $js ) ) {
					return 'try{' . $js . '} catch(e) {}';
				}
			}
			
			return '';
		}
		
		/*
		 * @desc prints the init script in the footer if the main script is being loaded globally
		 * @since 1.0.0
		*/
		public function add_footer_script() {
			
			$script = '<script type="text/javascript">(function() {';
			$script .= 'window.addEventListener("DOMContentLoaded", function() {';
			$script .= 'if(!window.polishedContentScript && typeof polishedContentGlobals !== "undefined" && window.polishedContent) {';
			$script .= $this->customJS();
			$script .= '
				function trueFalse(val) {
					return val === "true" || val === true || val === 1 || val === "1" ? true : false;
				};
				polishedContent.run({
					overrides: polishedContentGlobals.overrides,
					addOverflow: trueFalse(polishedContentGlobals.addOverflow),
					inheritMargins: trueFalse(polishedContentGlobals.inheritMargins),
					viewportWidths: polishedContentGlobals.viewportWidths.map(function(view) {return parseInt( view, 10 );})
				});	
			}})})();';
			
			echo preg_replace( '/\r|\n|\t/', '', $script )  . '</script>';
		
		}
		
		public function filter_content( $content ) {
			if ( ! is_main_query() ) {
				return $content;
			}
			
			$isSingle = is_singular();
			$isGlobal = $this->globalScript;
			
			if ( ! $isGlobal && ! $isSingle ) {
				return $content;
			}
			
			$hasAnimation = strpos( $content, 'polished-content' ) !== false && strpos( $content, 'pcx' ) !== false;
			$passesCheck = $isGlobal || $hasAnimation;
			
			if ( $passesCheck ) {
				
				global $post;
				$disableAll = $post->_polished_content_disable_all;
				
				if ( $isGlobal || ! $disableAll ) {
					
					$customJS = $this->customJS();
					$filtered = $this->overrides( $content );
					
					$overrides = $filtered['overrides'];
					$content = $filtered['content'];
					
					$viewportWidths = $this->viewportWidths();
					$allowedBlocks = $this->allowedBlocks();
					$content = $this->removeDisabledBlocks( $allowedBlocks, $content );
					
					$addOverflow = $this->defaults['addOverflow'] ? 'true' : 'false';
					$inheritMargins = $this->defaults['inheritMargins'] ? 'true' : 'false';
					
					if ( ! $isGlobal ) {
						wp_enqueue_script(
							'polished-content-js', 
							$this->scriptUrl,
							array(),
							$this->version,
							true 
						);
					
						/*
						 * for sites that get all page content via ajax, the enqueued script above
						 * will not print unless the script loading is set to "global"
						 * in those cases the "window.polishedContent" will be undefined,
						 * and we will simply inject the script manually in the "else" block below
						 * will also work the same if the theme doesn't call the_footer()
						*/
						$script = $this->customCSS();
						$script .= '
							<script type="text/javascript">
								(function(){
									function onReady(){
										var settings={
											viewportWidths:[' . $viewportWidths . '],
											overrides:' . "'" . $overrides . "'" . ',
											addOverflow:' . $addOverflow . ',
											inheritMargins:' . $inheritMargins . '
										};
										if (window.polishedContent !== undefined){
											' . $customJS . '
											polishedContent.run(settings);
										} else{
											var script=document.createElement("script");
											script.type="text/javascript";
											script.onload=function(){' . $customJS . 'polishedContent.run(settings);};
											script.src="' . $this->scriptUrl . '?' . $this->version . '";
											document.body.appendChild(script);
										}
									}
									if (document.readyState==="loading")window.addEventListener("DOMContentLoaded",onReady);
									else onReady();
								})();
								window.polishedContentScript = true;
							</script>
						';
						
						$content .= preg_replace( '/\r|\n|\t/', '', $script);
						
					} else {
						
						wp_localize_script(
							'polished-content-js',
							'polishedContentGlobals', 
							array(
								'viewportWidths' => explode( ',', $viewportWidths ),
								'overrides' => $overrides,
								'addOverflow' => $addOverflow,
								'inheritMargins' => $inheritMargins,
								'customJS' => $customJS
							)
						);
						
					}
					
					remove_filter( 'the_content', array( $this, 'filter_content' ) );
				}
				
				if ( $isSingle && $disableAll ) {
					$content = $this->removeAllClasses( $content );
				}
				
			}
			
			return $content;
			
		}
		
	}
	
	PolishedContentFront::instance();
	
}
