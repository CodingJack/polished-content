/**
 * External dependencies.
 */
import classnames from 'classnames';

/**
 * Internal dependencies.
 */
require( './sidebar.js' );

import ErrorBoundary from './error';
import Loader from './loader';

import { namespace, defaultData } from '../../../../shared/js/data';

import { getClasses, verifyObjects } from './utils';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { PanelBody } = wp.components;
const { createHigherOrderComponent } = wp.compose;
const { InspectorControls } = wp.blockEditor;
const { addFilter } = wp.hooks;
const { hasBlockSupport } = wp.blocks;

let supportedBlocks;
let openPanel;

/*
 * @desc merges block attributes with plugin attributes
 * @param object block - the blocks core settings object
 * @returns object - the possibly modified block
 * @since 1.0.0
 */
const addAttributes = ( block ) => {
	if ( ! verifyObjects( [ block ] ) ) {
		return block;
	}

	const { name } = block;
	const supportedBlock = supportedBlocks.indexOf( name ) !== -1;

	if ( supportedBlock ) {
		const supportsClass = hasBlockSupport( block, 'customClassName', true );

		if ( supportsClass ) {
			const { attributes } = block;

			if ( verifyObjects( [ attributes ] ) ) {
				block.attributes = { ...defaultData, ...attributes };
			}
		}
	}

	return block;
};

/*
 * @desc adds custom class names for the block on the frontend
 * @param object extraProps - block props that can be modified
 * @param object block - the blocks core settings object
 * @param attributes block - the blocks current attributes
 * @returns object - the possibly modified extraProps
 * @since 1.0.0
 */
const addClasses = ( extraProps, block, attributes ) => {
	if ( ! verifyObjects( [ extraProps, block, attributes ] ) ) {
		return extraProps;
	}

	const { name } = block;
	if ( supportedBlocks.indexOf( name ) === -1 ) {
		return extraProps;
	}

	const { pcxEnabled } = attributes;
	const supportsClass = hasBlockSupport(
		extraProps,
		'customClassName',
		true
	);

	if ( pcxEnabled && supportsClass ) {
		const settings = getClasses( { ...attributes } );

		const { animate, classes } = settings;

		if ( animate && classes ) {
			const blockName = name.replace( '/', '-' );
			extraProps.className = classnames(
				extraProps.className,
				`${ namespace }_${ blockName }${ classes }`
			);
		}
	}

	return extraProps;
};

const polishedContentControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { name } = props;

		if ( supportedBlocks.indexOf( name ) === -1 ) {
			return <BlockEdit { ...props } />;
		}

		const { setAttributes, isSelected, attributes } = props;

		if ( ! verifyObjects( [ setAttributes, attributes ] ) ) {
			return <BlockEdit { ...props } />;
		}

		const { pcxEnabled } = attributes;

		if ( pcxEnabled !== undefined && isSelected ) {
			return (
				<>
					<BlockEdit { ...props } />
					<InspectorControls>
						<PanelBody
							title={ __(
								'Polished Content',
								'polished-content'
							) }
							className={ `${ namespace }` }
							initialOpen={ openPanel }
						>
							<ErrorBoundary>
								<Loader
									bufferTime={ 250 }
									namespace={ namespace }
									resolve={ () => import( './module' ) }
									setAttributes={ setAttributes }
									attributes={ attributes }
								/>
							</ErrorBoundary>
						</PanelBody>
					</InspectorControls>
				</>
			);
		}

		return <BlockEdit { ...props } />;
	};
}, 'polishedContentControls' );

if ( typeof polishedContentGlobals !== 'undefined' ) {
	const { defaultSettings, chunkDirectory } = polishedContentGlobals; // eslint-disable-line no-undef

	__webpack_public_path__ = chunkDirectory; // eslint-disable-line no-undef, camelcase

	const { allowedBlocks, panelOpen } = defaultSettings;

	supportedBlocks = allowedBlocks;
	openPanel = panelOpen;

	addFilter(
		'editor.BlockEdit',
		`${ namespace }/polishedContentControls`,
		polishedContentControls
	);
	addFilter(
		'blocks.registerBlockType',
		`${ namespace }/addAttributes`,
		addAttributes
	);

	addFilter(
		'blocks.getSaveContent.extraProps',
		`${ namespace }/addClasses`,
		addClasses
	);
}
