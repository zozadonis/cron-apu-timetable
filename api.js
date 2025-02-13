import { config } from "dotenv";

config();

const s3Endpoint = process.env.APU_TIMETABLE_S3;
const intakeCode = process.env.INTAKE_CODE;
const nonElectives = ["CT027-3-3-EPDA", "CT024-3-3-DCOMS"]; // Add MODID that is NOT your elective

export async function fetchTimetables() {
  if (!s3Endpoint) {
    return new Response(
      JSON.stringify({ message: "Error: S3 endpoint not configured" }),
      { status: 500 },
    );
  }

  if (!intakeCode) {
    return new Response(
      JSON.stringify({ message: "Error: Intake Code not configured" }),
      { status: 500 },
    );
  }

  try {
    const response = await fetch(s3Endpoint);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ message: "Error: Unable to fetch data from S3" }),
        { status: 500 },
      );
    }

    const data = await response.json();
    // console.log("Fetched Data:", data);

    // Filter the entire S3 dataset by intake code
    const filteredData = filterByIntake(data, intakeCode);

    // Filter the courses by the user's elective choices
    const result = filterByElective(filteredData, nonElectives);
    console.log("Results: ", result);

    return new Response(JSON.stringify(result)), { status: 200 };
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error fetching data", error: error.message }),
      { status: 500 },
    );
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
    // console.log(`Checking MODID: ${modid}, isNonElective: ${isNonElective}`);
    return !isNonElective; // Keep only those that are NOT nonElectives
  });
};
