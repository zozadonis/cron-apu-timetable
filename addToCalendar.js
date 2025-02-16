import { google } from "googleapis";
import { config } from "dotenv";

config();

const serviceAccount = JSON.parse(process.env.GOOGLE_ACCOUNT_VARIABLES);

// Initialize Google Auth
const auth = new google.auth.JWT(
  serviceAccount.client_email,
  null,
  serviceAccount.private_key.replace(/\\n/g, "\n"), // Ensure correct formatting
  ["https://www.googleapis.com/auth/calendar"],
);

const calendar = google.calendar({ version: "v3", auth });

export async function addToCalendar(eventDetails) {
  const calendarId = process.env.CALENDAR_ID;

  try {
    const existingEvents = await calendar.events.list({
      calendarId,
      timeMin: eventDetails.start.dateTime, // Look for events from this time onward
      timeMax: eventDetails.end.dateTime, // Limit search to the event duration
      q: eventDetails.summary, // Search for the same event title
      singleEvents: true,
    });

    if (existingEvents.data.items.length > 0) {
      console.log(
        "Event already exists:",
        existingEvents.data.items[0].htmlLink,
      );
      return existingEvents.data.items[0]; // Return the existing event
    }

    const response = await calendar.events.insert({
      calendarId,
      resource: eventDetails,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
}
