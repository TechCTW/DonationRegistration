//--------------------------------------------------------------------------------------------------------------
//js für overview.html
//--------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
	//Ausführen beim Laden nach dem Laden der Website ohne externe Quellen
	readStoragedData();
})

window.addEventListener('beforeunload', function(event) {
    window.sessionStorage.clear();
});

function readStoragedData(){
	const storageData = sessionStorage.getItem('summary');		 //Daten abholen
	const summary = new Map(JSON.parse(storageData)); 			//Daten zurück in Map
	const dropOffData = document.getElementById('dropOffData');
	const pickUpData = document.getElementById('pickUpData');
	let textElement;
	let idElement;
	let getElement;

	pickUpData.style.display = 'none';   //Daten für Abholung ausblenden
	dropOffData.style.display = 'none';  //Daten für Abgabe ausblenden

	if (storageData == null) {
		//Fehlermeldung anzeigen
		document.getElementById('complete').hidden = true;
		document.getElementById('errorMessage').hidden = false;
		document.getElementById('errorMessage').innerText =  'ACHTUNG: Durch das Drücken der Zurück-Taste oder die Verwendung von Aktualisieren (F5) sind möglicherweise keine Daten mehr verfügbar.';
		document.getElementById('errorMessageButton').hidden = false;
		return;
	}
    
	//Auswertung sichtbar machen
	if (summary.get('pickUp') == 'true'){
		pickUpData.style.display = 'block';
	}

	if (summary.get('dropOff') == 'true'){
		dropOffData.style.display = 'block';
	}

	//Daten in Formular übertragen
	for (const key of summary.keys()){
		idElement = key;
		textElement = summary.get(key);

		//Elemente auf HTML-Seite übertragen
		getElement = document.getElementById(key);
		if (getElement != null){
			if (textElement === 'true' || textElement === 'false') {
				//bool'sche Werte
				getElement.checked = (textElement == 'true');
			} else {
				//Texte
				getElement.textContent = textElement;
			}   
		}
	}
}  