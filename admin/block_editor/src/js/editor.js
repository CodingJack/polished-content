/**
 * External dependencies.
 */
import gsap from 'gsap';

/**
 * WordPress dependencies.
 */
const { Component, createRef } = wp.element;

const { __ } = wp.i18n;

/**
 * Internal dependencies.
 */
import {
	namespace,
	selectOptions,
	defaultValues,
	allDataProps,
} from '../../../../shared/js/data';

import { playAnimation, resetAnimation } from './animation';

import {
	shouldAnimate,
	compareProps,
	checkChanges,
	checkInitialTab,
	animatableProps,
	objectValuesEqual,
	getPresetSelection,
	getOriginalSettings,
} from './utils';

import MyTabPanels from './panels';
import MyHeaderControl from './header';
import MyToggleControl from './components/my-toggle-control';
import MyResetButtons from './components/my-reset-buttons';
import MyRightClickMenu from './components/my-right-click-menu';

class PolishedContentEditor extends Component {
	constructor() {
		super( ...arguments );

		const { attributes } = this.props;
		const { pcxEnabled } = attributes;

		const presetData = getPresetSelection( { ...attributes }, true );
		const { selectedPreset } = presetData;

		checkInitialTab( pcxEnabled, selectedPreset );
		const { currentTab } = polishedContentGlobals; // eslint-disable-line no-undef

		this.state = {
			currentTab,
			ajaxLoading: false,
			rcMenuActive: false,
			previewIsPlaying: false,
			showSavePresetModal: false,
			...presetData,
		};

		this.animatedElements = {
			el: createRef(),
			container: createRef(),
		};

		this.settingsRef = createRef();
		this.updateProp = this.updateProp.bind( this );
		this.updateState = this.updateState.bind( this );

		this.restoreProperties = this.restoreProperties.bind( this );
		this.updateFromPreset = this.updateFromPreset.bind( this );
		this.updateBatchProps = this.updateBatchProps.bind( this );

		this.onRightClick = this.onRightClick.bind( this );
		this.hideRightClickMenu = this.hideRightClickMenu.bind( this );

		this.hideClearBtn = ! checkChanges(
			{ ...defaultValues },
			{ ...attributes }
		);
		this.originalSettings = getOriginalSettings( { ...attributes } );
	}

	/*
	 * @desc updates the state based on a user change and maybe calls a callback
	 * @param object args - the new state settings
	 * @param function callback - a possible callback to call asynchronously
	 * @since 1.0.0
	 */
	updateState( args, callback ) {
		// updateState is passed down to and called from child components as opposed to "setState"
		// this makes it easier to debug
		this.setState( args, callback );
	}

	/*
	 * @desc handles all actions that are meant to change the block's attributes
	 * @param object newProps - the new prop/values to set
	 * @since 1.0.0
	 */
	updateProps( newProps ) {
		const { attributes } = this.props;
		const animatable = animatableProps( { ...newProps } );
		const animate =
			animatable && shouldAnimate( { ...attributes, ...newProps } );

		// if the play button is paused but an animatable option was changed, auto-animate the preview
		if ( animate ) {
			this.setState( { bounce: true, previewIsPlaying: true }, () => {
				this.props.setAttributes( { ...newProps } );
			} );
		} else {
			this.props.setAttributes( { ...newProps } );
		}
	}

	/*
	 * @desc updates the block's attributes on a settings change
	 * @param string/boolean/number value - the prop's new value
	 * @param string prop - the attribute's name
	 * @since 1.0.0
	 */
	updateProp( value, prop ) {
		if ( prop === 'pcxEnabled' ) {
			if ( value ) {
				this.addRightClickListener();
			} else {
				this.removeAllRcListeners();
			}
		}

		this.updateProps( { [ prop ]: value } );
	}

	/*
	 * @desc paste previously copied settings from right-click menu into a block
	 * @since 1.0.0
	 */
	updateBatchProps() {
		const { copiedSettings } = polishedContentGlobals; // eslint-disable-line no-undef

		this.updateProps( { ...copiedSettings } );
	}

	/*
	 * @desc updates attributes and state when a settings preset is selected
	 * @param string selectedPreset - preset key that was selected
	 * @param boolean fromAjax - true if called after a save/delete preset event
	 * @param boolean fromDelete - true if called from a delete preset event
	 * @since 1.0.0
	 */
	updateFromPreset( selectedPreset ) {
		const { pcxAnimations } = selectOptions;
		const newProps = {
			...defaultValues,
			...pcxAnimations[ selectedPreset ],
		};
		this.updateProps( { ...newProps } );
	}

	/*
	 * @desc used to determine if we should play, replay or reset the animated element
	 * @param object e - the event object if coming from a restore defaults button click
	 * @param object originalSettings - the default values if coming from an undo changes action
	 * @since 1.0.0
	 */
	restoreProperties( e, originalSettings ) {
		const newProps = originalSettings || defaultValues;
		this.updateProps( { ...newProps } );
	}

	/*
	 * @desc used to determine if we should play, replay or reset the animated element
	 * @param object prevProps - the component's previous props
	 * @param object prevState - the component's previous state
	 * @since 1.0.0
	 */
	componentDidUpdate( prevProps, prevState ) {
		const { el, container } = this.animatedElements;

		const { current: curElement } = el;
		const { current: curContainer } = container;

		/*
		 * check if the preview animation should play
		 */
		if ( curElement && curContainer ) {
			const { previewIsPlaying } = this.state;

			if ( previewIsPlaying ) {
				const { attributes } = this.props;
				const { attributes: prevAttributes } = prevProps;
				const { previewIsPlaying: prevPlaying } = prevState;

				// was the play/pause button clicked ?
				let shouldPlay = previewIsPlaying !== prevPlaying;

				// if the play/pause button was clicked, did the animatable props change?
				if ( ! shouldPlay ) {
					shouldPlay = compareProps(
						{ ...prevAttributes },
						{ ...attributes }
					);
				}
				if ( shouldPlay ) {
					playAnimation( curElement, curContainer, {
						...defaultValues,
						...attributes,
					} );
				} else {
					const animate = shouldAnimate( { ...attributes } );

					// reset the animation if it was previously playing but now has no animatable values
					if ( ! animate ) {
						resetAnimation( curElement, true );
					}
				}
			} else {
				resetAnimation( curElement, true );
			}
		}
	}

	/*
	 * @desc only render when a block attribute changes that's related to the plugin
	 * @param object nextProps - the component's new props
	 * @param object nextState - the component's new state
	 * @since 1.0.0
	 */
	shouldComponentUpdate( nextProps, nextState ) {
		const { attributes: prevAttrs } = this.props;
		const { attributes: nextAttrs } = nextProps;

		// compare two objects that definitely have the same keys
		const statesEqual = objectValuesEqual(
			{ ...this.state },
			{ ...nextState }
		);

		// compare two objects against a specific set of keys
		const propsEqual = objectValuesEqual(
			{ ...prevAttrs },
			{ ...nextAttrs },
			allDataProps.slice()
		);

		return ! statesEqual || ! propsEqual;
	}

	/*
	 * @desc update the internal preset selection state based on whatever the current props are
	 *       this is needed as the block's props can change from a WP undo/redo that we aren't subscribed to
	 *       and we don't want to modify the state in componentDidUpdate because that causes a double render
	 * @param object nextProps - the component's new props
	 * @param object prevState - the component's previous state
	 * @since 1.0.0
	 */
	static getDerivedStateFromProps( nextProps, prevState ) {
		// guarantees that we only set the new state after the setAttributes call
		// view "setState" inside updateProps() to see how it works
		const { bounce } = prevState;
		if ( bounce ) {
			return { bounce: false };
		}

		const { attributes } = nextProps;
		const presetData = getPresetSelection( { ...attributes } );
		const { hideCreatePresetBtn } = presetData;

		const { previewIsPlaying, showSavePresetModal } = prevState;

		// we may need to reset the play/pause button if there's nothing to animate
		if ( previewIsPlaying ) {
			const animate = shouldAnimate( { ...attributes } );
			if ( ! animate ) {
				presetData.previewIsPlaying = false;
			}
		}

		// hide the save preset modal if it's open and an unsaveable preset is selected
		if ( showSavePresetModal && hideCreatePresetBtn ) {
			presetData.showSavePresetModal = false;
		}

		return { ...presetData };
	}

	/*
	 * @desc hides the right click menu if it was open
	 * @param Event e - will exist if triggered from a native event
	 * @param boolean disable - if the user chooses "disable" from the right-click menu
	 * @since 1.0.0
	 */
	hideRightClickMenu( e, disable ) {
		// if coming from a native event
		if ( e ) {
			if ( e.type === 'contextmenu' ) {
				const { rcMenuActive } = this.state;
				if ( ! rcMenuActive ) {
					e.preventDefault();
				}
			} else {
				const itmClass = `${ namespace }-rc-menu-itm`;
				const { target } = e;

				// bounce when right-clicking over the right-click menu
				if (
					target.classList.contains( itmClass ) ||
					target.closest( `.${ itmClass }` )
				) {
					return;
				}
			}
		}

		if ( ! disable ) {
			this.removeBodyRcListeners();
		} else {
			this.removeAllRcListeners();
		}

		this.removeBodyRcListeners();
		this.setState( { rcMenuActive: false } );
	}

	/*
	 * @desc called activates the right click menu
	 * @param Event e - the right click event object
	 * @since 1.0.0
	 */
	onRightClick( e ) {
		const { target } = e;

		// bounce if right-clicking over input text (to allow regular copy/paste)
		if (
			target.tagName.toLowerCase() === 'input' &&
			target.type === 'text'
		) {
			return;
		}

		const { rcMenuActive, showSavePresetModal } = this.state;

		// bounce if right-click over the save preset modal
		if ( showSavePresetModal ) {
			const presetClass = `${ namespace }-save-preset`;
			if (
				target.classList.contains( presetClass ) ||
				target.closest( `.${ presetClass }` )
			) {
				return;
			}
		}

		e.preventDefault();
		e.stopImmediatePropagation();

		// if the right click menu is already active and the user right-click's again,
		// hide the menu and then activate the right-click menu again with the new mouse coords
		if ( rcMenuActive ) {
			this.removeBodyRcListeners();
			this.setState( { rcMenuActive: false }, () => {
				this.onRightClick( e );
			} );
			return;
		}

		document.body.addEventListener( 'click', this.hideRightClickMenu );
		document.body.addEventListener(
			'contextmenu',
			this.hideRightClickMenu
		);

		this.setState( {
			rcMenuActive: true,
			rcEvent: e,
		} );
	}

	/*
	 * @desc added whenever the main settings panel is "enabled"
	 * @since 1.0.0
	 */
	addRightClickListener() {
		const { current } = this.settingsRef;
		if ( current ) {
			current.addEventListener( 'contextmenu', this.onRightClick );
		}
	}

	/*
	 * @desc removes right click event listeners from the body
	 * @since 1.0.0
	 */
	removeBodyRcListeners() {
		document.body.removeEventListener( 'click', this.hideRightClickMenu );
		document.body.removeEventListener(
			'contextmenu',
			this.hideRightClickMenu
		);
	}

	/*
	 * @desc added whenever the main settings panel is "disabled"
	 * @since 1.0.0
	 */
	removeAllRcListeners() {
		this.removeBodyRcListeners();
		const { current } = this.settingsRef;

		if ( current ) {
			current.removeEventListener( 'contextmenu', this.onRightClick );
		}
	}

	/*
	 * @desc add right click context menu
	 *       native React synthetic event can't be used for the right-click menu
	 *       because we need to catch the event before it bubbles to the root
	 * @since 1.0.0
	 */
	componentDidMount() {
		const { attributes } = this.props;
		const { pcxEnabled } = attributes;

		if ( pcxEnabled ) {
			this.addRightClickListener();
		}
	}

	/*
	 * @desc kill gsap animations for garbage collection
	 * @since 1.0.0
	 */
	componentWillUnmount() {
		const { globalTimeline } = gsap;
		globalTimeline.clear();

		this.removeAllRcListeners();
		this.settingsRef = null;
		this.animatedElements = null;
	}

	render() {
		const {
			state,
			props,
			updateProp,
			updateState,
			settingsRef,
			hideClearBtn,
			hideRightClickMenu,
			restoreProperties,
			updateFromPreset,
			animatedElements,
			originalSettings,
			updateBatchProps,
		} = this;

		const {
			rcEvent,
			currentTab,
			rcMenuActive,
			ajaxLoading,
			selectedPreset,
		} = state;

		const { attributes } = props;
		const { pcxEnabled } = attributes;
		const { current } = settingsRef;

		const block = {
			currentTab,
			updateProp,
			updateState,
			updateFromPreset,
			state: { ...state },
			props: { ...defaultValues, ...attributes },
		};

		const ajaxIsLoading = ! ajaxLoading ? '' : ' pcx-ajax-loading';
		const onClear =
			! hideClearBtn && selectedPreset !== 'PcxDefaults'
				? restoreProperties
				: false;

		const hasUndo = checkChanges(
			{ ...originalSettings },
			{ ...attributes },
			{ ...defaultValues }
		);
		const onUndo = hasUndo ? restoreProperties : false;

		return (
			<>
				<div
					className={ `${ namespace }-settings${ ajaxIsLoading }` }
					ref={ settingsRef }
				>
					<MyToggleControl
						prop="pcxEnabled"
						label={ __( 'Enable/Disable', 'polished-content' ) }
						checked={ pcxEnabled }
						callback={ updateProp }
					/>
					{ pcxEnabled && (
						<>
							<MyHeaderControl
								block={ block }
								ref={ animatedElements }
							/>
							<hr />
							<MyTabPanels block={ block } />
							<MyResetButtons
								onClear={ onClear }
								onUndo={ onUndo }
								originalSettings={ { ...originalSettings } }
							/>
							{ rcMenuActive && current && (
								<MyRightClickMenu
									wrap={ current }
									rcEvent={ rcEvent }
									attrs={ block.props }
									menuBuffer={ 16 }
									hideRightClickMenu={ hideRightClickMenu }
									updateState={ updateState }
									updateBatchProps={ updateBatchProps }
								/>
							) }
						</>
					) }
				</div>
			</>
		);
	}
}

export default PolishedContentEditor;
