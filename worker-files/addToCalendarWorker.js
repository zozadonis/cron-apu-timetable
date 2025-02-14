const encodeBase64 = (data) => Buffer.from(data).toString("base64");

const decodeBase64 = (data) => Buffer.from(data, "base64").toString();

/**
 * Generate a JWT for Google Service Account authentication.
 */
async function getAccessToken(env) {
  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: env.CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/calendar",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  // Encode header & payload
  const encodedHeader = encodeBase64(JSON.stringify(header));
  const encodedPayload = encodeBase64(JSON.stringify(payload));

  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  // Correctly format the private key
  const formattedKey = env.PRIVATE_KEY.replace(/\\n/g, "\n")
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .trim();

  const keyBuffer = Buffer.from(formattedKey, "base64");

  try {
    const key = await crypto.subtle.importKey(
      "pkcs8",
      keyBuffer,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"],
    );

    const signature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      key,
      new TextEncoder().encode(signatureInput),
    );

    const encodedSignature = encodeBase64(signature);
    const jwt = `${signatureInput}.${encodedSignature}`;

    // Exchange JWT for an access token
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error generating access token:", error);
    return null;
  }
}

/**
 * Add an event to Google Calendar.
 */
export async function addToCalendarWorker(eventDetails, env) {
  const accessToken = await getAccessToken(env);
  if (!accessToken) {
    console.error("Failed to obtain access token.");
    return;
  }

  const calendarId = env.CALENDAR_ID;
  const searchParams = new URLSearchParams({
    timeMin: eventDetails.start.dateTime,
    timeMax: eventDetails.end.dateTime,
    q: eventDetails.summary,
    singleEvents: "true",
  });

  // Check if the event already exists
  const existingEventsRes = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${searchParams}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  const existingEvents = await existingEventsRes.json();

  if (existingEvents.items?.length > 0) {
    console.log("Event already exists:", existingEvents.items[0].htmlLink);
    return existingEvents.items[0];
  }

  // Insert new event
  const insertRes = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventDetails),
    },
  );

  const insertedEvent = await insertRes.json();
  console.log("Event added:", insertedEvent.htmlLink);
  return insertedEvent;
}
