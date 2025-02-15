# Cron APU Timetable

# If you have any questions during the session, please raise your hand for any committees or stop me whenever.

### Prerequisites
1. [nodejs](https://nodejs.org/en/download)
2. [git](https://git-scm.com/downloads)
3. a [cloudflare](https://www.cloudflare.com/) account
4. a [gcp](https://cloud.google.com/) account

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
PROJECT_ID="YOUR PROJECT ID"
PRIVATE_KEY_ID="YOUR PRIVATE KEY ID"
PRIVATE_KEY="YOUR PRIVATE KEY"
CLIENT_EMAIL="YOUR CLIENT EMAIL"
CLIENT_ID="YOUR CLIENT ID"
CLIENT_CERT_URL="YOUR CLIENT CERT URL"

```
