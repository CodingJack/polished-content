/**
 * External dependencies.
 */

import React from 'react';

const { Fragment } = React;

/**
 * Internal dependencies.
 */

import OptionsList from './options-list';
import ToggleItems from './primitives/toggle-items';

const Wrapper = ( { wrapIt, wrapper, children } ) =>
	wrapIt ? wrapper( children ) : children;

const OptionColumns = ( { props, option, data, callback, description } ) => {
	const { namespace, maxColumnItems } = props;

	const { prop, type, mode, icons, ranges, subColumns } = option;

	let { list } = option;

	if ( ! list ) {
		list = {};
	}

	const len = list ? Object.keys( list ).length : 1;
	const numColumns = Math.max( len / maxColumnItems, 1 );

	const columns = [];
	for ( let i = 0; i < numColumns; i++ ) {
		columns[ i ] = i;
	}

	const maxIteration = columns.length - 1;
	const addToggle = type === 'checkbox';
	const marginRight = ! description ? `${ namespace }-margin` : '';
	const wrapDiv = type === 'checkbox' || len > 1 || maxIteration > 0;

	return columns.map( ( iteration ) => {
		const first = iteration === 0 ? ' first' : '';

		const items = Object.keys( list ).filter( ( item, index ) => {
			const count = maxColumnItems * iteration;
			return index >= count && index < count + maxColumnItems;
		} );

		return (
			<Fragment key={ `${ prop }-${ iteration }` }>
				<Wrapper
					wrapIt={ wrapDiv }
					wrapper={ ( children ) => (
						<div
							className={ `${ namespace }-inner${ first } ${ marginRight }` }
						>
							{ children }
						</div>
					) }
				>
					<div
						className={ `${ namespace }-inner${ first } ${ marginRight }` }
					>
						<OptionsList
							namespace={ namespace }
							list={ list }
							items={ items }
							data={ data }
							callback={ callback }
							icons={ icons }
							type={ type }
							prop={ prop }
							mode={ mode }
							ranges={ ranges }
							subColumns={ subColumns }
						/>
					</div>
				</Wrapper>
				{ iteration === maxIteration && (
					<>
						<div className="clear"></div>
						{ addToggle && (
							<ToggleItems
								namespace={ namespace }
								list={ list }
								prop={ prop }
								data={ data }
								callback={ callback }
							/>
						) }
					</>
				) }
			</Fragment>
		);
	} );
};

export default OptionColumns;
