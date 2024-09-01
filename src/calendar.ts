import * as fs from "fs";
import * as path from "path";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface EventBlock {
  date: string;
  name: string;
  timeStart: number;
  timeEnd: number;
}

`
<td id="${1}">
  <p class="dateDisplay">${1}</p>
  <ul>
    <li>${"SomeEvent"}</li>
  </ul>
</td>
`;

export default function gen(calDate: Date): string {
  const year = calDate.getFullYear();
  const month = calDate.getMonth();

  let startDay = new Date(year, month, 1).getDay();
  let lastDay = new Date(year, month + 1, 0).getDate();

  let genHTML = "<tr>";
  // Alignment
  for (let i = 0; i < startDay; i++) {
    genHTML += "<td></td>";
  }
  // Create dates with id that can populate events later
  for (let i = 1; i < lastDay + 1; i++) {
    genHTML += `<td id="${i}"><p>${i}</p><ul>`;
    let events: EventBlock[] = getEvents(new Date(year, month, i));
    for (let j = 0; j < events.length; j++) {
      genHTML += `<li>${events[j].name}</li>`;
    }
    genHTML += "</ul></td>";

    if ((i + startDay) % 7 == 0) {
      genHTML += "</tr><tr>";
    }
  }
  genHTML += "</tr>";
  return genHTML;
}

function getEvents(day: Date): EventBlock[] {
  let buffer: string = fs.readFileSync(
    path.join(__dirname, "dates.json"),
    "utf8"
  );
  let events: EventBlock[] = JSON.parse(buffer);
  let todayEvents: EventBlock[] = new Array();
  for (let i = 0; i < events.length; i++) {
    if (new Date(events[i].date).getUTCDate() == day.getUTCDate()) {
      todayEvents.push(events[i]);
    }
  }
  return todayEvents;
}
