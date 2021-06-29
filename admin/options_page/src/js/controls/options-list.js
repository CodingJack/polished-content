/**
 * External dependencies.
 */

import React from 'react';

/**
 * Internal dependencies.
 */

import CheckRadios from './primitives/check-radios';
import NumberInputs from './primitives/number-inputs';
import SelectBox from './primitives/select-box';
import InputRanges from './primitives/input-ranges';
import ToggleButtons from './primitives/toggle-buttons';
import CodeMirror from './code-mirror';

const components = {
  number: NumberInputs,
  radio: CheckRadios,
  checkbox: CheckRadios,
  select: SelectBox,
  range: InputRanges,
  toggle: ToggleButtons,
  codemirror: CodeMirror,
};

const OptionsList = ( props ) => {
  const { type } = props;

  const Component = components[ type ];
  return <Component { ...props } />;
};

export default OptionsList;
