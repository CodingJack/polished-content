/*
 * pretty much a clone from the original except the state has been lifted up
 * so the panels can be triggered from outside the component
 * https://github.com/WordPress/gutenberg/tree/master/packages/components/src/tab-panel
 */

/**
 * External dependencies
 */
import classnames from 'classnames';
import { partial, noop, find } from 'lodash';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;
const { withInstanceId } = wp.compose;

const { Button, NavigableMenu } = wp.components;

const TabButton = ( { tabId, onClick, children, selected, ...rest } ) => (
	<Button
		role="tab"
		isSecondary
		tabIndex={ selected ? null : -1 }
		aria-selected={ selected }
		id={ tabId }
		onClick={ onClick }
		{ ...rest }
	>
		{ children }
	</Button>
);

class MyTabPanel extends Component {
	constructor() {
		super( ...arguments );

		this.handleClick = this.handleClick.bind( this );
		this.onNavigate = this.onNavigate.bind( this );
	}

	handleClick( tabKey ) {
		const { onSelect = noop } = this.props;
		onSelect( tabKey );
	}

	onNavigate( childIndex, child ) {
		child.click();
	}

	render() {
		const {
			activeClass = 'is-active',
			className,
			instanceId,
			currentTab,
			orientation = 'horizontal',
			tabs,
		} = this.props;

		const selectedTab = find( tabs, { name: currentTab } );
		const selectedId = instanceId + '-' + selectedTab.name;

		return (
			<div className={ className }>
				<NavigableMenu
					role="tablist"
					orientation={ orientation }
					onNavigate={ this.onNavigate }
					className="components-tab-panel__tabs"
				>
					{ tabs.map( ( tab ) => (
						<TabButton
							className={ classnames( tab.className, {
								[ activeClass ]: tab.name === currentTab,
							} ) }
							isSecondary={ tab.name !== currentTab }
							isPrimary={ tab.name === currentTab }
							tabId={ instanceId + '-' + tab.name }
							aria-controls={
								instanceId + '-' + tab.name + '-view'
							}
							selected={ tab.name === currentTab }
							key={ tab.name }
							onClick={ partial( this.handleClick, tab.name ) }
						>
							{ tab.title }
						</TabButton>
					) ) }
				</NavigableMenu>
				{ selectedTab && (
					<div
						aria-labelledby={ selectedId }
						role="tabpanel"
						id={ selectedId + '-view' }
						className="components-tab-panel__tab-content"
						tabIndex="0"
					>
						{ this.props.children( selectedTab ) }
					</div>
				) }
			</div>
		);
	}
}

export default withInstanceId( MyTabPanel );
