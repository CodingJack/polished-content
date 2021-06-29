<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

if ( !class_exists( 'PolishedContentCustomPlugins' ) ) {

  final class PolishedContentFilterBlocks {
    
    private static $instance = null;

    public static function instance() {
      
      if ( is_null( self::$instance ) ) {
        self::$instance = new self();
      }

      return self::$instance;
    }
    
    /*
     * @desc registers custom blocks added to the "admin/allowed_blocks.php" file
     *       the array keys are the block's namespace and the array values are the plugins' main directory/file
     * @since 1.0.0
    */
    private static function custom_blocks() {
      
      return array(
        'ultimate_Addons' => 'ultimate-addons-for-gutenberg/ultimate-addons-for-gutenberg.php',
        'kadence' => 'kadence-blocks/kadence-blocks.php',
        'advanced_Gutenberg' => 'advanced-gutenberg/advanced-gutenberg.php',
        'stackable' => 'stackable-ultimate-gutenberg-blocks/plugin.php',
        'coBlocks' => 'coblocks/class-coblocks.php'
      );
      
    }
    
    /*
     * @desc removes custom blocks if they aren't activated
     * @returns "allowed blocks" list for front-end
     * @since 1.0.0
    */
    public static function filterSupportedAdmin( $allowedBlocks, $supportedBlocks ) {
      
      $customBlocks = self::custom_blocks();
      
      if ( is_array( $customBlocks ) ) {
        foreach( $customBlocks as $slug => $path ) {
          if ( ! is_plugin_active( $path ) ) {	
            unset( $supportedBlocks[$slug] );
          }
        }
      }
        
      $allowedBlocks = explode( ' ', $allowedBlocks );
      $allSupported = array();
      
      foreach( $supportedBlocks as $category ) {
        foreach( $category as $key => $title ) {
          $allSupported[] = $key;
        }
      }
      
      foreach( $allowedBlocks as $key => $block ) {
        if ( ! in_array( $block, $allSupported ) ) {
          unset( $allowedBlocks[$key] );
        }
      }
      
      $allowedBlocks = implode( ' ', $allowedBlocks );
      
      return array(
        'allowedBlocks' => $allowedBlocks,
        'supportedBlocks' => $supportedBlocks
      );
        
    }
    
    /*
     * @desc removes custom blocks if they aren't activated
     * @returns "allowed blocks" list for front-end
     * @since 1.0.0
    */
    public static function filterSupportedFront( $allowedBlocks ) {
      
      include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
      $customBlocks = self::custom_blocks();
      
      if ( is_array( $customBlocks ) ) {
        foreach( $customBlocks as $slug => $path ) {
          
          if ( ! is_plugin_active( $path ) ) {	
            $allowedBlocks = explode( ' ', $allowedBlocks );
          
            foreach( $allowedBlocks as $key => $block ) {
              if ( strpos( $block, $slug . '/' ) !== false ) {
                unset( $allowedBlocks[$key] );
              }
            }
            $allowedBlocks = implode( ' ', $allowedBlocks );
          }
        }
      }

      return $allowedBlocks;
        
    }
    
    public function __construct() {}
    
  }
  
  PolishedContentFilterBlocks::instance();
  
}
