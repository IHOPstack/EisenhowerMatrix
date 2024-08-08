let t = TrelloPowerUp.iframe();

let importanceInput = document.getElementById('importance');
let urgencyInput = document.getElementById('urgency');

t.render(function () {
  importanceInput.value = t.arg('importance');
  urgencyInput.value = t.arg('urgency');
});

let form = document.getElementById('priority-form');
form.addEventListener('submit', function (event) {
  event.preventDefault();
  Promise.all([
    t.set('card', 'shared', 'importance', parseInt(importanceInput.value)),
    t.set('card', 'shared', 'urgency', parseInt(urgencyInput.value)),
  ]).then(function () {
    t.closePopup();
  });
});
