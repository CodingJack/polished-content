# Polished Content
WordPress Gutenberg Block Animation Builder w/ Intersection Observer

[Front-end Demo](http://www.codingjack.com/polished-content/) | [Admin Screenshots](http://www.codingjack.com/polished-content-screenshots/)

![Screenshot of the Plugin's Animation Editor, editing a post in WordPress](/admin/screenshots/dist/img/git-screenshot.jpg)

## Description

Polished Content is a WordPress Plugin that allows you to add robust animations to existing Gutenberg Blocks.  Animations will only ever occur when the content is in view, and can be repeated and reversed as the page scrolls.  The animations can then happen as smooth, "singular" animations or can be connected to the page's scroll position for a more dynamic experience.  

In addition to the several standard animation options such as movements, zooms, blurs, you also have full control over duration, easing, scroll behavior, auto-reverse, and many more options to animate your content in different ways.  The plugin includes several built-in preset animations and you can also create your own.  And animations can also be copied and pasted into other blocks using the built-in right-click menu.  To get an idea of all the possibilities, check out the [Admin Screenshots](http://www.codingjack.com/polished-content-screenshots/).

Polished Content uses the HTML5 [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to help determine when and how content should be animated, and also includes an IE/Edge fallback for animating the CSS clip-path.  In addition, animations can be enabled/disabled individually on different screen widths.

## Getting Started

[Download](https://github.com/CodingJack/polished-content/raw/master/polished-content.zip) the plugin and then [upload and install](https://www.wpbeginner.com/beginners-guide/step-by-step-guide-to-install-a-wordpress-plugin-for-beginners/) the plugin to your WordPress site.

## Built With / Techology Used

* [Greensock](https://greensock.com/)
* [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

## Authors

* **Jason McElwaine** - *Initial work* - [CodingJack](http://www.codingjack.com)

## License

* This original work in this project is licensed under [GPL-2.0+](https://opensource.org/licenses/GPL-2.0)
* The included Greensock scripts are licensed using its [Standard License](https://greensock.com/standard-license/)
* The [Intersection Observer Polyfill](https://www.npmjs.com/package/intersection-observer) included is licensed under [W3C License](https://opensource.org/licenses/W3C)

## Supported Blocks

Polished Content includes support for several 3rd party Custom Block plugins.  All of the available blocks that can be animated are listed in [this screenshot](https://github.com/CodingJack/polished-content/raw/master/admin/screenshots/dist/img/screen_15.jpg).  Support for additional blocks can be manually added to the "blocks.php" file inside the main admin folder.

## Considerations

All of the built-in supported blocks have been tested and will work out of the box in most cases.  But not all options will play nice 100% of the time, as blocks are wrapped in an animated wrapper which can sometimes lead to layout/positioning issues depending on the particular animation.  However, the animation editor has several "helper" options in the "formatting" section that resolve most issues, including an option to add a custom Class to the animation's wrapper which can then be targetted in the "Custom CSS" section in the plugin's main settings page.

## Not limited to Gutenberg Blocks

The Gutenberg editor is required to create an animation, but inside the editor there's an option to copy the animation's classes.  And then those classes can be added to any of your WP site's content (see the "Custom JS" section in the plugin's settings page for an example).  However, the plugin's script will normally only load if a page/post's "the_content()" contains an element with the expected animation classes, so if you add the classes to your site's header or footer you will need to set the plugin's "Script Loading" option to "Global" in the plugin's main settings page.  

## Acknowledgments

Hats off the the creators of [Gutenberg](https://github.com/WordPress/gutenberg) and [Greensock](https://greensock.com/) for allowing this plugin to exist.  They are the real heroes of Polished Content.
