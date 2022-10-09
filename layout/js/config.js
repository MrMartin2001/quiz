/* Author: Dominik Beese */

// get and set property
function getProperty(property, defaultValue) {
	if (localStorage.getItem(property) == null) setProperty(property, defaultValue);
	return localStorage.getItem(property);
}
function setProperty(property, value) {
	localStorage.setItem(property, value);
}

// generate html for show japanese checkbox
function generateShowJapaneseCheckbox(parent, callback) {
	var checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.checked = parseInt(getProperty('showJapanese', 0));
	checkbox.onclick = () => {
		setProperty('showJapanese', checkbox.checked ? 1 : 0);
		callback();
	}
	output.appendChild(checkbox);
	var label = document.createElement('label');
	label.innerText = _tr('en', 'Show Japanese Names', 'de', 'Japanische Namen zeigen');
	label.style.fontSize = '0.85em';
	output.appendChild(label);
	parent.appendChild(label);
}
