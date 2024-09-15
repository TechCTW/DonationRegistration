//--------------------------------------------------------------------------------------------------------------
//js für donations.html / Validierungsfunktionen
//--------------------------------------------------------------------------------------------------------------
function checkInput(input){
    const allowedChars = input.getAttribute('data-allowed-char');
    const checkChars = new RegExp('[^' + allowedChars + ']', 'g');
                
    input.value = input.value.replace(checkChars, '');  //unerlaubte Zeichen löschen
    input.value = input.value.replace('  ', ' ');       //max. ein Leerzeichen zulassen
}

//--------------------------------------------------------------------------------------------------------------

function validateInput(input){
  const allowedChars = input.getAttribute('data-allowed-char');
  const checkChars = new RegExp('[^' + allowedChars + ']', 'g');
  const infoElement = input.nextElementSibling; //Nächstes Element (Fehlermeldung)

  //entferne überflüssige Leerzeichen am Ende und Anfang
  input.value = input.value.trimEnd();
  input.value = input.value.trimStart();

  if (checkChars.test(input.value)){
      //Prüfe ob alle Zeichen im erlaubten Bereich sind
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    infoElement.textContent = 'Ihre Eingabe enthält unerlaubte Zeichen.';
    return false;

  } else if (input.value.length < input.minLength) {
    //Prüfe ob die min. Anzahl an Zeichen vorhanden sind
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    infoElement.textContent = 'Ihre Eingabe ist zu kurz.';
    return false;

  } else if (input.value.length > input.maxLength) {
    //Prüfe ob die max. Anzahl an Zeichen überschritten ist
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    infoElement.textContent = 'Ihre Eingabe ist zu lang.';
    return false;

  } else if (input.id === 'zipCode'){
    //Sonderfall Postleitzahlen
    const minZipCode = input.getAttribute('data-zip-code-area') * 1000;
    const maxZipCode = minZipCode + 999;
    if (input.value < minZipCode || input.value > maxZipCode) {
      //Prüfe Postleitzahlenbereich
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      infoElement.textContent = 'Die PLZ muss sich innerhalb des PLZ-Bereichs: ' + minZipCode + ' und ' + maxZipCode + ' befinden';
      return false;
    }
  }
  infoElement.textContent = '';
  input.classList.add('is-valid');
  input.classList.remove('is-invalid');
  return true;
}

//--------------------------------------------------------------------------------------------------------------

function validateSelect(input){
  const infoElement = input.nextElementSibling; //nächstes Element => Fehlermeldung
  if (input.value === ''){
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    infoElement.textContent = 'Bitte treffen Sie eine Auswahl.';
    return false;
  }
  input.classList.add('is-valid');
  input.classList.remove('is-invalid');
  infoElement.textContent = '';
  return true;
}

//--------------------------------------------------------------------------------------------------------------

function validateDonation(name = 'donation', minCount = 1){
  const checkbox = document.getElementsByName(name);
  const donationMessage = document.getElementById('donationMessage');
  let checked = 0;

  for (const element of checkbox){
    if (element.checked) {
      checked++;
    }
  }
  
  //Validiert
  if (checked >= minCount){
    for (const element of checkbox){
      element.classList.add('is-valid');
      element.classList.remove('is-invalid');  
    }      
    donationMessage.style.display = 'none'; //muss gesondert behandelt werden, da HTML und Bootstrap Fehlermeldungen bei "Gruppen" nicht unterstützt
    donationMessage.textContent = ''; 
    return true;
  }

  //Nicht validiert
  for (const element of checkbox){
    element.classList.add('is-invalid');
    element.classList.remove('is-valid');  
  }      
  donationMessage.style.display = 'block';  //muss gesondert behandelt werden, da HTML und Bootstrap Fehlermeldungen bei "Gruppen" nicht unterstützt
  donationMessage.textContent = 'Bitte treffen Sie eine Auswahl.'
  return false;
}

//--------------------------------------------------------------------------------------------------------------

  function validatePrivacy(input){
  const privacyMessage = document.getElementById('privacyMessage');

  if (input.checked) {
    input.classList.add('is-valid');
    input.classList.remove('is-invalid');
    privacyMessage.style.display = 'none';
    privacyMessage.textContent = '';
    return true;
  }
  input.classList.add('is-invalid');
  input.classList.remove('is-valid');
  privacyMessage.style.display = 'block';  
  privacyMessage.textContent = 'Bitte bestätigen Sie unsere Datenschutzbestimmungen';
  return false;
}