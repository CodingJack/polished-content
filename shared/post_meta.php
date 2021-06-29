<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

if ( !class_exists( 'PolishedContentPostMeta' ) ) {

  final class PolishedContentPostMeta {
    
    private static $instance = null;
    
    private $metas = array(
      '_polished_content_meta_added' => 'boolean',
      '_polished_content_disable_all' => 'boolean',
      '_polished_content_override_all' => 'boolean',
      '_polished_content_scroll_type' => 'string',
      '_polished_content_percentage_in' => 'number',
      '_polished_content_percentage_in_stagger' => 'number',
      '_polished_content_reverse' => 'boolean',
      '_polished_content_scroll_stagger' => 'boolean',
      '_polished_content_desktop' => 'boolean',
      '_polished_content_laptop' => 'boolean',
      '_polished_content_tablet' => 'boolean',
      '_polished_content_smartphone' => 'boolean'
    );
    
    public static function instance() {
      
      if ( is_null( self::$instance ) ) {
        self::$instance = new self();
      }

      return self::$instance;
      
    }
    
    public function __construct() {
      
      add_action( 'init', array( $this, 'register_post_meta' ) );
      
    }
    
    public function register_post_meta() {
      
      foreach( $this->metas as $meta => $type ) {
        
        register_meta( 'post', $meta, array(
          'show_in_rest' => true,
          'type' => $type,
          'single' => true,
          'auth_callback' => function() { 
            return current_user_can( 'edit_posts' );
          }
        ) );
        
      }	
    }
  }
  
  PolishedContentPostMeta::instance();
  
}
