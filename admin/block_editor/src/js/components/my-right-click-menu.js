/**
 * Internal dependencies.
 */
import {
	namespace,
	panelSettings,
	rightClickItems,
} from '../../../../../shared/js/data';

/**
 * WordPress dependencies.
 */
const {
	Component,
	createRef,
} = wp.element;

const writeSettings = ( key, attrs, settings ) => {
	panelSettings[ key ].forEach( ( prop ) => {
		settings[ prop ] = attrs[ prop ];
	} );
};

const RightClickItems = ( { attrs, hideRcMenu, updateState, updateBatchProp } ) => {
	const {
		copiedPanel,
		copiedSettings,
	} = polishedContentGlobals; // eslint-disable-line no-undef

	const rcItems = { ...rightClickItems };
	if ( ! copiedSettings ) {
		delete rcItems.paste;
	}

	return Object.keys( rcItems ).map( ( key, index ) => {
		const itm = rcItems[ key ];
		let settings;

		const onClick = () => {
			switch ( key ) {
				case 'all':
					settings = {};
					Object.keys( panelSettings ).forEach( ( panel ) => {
						writeSettings( panel, attrs, settings );
					} );
					break;
				case 'paste':
					updateBatchProp();

					// if copied from a single panel's settings, change the  panel for the current block
					if ( copiedPanel ) {
						updateState( { currentTab: copiedPanel } );
					}
					break;
				case 'disable':
					hideRcMenu( false, true );
					return;
				default:
					settings = {};
					writeSettings( key, attrs, settings );
				// end default
			}

			if ( settings ) {
				polishedContentGlobals.copiedSettings = settings; // eslint-disable-line no-undef
				polishedContentGlobals.copiedPanel = key !== 'all' && key !== 'paste' ? key : null; // eslint-disable-line no-undef
			}

			hideRcMenu();
		};

		const onKeyDown = ( e ) => {
			if ( e.which === 13 ) {
				onClick();
			}
		};

		return (
			<div role="button" tabIndex={ index } key={ `${ namespace }-rc-item-${ key }` } className={ `${ namespace }-rc-menu-itm` } onClick={ onClick } onKeyDown={ onKeyDown }>
				<span className={ `dashicons dashicons-${ itm.icon }` }></span>
				<span className={ `${ namespace }-rc-menu-text` }>{ itm.text }</span>
			</div>
		);
	} );
};

class MyRightClickMenu extends Component {
	constructor() {
		super( ...arguments );
		this.ref = createRef();
	}

	componentDidMount() {
		const {
			wrap,
			rcEvent,
			menuBuffer,
		} = this.props;

		const {
			clientX,
			clientY,
		} = rcEvent;

		const el = this.ref.current;
		const elRect = el.getBoundingClientRect();
		const wrapRect = wrap.getBoundingClientRect();

		const {
			width: elWidth,
			height: elHeight,
		} = elRect;

		const {
			top: wrapTop,
			left: wrapLeft,
			width: wrapWidth,
			height: wrapHeight,
		} = wrapRect;

		const posX = clientX - wrapLeft;
		const posY = clientY - wrapTop;

		let posLeft = posX + elWidth < wrapWidth + menuBuffer ? posX : posX - elWidth;
		let posTop = posY + elHeight < wrapHeight ? posY : posY - elHeight;

		posLeft = Math.max( 0, posLeft );
		posLeft = Math.min( posLeft, wrapWidth - elWidth );

		posTop = Math.max( 0, posTop );
		posTop = Math.min( posTop, wrapHeight - elHeight );

		el.style.left = `${ posLeft }px`;
		el.style.top = `${ posTop }px`;
		el.style.visibility = 'visible';
	}

	componentWillUnmount() {
		this.ref = null;
	}

	render() {
		return (
			<div className={ `${ namespace }-rc-menu` } ref={ this.ref }>
				<RightClickItems { ...this.props } />
			</div>
		);
	}
}

export default MyRightClickMenu;

