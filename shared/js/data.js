// the data is used on both the backend and frontend
// but translations are only needed for the backend
const { __ } =
	typeof wp !== 'undefined' && wp.i18n ? wp.i18n : { __: ( st ) => st };

const namespace = 'polished-content';
const hasGlobals = typeof polishedContentGlobals !== 'undefined';

const selectOptions = {
	pcxAlign: [ 'left', 'center', 'right' ],
	pcxAlignRtl: [ 'right', 'center', 'left' ],
	pcxPosition: [
		'left-top',
		'center-top',
		'right-top',
		'left-center',
		'center-center',
		'right-center',
		'left-bottom',
		'center-bottom',
		'right-bottom',
	],
	pcxAnimations: {
		PcxFade: {
			pcxOpacity: 0,
		},
		PcxGaussianBlur: {
			pcxOpacity: 0,
			pcxBlur: 10,
			pcxMask: true,
		},
		PcxWipeLeft: {
			pcxClip: 'right-center',
			pcxDuration: 500,
			pcxEasing: 'Power2',
			pcxEaseDirection: 'easeInOut',
		},
		PcxWipeRight: {
			pcxClip: 'left-center',
			pcxDuration: 500,
			pcxEasing: 'Power2',
			pcxEaseDirection: 'easeInOut',
		},
		PcxMoveBottom: {
			pcxOpacity: 0,
			pcxPosition: 'center-bottom',
			pcxStrength: 'short',
		},
		PcxMoveRight: {
			pcxOpacity: 0,
			pcxPosition: 'right-center',
			pcxStrength: 'full',
		},
		PcxMoveLeft: {
			pcxOpacity: 0,
			pcxPosition: 'left-center',
			pcxStrength: 'full',
		},
		PcxSlideInRight: {
			pcxPosition: 'right-center',
			pcxMask: true,
			pcxEasing: 'Power2',
		},
		PcxSlideInLeft: {
			pcxPosition: 'left-center',
			pcxMask: true,
			pcxEasing: 'Power2',
		},
		PcxHeadlineMotion: {
			pcxBlur: 5,
			pcxEasing: 'Power2',
			pcxOpacity: 0,
			pcxPosition: 'right-center',
			pcxSkewX: -15,
			pcxStrength: 'short',
		},
		PcxFlipHorizontal: {
			pcxDuration: 1000,
			pcxEasing: 'Circ',
			pcxOpacity: 50,
			pcxRotateY: 180,
		},
		PcxFlipVertical: {
			pcxDuration: 1000,
			pcxEasing: 'Circ',
			pcxOpacity: 50,
			pcxRotateX: -180,
		},
		PcxGrayscaleBlur: {
			pcxBlur: 10,
			pcxGrayscale: 100,
			pcxMask: true,
			pcxPercentageIn: 50,
			pcxZoom: 120,
		},
		PcxZoomFade: {
			pcxOpacity: 0,
			pcxZoom: 75,
		},
		PcxZoomInvert: {
			pcxZoom: 300,
			pcxMask: true,
			pcxEasing: 'Power3',
		},
		PcxZoomBottom: {
			pcxOpacity: 0,
			pcxZoom: 75,
			pcxPosition: 'center-bottom',
			pcxStrength: 'short',
		},
		PcxZoomRight: {
			pcxOpacity: 0,
			pcxZoom: 75,
			pcxPosition: 'right-center',
			pcxStrength: 'full',
		},
		PcxZoomLeft: {
			pcxOpacity: 0,
			pcxZoom: 75,
			pcxPosition: 'left-center',
			pcxStrength: 'full',
		},
		PcxReverseFlip: {
			pcxRotateX: 180,
			pcxRotateY: 180,
			pcxEasing: 'Power2',
		},
		PcxPhantomZone: {
			pcxOpacity: 0,
			pcxPosition: 'center-bottom',
			pcxStrength: 'short',
			pcxZoom: 150,
			pcxRotateX: 70,
			pcxEasing: 'Power2',
		},
		PcxTextDust: {
			pcxOpacity: 0,
			pcxZoom: 200,
			pcxBlur: 30,
			pcxEasing: 'Power2',
		},
		PcxSlidingDoors: {
			pcxClip: 'left-center',
			pcxMask: true,
			pcxPosition: 'right-center',
			pcxStrength: 'short',
		},
		PcxOpenSesame: {
			pcxOpacity: 0,
			pcxClip: 'center-bottom',
			pcxRotateX: -45,
		},
	},
	pcxPresets: [
		{
			label: __( 'Select a Preset Animation', 'polished-content' ),
			value: 'PcxDefaults',
			disabled: true,
		},
		{
			label: __( 'Simple Fade', 'polished-content' ),
			value: 'PcxFade',
		},
		{
			label: __( 'Gaussian Blur', 'polished-content' ),
			value: 'PcxGaussianBlur',
		},
		{
			label: __( 'Wipe Left', 'polished-content' ),
			value: 'PcxWipeLeft',
		},
		{
			label: __( 'Wipe Right', 'polished-content' ),
			value: 'PcxWipeRight',
		},
		{
			label: __( 'Move from Bottom', 'polished-content' ),
			value: 'PcxMoveBottom',
		},
		{
			label: __( 'Move from Right', 'polished-content' ),
			value: 'PcxMoveRight',
		},
		{
			label: __( 'Move from Left', 'polished-content' ),
			value: 'PcxMoveLeft',
		},
		{
			label: __( 'Slide in Right', 'polished-content' ),
			value: 'PcxSlideInRight',
		},
		{
			label: __( 'Slide in Left', 'polished-content' ),
			value: 'PcxSlideInLeft',
		},
		{
			label: __( 'Headline Motion', 'polished-content' ),
			value: 'PcxHeadlineMotion',
		},
		{
			label: __( 'Flip Horizontal', 'polished-content' ),
			value: 'PcxFlipHorizontal',
		},
		{
			label: __( 'Flip Vertical', 'polished-content' ),
			value: 'PcxFlipVertical',
		},
		{
			label: __( 'Smooth Zoom', 'polished-content' ),
			value: 'PcxZoomFade',
		},
		{
			label: __( 'Inverted Zoom', 'polished-content' ),
			value: 'PcxZoomInvert',
		},
		{
			label: __( 'Zoom from Bottom', 'polished-content' ),
			value: 'PcxZoomBottom',
		},
		{
			label: __( 'Zoom from Right', 'polished-content' ),
			value: 'PcxZoomRight',
		},
		{
			label: __( 'Zoom from Left', 'polished-content' ),
			value: 'PcxZoomLeft',
		},
		{
			label: __( 'Grayscale Blur', 'polished-content' ),
			value: 'PcxGrayscaleBlur',
		},
		{
			label: __( 'Reverse Flip', 'polished-content' ),
			value: 'PcxReverseFlip',
		},
		{
			label: __( 'Phantom Zone', 'polished-content' ),
			value: 'PcxPhantomZone',
		},
		{
			label: __( 'Text Dust', 'polished-content' ),
			value: 'PcxTextDust',
		},
		{
			label: __( 'Sliding Doors', 'polished-content' ),
			value: 'PcxSlidingDoors',
		},
		{
			label: __( 'Open Sesame', 'polished-content' ),
			value: 'PcxOpenSesame',
		},
	],
	pcxStrength: [
		{
			label: __( 'Short Distance', 'polished-content' ),
			value: 'short',
		},
		{
			label: __( 'Full Content', 'polished-content' ),
			value: 'full',
		},
		{
			label: __( 'Full Screen', 'polished-content' ),
			value: 'max',
		},
	],
	pcxFloat: [
		{
			label: __( 'None', 'polished-content' ),
			value: 'none',
		},
		{
			label: __( 'Left', 'polished-content' ),
			value: 'left',
		},
		{
			label: __( 'Right', 'polished-content' ),
			value: 'right',
		},
	],
	pcxDelayBreak: [
		{
			label: __( 'None', 'polished-content' ),
			value: 'none',
		},
		{
			label: __( 'Laptop', 'polished-content' ),
			value: 'laptop',
		},
		{
			label: __( 'Tablet', 'polished-content' ),
			value: 'tablet',
		},
		{
			label: __( 'Smartphone', 'polished-content' ),
			value: 'smartphone',
		},
		{
			label: __( 'Custom Width', 'polished-content' ),
			value: 'custom',
		},
	],
	pcxPerspective: [
		{
			label: __( '100vw', 'polished-content' ),
			value: '100vw',
		},
		{
			label: __( '90vw', 'polished-content' ),
			value: '90vw',
		},
		{
			label: __( '80vw', 'polished-content' ),
			value: '80vw',
		},
		{
			label: __( '70vw', 'polished-content' ),
			value: '70vw',
		},
		{
			label: __( '60vw', 'polished-content' ),
			value: '60vw',
		},
		{
			label: __( '50vw', 'polished-content' ),
			value: '50vw',
		},
		{
			label: __( '40vw', 'polished-content' ),
			value: '40vw',
		},
		{
			label: __( '30vw', 'polished-content' ),
			value: '30vw',
		},
		{
			label: __( '20vw', 'polished-content' ),
			value: '20vw',
		},
		{
			label: __( '10vw', 'polished-content' ),
			value: '10vw',
		},
		{
			label: __( 'Custom Value', 'polished-content' ),
			value: 'custom',
		},
	],
	pcxClip: [
		{
			label: __( 'None', 'polished-content' ),
			value: 'center-center',
		},
		{
			label: __( 'From Top', 'polished-content' ),
			value: 'center-top',
		},
		{
			label: __( 'From Right', 'polished-content' ),
			value: 'right-center',
		},
		{
			label: __( 'From Bottom', 'polished-content' ),
			value: 'center-bottom',
		},
		{
			label: __( 'From Left', 'polished-content' ),
			value: 'left-center',
		},
		{
			label: __( 'Top Left', 'polished-content' ),
			value: 'left-top',
		},
		{
			label: __( 'Top Right', 'polished-content' ),
			value: 'right-top',
		},
		{
			label: __( 'Bottom Right', 'polished-content' ),
			value: 'right-bottom',
		},
		{
			label: __( 'Bottom Left', 'polished-content' ),
			value: 'left-bottom',
		},
	],
	pcxTransformOrigin: [
		{
			label: __( 'Center', 'polished-content' ),
			value: 'center-center',
		},
		{
			label: __( 'Top', 'polished-content' ),
			value: 'center-top',
		},
		{
			label: __( 'Right', 'polished-content' ),
			value: 'right-center',
		},
		{
			label: __( 'Bottom', 'polished-content' ),
			value: 'center-bottom',
		},
		{
			label: __( 'Left', 'polished-content' ),
			value: 'left-center',
		},
		{
			label: __( 'Top Left', 'polished-content' ),
			value: 'left-top',
		},
		{
			label: __( 'Top Right', 'polished-content' ),
			value: 'right-top',
		},
		{
			label: __( 'Bottom Right', 'polished-content' ),
			value: 'right-bottom',
		},
		{
			label: __( 'Bottom Left', 'polished-content' ),
			value: 'left-bottom',
		},
	],
	pcxScrollType: [
		{
			label: __( 'Once when in view', 'polished-content' ),
			value: 'in',
		},
		{
			label: __( 'Each time it appears', 'polished-content' ),
			value: 'each',
		},
		{
			label: __( 'In and out in both directions', 'polished-content' ),
			value: 'both',
		},
	],
	pcxEasing: [
		{
			label: __( 'None', 'polished-content' ),
			value: 'Power0',
		},
		{
			label: __( 'Power 1', 'polished-content' ),
			value: 'Power1',
		},
		{
			label: __( 'Power 2', 'polished-content' ),
			value: 'Power2',
		},
		{
			label: __( 'Power 3', 'polished-content' ),
			value: 'Power3',
		},
		{
			label: __( 'Power 4', 'polished-content' ),
			value: 'Power4',
		},
		{
			label: __( 'Back', 'polished-content' ),
			value: 'Back',
		},
		{
			label: __( 'Bounce', 'polished-content' ),
			value: 'Bounce',
		},
		{
			label: __( 'Elastic', 'polished-content' ),
			value: 'Elastic',
		},
		{
			label: __( 'Circ', 'polished-content' ),
			value: 'Circ',
		},
		{
			label: __( 'Expo', 'polished-content' ),
			value: 'Expo',
		},
		{
			label: __( 'Sine', 'polished-content' ),
			value: 'Sine',
		},
	],
	pcxEaseDirection: [
		{
			label: __( 'easeOut', 'polished-content' ),
			value: 'easeOut',
		},
		{
			label: __( 'easeIn', 'polished-content' ),
			value: 'easeIn',
		},
		{
			label: __( 'easeInOut', 'polished-content' ),
			value: 'easeInOut',
		},
	],
};

// same options, no need to repeat
selectOptions.pcxTransformReset = selectOptions.pcxDelayBreak.slice();

const customPreset = {
	label: __( 'Custom Values', 'polished-content' ),
	value: 'PcxCustom',
};

/*
 * these are always displayed
 * regardless of the user options
 */
const whitelisted = [ 'PcxFade', 'PcxGaussianBlur' ];

const tweenables = {
	pcxOpacity: {
		prop: 'opacity',
		times: 0.01,
	},
	pcxZoom: {
		prop: 'scale',
		times: 0.01,
	},
	pcxRotate: {
		prop: 'rotation',
		times: 1,
	},
	pcxRotateX: {
		prop: 'rotationX',
		times: 1,
	},
	pcxRotateY: {
		prop: 'rotationY',
		times: 1,
	},
	pcxSkewX: {
		prop: 'skewX',
		times: 1,
	},
	pcxSkewY: {
		prop: 'skewY',
		times: 1,
	},
};

const viewports = [ 'pcxDesktop', 'pcxTablet', 'pcxLaptop', 'pcxSmartphone' ];

const nonAnimatable = viewports
	.slice()
	.concat( [
		'pcxEnabled',
		'pcxReverse',
		'pcxFloat',
		'pcxInherit',
		'pcxInline',
		'pcxAlign',
		'pcxClass',
		'pcxEaseReverse',
		'pcxDelayReverse',
		'pcxDelayBreak',
		'pcxTransformReset',
		'pcxPerspective',
		'pcxScrollType',
		'pcxPercentageIn',
		'pcxScrollStagger',
		'pcxLetterSpacing',
		'pcxPercentageInStagger',
	] );

const clipPoints = {
	'center-top': [ 0, 0, 1, 0 ],
	'right-center': [ 0, 0, 0, 1 ],
	'center-bottom': [ 1, 0, 0, 0 ],
	'left-center': [ 0, 1, 0, 0 ],
	'left-top': [ 0, 1, 1, 0 ],
	'right-top': [ 0, 0, 1, 1 ],
	'left-bottom': [ 1, 1, 0, 0 ],
	'right-bottom': [ 1, 0, 0, 1 ],
};

const threeD = [ 'pcxSkewX', 'pcxSkewY', 'pcxRotateX', 'pcxRotateY' ];

const reversable = [
	'pcxRotate',
	'pcxRotateX',
	'pcxRotateY',
	'pcxSkewX',
	'pcxSkewY',
];

const transformable = reversable.slice().concat( [ 'pcxPosition', 'pcxZoom' ] );

const animationCore = [
	'pcxOpacity',
	'pcxPosition',
	'pcxZoom',
	'pcxClip',
	'pcxBlur',
	'pcxGrayscale',
	'pcxRotate',
	'pcxRotateX',
	'pcxRotateY',
	'pcxSkewX',
	'pcxSkewY',
	'pcxLetterSpacing',
];

const coreDefaults = [
	'scroll_type',
	'percentage_in',
	'percentage_in_stagger',
	'scroll_stagger',
	'reverse',
	'desktop',
	'laptop',
	'tablet',
	'smartphone',
];

const {
	pcxPosition,
	pcxStrength,
	pcxClip,
	pcxAlign,
	pcxFloat,
	pcxPerspective,
	pcxTransformOrigin,
	pcxEasing,
	pcxDelayBreak,
	pcxTransformReset,
	pcxEaseDirection,
	pcxScrollType,
} = selectOptions;

/*
 * attributes pushed into blocks
 * editor options MUST match this list!
 */
const defaultData = {
	pcxEnabled: {
		type: 'boolean',
		default: false,
	},
	basics: {
		pcxOpacity: {
			type: 'number',
			default: 100,
		},
		pcxBlur: {
			type: 'number',
			default: 0,
		},
		pcxGrayscale: {
			type: 'number',
			default: 0,
		},
		pcxZoom: {
			type: 'number',
			default: 100,
		},
		pcxPosition: {
			type: 'string',
			default: pcxPosition[ 4 ],
		},
		pcxStrength: {
			type: 'string',
			default: pcxStrength[ 1 ].value,
		},
		pcxClip: {
			type: 'string',
			default: pcxClip[ 0 ].value,
		},
		pcxMask: {
			type: 'boolean',
			default: false,
		},
	},
	advanced: {
		pcxLetterSpacing: {
			type: 'number',
			default: 0,
		},
		pcxRotate: {
			type: 'number',
			default: 0,
		},
		pcxRotateX: {
			type: 'number',
			default: 0,
		},
		pcxRotateY: {
			type: 'number',
			default: 0,
		},
		pcxSkewX: {
			type: 'number',
			default: 0,
		},
		pcxSkewY: {
			type: 'number',
			default: 0,
		},
		pcxPerspective: {
			type: 'string',
			default: pcxPerspective[ 5 ].value,
		},
		pcxTransformOrigin: {
			type: 'string',
			default: pcxTransformOrigin[ 0 ].value,
		},
		pcxTransformReset: {
			type: 'string',
			default: pcxTransformReset[ 0 ].value,
		},
	},
	timing: {
		pcxDuration: {
			type: 'number',
			default: 750,
		},
		pcxDelay: {
			type: 'number',
			default: 0,
		},
		pcxDelayReverse: {
			type: 'number',
			default: 0,
		},
		pcxDelayBreak: {
			type: 'string',
			default: pcxDelayBreak[ 0 ].value,
		},
		pcxEasing: {
			type: 'string',
			default: pcxEasing[ 4 ].value,
		},
		pcxEaseReverse: {
			type: 'boolean',
			default: false,
		},
		pcxEaseDirection: {
			type: 'string',
			default: pcxEaseDirection[ 0 ].value,
		},
	},
	formatting: {
		pcxFloat: {
			type: 'string',
			default: pcxFloat[ 0 ].value,
		},
		pcxInherit: {
			type: 'boolean',
			default: false,
		},
		pcxInline: {
			type: 'boolean',
			default: false,
		},
		pcxAlign: {
			type: 'string',
			default: pcxAlign[ 0 ],
		},
		pcxClass: {
			type: 'string',
			default: '',
		},
	},
	settings: {
		pcxScrollType: {
			type: 'string',
			default: pcxScrollType[ 0 ].value,
		},
		pcxPercentageIn: {
			type: 'number',
			default: 25,
		},
		pcxPercentageInStagger: {
			type: 'number',
			default: 15,
		},
		pcxReverse: {
			type: 'boolean',
			default: false,
		},
		pcxScrollStagger: {
			type: 'boolean',
			default: false,
		},
		pcxDesktop: {
			type: 'boolean',
			default: true,
		},
		pcxLaptop: {
			type: 'boolean',
			default: true,
		},
		pcxTablet: {
			type: 'boolean',
			default: true,
		},
		pcxSmartphone: {
			type: 'boolean',
			default: true,
		},
	},
};

const rightClickItems = {
	all: {
		icon: 'clipboard',
		text: __( 'Copy All', 'polished-content' ),
	},
	paste: {
		icon: 'migrate',
		text: __( 'Paste Copied Settings', 'polished-content' ),
	},
	basics: {
		icon: 'admin-settings',
		text: __( 'Copy Basics', 'polished-content' ),
	},
	advanced: {
		icon: 'admin-plugins',
		text: __( 'Copy Advanced', 'polished-content' ),
	},
	timing: {
		icon: 'dashboard',
		text: __( 'Copy Timing', 'polished-content' ),
	},
	formatting: {
		icon: 'art',
		text: __( 'Copy Formatting', 'polished-content' ),
	},
	settings: {
		icon: 'admin-generic',
		text: __( 'Copy Scroll Settings', 'polished-content' ),
	},
	disable: {
		icon: 'no',
		text: __( 'Disable Menu', 'polished-content' ),
	},
};

// settings panels for right click menu
const panelSettings = {};
const panels = [ 'basics', 'advanced', 'timing', 'formatting', 'settings' ];

panels.forEach( ( panel ) => {
	const settings = defaultData[ panel ];
	const curPanel = [];

	for ( const [ key, value ] of Object.entries( settings ) ) {
		defaultData[ key ] = value;
		curPanel.push( key );
	}

	delete defaultData[ panel ];
	panelSettings[ panel ] = curPanel;
} );

/*
 * push user preset settings into core preset settings
 */
if ( hasGlobals ) {
	const { defaultSettings } = polishedContentGlobals; // eslint-disable-line no-undef

	if ( defaultSettings && ! Array.isArray( defaultSettings ) ) {
		const { viewportsEnabled } = defaultSettings;

		const { pcxAnimations } = selectOptions;

		viewports.forEach( ( viewport, i ) => {
			defaultSettings[ viewport ] = viewportsEnabled[ i ];
		} );

		const settings = { ...defaultSettings };
		Object.keys( settings ).forEach( ( key ) => {
			if ( key.substr( 0, 3 ) !== 'pcx' ) {
				delete settings[ key ];
			}
		} );

		for ( const [ key, value ] of Object.entries( pcxAnimations ) ) {
			pcxAnimations[ key ] = { ...value, ...settings };
		}
	}
}

/*
 * Processed from data above and exported below
 *
 * defaultValues
 * mainDefaults
 * animatable
 * allDataProps
 * originalPresets
 *
 */
const allDataProps = Object.keys( defaultData );
const defaultValues = {};
const animatable = [];

for ( const [ key, value ] of Object.entries( defaultData ) ) {
	defaultValues[ key ] = value.default;
	animatable.push( key );
}

delete defaultValues.pcxEnabled;

nonAnimatable.forEach( ( key ) => {
	animatable.splice( animatable.indexOf( key ), 1 );
} );

const mainDefaults = { PcxDefaults: { ...defaultValues } };

const { pcxPresets } = selectOptions;
const originalPresets = [ ...pcxPresets ];

/*
 * Push custom presets from database into preset select options
 * and modify default presets if user options exist
 */
if ( hasGlobals ) {
	const { customPresets, defaultSettings } = polishedContentGlobals; // eslint-disable-line no-undef

	if ( defaultSettings && ! Array.isArray( defaultSettings ) ) {
		const { defaultPresets } = defaultSettings;

		if ( Array.isArray( defaultPresets ) ) {
			const presetDefaults = whitelisted.slice();

			defaultPresets.forEach( ( def ) => {
				presetDefaults.push( def );
			} );

			const { pcxAnimations } = selectOptions;

			Object.keys( pcxAnimations ).forEach( ( key ) => {
				if ( presetDefaults.indexOf( key ) === -1 ) {
					delete pcxAnimations[ key ];
				}
			} );

			presetDefaults.push( 'PcxDefaults' );
			pcxPresets.slice().forEach( ( preset ) => {
				const key = preset.value;

				if ( presetDefaults.indexOf( key ) === -1 ) {
					pcxPresets.splice( pcxPresets.indexOf( preset ), 1 );
				}
			} );
		}
	}
	if ( customPresets && ! Array.isArray( customPresets ) ) {
		const { pcxAnimations } = selectOptions;

		pcxPresets.push( {
			label: `*** ${ __( 'Custom Presets', 'polished-content' ) } ***`,
			value: 'PcxCustomPresets',
			disabled: true,
		} );

		Object.keys( customPresets ).forEach( ( key ) => {
			const preset = customPresets[ key ];
			pcxAnimations[ key ] = preset.settings;

			pcxPresets.push( {
				label: preset.title,
				value: key,
			} );
		} );
	}
}

export {
	namespace,
	selectOptions,
	panelSettings,
	rightClickItems,
	originalPresets,
	customPreset,
	tweenables,
	animatable,
	clipPoints,
	defaultData,
	defaultValues,
	mainDefaults,
	animationCore,
	coreDefaults,
	transformable,
	reversable,
	whitelisted,
	allDataProps,
	threeD,
};
