/* Author: Dominik Beese */

/* =================== */
/* === DEFINITIONS === */
/* =================== */

/* === INFO === */
/*
Dieses Skript stylet <code> tags, die mit dem class-Attribute eine bestimmte Sprache zugeordnet bekommen haben.
Beispiel: '<code class="python">def pythonCode()</code>'

Eine Definition besteht aus einer List von Objekten. Jedes Element gibt ein Feature an.
Features sind Dinge wie Kommentare, Strings, Zahlen und Keywords, die einen bestimmten Style erhalten sollen.

Ein Feature-Objekt hat mehrere Eigenschaften:
  * regex: Ein regulärer Ausdruck, der das Feature matchen soll. Alles, was gematchet wird, wird gestylet.
  * tokens: Ein String mit leerzeichen getrennten Begriffen, die gematchet werden sollen.
            Diese werden nach absteigender Länge sortiert, damit Fehler beim matching vermieden werden.
  ! style: Der Inhalt des html-Attributs style, der für dieses Feature benutzt werden soll.
  ? fullWord: falls true, muss dieses Feature ein ganzes Wort sein, das heißt es darf nicht Teil (Anfang, Ende, Mitte) eines Wortes sein.
Dabei müssen style und entweder regex oder tokens angegeben werden.

Wichtig ist es, auf die Reihenfolge der Features zu achten.
Sollen besipielsweise keine Keywords in Kommentaren gestylet werden, müssen Kommentare zuerst definiert werden.

Hinweise:
  * Auf jede Definition muss die Methode compile(lang) aufgerufen werden, damit die regulären Ausdrücke kompiliert werden.
  * Zufällig auftretende Tags wie 'ab<cd>e' müssen manuell durch &lt; und &gt; escapet werden.
    Es hilft auch, den gesamten Code innherhalb des <code> Tags in einen <xmp> Tag zu verpacken.
*/


/* === JSON (json) === */
/*
  Uses the following colors:
  --json-key, --json-string, --json-number, --json-operator
*/
var LANG_JSON = [
	// keys
	{'regex': String.raw`"(\\"|[^"\r\n])*"\s*:`,
		'style': 'color: var(--json-key, #8000ff);'},
	// strings
	{'regex': String.raw`"(\\"|[^"\r\n])*"`,
		'style': 'color: var(--json-string, #800000);'},
	// numbers
	{'regex': String.raw`\d+(\.\d+)?`,
		'style': 'color: var(--json-number, #ff0000);', 'fullWord': true},
	// constants
	{'tokens': 'true false null',
		'style': 'color: var(--json-operator, #18af8a);'},
];
compile(LANG_JSON);


/* === FUNCTIONS === */

// compiles the regex elements in the language
function compile(lang) {
	for (var k = 0; k < lang.length; k++) {
	if (lang[k].tokens)
		lang[k].regex = lang[k].tokens
			.split(' ')
			.map(function(t){return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})
			.sort(function(a,b){return b.length-a.length})
			.join('|');
		lang[k].regex = RegExp('^(' + lang[k].regex + ')');
	}
}

// returns the correct language style
function clazz2lang(clazz) {
	switch (clazz) {
		case 'json': return LANG_JSON;
		default: return null;
	}
}


/* ============ */
/* === MAIN === */
/* ============ */

// sets the style of <b> tags inside <code> tags
var style = document.createElement('style');
style.innerHTML += 'code * { all: unset; }';
style.innerHTML += 'code b { font-weight: normal; }';
document.head.appendChild(style);

function highlightAllCodeTags() {
	// loop over all <code> tags
	var codeTags = document.querySelectorAll('code');
	for (var c = 0, code; code = codeTags[c]; c++) {
		/*// escape html inside tag
		var wrapper = document.createElement('div');
		wrapper.style = 'white-space: pre;';
		console.log(code.innerHTML);
		var text = document.createTextNode(code.innerHTML);
		wrapper.appendChild(text);
		code.innerHTML = wrapper.innerHTML;*/
		
		// get language definiton from class
		var clazz = code.className.split(' ')[0];
		var lang = clazz2lang(clazz);
		if (lang === null) continue;
		console.log('code.style(' + clazz + ')');
		
		// skip xmp tag if needed
		if (code.firstChild.tagName == 'XMP') code = code.firstChild;
		
		// iterate over full content
		var textNode = code.firstChild;
		for (var i = 0; i < textNode.wholeText.length; i++) {
			var text = textNode.wholeText;
			
			// iterate over each language feature
			for (var k = 0; k < lang.length; k++) {
				var feature = lang[k];
				
				// check if substr(i) matches
				var match = text.substr(i).match(feature.regex);
				if (match === null) continue;
				match = match[0];
				var j = i + match.length;
				
				// skip if feature must but is not a full word
				if (feature.fullWord) {
					if (i > 0 && text[i-1].match('\\w')) continue;
					if (j < text.length && text[j].match('\\w')) continue;
				}
				
				// split text into before, content and after
				var afterNode = textNode.splitText(j);
				var contentNode = textNode.splitText(i);
				
				// create new content node with correct style
				var newNode = document.createElement('b');
				newNode.style = feature.style;
				newNode.appendChild(contentNode);
				code.insertBefore(newNode, afterNode);
				
				// continue with next node
				textNode = afterNode;
				i = -1;
			}
		}
	}
}
highlightAllCodeTags();
