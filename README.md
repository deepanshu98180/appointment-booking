
# Appointment Booking System

A scalable backend API for a multi-provider appointment booking system built with **Node.js**, **Express**, and **MongoDB**. The system supports JWT-based authentication and allows providers to create availability templates and clients to book appointment slots.

---

## Features

* Multi-provider appointment booking
* Provider availability templates with recurring weekday slots
* Booking management with unique booking IDs
* JWT authentication for clients, providers, and admins
* Pagination and search support for bookings
* Environment configuration support via `.env`
* Postman collection available for API testing

---

## Getting Started

### Prerequisites

* Node.js (v16+ recommended)
* MongoDB running locally or remotely

### Installation

1. Clone the repository and switch to the `dev` branch:

   ```bash
   git clone <repo-url>
   cd appointment-booking
   git checkout dev
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root using the provided `.env.example`:

   ```bash
   cp .env.example .env
   ```

4. Start the server:

   ```bash
   npm start
   ```

The server will run at `http://localhost:2408`.

---

## API Documentation

You can test the API endpoints using the provided Postman collection.

Download: [`docs/provider_booking.postman_collection.json`](./docs/provider_booking.postman_collection.json)

### Key API Features

#### User APIs

* **Auth**
  * `POST /auth/send` — Send OTP
  * `POST /auth/verify` — Verify OTP and login
  * `POST /auth/logout` — Logout

* **Profile**
  * `GET /profile/details` — Get user details
  * `PUT /profile/details` — Update user profile

* **Explore Providers**
  * `GET /explore-providers/get-providers` — Get list of providers

* **Availabilities**
Let me know if you'd like me to:

* Add testing instructions (e.g., Jest)
* Add Docker setup
* Help you generate `postman_collection.json` if not done yet
  * `GET /availabilities/get-availabilities` -Get dates on available slots provided by the provider
  * `GET /availabilities/get-slots-by-date` -Get slots for specific date

* **Bookings**
  * `GET /bookings` — Fetch user bookings
  * `POST /bookings/book-slot` — Book an appointment

#### Provider APIs

* **Auth**
  * `POST /auth/send` — Send OTP
  * `POST /auth/verify` — Verify OTP and login
  * `POST /auth/logout` — Logout

* **Profile**
  * `GET /profile/details` — Get provider details
  * `PUT /profile/details` — Update provider profile

* **Availabilities**
  * `GET /availabilities/get-availabilities`
  * `GET /availabilities/get-slots-by-date`
  * `POST /availabilities/set-availabilities` — Create/update availability template

#### Admin APIs

* **Auth**
  * `POST /auth/login` — Admin login

* **Bookings**
  * `GET /bookings/all-bookings` — View all bookings across platform

### Notes

* All routes are prefixed with `/api/v1/`
* Most endpoints require authentication via JWT 

---

## Project Structure

The source code is organized inside the `src/` directory:

* **`models/`** — Mongoose schemas (Users, Bookings, Templates, Admins, etc.)
* **`controllers/v1/`** — Versioned route handlers
* **`services/`** — Business logic (auth, bookings, availability, profiles)
* **`routes/v1/`** — Express route definitions (grouped by module)
* **`middlewares/`** — JWT auth, validation, error handling
* **`validations/`** — Joi schemas for input validation
* **`constants/`** — Enums and static values
* **`lib/`** — Cryptographic utilities (`bcrypt`, `jwt`)
* **`config/`** — MongoDB and env setup
* **`utils/`** — Helper functions (crypto, response formatting)
* **`logs/`** — Log files (e.g., `access.log`)
* **`app.js` / `server.js`** — App setup and server entry point

---

## Environment Variables

 Use the `.env.example` as a template


## Postman Collection

The Postman collection file is located at:

```
/docs/postman_collection.json
```

You can import it directly into Postman to test all endpoints.

---


## AI Assistance Log

In alignment with the Authenticity & Fair Use Policy, ChatGPT was used to assist with:

- Logger setup using Winston
- Initial JWT authentication structure
- Rate limiter middleware
- Availability logic (`getAvailableDatesForProvider`)
- Joi validation schemas
- Documentation improvements (README, `.env`, Postman guidance)

Boilerplate was reused from a prior project authored by the developer.

See detailed log in [`chatgpt-log.md`](./chatgpt-log.md).

## Contact

For support, questions, or feature requests, contact [deepanshu98180@gmail.com](mailto:deepanshu98180@gmail.com) or open an issue on the repository.

---
