/**
 * External dependencies.
 */

import React from 'react';

const { Fragment } = React;

/**
 * Internal dependencies.
 */
const { subMenus } = polishedContentGlobals; // eslint-disable-line no-undef

/*
 * these functions are used to convert some strings to HTML
 * to avoid dangerouslySetInnerHTML, well, because it's dangerous :D
 */

/*
 * parses links embedded in strings with this format:
 * {{Link Text||http:www.site.com||target}}
 */
const ParseLinks = ( { text, changePage } ) => {
  /*
   * internal links with a structure of:
   * {{Link Text||#menuIndex|menuItem}}
   * this allows us to trigger any tab from any menu
   */
  const onLinkClick = function( e ) {
    const href = e.target.dataset.href.substring( 1 ).split( '|' );
    if ( href.length < 2 ) {
      console.log( 'link formatted incorrectly' ); // eslint-disable-line no-console
      return;
    }

    const menuIndex = href[ 0 ];
    const menuItem = parseInt( href[ 1 ], 10 );

    subMenus[ menuIndex ] = menuItem;
    changePage[ menuIndex ]( menuItem );
    e.preventDefault();
  };

  if ( /(?=.*\{\{)(?=.*\|\|)(?=.*\}\})/.test( text ) ) {
    const str = unescape( text );
    const links = str.split( '{{' );

    return links.map( ( itm, index ) => {
      if ( itm.search( /\}\}/ ) !== -1 ) {
        const txt = itm.split( '}}' );

        if ( txt[ 0 ].search( /\|\|/ ) !== -1 ) {
          const a = txt[ 0 ].split( '||' );
          const target = a[ 2 ] ? `_${ a[ 2 ] }` : null;
          const onClick =
            a[ 1 ].charAt( 0 ) === '#' ? onLinkClick : null;

          return (
            <Fragment key={ index }>
              <a
                href={ a[ 1 ] }
                target={ target }
                data-href={ a[ 1 ] }
                onClick={ onClick }
              >
                { a[ 0 ] }
              </a>
              { txt[ 1 ] }
            </Fragment>
          );
        }
      }
      return itm;
    } );
  }

  return <>{ text }</>;
};

/*
 * parses strings into span elements with a class from this format:
 * [[Text||className]]
 */
const ParseHTML = ( { namespace, text, changePage } ) => {
  if ( /(?=.*\[\[)(?=.*\|\|)(?=.*\]\])/.test( text ) ) {
    const str = unescape( text );
    const spans = str.split( '[[' );

    return spans.map( ( itm, index ) => {
      if ( itm.search( /\]\]/ ) !== -1 ) {
        const txt = itm.split( ']]' );

        if ( txt[ 0 ].search( /\|\|/ ) !== -1 ) {
          const c = txt[ 0 ].split( '||' );

          return (
            <Fragment key={ `${ namespace }-span-${ index }` }>
              <span className={ `${ namespace }-${ c[ 1 ] }` }>
                { c[ 0 ] }
              </span>
              <ParseLinks
                text={ txt[ 1 ] }
                changePage={ changePage }
              />
            </Fragment>
          );
        }
      }
      return (
        <ParseLinks
          key={ `${ namespace }-span-${ index }` }
          text={ itm }
          changePage={ changePage }
        />
      );
    } );
  }

  return <ParseLinks text={ text } changePage={ changePage } />;
};

export default ParseHTML;
