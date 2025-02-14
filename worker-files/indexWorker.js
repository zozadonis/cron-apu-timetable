import { fetchTimetablesWorker } from "./fetchTimetableWorker.js";
import { addToCalendarWorker } from "./addToCalendarWorker.js";

export default {
  async fetch(request, env, ctx) {
    try {
      const timetableData = await fetchTimetablesWorker(env);
      console.log("Fetched Timetable Data:", timetableData); // Debugging log

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

      const addEvents = formattedTimetable.map((event) =>
        addToCalendarWorker(event, env),
      );
      await Promise.all(addEvents); // Run them in parallel

      return new Response("Timetable added successfully!", { status: 200 });
    } catch (error) {
      console.error("Error processing timetable:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
};
