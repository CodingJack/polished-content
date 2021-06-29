/**
 * External dependencies.
 */
 import React from 'react';

/*
 * this is the main entry point for the lazy-loaded chunk
 */
import PolishedContentEditor from './editor';
const Module = ( props ) => <PolishedContentEditor { ...props } />;
export default Module;
