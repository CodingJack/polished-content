/**
 * External dependencies.
 */

import React from 'react';

const {
	Fragment,
} = React;

/**
 * Internal dependencies.
 */
import ParseHTML from './parse-html';

const GroupedText = ( { namespace, paragraph, changePage, menuIndex } ) => {
	const {
		subheader,
	} = paragraph;

	let {
		content,
	} = paragraph;

	if ( ! Array.isArray( content ) ) {
		content = [ content ];
	}

	return (
		<>
			<span className={ `${ namespace }-subheader` }>{ subheader }</span>
			{
				content.map( ( text, index ) => {
					return (
						<Fragment key={ `${ namespace }-grouped-${ index }` }>
							<span className={ `${ namespace }-paragraph` }>
								<ParseHTML
									namespace={ namespace }
									text={ text }
									changePage={ changePage }
									menuIndex={ menuIndex }
								/>
							</span>
						</Fragment>
					);
				} )
			}
		</>
	);
};

export default GroupedText;
