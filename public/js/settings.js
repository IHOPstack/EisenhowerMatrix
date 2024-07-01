var t = TrelloPowerUp.iframe();

// Define default settings
const defaultSettings = {
  gridTitle: 'Matrix View',
  topLabel: 'Importance',
  sideLabel: 'Urgency',
  gridRows: 4,
  gridCols: 4,
  topLabelDirection: 'ascending',
  sideLabelDirection: 'ascending',
};

// Function to load settings
export function loadSettings() {
  return t.get('board', 'shared', 'matrixSettings')
    .then(savedSettings => ({...defaultSettings, ...savedSettings}));
}

// Function to save settings
export function saveSettings(newSettings) {
  return t.set('board', 'shared', 'matrixSettings', newSettings);
}

t.render(function() {
  let settings;
  loadSettings().then(loadedSettings => {
    settings = loadedSettings;
    updateForm(settings);
  });

  document.getElementById('settings-form').addEventListener('submit', function(event) {
    event.preventDefault();
    handleSaveSettings(settings);
  });
});

function updateForm(settings) {
  document.getElementById('grid-title').value = settings.gridTitle;
  document.getElementById('top-label').value = settings.topLabel;
  document.getElementById('side-label').value = settings.sideLabel;
  document.getElementById('grid-rows').value = settings.gridRows;
  document.getElementById('grid-cols').value = settings.gridCols;
  document.getElementById('top-label-direction').value = settings.topLabelDirection;
  document.getElementById('side-label-direction').value = settings.sideLabelDirection;
}

function handleSaveSettings(settings) {
  const newSettings = {
    gridTitle: document.getElementById('grid-title').value,
    topLabel: document.getElementById('top-label').value,
    sideLabel: document.getElementById('side-label').value,
    gridRows: parseInt(document.getElementById('grid-rows').value),
    gridCols: parseInt(document.getElementById('grid-cols').value),
    topLabelDirection: document.getElementById('top-label-direction').value,
    sideLabelDirection: document.getElementById('side-label-direction').value,
  };

  saveSettings(newSettings)
    .then(function() {
      t.closePopup();
    });
}
