#!/bin/bash
set -e

npm install

if [[ -f .env.local ]]; then
    read -p ".env.local already exists. Overwrite it? (y/n) " overwrite_prompt
    if [[ $overwrite_prompt != "y" ]]; then
        echo "Keeping existing .env.local."
        exit 0
    fi
fi

echo "Start a local Postgres in Docker for development?"
read -p "(y/n) " db_prompt

echo "# db" > .env.local

if [[ $db_prompt == "y" ]]; then
    echo "DATABASE_URL=postgresql://monolith:monolith@localhost:5432/monolith" >> .env.local
    npm run db:up
    echo "Waiting for Postgres..."
    until docker compose exec -T db pg_isready -U monolith > /dev/null 2>&1; do sleep 1; done
    npm run migrate:dev
    echo "Local Postgres is up and migrated."
else
    echo "DATABASE_URL=postgresql://user:password@host:5432/db" >> .env.local
    echo -e "\nSkipped local db. Set DATABASE_URL in .env.local, then run: npm run migrate:dev\n"
fi

echo -e "\n# auth\nNEXTAUTH_URL=http://localhost:3000" >> .env.local

NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET" >> .env.local

echo "Enter your Google Client ID and Secret, or leave blank to skip:"
read -p "Google Client ID: " google_client_id
read -p "Google Client Secret: " google_client_secret

if [[ -n $google_client_id && -n $google_client_secret ]]; then
    echo -e "GOOGLE_ID=$google_client_id\nGOOGLE_SECRET=$google_client_secret" >> .env.local
    echo "Google OAuth credentials updated in .env.local"
else
    echo -e "GOOGLE_ID=google-id-here\nGOOGLE_SECRET=google-secret-here" >> .env.local
    echo -e "\nSkipped. Update GOOGLE_ID and GOOGLE_SECRET in .env.local later."
fi
