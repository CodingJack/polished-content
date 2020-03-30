/**
 * External dependencies.
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies.
 */

import { originalPresets, whitelisted } from '../../../../shared/js/data';

const { supportedBlocks } = polishedContentGlobals; // eslint-disable-line no-undef

const desktop = __( 'Desktop', 'polished-content' );
const tablet = __( 'Tablet', 'polished-content' );
const laptop = __( 'Laptop', 'polished-content' );
const smartphone = __( 'Smartphone', 'polished-content' );

const viewports1 = { desktop, laptop, tablet, smartphone };
const viewports2 = { desktop, tablet, laptop, smartphone };

const presets = {};
polishedContentGlobals.subMenus = {}; // eslint-disable-line no-undef

originalPresets.shift();
originalPresets.forEach( ( preset ) => {
	const { label, value } = preset;

	presets[ value ] = label;
} );

whitelisted.forEach( ( itm ) => {
	delete presets[ itm ];
} );

/*
 * @desc data that describes the opens page panels
 * @since 1.0.0
 */
const pluginDefaults = [
	{
		title: __( 'Plugin Settings', 'polished-content' ),
		icon: 'admin-generic',
		options: [
			{
				prop: 'panelOpen',
				type: 'toggle',
				label: __( 'Panel Starts Opened', 'polished-content' ),
				description: __(
					'Choose if you want the Animation Panel to be open automatically when a block is selected',
					'polished-content'
				),
			},
			{
				prop: 'viewportWidths',
				type: 'number',
				label: __( 'Viewport Widths', 'polished-content' ),
				description: __(
					'You can enable/disable animations based on a viewport inside the editor.  The numbers here act like {{CSS breakpoints||https://developer.mozilla.org/en-US/docs/Web/CSS/@media||blank}}',
					'polished-content'
				),
				list: viewports1,
				icons: true,
				ranges: {
					min: 240,
					max: 4096,
				},
			},
			{
				prop: 'scriptLoading',
				type: 'select',
				label: __( 'Plugin Script Loading', 'polished-content' ),
				description: __(
					"Load the plugin's script only when a page/post's content has an animation (Default) or on all pages (Global)",
					'polished-content'
				),
				list: {
					default: __( 'Default', 'polished-content' ),
					global: __( 'Global', 'polished-content' ),
				},
			},
			{
				prop: 'userRoles',
				type: 'checkbox',
				label: __( 'User Permissions', 'polished-content' ),
				description: __(
					'Select which admin user-roles will have access to the animation editor',
					'polished-content'
				),
				list: {
					editor: __( 'Editor', 'polished-content' ),
					author: __( 'Author', 'polished-content' ),
					contributor: __( 'Contributor', 'polished-content' ),
				},
			},
		],
	},
	{
		title: __( 'Default Preset Settings', 'polished-content' ),
		icon: 'tag',
		options: [
			{
				prop: 'overrideFront',
				type: 'toggle',
				label: __( 'Front-end Override', 'polished-content' ),
				description: __(
					'Override all animations on the front-end with the settings below.  Useful for batch-testing animations on multiple pages.',
					'polished-content'
				),
			},
			{
				prop: 'pcxScrollType',
				type: 'select',
				label: __( 'Animate Content', 'polished-content' ),
				description: __(
					'Choose if the block should only animate once or if it should animate as it scrolls into and out of view',
					'polished-content'
				),
				list: {
					in: __( 'Once when in view', 'polished-content' ),
					each: __( 'Each time it appears', 'polished-content' ),
					both: __(
						'In and out in both directions',
						'polished-content'
					),
				},
			},
			{
				prop: 'pcxPercentageIn',
				type: 'range',
				label: __( 'Percentage in View', 'polished-content' ),
				list: {
					regular: __( 'Regular Percentage', 'polished-content' ),
				},
				ranges: {
					min: 0,
					max: 50,
				},
			},
			{
				prop: 'pcxPercentageInStagger',
				type: 'range',
				description: __(
					"The block will begin to animate when its inside this percentage of the page's viewport",
					'polished-content'
				),
				list: {
					stagger: __( 'Scroll Stagger %', 'polished-content' ),
				},
				ranges: {
					min: 0,
					max: 25,
				},
			},
			{
				prop: 'pcxReverse',
				type: 'toggle',
				label: __( 'Auto Reverse', 'polished-content' ),
				description: __(
					'Movements, wipes, rotations and skews will be reversed when scrolled up and out of view',
					'polished-content'
				),
			},
			{
				prop: 'pcxScrollStagger',
				type: 'toggle',
				label: __( 'Stagger on Scroll', 'polished-content' ),
				description: __(
					"Choose if the block will animate in relation to the page's scroll position",
					'polished-content'
				),
			},
			{
				prop: 'viewportsEnabled',
				type: 'toggle',
				list: viewports2,
				icons: true,
				subColumns: 2,
				label: __(
					'Enable/Disable Animation for...',
					'polished-content'
				),
			},
		],
	},
	{
		title: __( 'Default Presets', 'polished-content' ),
		icon: 'tag',
		options: [
			{
				prop: 'defaultPresets',
				type: 'checkbox',
				list: presets,
			},
		],
	},
];

const allowedBlocks = [];
for ( const [ title, list ] of Object.entries( supportedBlocks ) ) {
	allowedBlocks.push( {
		title: title.replace( '_', ' ' ),
		suffix: ` ${ __( 'Blocks', 'polished-content' ) }`,
		icon: 'text',
		options: [
			{
				list,
				type: 'checkbox',
				prop: 'allowedBlocks',
			},
		],
	} );
}

const customCSS = [
	{
		title: 'Custom CSS',
		subtype: 'fullpanel',
		icon: 'editor-code',
		options: [
			{
				prop: 'addOverflow',
				type: 'toggle',
				label: __( 'Page Overflow Fix', 'polished-content' ),
				description: __(
					"This is an important option when the page has Block animations that would normally bleed outside the screen, such as movements and transforms.  It adds some CSS to make sure the these animations never interfere with the page's scrollbars.",
					'polished-content'
				),
			},
			{
				prop: 'inheritMargins',
				type: 'toggle',
				label: __( 'Inherit Margins', 'polished-content' ),
				description: __(
					'Animated Blocks are wrapped in a container which may effect content margins.  This option will remove the margins from the Block, allowing the wrapper to inherit them instead.',
					'polished-content'
				),
			},
			{
				prop: 'customCSS',
				type: 'codemirror',
				label: __( 'Additional CSS', 'polished-content' ),
				description: __(
					'CSS added here will print on the front-end whenever a page/post includes an animation.',
					'polished-content'
				),
			},
		],
	},
];

const customJS = [
	{
		title: 'Custom JavaScript',
		subtype: 'fullpanel',
		icon: 'editor-code',
		options: [
			{
				prop: 'customJS',
				type: 'codemirror',
				mode: 'js',
				label: __( 'Additional JavaScript', 'polished-content' ),
				description: __(
					'JavaScript added here will print on the front-end whenever a page/post includes an animation.',
					'polished-content'
				),
			},
		],
	},
];

const helpPage = [
	{
		title: __( 'Plugin Information', 'polished-content' ),
		icon: 'wordpress-alt',
		pages: [
			{
				type: 'content',
				title: __( 'Panels', 'polished-content' ),
				content: [
					{
						header: __(
							'The Animation Editor',
							'polished-content'
						),
						paragraphs: [
							__(
								'When you select a block in the page/post editor, the animation editor can be accessed in the Block settings toward the right.',
								'polished-content'
							),
							[
								{
									alt: __(
										'Plugin Location Screenshot',
										'polished-content'
									),
									file: 'screen_1.jpg',
								},
							],
						],
						className: 'flex polished-content-img-margin',
					},
					{
						header: __( 'Page/Post Settings', 'polished-content' ),
						paragraphs: [
							__(
								'You can also use the Page/Post settings to disable all animations or override specific settings on the front-end which is useful for batch-testing.',
								'polished-content'
							),
							[
								{
									alt: __(
										'Page/Post Settings Screenshot 1',
										'polished-content'
									),
									file: 'screen_12.jpg',
								},
								{
									alt: __(
										'Page/Post Settings Screenshot 2',
										'polished-content'
									),
									file: 'screen_13.jpg',
								},
							],
						],
						className: 'flex',
					},
				],
			},
			{
				type: 'content',
				title: __( 'Presets', 'polished-content' ),
				content: [
					{
						header: __( 'Preset Animations', 'polished-content' ),
						paragraphs: [
							__(
								'You can start with a predefined animation from the presets dropdown.  And then after applying custom settings you can create your own preset for later usage.',
								'polished-content'
							),
							[
								{
									alt: __(
										'Presets Screenshot 1',
										'polished-content'
									),
									file: 'screen_2.jpg',
								},
								{
									alt: __(
										'Presets Screenshot 2',
										'polished-content'
									),
									file: 'screen_3.jpg',
								},
								{
									alt: __(
										'Presets Screenshot 3',
										'polished-content'
									),
									file: 'screen_4.jpg',
								},
							],
						],
						className: 'flex',
					},
				],
			},
			{
				type: 'content',
				title: __( 'Animations', 'polished-content' ),
				content: [
					{
						header: __(
							'Customize your Animation',
							'polished-content'
						),
						paragraphs: [
							__(
								"Modify your animations inside the Basics and Advanced sections.  And set the animation's duration and easing inside the Timing section.",
								'polished-content'
							),
							[
								{
									alt: __(
										'Basics Screenshot',
										'polished-content'
									),
									file: 'screen_5.jpg',
								},
								{
									alt: __(
										'Advanced Screenshot',
										'polished-content'
									),
									file: 'screen_6.jpg',
								},
								{
									alt: __(
										'Timing Screenshot',
										'polished-content'
									),
									file: 'screen_7.jpg',
								},
							],
						],
						className: 'flex',
					},
				],
			},
			{
				type: 'content',
				title: __( 'Formatting', 'polished-content' ),
				content: [
					{
						header: __(
							'Formatting & Style Settings',
							'polished-content'
						),
						paragraphs: [
							__(
								'Use the Content Mask and Tansform Origin options to create different looks for your animations and apply layout formatting to the animated wrapper.',
								'polished-content'
							),
							[
								{
									alt: __(
										'Formatting Screenshot',
										'polished-content'
									),
									file: 'screen_8.jpg',
								},
							],
							{
								subheader: __(
									'Inherit Margins',
									'polished-content'
								),
								content: __(
									'This option is useful resolving spacing issues that might occur once the Block is wrapped in its animated container.  This option can also be applied globally in the {{Custom CSS||#0|2}} section.',
									'polished-content'
								),
							},
							{
								subheader: __(
									'Animate as Inline Block',
									'polished-content'
								),
								content: __(
									"Enable this option for content that doesn't normally appear as full-width, such as buttons, icon's etc.  And then set its alignment if your Block's content is meant to be aligned to the center or right.",
									'polished-content'
								),
							},
							{
								subheader: __(
									'CSS Float',
									'polished-content'
								),
								content: __(
									'This option is useful if your block is meant to display inline next to other content.  For example, an image and a paragraph, etc.',
									'polished-content'
								),
							},
							{
								subheader: __(
									'Wrapper Class',
									'polished-content'
								),
								content: __(
									"Classes added here will get added to the animation's outer wrapper.  Then you can target the class with some {{Custom CSS||#0|2}} if needed.",
									'polished-content'
								),
							},
							{
								subheader: __(
									'Copy Animation Classes',
									'polished-content'
								),
								content: __(
									'Click this option to copy the current animation classes for the Block.  The classes can then be added to any other ocntent on your site.  Then you can load the "Plugin Script Loading" option in the settings {{here||#0|0}}.',
									'polished-content'
								),
							},
						],
						className: 'float polished-content-scroll-settings',
					},
				],
			},
			{
				type: 'content',
				title: __( 'Scroll Settings', 'polished-content' ),
				content: [
					{
						header: __(
							'Scrolling & Viewport Settings',
							'polished-content'
						),
						paragraphs: [
							__(
								'Choose how and when your content should animate.  The settings in this section can also be applied globally with the "Front-end Override" option in the {{Default Preset Settings||#0|0}} or also per-page in the {{Page/Post||#1|0}} settings panel.',
								'polished-content'
							),
							[
								{
									alt: __(
										'Scroll Settings Screenshot',
										'polished-content'
									),
									file: 'screen_9.jpg',
								},
							],
							{
								subheader: __(
									'Animate Content',
									'polished-content'
								),
								content: [
									__(
										'[[Once when in view:||bold]] Content will animate once and only once whenever it first appears in view.',
										'polished-content'
									),
									__(
										"[[Each time it appears:||bold]] Content will animate in every time it's scrolled into view.",
										'polished-content'
									),
									__(
										'[[In and out in both directions:||bold]] Content will animate both in and out as the page is scrolled in both directions.',
										'polished-content'
									),
								],
							},
							{
								subheader: __(
									'Percentage in View',
									'polished-content'
								),
								content: __(
									"Content will begin to animate when it's this percentage inside the page's viewport.  There's no magic number here as the best visual often depends on the size of the content and also whether or not the Stagger on Scroll option is enabled.  But check out the {{Technology||#1|7}} section if you'd like to learn more.",
									'polished-content'
								),
							},
							{
								subheader: __(
									'Auto Reverse',
									'polished-content'
								),
								content: __(
									'Enabling this option will reverse movements, rotations, wipes and skews when content is animated out of view.  For example, if a Block animates in from the right, it would animate out to the left, etc.',
									'polished-content'
								),
							},
							{
								subheader: __(
									'Stagger on Scroll',
									'polished-content'
								),
								content: __(
									"Enabling this option will tie the animation to the page's scroll position.  For example, normally when content enters the viewport it would just animate into its final position all at once.  But with Stagger on Scroll, the animation will play and pause depending on the the Percentage in View option.",
									'polished-content'
								),
							},
							{
								subheader: __(
									'Enable/Disable animation for...',
									'polished-content'
								),
								content: __(
									'Here you can choose which screen sizes the animation should play on.  You can customize the screen width values over in the {{settings section||#0|0}} of this page.',
									'polished-content'
								),
							},
						],
						className: 'float polished-content-scroll-settings',
					},
				],
			},
			{
				type: 'content',
				title: __( 'Copy/Paste', 'polished-content' ),
				content: [
					{
						header: __( 'Right Click Menu', 'polished-content' ),
						paragraphs: [
							__(
								'The animation editor has a right-click menu can be used to easily copy and paste settings from one Block to another.  Useful for quickly adjusting the settings between Blocks when creating your animations.',
								'polished-content'
							),
							[
								{
									alt: __(
										'Right-click Menu Screenshot 1',
										'polished-content'
									),
									file: 'screen_10.jpg',
								},
								{
									alt: __(
										'Right-click Menu Screenshot 2',
										'polished-content'
									),
									file: 'screen_11.jpg',
								},
							],
						],
						className: 'flex',
					},
				],
			},
			{
				type: 'content',
				title: __( 'Plugin Editing', 'polished-content' ),
				content: [
					{
						header: __(
							'Adding Custom Blocks',
							'polished-content'
						),
						paragraphs: [
							__(
								"All the blocks listed in the {{Allowed Blocks||#0|1}} page have been pre-tested and will work out of the box.  There's also built in support for many of the blocks in these plugins:",
								'polished-content'
							),
							'{{Ultimate Addons for Gutenberg plugins||https://wordpress.org/plugins/ultimate-addons-for-gutenberg/||blank}}',
							'{{Advanced Gutenberg||https://www.joomunited.com/wordpress-products/advanced-gutenberg||blank}}',
							'{{CoBlocks||https://coblocks.com/||blank}}',
							'{{Stackable - Gutenberg Blocks||https://wpstackable.com/||blank}}',
							'{{Kadence Blocks||https://wordpress.org/plugins/kadence-blocks/||blank}}',
							__(
								'If you want to add your own blocks this can be done by manually editing the "blocks.php" file inside the plugin\'s admin folder.  Then once added there you can enable them inside the {{options page here||#0|1}}.  Just keep in mind that the "Additional CSS Class" option must already exist for the Block in order to be compatible with Polished Content.',
								'polished-content'
							),
						],
						className: 'plugins-list',
					},
					{
						header: __( 'Editing JavaScript', 'polished-content' ),
						paragraphs: [
							__(
								"To edit the plugin's JavaScript first clone or download the full source files from GitHub {{here||https://github.com/CodingJack/polished-content||blank}}",
								'polished-content'
							),
							__(
								"The plugin's JavaScript has three parts.  The options page here, the Block Editor, and the front-end:",
								'polished-content'
							),
							'[[admin/options_page/src/||code]]',
							'[[admin/block_editor/src/||code]]',
							'[[front/src/||code]]',
							__(
								'The options page and front-end have their own config found in the plugin\'s root "config" folder, and the Block Editor uses the default {{@wordpress/scripts||https://developer.wordpress.org/block-editor/packages/packages-scripts/||blank}} config.  All three parts are compiled together in Node with the scripts below.  To get started:',
								'polished-content'
							),
							'[[npm install||code]]',
							__(
								"... from the plugin's root directory.",
								'polished-content'
							),
							__(
								'Then the scripts you can run are:',
								'polished-content'
							),
							'[[npm run watch||code]]',
							'[[npm run build||code]]',
							'[[npm run lint||code]]',
							__(
								"The core package.json file is where you can edit the source and distribution paths and there you'll also find some command line actions to handle the .scss files for the admin parts.",
								'polished-content'
							),
						],
					},
					{
						header: __( 'Editing CSS', 'polished-content' ),
						paragraphs: [
							__(
								'The admin\'s CSS can be found in the same folders as the JavaScript above, with the difference being that the .scss files are in the "src" folder and the "css" files in the "dist" folder.',
								'polished-content'
							),
							__(
								'You can edit the SASS files and recompile using the "npm run build" command above, or edit the CSS files manually inside the "dist" folders.  The small CSS for the front-end is located at the top of the plugin\'s "front/front.php" file.',
								'polished-content'
							),
						],
					},
				],
			},
			{
				type: 'content',
				title: __( 'Technology', 'polished-content' ),
				content: [
					{
						header: __(
							'Technology used for the Plugin',
							'polished-content'
						),
						paragraphs: [
							{
								subheader: __(
									'Intersection Observer',
									'polished-content'
								),
								content: [
									__(
										'Polished Content uses the {{HTML5 Intersection Observer||https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API||blank}} to watch for when content is scrolled into and out of view.  This is in contrast to the traditional window "scroll" event that\'s often used for animating elements when scrolling.',
										'polished-content'
									),
									__(
										'When using the traditional window scroll event, every time the page is scrolled you normally have to run a big programmatic loop checking the exact size and position of each and every piece of content being animated.  And this can be a big performance hit.',
										'polished-content'
									),
									__(
										'But with the Intersection Observer, the browser handles all the calculations behind the scenes, and only notifies us when the content is where we expect it to be.  Inside the viewport!',
										'polished-content'
									),
									__(
										'However, there are some drawbacks.  Since the Intersection Observer only tells us when the content is "intersecting" (entering or leaving the viewport), we can essentially "lose track" of the element once it\'s completely in view.  And this limits the ability to further control the element.',
										'polished-content'
									),
									__(
										'But Intersection Observer is used in Polished Content because the pros outweigh the cons :)',
										'polished-content'
									),
								],
							},
							{
								subheader: 'Greensock',
								content: [
									__(
										'{{Greensock||https://greensock.com/||blank}} is an animation engine that does amazing things without compromising performance.  Greensock is "mostly" free.  You can check out their "No Charge" license {{here||https://greensock.com/standard-license/||blank}}.',
										'polished-content'
									),
								],
							},
							{
								subheader: __(
									'Everything else...',
									'polished-content'
								),
								content: [
									'{{WordPress Scripts||https://www.npmjs.com/package/@wordpress/scripts||blank}} - License: {{GPL-2.0-or-later||https://opensource.org/licenses/GPL-2.0||blank}}',
									'{{React||https://www.npmjs.com/package/react||blank}} - License:  {{MIT||https://opensource.org/licenses/MIT||blank}}',
									'{{Webpack||https://www.npmjs.com/package/webpack||blank}} - License:  {{MIT||https://opensource.org/licenses/MIT||blank}}',
									'{{Babel||https://www.npmjs.com/package/@babel/core||blank}} - License:  {{MIT||https://opensource.org/licenses/MIT||blank}}',
									'{{eslint-plugin-react||https://www.npmjs.com/package/eslint-plugin-react||blank}} - License:  {{MIT||https://opensource.org/licenses/MIT||blank}}',
									'{{eslint-loader||https://www.npmjs.com/package/eslint-loader||blank}} - License:  {{MIT||https://opensource.org/licenses/MIT||blank}}',
									'{{node-sass||https://www.npmjs.com/package/node-sass||blank}} - License:  {{MIT||https://opensource.org/licenses/MIT||blank}}',
									'{{core-js||https://www.npmjs.com/package/core-js||blank}} - License:  {{MIT||https://opensource.org/licenses/MIT||blank}}',
									'{{classnames||https://www.npmjs.com/package/classnames||blank}} - License:  {{MIT||https://opensource.org/licenses/MIT||blank}}',
									'{{axios||https://www.npmjs.com/package/axios||blank}} - License:  {{MIT||https://opensource.org/licenses/MIT||blank}}',
									'{{requestIdleCallback polyfill||https://www.npmjs.com/package/requestidlecallback||blank}} - License:  {{MIT||https://opensource.org/licenses/MIT||blank}}',
									'{{IntersectionObserver polyfill||https://www.npmjs.com/package/intersection-observer||blank}} - License:  {{W3C-20150513||https://opensource.org/licenses/W3C||blank}}',
									'{{qs||https://www.npmjs.com/package/qs||blank}} - License:  {{BSD-3-Clause||https://opensource.org/licenses/BSD-3-Clause||blank}}',
								],
							},
						],
					},
				],
			},
		],
	},
];

const pages = [
	{
		type: 'options',
		title: __( 'Settings/Presets', 'polished-content' ),
		content: pluginDefaults,
	},
	{
		type: 'options',
		title: __( 'Allowed Blocks', 'polished-content' ),
		content: allowedBlocks,
	},
	{
		type: 'options',
		title: __( 'Custom CSS', 'polished-content' ),
		content: customCSS,
	},
	{
		type: 'options',
		title: __( 'Custom JS', 'polished-content' ),
		content: customJS,
	},
	{
		type: 'html',
		title: __( 'Info/Docs', 'polished-content' ),
		content: helpPage,
	},
	{
		type: 'screenshots',
		title: __( 'Screenshots', 'polished-content' ),
	},
];

export default pages;
