# Cron APU Timetable

### Prerequisites
1. [nodejs](https://nodejs.org/en/download)
2. [git](https://git-scm.com/downloads)
3. [npm]()
4. a [gcp](https://cloud.google.com/) account
5. ability to code yourself (just kidding, you'll be guided)

## Getting Started

First, clone the repository and install the dependencies.

```
git clone https://github.com/Hackthletes-APU/cron-apu-timetable.git

cd cron-apu-timetable

npm install
```

Next, let's setup and configure all the `enviroment variables` needed to run the project.

Create a new file called `.env` and copy the contents from `.env.example` and paste it into the newly created file.

It should look something like this:
```

// .env
APU_TIMETABLE_S3="S3 PUBLIC LINK"
INTAKE_CODE="YOUR INTAKE CODE"

## GOOGLE SERVICE ACCOUNT VARIABLES
CALENDAR_ID="YOUR CALENDAR ID"
GOOGLE_ACCOUNT_VARIABLES={YOUR_CONVERTED_JSON_TEXT}

```

Google Account Variables actually refer to the JSON file that you can download after creating a service account.

To simplify the process and ensure that the JSON file works in the `.env` file, I've created a helper function to help you convert the file.

To run it, ensure that you rename the `.json` file to `serviceAccount.json`

Then run in the root of the project:
```
node jsonCoverter.js
```

It should output the entire file in `variable.txt`. Copy that and place it directly at `GOOGLE_ACCOUNT_VARIABLES` in `.env`.

## Deploying to Github Actions

Before setting up Github Actions, make sure you modify the file in `./github/workflows/cron.yml`

Last but not least, remember to push the code to Github before setting up Actions.

## Common issues
- Forgetting to enable Google Calendar API Key
- Github Actions Secrets not copied paste properly
- Incorrectly setting up the `.env` file (There should be no curly brackets + GOOGLE_ACCOUNT_VARIABLES should be one line of .json format)
- Remeber to double check that you forked instead of cloned.
- cron.yml file wasn't properly configured
