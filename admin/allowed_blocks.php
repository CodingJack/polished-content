<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

if ( !class_exists( 'PolishedContentBlocks' ) ) {

  final class PolishedContentBlocks {
    
    private static $instance = null;
    
    /*
     * @desc a list of tested blocks that are supported by the plugin
     *       custom blocks added here need to be added to "admin/filter_blocks.php -> custom_blocks"
     * @since 1.0.0
    */
    public static function supported_blocks() {
      
      return array(
      
        'common' => array(
          'core/heading' => __( 'Heading', 'polished-content' ),
          'core/paragraph' => __( 'Paragraph', 'polished-content' ),
          'core/image' => __( 'Image', 'polished-content' ),
          'core/cover' => __( 'Cover', 'polished-content' ),
          'core/gallery' => __( 'Gallery', 'polished-content' ),
          'core/list' => __( 'List', 'polished-content' ),
          'core/quote' => __( 'Quote', 'polished-content' ),
          'core/column' => __( 'Column', 'polished-content' ),
          'core/video' => __( 'Video', 'polished-content' ),
          'core/audio' => __( 'Audio', 'polished-content' ),
          'core/file' => __( 'File', 'polished-content' )
        ),
        'layout' => array(
          'core/button' => __( 'Button', 'polished-content' ),
          'core/columns' => __( 'Columns', 'polished-content' ),
          'core/media-text' => __( 'Media & Text', 'polished-content' ),
          'core/separator' => __( 'Separator', 'polished-content' ),
          'core/group' => __( 'Group', 'polished-content' )
        ),
        'formatting' => array(
          'core/code' => __( 'Code', 'polished-content' ),
          'core/preformatted' => __( 'Preformatted', 'polished-content' ),
          'core/pullquote' => __( 'Pullquote', 'polished-content' ),
          'core/table' => __( 'Table', 'polished-content' ),
          'core/verse' => __( 'Verse', 'polished-content' )
        ),
        'embed' => array(
          'core/embed' => __( 'Embed', 'polished-content' ),
          'core-embed/twitter' => __( 'Twitter', 'polished-content' ),
          'core-embed/youtube' => __( 'YouTube', 'polished-content' ),
          'core-embed/facebook' => __( 'Facebook', 'polished-content' ),
          'core-embed/instagram' => __( 'Instagram', 'polished-content' ),
          'core-embed/wordpress' => __( 'WordPress', 'polished-content' ),
          'core-embed/soundcloud' => __( 'SoundCloud', 'polished-content' ),
          'core-embed/spotify' => __( 'Spotify', 'polished-content' ),
          'core-embed/flickr' => __( 'Flickr', 'polished-content' ),
          'core-embed/vimeo' => __( 'Vimeo', 'polished-content' ),
          'core-embed/animoto' => __( 'Animoto', 'polished-content' ),
          'core-embed/cloudup' => __( 'Cloudup', 'polished-content' ),
          'core-embed/collegehumor' => __( 'CollegeHumor', 'polished-content' ),
          'core-embed/crowdsignal' => __( 'Crowdsignal', 'polished-content' ),
          'core-embed/dailymotion' => __( 'Dailymotion', 'polished-content' ),
          'core-embed/hulu' => __( 'Hulu', 'polished-content' ),
          'core-embed/imgur' => __( 'Imgur', 'polished-content' ),
          'core-embed/issuu' => __( 'Issuu', 'polished-content' ),
          'core-embed/kickstarter' => __( 'Kickstarter', 'polished-content' ),
          'core-embed/meetup-com' => __( 'Meetup.com', 'polished-content' ),
          'core-embed/mixcloud' => __( 'Mixcloud', 'polished-content' ),
          'core-embed/polldaddy' => __( 'Polldaddy', 'polished-content' ),
          'core-embed/reddit' => __( 'Reddit', 'polished-content' ),
          'core-embed/reverbnation' => __( 'ReverbNation', 'polished-content' ),
          'core-embed/screencast' => __( 'Screencast', 'polished-content' ),
          'core-embed/scribd' => __( 'Scribd', 'polished-content' ),
          'core-embed/slideshare' => __( 'Slideshare', 'polished-content' ),
          'core-embed/smugmug' => __( 'SmugMug', 'polished-content' ),
          'core-embed/speaker' => __( 'Speaker', 'polished-content' ),
          'core-embed/speaker-deck' => __( 'title', 'polished-content' ),
          'core-embed/ted' => __( 'TED', 'polished-content' ),
          'core-embed/tumblr' => __( 'Tumblr', 'polished-content' ),
          'core-embed/videopress' => __( 'VideoPress', 'polished-content' ),
          'core-embed/wordpress-tv' => __( 'WordPress.tv', 'polished-content' ),
          'core-embed/amazon-kindle' => __( 'Amazon Kindle', 'polished-content' )
        ),
        'ultimate_Addons' => array(
          'uagb/advanced-heading' => __( 'Advanced Heading', 'polished-content' ),
          'uagb/section' => __( 'Section', 'polished-content' ),
          'uagb/buttons' => __( 'Multi Buttons', 'polished-content' ),
          'uagb/team' => __( 'Team', 'polished-content' ),
          'uagb/social-share' => __( 'Social Share', 'polished-content' ),
          'uagb/google-map' => __( 'Google Map', 'polished-content' ),
          'uagb/icon-list' => __( 'Icon List', 'polished-content' ),
          'uagb/content-timeline' => __( 'Content Timeline', 'polished-content' ),
          'uagb/column' => __( 'Column', 'polished-content' ),
          'uagb/columns' => __( 'Advanced Columns', 'polished-content' ),
          'uagb/blockquote' => __( 'Blockquote', 'polished-content' ),
          'uagb/marketing-button' => __( 'Marketing Button', 'polished-content' ),
          'uagb/table-of-contents' => __( 'Table of Contents', 'polished-content' )
        ),
        'kadence' => array(
          'kadence/spacer' => __( 'Spacer/Divider', 'polished-content' ),
          'kadence/advancedbtn' => __( 'Advanced Button', 'polished-content' ),
          'kadence/rowlayout' => __( 'Row Layout', 'polished-content' ),
          'kadence/column' => __( 'Column', 'polished-content' ),
          'kadence/icon' => __( 'Icon', 'polished-content' ),
          'kadence/tabs' => __( 'Tabs', 'polished-content' ),
          'kadence/tab' => __( 'Tab', 'polished-content' ),
          'kadence/infobox' => __( 'Info Box', 'polished-content' ),
          'kadence/accordion' => __( 'Accordion', 'polished-content' ),
          'kadence/pane' => __( 'Pane', 'polished-content' ),
          'kadence/iconlist' => __( 'Icon List', 'polished-content' ),
          'kadence/testimonials' => __( 'Testimonials', 'polished-content' ),
          'kadence/advancedgallery' => __( 'Advanced Gallery', 'polished-content' )
        ),
        'advanced_Gutenberg' => array(
          'advgb/accordion' => __( 'Accordion', 'polished-content' ),
          'advgb/accordion-item' => __( 'Accordion Item', 'polished-content' ),
          'advgb/accordions' => __( 'Advanced Accordion', 'polished-content' ),
          'advgb/button' => __( 'Advanced Button', 'polished-content' ),
          'advgb/image' => __( 'Advanced Image', 'polished-content' ),
          'advgb/list' => __( 'Advanced List', 'polished-content' ),
          'advgb/table' => __( 'Advanced Table', 'polished-content' ),
          'advgb/video' => __( 'Advanced Video', 'polished-content' ),
          'advgb/contact-form' => __( 'Contact Form', 'polished-content' ),
          'advgb/container' => __( 'Container', 'polished-content' ),
          'advgb/count-up' => __( 'Count Up', 'polished-content' ),
          'advgb/images-slider' => __( 'Images Slider', 'polished-content' ),
          'advgb/login-form' => __( 'Login/Register Form', 'polished-content' ),
          'advgb/map' => __( 'Map', 'polished-content' ),
          'advgb/newsletter' => __( 'Newsletter', 'polished-content' ),
          'advgb/search-bar' => __( 'Search Bar', 'polished-content' ),
          'advgb/social-links' => __( 'Social Links', 'polished-content' ),
          'advgb/summary' => __( 'Summary', 'polished-content' ),
          'advgb/tabs' => __( 'Tabs', 'polished-content' ),
          'advgb/testimonial' => __( 'Testimonial', 'polished-content' )
        ),
        'stackable' => array(
          'ugb/accordion' => __( 'Accordion', 'polished-content' ),
          'ugb/blockquote' => __( 'Blockquote', 'polished-content' ),
          'ugb/button' => __( 'Button', 'polished-content' ),
          'ugb/cta' => __( 'Call to Action', 'polished-content' ),
          'ugb/card' => __( 'Card', 'polished-content' ),
          'ugb/container' => __( 'Container', 'polished-content' ),
          'ugb/count-up' => __( 'Count Up', 'polished-content' ),
          'ugb/divider' => __( 'Divider', 'polished-content' ),
          'ugb/expand' => __( 'Expand / Show More', 'polished-content' ),
          'ugb/feature-grid' => __( 'Feature Grid', 'polished-content' ),
          'ugb/feature' => __( 'Feature', 'polished-content' ),
          'ugb/ghost-button' => __( 'Ghost Button', 'polished-content' ),
          'ugb/header' => __( 'Header', 'polished-content' ),
          'ugb/icon-list' => __( 'Icon List', 'polished-content' ),
          'ugb/image-box' => __( 'Image Box', 'polished-content' ),
          'ugb/notification' => __( 'Notification', 'polished-content' ),
          'ugb/number-box' => __( 'Number Box', 'polished-content' ),
          'ugb/pricing-box' => __( 'Pricing Box', 'polished-content' ),
          'ugb/pullquote' => __( 'Pullquote', 'polished-content' ),
          'ugb/separator' => __( 'Separator', 'polished-content' ),
          'ugb/spacer' => __( 'Spacer', 'polished-content' ),
          'ugb/team-member' => __( 'Team Member', 'polished-content' ),
          'ugb/testimonial' => __( 'Testimonial', 'polished-content' ),
          'ugb/video-popup' => __( 'Video Popup', 'polished-content' )
        ),
        'coBlocks' => array(
          'coblocks/accordion' => __( 'Accordion', 'polished-content' ),
          'coblocks/accordion-item' => __( 'Accordion Item', 'polished-content' ),
          'coblocks/alert' => __( 'Alert', 'polished-content' ),
          'coblocks/author' => __( 'Author', 'polished-content' ),
          'coblocks/buttons' => __( 'Buttons', 'polished-content' ),
          'coblocks/gallery-collage' => __( 'Collage', 'polished-content' ),
          'coblocks/gallery-carousel' => __( 'Carousel', 'polished-content' ),
          'coblocks/click-to-tweet' => __( 'Click to Tweet', 'polished-content' ),
          'coblocks/column' => __( 'Column', 'polished-content' ),
          'coblocks/dynamic-separator' => __( 'Dynamic HR', 'polished-content' ),
          'coblocks/feature' => __( 'Feature', 'polished-content' ),
          'coblocks/features' => __( 'Features', 'polished-content' ),
          'coblocks/food-and-drinks' => __( 'Food & Drinks', 'polished-content' ),
          'coblocks/gist' => __( 'Gist', 'polished-content' ),
          'coblocks/hero' => __( 'Hero', 'polished-content' ),
          'coblocks/highlight' => __( 'Highlight', 'polished-content' ),
          'coblocks/icon' => __( 'Icon', 'polished-content' ),
          'coblocks/logos' => __( 'Logos & Badges', 'polished-content' ),
          'coblocks/map' => __( 'Map', 'polished-content' ),
          'coblocks/gallery-masonry' => __( 'Masonry', 'polished-content' ),
          'coblocks/media-card' => __( 'Media Card', 'polished-content' ),
          'coblocks/pricing-table' => __( 'Pricing Table', 'polished-content' ),
          'coblocks/pricing-table-item' => __( 'Pricing Table Item', 'polished-content' ),
          'coblocks/row' => __( 'Row', 'polished-content' ),
          'coblocks/service' => __( 'Service', 'polished-content' ),
          'coblocks/services' => __( 'Services', 'polished-content' ),
          'coblocks/shape-divider' => __( 'Shape Divider', 'polished-content' ),
          'coblocks/gallery-stacked' => __( 'Stacked', 'polished-content' )
        )
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
  
  PolishedContentBlocks::instance();

}
