#!/usr/bin/env bash
# scripts/run-integration.sh

DIR="$(cd "$(dirname "$0")" && pwd)"
source $DIR/setenv.sh
yarn docker:up
echo '🟡 - Waiting for database to be ready...'
$DIR/wait-for-it.sh "${DB_URL}" -- echo '🟢 - Database is ready!'
dotenv -e ./test.env -- yarn prisma migrate dev
jest -watchAll
