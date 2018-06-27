const {map, filter, throttleTime, debounceTime} = rxjs.operators;

const button = document.querySelector('button');
const result = document.querySelector('#result');

var groupName;

document.getElementById("txt_team").addEventListener("keyup", function() {
  groupName =  document.getElementById('txt_team').value;
    fetchTeam();
}, false);


function displayTeam(jsonResult) {
var {from, of} = rxjs; 

var selectedGroup;
from(jsonResult).pipe(
   filter(group => (group.letter == groupName.toUpperCase()))
  ).subscribe(group => selectedGroup = group);

of(selectedGroup).pipe(
    map(g => g.ordered_teams)
).subscribe(g => selectedGroup = g);

return `<table border="1"> <tr><th>Country</th><th>Played</th><th>Wins-Draws-Lost</th><th>Goals</th><th>Goal Difference</th><th>Points</th></tr>${selectedGroup.map( team => `
<tr><td>${team.country}</td><td> ${team.games_played}</td><td> ${team.wins} - ${team.draws} - ${team.losses}</td><td>${team.goals_for} - ${team.goals_against}</td> <td>${team.goal_differential}</td> <td>${team.points}</td></tr>`).join('')}</table>`;
  
}

async function fetchTeam() {
  const URL = "https://worldcup.sfg.io/teams/group_results";
  
  try {
    const fetchResult = fetch(URL);
    const response = await fetchResult;
    if (response.ok) {
      const jsonData = await response.json();
      result.innerHTML = displayTeam(jsonData);
    } else {
      result.innerHTML = `Response.status: ${response.status}`;
    }
  } catch (e) {
    result.innerHTML = e;
  }
}
