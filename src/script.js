import { getDepartures, getSites } from "./api.js"; 

const northTableBody = document.querySelector("#depTableNorth tbody");
const souhtTableBody = document.querySelector("#depTableSouth tbody");
const stationName = document.querySelector("#stationName")
const trafficStatus = document.querySelector("#trafficStatus");

const BASE_URL = "https://transport.integration.sl.se/v1/sites"

// Jordbro Station id: 9729
// Handen id: 9730
// Skogås id: 9731
// Vega id: 9733
// Trångsund id: 9732
// Farsta Strand id: 9180

async function fetchSites() {
  const sites = await getSites();
  // console.log('Received sites:', data);
  // const site = data.sites.find(site => site.id === 9729); // Find Jordbro station
  sites.forEach(site => {
    if (site.id === 9729) { // Check if the site is Jordbro station
      console.log(site.name, "id:", site.id);
    }
  });
};
setInterval(fetchSites, 5_000);

async function fetchData() {
  const siteId = "9729";
  const departures = await getDepartures(siteId);

  northTableBody.innerHTML = ""; //Clears north table from previous fetch cycle
  souhtTableBody.innerHTML = ""; //Clears south table from previous fetch cycle

  // console.log('Received data:', departures);

  for (const dep of departures) {
  // departures.forEach(dep => {
    const row = document.createElement("tr");

    if (dep.line.transport_mode == "TRAIN"){
      stationName.innerHTML = `${dep.stop_area.name}`
      document.title = `${dep.stop_area.name} Avgångar`;

      // trafficStatus.innerHTML = `<h3>Trafik Status: ${dep.journey.state}</h3>`;
      // console.log(dep.journey.prediction_state);
      // console.log(dep.destination,": ",dep.journey);

      row.innerHTML = `
      <td colspan="1">${dep.line.id}</td>
      <td colspan="2">${dep.destination}</td>
      <td colspan="1">${getMinutesUntilDeparture(dep.scheduled)}</td>
      `;
      //<td colspan="1">${dep.display}</td>
      
      if(dep.direction_code == 2) { //2 is for north, 1 is for south
        northTableBody.appendChild(row) //north direction
      } else {
        souhtTableBody.appendChild(row) //south direction
      }
    }
  }
}
setInterval(fetchData, 5_000);

// Gets minutes until departure
function getMinutesUntilDeparture(depTime) {
  const now = new Date();
  const departureTime = new Date(depTime);
  const diff = departureTime - now; // Difference in milliseconds
  if (diff <= 60_000) {
    return "Nu";
  }
  return Math.floor(diff / 60_000) + " min"; // Convert to minutes
}

// Clock functionality
const clockHeader = document.querySelector("#clock");
function startClock() {
  let now = new Date();
  let hours = numHandler(now.getHours());
  let mins = numHandler(now.getMinutes());
  let sec = numHandler(now.getSeconds());
  clockHeader.innerHTML = hours + ":" + mins + ":" + sec;
  setTimeout(startClock, 1_000);
}

function numHandler(number) {
  if (number < 10) { return "0" + number; }
  return number;
}

const body = document.getElementsByTagName("body")
body.onload = fetchData(), startClock()

