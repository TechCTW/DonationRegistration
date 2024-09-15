//--------------------------------------------------------------------------------------------------------------
//js für alle Seiten
//--------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  // Funktion zum Laden und Einfügen eines HTML-Fragments
  function loadFragment(url, elementId) {
    return fetch(url)
      .then(response => response.text())
      .then(data => document.getElementById(elementId).innerHTML = data)
      .catch(error => console.error(`Error fetching the ${elementId}:`, error));
  }
  // Laden des Headers und des Footers
  Promise.all([
    loadFragment('header.html', 'header'),  
    loadFragment('footer.html', 'footer')
  ]).then(() => {
    document.body.classList.add('loaded'); //'loaded' blendet Content ein
    window.scrollTo(0, 0); //springe auf Position oben links
  });
});  