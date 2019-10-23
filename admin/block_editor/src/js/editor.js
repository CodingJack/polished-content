/**
 * WordPress dependencies.
 */
const {
	Component,
	createRef,
} = wp.element;

const { __ } = wp.i18n;

// sandboxing gsap
import { gsap, gsapReset } from '../../../../shared/js/sandbox-gsap';
require( 'gsap/umd/TweenMax' );
gsapReset();

/**
 * Internal dependencies.
 */
import {
	namespace,
	selectOptions,
	defaultValues,
} from '../../../../shared/js/data';

import {
	playAnimation,
	resetAnimation,
} from './animation';

import {
	shouldAnimate,
	compareProps,
	checkChanges,
	checkInitialTab,
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
		this.updateProp = this.updateProps.bind( this );
		this.updateState = this.updateStates.bind( this );

		this.propertyRestore = this.restoreProperties.bind( this );
		this.updateFromPreset = this.updateFromPresets.bind( this );
		this.updateBatchProp = this.updateBatchProps.bind( this );

		this.rightClick = this.onRightClick.bind( this );
		this.hideRcMenu = this.hideRightClickMenu.bind( this );

		this.hideClearBtn = ! checkChanges( { ...defaultValues }, { ...attributes } );
		this.originalSettings = getOriginalSettings( { ... attributes } );
	}

	/*
	 * @desc updates the block's attributes on a settings change
	 * @param string/boolean/number value - the prop's new value
	 * @param string prop - the attribute's name
	 * @since 1.0.0
	*/
	updateProps( value, prop ) {
		const {
			attributes,
		} = this.props;

		const {
			showSavePresetModal,
			previewIsPlaying,
		} = this.state;

		const newProp = { [ prop ]: value };
		const newProps = { ...attributes, ...newProp };
		const presetData = getPresetSelection( { ...newProps } );
		const { selectedPreset } = presetData;

		if ( showSavePresetModal && selectedPreset !== 'PcxCustom' ) {
			presetData.showSavePresetModal = false;
		}

		const newState = { ...presetData };
		const animate = shouldAnimate( { ...newProps } );

		if ( ! previewIsPlaying && animate ) {
			newState.previewIsPlaying = true;
		}

		if ( prop === 'pcxEnabled' ) {
			if ( value ) {
				this.addRightClickListener();
			} else {
				this.removeAllRcListeners();
			}
		}

		this.setState( { ...newState } );
		this.props.setAttributes( newProp );
	}

	/*
	 * @desc updates the state based on a user change and maybe calls a callback
	 * @param object args - the new state settings
	 * @param function callback - a possible callback to call asynchronously
	 * @since 1.0.0
	*/
	updateStates( args, callback ) {
		this.setState( args, callback );
	}

	/*
	 * @desc updates attributes and state when a settings preset is selected
	 * @param string selectedPreset - preset key that was selected
	 * @param boolean fromAjax - true if called after a save/delete preset event
	 * @param boolean fromDelete - true if called from a delete preset event
	 * @since 1.0.0
	*/
	updateFromPresets( selectedPreset, fromAjax, fromDelete ) {
		const { pcxAnimations } = selectOptions;
		const newProps = { ...defaultValues, ...pcxAnimations[ selectedPreset ] };

		const newState = { previewIsPlaying: shouldAnimate( { ...newProps } ) };
		const presetData = getPresetSelection( { ...newProps } );

		const { showSavePresetModal } = this.state;
		if ( showSavePresetModal && selectedPreset !== 'PcxCustom' ) {
			presetData.showSavePresetModal = false;
		}

		if ( fromAjax ) {
			newState.ajaxLoading = false;
		}

		this.setState( { ...newState, ...presetData } );

		if ( ! fromDelete ) {
			this.props.setAttributes( newProps );
		}
	}

	/*
	 * @desc used to determine if we should play, replay or reset the animated element
	 * @param object e - the event object if coming from a restore defaults button click
	 * @param object originalSettings - the default values if coming from an undo changes action
	 * @since 1.0.0
	*/
	restoreProperties( e, originalSettings ) {
		const newProps = originalSettings || { ...defaultValues };
		const presetData = getPresetSelection( { ...newProps } );

		let previewIsPlaying;
		if ( originalSettings ) {
			previewIsPlaying = shouldAnimate( { ...newProps } );
		}

		const newState = { previewIsPlaying };
		const newData = { showSavePresetModal: false };

		this.setState( { ...newState, ...presetData, ...newData } );
		this.props.setAttributes( newProps );
	}

	/*
	 * @desc used to determine if we should play, replay or reset the
	 *       animated element and also to verify the preset selection
	 * @param object prevProps - the component's previous props
	 * @param object prevState - the component's previous state
	 * @since 1.0.0
	*/
	componentDidUpdate( prevProps, prevState ) {
		const {
			el,
			container,
		} = this.animatedElements;

		const { current: curElement } = el;
		const { current: curContainer } = container;

		const { attributes } = this.props;
		const { attributes: prevAttributes } = prevProps;
		const propsChanged = compareProps( { ...prevAttributes }, { ...attributes } );

		/*
		 * check if the preview animation should play
		*/
		if ( curElement && curContainer ) {
			const { previewIsPlaying } = this.state;

			if ( previewIsPlaying ) {
				const { previewIsPlaying: prevPlaying } = prevState;
				let shouldPlay = previewIsPlaying !== prevPlaying;

				if ( ! shouldPlay ) {
					shouldPlay = propsChanged;
				}
				if ( shouldPlay ) {
					playAnimation( curElement, curContainer, { ...defaultValues, ...attributes } );
				}
			} else {
				resetAnimation( curElement, true );
			}
		}

		/*
		 * check if the preset selection is accurate
		*/
		if ( propsChanged ) {
			const {
				selectedPreset,
				hideSavePresetBtn,
				hideDeleteBtn,
			} = this.state;

			const curPresetData = {
				selectedPreset,
				hideSavePresetBtn,
				hideDeleteBtn,
			};

			const presetData = getPresetSelection( { ...attributes } );
			if ( ! objectValuesEqual( presetData, curPresetData ) ) {
				const { showSavePresetModal } = this.state;
				const { selectedPreset: curPreset } = presetData;

				if ( showSavePresetModal && curPreset !== 'PcxCustom' ) {
					presetData.showSavePresetModal = false;
				}

				this.setState( { ...presetData } );
			}
		}
	}

	/*
	 * @desc paste previously copied settings from right-click menu into a block
	 * @since 1.0.0
	*/
	updateBatchProps() {
		const {
			copiedSettings,
		} = polishedContentGlobals; // eslint-disable-line no-undef

		const { attributes } = this.props;
		const newProps = { ...getOriginalSettings( { ...attributes } ), ...copiedSettings };
		const newState = { previewIsPlaying: shouldAnimate( { ...newProps } ) };
		const presetData = getPresetSelection( { ...newProps } );

		const { showSavePresetModal } = this.state;
		const { selectedPreset } = presetData;

		if ( showSavePresetModal && selectedPreset !== 'PcxCustom' ) {
			presetData.showSavePresetModal = false;
		}

		this.setState( { ...newState, ...presetData } );
		this.props.setAttributes( { ...copiedSettings } );
	}

	/*
	 * @desc hides the right click menu if it was open
	 * @param Event e - will exist if triggered from a native event
	 * @since 1.0.0
	*/
	hideRightClickMenu( e, disable ) {
		if ( e ) {
			if ( e.type === 'contextmenu' ) {
				const { rcMenuActive } = this.state;
				if ( ! rcMenuActive ) {
					e.preventDefault();
				}
			} else {
				const itmClass = `${ namespace }-rc-menu-itm`;
				if ( e.target.classList.contains( itmClass ) || e.target.closest( `.${ itmClass }` ) ) {
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
		if ( target.tagName.toLowerCase() === 'input' && target.type === 'text' ) {
			return;
		}

		const {
			rcMenuActive,
			showSavePresetModal,
		} = this.state;

		// bounce if save preset modal is open
		if ( showSavePresetModal ) {
			const presetClass = `${ namespace }-save-preset`;
			if ( target.classList.contains( presetClass ) || target.closest( `.${ presetClass }` ) ) {
				return;
			}
		}

		e.preventDefault();
		e.stopImmediatePropagation();

		if ( rcMenuActive ) {
			this.removeBodyRcListeners();
			this.setState( { rcMenuActive: false }, () => {
				this.onRightClick( e );
			} );
			return;
		}

		this.setState( {
			rcMenuActive: true,
			rcEvent: e,
		}, () => {
			document.body.addEventListener( 'click', this.hideRcMenu );
			document.body.addEventListener( 'contextmenu', this.hideRcMenu );
		} );
	}

	/*
	 * @desc added whenever the main settings panel is "enabled"
	 * @since 1.0.0
	*/
	addRightClickListener() {
		const { current } = this.settingsRef;
		if ( current ) {
			current.addEventListener( 'contextmenu', this.rightClick );
		}
	}

	/*
	 * @desc removes right click event listeners from the body
	 * @since 1.0.0
	*/
	removeBodyRcListeners() {
		document.body.removeEventListener( 'click', this.hideRcMenu );
		document.body.removeEventListener( 'contextmenu', this.hideRcMenu );
	}

	/*
	 * @desc added whenever the main settings panel is "disabled"
	 * @since 1.0.0
	*/
	removeAllRcListeners() {
		this.removeBodyRcListeners();
		const { current } = this.settingsRef;

		if ( current ) {
			current.removeEventListener( 'contextmenu', this.rightClick );
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
		gsap.TweenMax.killAll( true );
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
			hideRcMenu,
			hideClearBtn,
			propertyRestore,
			updateFromPreset,
			animatedElements,
			originalSettings,
			updateBatchProp,
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
		const onClear = ! hideClearBtn && selectedPreset !== 'PcxDefaults' ? propertyRestore : false;

		const hasUndo = checkChanges( { ...originalSettings }, { ...attributes }, { ...defaultValues } );
		const onUndo = hasUndo ? propertyRestore : false;

		return (
			<>
				<div className={ `${ namespace }-settings${ ajaxIsLoading }` } ref={ settingsRef }>
					<MyToggleControl
						prop="pcxEnabled"
						label={ __( 'Enable/Disable', 'polished-content' ) }
						checked={ pcxEnabled }
						callback={ updateProp }
					/>
					{ pcxEnabled && (
						<>
							<MyHeaderControl block={ block } ref={ animatedElements } />
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
									hideRcMenu={ hideRcMenu }
									updateState={ updateState }
									updateBatchProp={ updateBatchProp }
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
