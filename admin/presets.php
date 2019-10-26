<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( !class_exists( 'PolishedContentPresets' ) ) {

	final class PolishedContentPresets {
		
		private static $instance = null;
		
		/*
		 * @desc a list of the default presets.  Used for the initial database options
		 * @since 1.0.0
		*/
		public static function defaults() {
			
			return array(
				'PcxWipeLeft',
				'PcxWipeRight',
				'PcxMoveBottom',
				'PcxMoveRight',
				'PcxMoveLeft',
				'PcxSlideInRight',
				'PcxSlideInLeft',
				'PcxHeadlineMotion',
				'PcxFlipHorizontal',
				'PcxFlipVertical',
				'PcxGrayscaleBlur',
				'PcxZoomFade',
				'PcxZoomInvert',
				'PcxZoomBottom',
				'PcxZoomRight',
				'PcxZoomLeft',
				'PcxReverseFlip',
				'PcxPhantomZone',
				'PcxTextDust',
				'PcxSlidingDoors',
				'PcxOpenSesame'
			);
			
		}

		public static function instance() {
			
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}
		
		public function __construct() {}
		
	}
	
	PolishedContentPresets::instance();

}
