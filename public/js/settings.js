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
  doNowColor: 'green',
  delegateColor: 'yellow',
  scheduleColor: 'blue',
  ignoreColor: 'red',
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
    handleSaveSettings();
  });
  ['doNow', 'delegate', 'schedule', 'ignore'].forEach(quadrant => {
    const select = document.getElementById(`${quadrant}-color`);
    const customInput = document.getElementById(`${quadrant}-color-custom`);
    
    if (select && customInput) {
      select.addEventListener('change', function() {
        customInput.style.display = this.value === 'custom' ? 'inline' : 'none';
        updateSelectColor(this, this.value, customInput.value);
      });

      customInput.addEventListener('input', function() {
        updateSelectColor(select, 'custom', this.value);
      });
    }
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
  document.getElementById('doNow-color').value = settings.doNowColor;
  document.getElementById('delegate-color').value = settings.delegateColor;
  document.getElementById('schedule-color').value = settings.scheduleColor;
  document.getElementById('ignore-color').value = settings.ignoreColor;
  ['doNow', 'delegate', 'schedule', 'ignore'].forEach(quadrant => {
    const select = document.getElementById(`${quadrant}-color`);
    const customInput = document.getElementById(`${quadrant}-color-custom`);
    select.value = settings[`${quadrant}Color`];
    if (settings[`${quadrant}Color`] === 'custom') {
      customInput.style.display = 'inline';
      customInput.value = settings[`${quadrant}CustomColor`] || '#ffffff';
    } else {
      customInput.style.display = 'none';
    }
    updateSelectColor(select, settings[`${quadrant}Color`], settings[`${quadrant}CustomColor`]);
  });
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
    doNowColor: document.getElementById('doNow-color').value,
    delegateColor: document.getElementById('delegate-color').value,
    scheduleColor: document.getElementById('schedule-color').value,
    ignoreColor: document.getElementById('ignore-color').value,
  };
  ['doNow', 'delegate', 'schedule', 'ignore'].forEach(quadrant => {
    const select = document.getElementById(`${quadrant}-color`);
    newSettings[`${quadrant}Color`] = select.value;
    
  });
  saveSettings(newSettings)
  .then(function() {
    t.closePopup();
  });
}
function updateSelectColor(select, color, customColor) {
  if (color === 'custom') {
    select.style.backgroundColor = customColor;
  } else {
    select.style.backgroundColor = `var(--ds-background-accent-${color}-subtle)`;
  }
  select.style.color = getContrastYIQ(select.style.backgroundColor);
}

function getContrastYIQ(hexcolor){
  var r = parseInt(hexcolor.substr(1,2),16);
  var g = parseInt(hexcolor.substr(3,2),16);
  var b = parseInt(hexcolor.substr(5,2),16);
  var yiq = ((r*299)+(g*587)+(b*114))/1000;
  return (yiq >= 128) ? 'black' : 'white';
}
