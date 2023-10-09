#!/bin/bash

# Install npm dependencies
npm install

# Create dev sqlite db
echo "Would you like to create a sqlite db for development?"
read -p "(y/n)" db_prompt

if [[ $db_prompt == "y" ]]; then
    grep -q "db-url-here" .env && \
    { sed 's|db-url-here|file:./dev.db|g' .env > temp; mv temp .env; } || \
    echo "Placeholder not found\n"

    # Database migration
    npx prisma migrate dev --name init
    echo "Created dev.db\n"
else
    echo -e "\nSkipped creating dev.db. To use another database:\n1. Update the DATABASE_URL in the .env file.\n2. Update the db provider in the src/backend/database/prisma.schema file.\n"
fi

# Prompt for Google OAuth credentials
echo "Enter your Google Client ID and Secret, or leave blank to skip:"
read -p "Google Client ID: " google_client_id
read -p "Google Client Secret: " google_client_secret

# Update .env with Google OAuth credentials if provided
if [[ -n $google_client_id && -n $google_client_secret ]]; then
    sed "s|your-google-client-id|$google_client_id|g; s|your-google-client-secret|$google_client_secret|g" .env > temp && mv temp .env
    echo "Google OAuth credentials updated in .env"
else
    echo -e "\nSkipped. Update GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env later."
fi