/*
 * sandboxing gsap ( greensock pollutes globals by default )
*/
export const gsap = window.GreenSockGlobals = {};

export const gsapReset = () => {
	window.GreenSockGlobals = null;
	window._gsQueue = null;
	window._gsDefine = null;
};
