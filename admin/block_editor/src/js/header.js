/**
 * WordPress dependencies.
 */
const {
	forwardRef,
} = wp.element;

/**
 * Internal dependencies.
 */
import MyPreviewControl from './components/my-preview-control';
import MyPresetsControl from './components/my-presets-control';

const MyHeaderControl = forwardRef( ( { block }, animatedElements ) => {
	return (
		<>
			<MyPreviewControl block={ block } ref={ animatedElements } />
			<MyPresetsControl block={ block } />
		</>
	);
} );

export default MyHeaderControl;

