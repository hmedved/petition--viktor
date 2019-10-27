#!/bin/bash

## Change user and database (pguser, testdb)
psql -h localhost -p 5432 -U postgres -d wintergreen-petition -f migrations/data.sql
