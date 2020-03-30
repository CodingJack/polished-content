/*
	Polished Content v1.1.0
*/

// migration from gsap v2 to gsap v3
export const easeLookup = ( easing ) => {
	if ( ! easing ) {
		return null;
	}
	if ( easing.search( 'Power0' ) !== -1 ) {
		return 'none';
	}

	return easing
		.toLowerCase()
		.replace( 'ease', '' )
		.replace( 'inout', 'inOut' );
};
