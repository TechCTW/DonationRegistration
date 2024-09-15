//--------------------------------------------------------------------------------------------------------------
//js für donations.html
//--------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  //Feiertage und Urlaube aus einer JSON-Liste laden
  fetch('json/blacklist.json')
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      //Abholdatum in HTML-Element schreiben
      const jsonArray = data; 
      const holidays = jsonArray.map(data => data.date);  //Reines Datenarray erstellen
      setPickUpDate(holidays);
  })
  .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
  });

  //Prüfe beim Laden die ausgewählte Option
  toggleDelivery();
})

//--------------------------------------------------------------------------------------------------------------
function setPickUpDate(holidays){
  //Funktion zum errechnen von Abohldaten bei der Spendenanmeldung
  const pickUpDate = document.getElementById('pickUpDate');
  let startDay = parseInt(pickUpDate.getAttribute('data-count-startday'));
  let maxEntries = parseInt(pickUpDate.getAttribute('data-count-entries'));
  let result = new Date();

  //Aktuelles Datum + Start-Tag setzen
  result.setDate(result.getDate() + startDay); 

  for (let i = 0; i < maxEntries; i++){
    //Prüfe ob der Tag ein Wochenende oder Feiertag ist
    while(result.getDay() == 0 || result.getDay() == 6 || isHoliday(result, holidays)){
        result.setDate(result.getDate() + 1);
    }
    
    //Option erstellen und dem HTML-Tag anhängen
    const option = document.createElement('option');
    option.value = result.toLocaleDateString('de-DE', {weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'});
    option.textContent = option.value;
    pickUpDate.appendChild(option);

    //Tag für nächsten Schleifendruchlauf erhöhen
    result.setDate(result.getDate() + 1);
  }
}

//--------------------------------------------------------------------------------------------------------------

function isHoliday(checkDate, blacklist) {
  //Funktion zum prüfen ob ein Datum in einer blacklist (Array) enthalten ist
  
  //Datum in Format YYYY-MM-DD umwandeln
  //Monate/Tage sind 0-basiert
  let year = checkDate.getFullYear();
  let month = (checkDate.getMonth() + 1).toString().padStart(2, '0');   
  let day = checkDate.getDate().toString().padStart(2, '0');  
  let checkValue = year.toString() + '-' + month.toString() + '-' + day.toString();
  
  if (blacklist.includes(checkValue)){
      return true;
      }
      return false;
}

//--------------------------------------------------------------------------------------------------------------

function toggleDelivery() {
    //Adressfeld je nach Auswahl ein-/ausblenden
    const delivery = document.getElementsByName('delivery');        //gibt eine Node-Liste aus
    const pickUpAdress = document.getElementById('pickUpAdress');   

    //Prüfe welcher Wert ausgewählt wurde
    for (const radio of delivery) {     
      if (radio.checked) {              
        if (radio.value === 'pickUp'){   
          pickUpAdress.style.display = 'block';
        } else {
          pickUpAdress.style.display = 'none';
        }
      }
    }
  }

//--------------------------------------------------------------------------------------------------------------

function toggleDonationCheckbox(input){
  //Warnmeldungen entfernen, sobald eine checkbox ausgewählt wurde
  if (input.classList.contains('is-valid') || input.classList.contains('is-invalid')){
    validateDonation();
  }
}

//--------------------------------------------------------------------------------------------------------------

function togglePrivacyCheckbox(input){
  //Warnmeldungen entfernen, sobald eine checkbox ausgewählt wurde
  if (input.classList.contains('is-valid') || input.classList.contains('is-invalid')){
    validatePrivacy(input);
  }
}

//--------------------------------------------------------------------------------------------------------------
function resetForm(){
  //Formular leeren über reset()-Methode 
  const registration = document.getElementById('registration');
  registration.reset();

  //Auswahl entfernen
  document.getElementById('territory').value = '';
  document.getElementById('pickUpDate').value = '';
  
  //Formularfelder nach Vorauswahl anzeigen
  toggleDelivery();

  //Meldungen entfernen
  const elementsValid = registration.querySelectorAll('.is-valid');
  const elementsInvalid = registration.querySelectorAll('.is-invalid');

  for (const element of elementsValid){
    element.classList.remove('is-valid');
  }
  for (const element of elementsInvalid){
    element.classList.remove('is-invalid');
  }

  //Sonderfall Meldungen der Checkboxen
  const donationMessage = document.getElementById('donationMessage');
  donationMessage.style.display = 'none';
}

//--------------------------------------------------------------------------------------------------------------

function submitForm() {
  //Alle Eingaben validieren und in SessionStorage schreiben
  const inputTag = document.querySelectorAll('input');
  let pickUp = false;
  let validationOk = true;

  //Prüfe ob Abholung gewählt wurde
  for (let input of inputTag){
    if (input.id === 'pickUp'){
      pickUp = input.checked;
    }
  }
  //Nicht benötigte Felder bereinigen
  if (!pickUp){
    for (const input of inputTag){
      if (input.type === 'text' && input.parentElement.id === 'pickUpAdress') {
        input.value = '';
      }
    }  
    //Abholdatum löschen
    document.getElementById('pickUpDate').value = '';
  }

  //Validierung für Eingabefelder durchführen
  for (const input of inputTag){
    if (input.type === 'text' ) {

      if (!validateInput(input)) {
        // Validierung fehlgeschlagen
        if (input.getAttribute('data-assignment') != 'pickUpAdress') {
          // das Element ist nicht abhängig von der Vorauswahl
          validationOk = false;
        } else if (pickUp) {
          // diese Elemente werden für Vorauswahl pickUp benötigt
          validationOk = false;
        }
      }
    }
  }

  //Validierung für Abholdaum durchführen
  if (!validateSelect(document.getElementById('pickUpDate')) && pickUp){
    validationOk = false;
  }

  //Validierung für Region durchführen
  if (!validateSelect(document.getElementById('territory'))){
    validationOk = false;
  }

  //Validierung für Spendenart durchführen
  if (!validateDonation()) {
    validationOk = false;
  }

  //submit abbrechen, wenn validierung fehlgeschlagen
  if (!validationOk){
    return;
  }
  
  //Daten lokal speichern
  let summary = new Map();
  let donationList = '';

  //alle Input-Elemente
  for (let input of inputTag){
    switch (input.type) {
      case 'radio':
        summary.set(input.id, (input.checked) ? 'true' : 'false');  
        break;
      case 'text':
        summary.set(input.id, input.value);
        break;
      case 'checkbox':
        summary.set(input.id, (input.checked) ? 'true' : 'false');  
        if (input.name === 'donation' && input.checked){
          donationList = donationList.concat((donationList === '') ? '' : ', '); //Komma bei Liste hinzu
          donationList = donationList.concat(input.value);
        }
        break;
    }
  }
  
  //Region
  summary.set(document.getElementById('territory').id, document.getElementById('territory').value);

  //Spendenliste als String für Anzeige hinzu
  summary.set('donationList', donationList);

  //Abholdatum hinzufügen
  if (pickUp){
    summary.set('pickUpDate', document.getElementById('pickUpDate').value);
    summary.set('dropOffDate', '');
  } else {
    //Abgabedatum hinzufügen
    let actDate = new Date();
    actDate.setDate(actDate.getDate() + 7); //7 Tage bis zur Abgabe
    summary.set('dropOffDate', actDate.toLocaleDateString('de-DE', {weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'}));
    summary.set('pickUpDate', '');
  }


  
  //Daten im lokalen Speicher ablegen und Übersicht aufrufen
  const stringify = JSON.stringify(Array.from(summary.entries()));
  sessionStorage.setItem('summary', stringify);
  document.getElementById('registration').style.display = 'none';           //verhindert die Anzeige von leeren Feldern nach resetForm()
  resetForm();                                                              
  window.location.href = 'overview.html';                                   //Übersichtsseite aufrufen
}

