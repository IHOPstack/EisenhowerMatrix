var t = TrelloPowerUp.iframe();

// Initialize settings
let settings = {
  gridTitle: 'Matrix View',
  topLabel: 'Importance',
  sideLabel: 'Urgency',
  gridRows: 4,
  gridCols: 4,
};

t.render(function() {
  // Load existing settings
  t.get('board', 'shared', 'matrixSettings')
    .then(function(savedSettings) {
      if (savedSettings) {
        settings = {...settings, ...savedSettings};
      }
      updateForm();
    });

  // Set up the form submit handler
  document.getElementById('settings-form').addEventListener('submit', function(event) {
    event.preventDefault();
    saveSettings();
  });
});

function updateForm() {
  document.getElementById('grid-title').value = settings.gridTitle;
  document.getElementById('top-label').value = settings.topLabel;
  document.getElementById('side-label').value = settings.sideLabel;
  document.getElementById('grid-rows').value = settings.gridRows;
  document.getElementById('grid-cols').value = settings.gridCols;
}

function saveSettings() {
  settings = {
    gridTitle: document.getElementById('grid-title').value,
    topLabel: document.getElementById('top-label').value,
    sideLabel: document.getElementById('side-label').value,
    gridRows: parseInt(document.getElementById('grid-rows').value),
    gridCols: parseInt(document.getElementById('grid-cols').value),
  };

  t.set('board', 'shared', 'matrixSettings', settings)
    .then(function() {
      t.closePopup();
    });
}