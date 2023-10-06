npm install
npx prisma migrate dev --name init
sed -i 's|db-url-here|file:./dev.db|g' .env