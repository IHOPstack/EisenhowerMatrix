var t = TrelloPowerUp.iframe();

var importanceInput = document.getElementById('importance');
var urgencyInput = document.getElementById('urgency');

t.render(function() {
  importanceInput.value = t.arg('importance') || 3;
  urgencyInput.value = t.arg('urgency') || 3;
});

var form = document.getElementById('priority-form');
form.addEventListener('submit', function(event) {
  event.preventDefault();
  Promise.all([
    t.set('card', 'shared', 'importance', parseInt(importanceInput.value)),
    t.set('card', 'shared', 'urgency', parseInt(urgencyInput.value))
  ]).then(function() {
    t.closePopup();
  });
});