/* Author: Dominik Beese */

const defaultLanguage = 'de';

// get stored language, or set default
function getLanguage() {
	if (localStorage.getItem('language') == null) setLanguage(defaultLanguage);
	return localStorage.getItem('language');
}

// store language
function setLanguage(lang) {
	localStorage.setItem('language', lang);
}

// generate html for language selection
function _generateLanguages(...args) {
	function flag(lang) {
		if (lang == 'de') return '&#127465;&#127466;';
		if (lang == 'en') return '&#127468;&#127463;';
		if (lang == 'es') return '&#127466;&#127480;';
		if (lang == 'fr') return '&#127467;&#127479;';
		if (lang == 'it') return '&#127470;&#127481;';
	}
	var s = '<div class="language">';
	for (let lang of args)
		s += `<a href="" onclick="setLanguage('${lang}');">${flag(lang)}</a>`;
	s += '</div>';
	return s;
}

// write html for language selection
function generateLanguages(...args) {
	document.write(_generateLanguages(...args));
}

// tranlsate kwargs string of (lang, translation) pairs
function _tr(...kwargs) {
	var lang = getLanguage();
	for (let i = 0; i < kwargs.length; i += 2)
		if (lang == kwargs[i]) return kwargs[i+1];
	return kwargs[1];
}

// translate and write kwargs string of (lang, translation) pairs
function __tr(...kwargs) {
	document.write(_tr(...kwargs));
}
