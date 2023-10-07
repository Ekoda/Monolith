#!/bin/bash

# Install npm dependencies
npm install

# Update database URL if placeholder is found
grep -q "db-url-here" .env && \
{ sed 's|db-url-here|file:./dev.db|g' .env > temp; mv temp .env; } || \
echo "Placeholder not found"

# Database migration
npx prisma migrate dev --name init

# Prompt for Google OAuth credentials
echo "Enter your Google Client ID and Secret, or leave blank to skip:"
read -p "Google Client ID: " google_client_id
read -p "Google Client Secret: " google_client_secret

# Update .env with Google OAuth credentials if provided
if [[ -n $google_client_id && -n $google_client_secret ]]; then
    sed "s|your-google-client-id|$google_client_id|g; s|your-google-client-secret|$google_client_secret|g" .env > temp && mv temp .env
    echo "Google OAuth credentials updated in .env"
else
    echo "Skipped. Update GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env later."
fi