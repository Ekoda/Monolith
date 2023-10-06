npm install
grep -q "db-url-here" .env && \
{ sed 's|db-url-here|file:./dev.db|g' .env > temp; mv temp .env; } || \
echo "Placeholder not found"
npx prisma migrate dev --name init
