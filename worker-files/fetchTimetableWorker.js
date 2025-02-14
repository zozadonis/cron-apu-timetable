const nonElectives = ["CT027-3-3-EPDA", "CT024-3-3-DCOMS"];

export async function fetchTimetablesWorker(env) {
  const s3Endpoint = env.APU_TIMETABLE_S3;
  const intakeCode = env.INTAKE_CODE;

  if (!s3Endpoint || !intakeCode) {
    return { error: "Missing environment variables" };
  }

  try {
    const response = await fetch(s3Endpoint);
    if (!response.ok) {
      return { error: "Failed to fetch data from S3" };
    }

    const data = await response.json();
    const filteredData = filterByIntake(data, intakeCode);
    return filterByElective(filteredData, nonElectives);
  } catch (error) {
    return { error: error.message };
  }
}

const filterByIntake = (data, intakeCode) => {
  return data.filter((entry) => entry.INTAKE?.trim() === intakeCode.trim());
};

const filterByElective = (filteredData, nonElectives) => {
  return filteredData.filter((entry) => {
    const modid = entry.MODID?.trim();
    return !nonElectives.some((mod) => modid?.includes(mod));
  });
};
