#!/bin/bash

npm install

echo "Would you like to create a sqlite db for development?"
read -p "(y/n) " db_prompt

echo -e "# db" > .env

if [[ $db_prompt == "y" ]]; then
    echo "DATABASE_URL=file:./dev.db" >> .env
    npx prisma migrate dev --name init
    echo "Created dev.db\n"
else
    echo "DATABASE_URL=db-url-here" >> .env
    echo -e "\nSkipped creating dev.db. To use another database:\n1. Update the DATABASE_URL in the .env file.\n2. Update the db provider in the src/backend/database/prisma.schema file.\n"
fi

echo -e "\n# api\nBASE_URL=http://localhost:3000\n\n# auth\nNEXTAUTH_URL=http://localhost:3000" >> .env

echo "Enter your Google Client ID and Secret, or leave blank to skip:"
read -p "Google Client ID: " google_client_id
read -p "Google Client Secret: " google_client_secret

if [[ -n $google_client_id && -n $google_client_secret ]]; then
    echo -e "GOOGLE_ID=$google_client_id\nGOOGLE_SECRET=$google_client_secret" >> .env
    echo "Google OAuth credentials updated in .env"
else
    echo -e "GOOGLE_ID=google-id-here\nGOOGLE_SECRET=google-secret-here" >> .env
    echo -e "\nSkipped. Update GOOGLE_ID and GOOGLE_SECRET in .env later."
fi
