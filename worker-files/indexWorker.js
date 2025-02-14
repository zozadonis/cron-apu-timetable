import { fetchTimetablesWorker } from "./fetchTimetableWorker.js";
import { addToCalendarWorker } from "./addToCalendarWorker.js";

export default {
  async fetch(request, env, ctx) {
    try {
      const timetableData = await fetchTimetablesWorker(env);
      console.log("Fetched Timetable Data:", timetableData);

      if (!timetableData || !Array.isArray(timetableData)) {
        return new Response("Invalid timetable data", { status: 500 });
      }

      const formattedTimetable = timetableData.map((event) => ({
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
        await addToCalendarWorker(event, env); // ✅ Ensures sequential execution
        await delay(200); // ✅ Waits 200ms before next request
      }

      return new Response("Timetable added successfully!", { status: 200 });
    } catch (error) {
      console.error("Error processing timetable:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
};

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
