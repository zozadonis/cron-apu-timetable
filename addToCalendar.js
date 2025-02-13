import { google } from "googleapis";
import { config } from "dotenv";

config();

const serviceAccount = {
  type: "service_account",
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.CLIENT_CERT_URL,
};

// Initialize Google Auth
const auth = new google.auth.JWT(
  serviceAccount.client_email,
  null,
  serviceAccount.private_key,
  ["https://www.googleapis.com/auth/calendar"],
);

const calendar = google.calendar({ version: "v3", auth });

export async function addToCalendar(eventDetails) {
  const calendarId = process.env.CALENDAR_ID;

  try {
    const existingEvents = await calendar.events.list({
      calendarId,
      timeMin: eventDetails.start.dateTime, // Look foevents from this time onward
      timeMax: eventDetails.end.dateTime, // Limisearch to the event duration
      q: eventDetails.summary, // Search fothe same event title
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
