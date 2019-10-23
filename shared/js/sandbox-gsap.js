/*
 * sandboxing gsap
*/
export const gsap = window.GreenSockGlobals = {};

export const gsapReset = () => {
	window.GreenSockGlobals = null;
	window._gsQueue = null;
	window._gsDefine = null;
};
