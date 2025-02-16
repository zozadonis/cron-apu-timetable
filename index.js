import { fetchTimetable } from "./fetchTimetable.js";
import { addToCalendar } from "./addToCalendar.js";

(async () => {
  console.log("Fetching timetable...");

  const timetable = await fetchTimetable();

  // Ensure timetable is an array before looping
  if (!Array.isArray(timetable)) {
    console.error("Error: Expected an array but got", typeof timetable);
    return;
  }

  if (!timetable.length > 1) {
    console.error("Received an empty array from fetchTimetable.js");
    return;
  }

  const formattedTimetable = timetable.map((event) => ({
    summary: event.MODID,
    start: {
      dateTime: event.TIME_FROM_ISO,
      timeZone: "Asia/Kuala_Lumpur",
    },
    end: {
      dateTime: event.TIME_TO_ISO,
      timeZone: "Asia/Kuala_Lumpur",
    },
  }));

  for (const event of formattedTimetable) {
    await addToCalendar(event);
  }
})();
