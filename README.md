# Running the server

## System Requirements

[Docker](https://docs.docker.com/get-docker/)

[Docker Compose](https://docs.docker.com/compose/install/)

## Instructions (Linux)

### Clone this repository

```bash
git clone git@github.com:arnab4477/nest-microservice-mvp.git && cd nest-microservice-mvp/
```

### Build & start the server

```bash
docker-compose up -d
```

### Ping the server

```bash
curl http://localhost:6000/v1/api/
```

### Check the logs

```bash
docker-compose logs -f app
```

# Technologies used

- **Backend Framework**
  - Nestjs
- **Database**
  - Postgres
  - TypeORM
- **Authentication (minimal)**
  - JWT
- **Caching**
  - Redis
- **Testing**
  - Jest
  - Automock
- **CI (pre-commit checks)**
  - Husky
- **Deployment**
  - Docker
  - Docker Compose

# API Routes

BaseUrl: `'/api/v1'` (all routes mentioned below will have this prefix)

## Healthcheck

- GET - `'/'` (returns app running status & version information)

## Users

Request bodies/queries/parameters in `src/users/dto`

- POST - `'/users'` (creates a new user, errs if passed username is already present in the database)
- GET - `'/users/:id'` (retrieves an existing user)
- PATCH - `'/users/:id'` (updates an existing user, username cannot be updated)
- DELETE - `'/users/:id'` (deletes an existing user)
- GET - `'/users/search'` (searches and retrives paginated users based on username and/or age range, blocked users not included in the result set)

## Blocking/Unblocking

Request body in `src/block/dto`

- PUT - `'/block'` (blocks or unblocks an user from another user)

# Architecture

## DB model and logic

DB migrations in `src/migrations`

### Users

- Users is a simple table in postgres with the provided columns. Only `created_at` and `updated_at` have been added
- `username` has an unqiue constraint
- `username` and `birthdate` have indexes as these fields would be required in searches
- `name`, `username` and `surname` all have a maximum length constraint of 20 characters

### Blocking

- The blocking table is simple, other than the primary key, there are only two columns, `blocker_id` (of the user who is blocking) and `blocked_id` (the user who got blocked). Both of these are foreign keys, creating two _many-to-one_ relationships with the users table.
- When a blocking/unblocking request is passed (to block or to unblock is determined by the `block` boolean passed in the request body in the block API), validation is done based if the usee has already blocked/unblocked the given user and if all checks pass, a new record is inserted (blocked) or an existing record is removed (unbloced)
- In the search API, a the condition is passed while fetching the users, where if any record exists with the current (searching) user's ID as the `blocker_id`, then the returned users ID must not be the `blocked_id` of that record, effectively filtering out all the blocked users

## Caching

A basic caching mechanism has been put up for the most db query, if an user exists in the users table or not (it runs in each auth middleware calls for GET and PUT requests).

- When an user is created, a record is added to Redis (for 30 minutes but this time is arbitary) with the user's ID as the key and `'true'` as the value
- This is then used in the auth middleware to check if the user is presented in the database. If there is no record in Redis (expired after 30 mins of user creation), only then it does an actual db call. If a db record is found, the record is added again to Redis
- When an user is deleted, the record with the user's ID as key is deleted to invalidate the cache
