import { fetchTimetables } from "./api.js";

(async () => {
  console.log("Testing getTimetables...");

  const response = await fetchTimetables();
  console.log("Response", JSON.stringify(response));
})();
