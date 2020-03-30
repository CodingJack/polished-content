/**
 * External dependencies.
 */

import React from 'react';

const { Fragment } = React;

/**
 * Internal dependencies.
 */
import ParagraphContent from './paragraph-content';

const Wrapper = ( { wrapIt, wrapper, children } ) =>
	wrapIt ? wrapper( children ) : children;

const HTMLContent = ( { namespace, html, changePage, menuIndex } ) => {
	const { header, isList, paragraphs, className } = html;

	const cssClass = className ? `${ namespace }-html-${ className }` : '';

	return (
		<div className={ cssClass }>
			<h1>{ header }</h1>
			<Wrapper
				wrapIt={ isList }
				wrapper={ ( children ) => <ul>{ children }</ul> }
			>
				{ paragraphs.map( ( paragraph, i ) => {
					const isText = ! Array.isArray( paragraph );

					return (
						<Fragment key={ `${ namespace }-paragraph-${ i }` }>
							<Wrapper
								wrapIt={ isText }
								wrapper={ ( children ) =>
									! isList ? (
										<p>{ children }</p>
									) : (
										<li>{ children }</li>
									)
								}
							>
								<ParagraphContent
									namespace={ namespace }
									paragraph={ paragraph }
									changePage={ changePage }
									isText={ isText }
									menuIndex={ menuIndex }
								/>
							</Wrapper>
						</Fragment>
					);
				} ) }
			</Wrapper>
			<div className="clear"></div>
		</div>
	);
};

export default HTMLContent;
