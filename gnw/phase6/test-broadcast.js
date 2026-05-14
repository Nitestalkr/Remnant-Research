const { broadcast } = require('./broadcast-protocol.js');

const result = broadcast('andi', {
  curiosity: 0.6,
  helpfulness: 0.75,
  competence: 0.85,
  safety: 0.7,
  goal_directed: 0.85
}, null, 'advance_milestone', 0.85, 117);

console.log('Broadcast test OK');
console.log(JSON.stringify(result, null, 2));
