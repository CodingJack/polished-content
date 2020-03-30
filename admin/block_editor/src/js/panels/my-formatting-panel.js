/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies.
 */
import MyTextControl from '../components/my-text-control';
import MySelectControl from '../components/my-select-control';
import MyToggleControl from '../components/my-toggle-control';
import MyAlignButtons from '../components/my-align-buttons';
import MyClassesControl from '../components/my-classes-control';

const MyFormattingPanel = ( { block } ) => {
	const { props, updateProp } = block;

	const { pcxInherit, pcxAlign, pcxInline, pcxFloat, pcxClass } = props;

	return (
		<>
			<MyToggleControl
				prop="pcxInherit"
				label={ __( 'Inherit Margins', 'polished-content' ) }
				checked={ pcxInherit }
				callback={ updateProp }
				help={ __(
					'Removes margins from the Block allowing the animated wrapper to inherit them instead.',
					'polished-content'
				) }
			/>
			<MyToggleControl
				prop="pcxInline"
				label={ __( 'Animate as Inline Block', 'polished-content' ) }
				checked={ pcxInline }
				callback={ updateProp }
				help={ __(
					'Useful for Buttons and other content that is not intended to appear full-width.',
					'polished-content'
				) }
			/>
			{ pcxInline && (
				<MyAlignButtons
					prop="pcxAlign"
					value={ pcxAlign }
					callback={ updateProp }
				/>
			) }
			<MySelectControl
				prop="pcxFloat"
				label={ __( 'CSS Float', 'polished-content' ) }
				value={ pcxFloat }
				callback={ updateProp }
				help={ __(
					'Useful if your content is normally meant to display inline',
					'polished-content'
				) }
			/>
			<MyTextControl
				type="text"
				validity="class"
				prop="pcxClass"
				label={ __( 'Wrapper Class', 'polished-content' ) }
				value={ pcxClass }
				callback={ updateProp }
				help={ __(
					"Add an optional class name to the animation's outer wrapper",
					'polished-content'
				) }
			/>
			<MyClassesControl block={ block } />
		</>
	);
};

export default MyFormattingPanel;
