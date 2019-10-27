#!/bin/bash

## Change user and database (pguser, testdb)
psql -h localhost -p 5432 -U pguser -d testdb -f migrations/data.sql
