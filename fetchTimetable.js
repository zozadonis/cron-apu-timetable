import { config } from "dotenv";
config();

const s3Endpoint = process.env.APU_TIMETABLE_S3;
const intakeCode = process.env.INTAKE_CODE;
const nonElectives = [""]; // Add MODID that is NOT your elective

export async function fetchTimetable() {
  if (!s3Endpoint) {
    console.error("Error: S3 endpoint not configured");
    return []; // Return empty array instead of Response
  }

  if (!intakeCode) {
    console.error("Error: Intake Code not configured");
    return [];
  }

  try {
    const response = await fetch(s3Endpoint);

    if (!response.ok) {
      console.error("Error: Unable to fetch data from S3");
      return [];
    }

    const data = await response.json();

    // Filter the entire S3 dataset by intake code
    const filteredData = filterByIntake(data, intakeCode);

    // Filter the courses by the user's elective choices
    const result = filterByElective(filteredData, nonElectives);

    return result; // Return data directly as an array
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return []; // Return empty array on error
  }
}

const filterByIntake = (data, intakeCode) => {
  return data.filter((entry) => {
    const intakeValue = entry.INTAKE?.trim();
    const searchValue = intakeCode.trim();
    return intakeValue === searchValue;
  });
};

const filterByElective = (filteredData, nonElectives) => {
  if (nonElectives.length < 1) {
    return filteredData;
  }

  return filteredData.filter((entry) => {
    const modid = entry.MODID?.trim();
    const isNonElective = nonElectives.some((mod) => modid?.includes(mod));
    return !isNonElective; // Keep only those that are NOT nonElectives
  });
};
