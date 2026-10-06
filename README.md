# FactoryFlow - Docker Development Environment

This repository contains the Dockerized development environment for **FactoryFlow**, a Node.js + Express + MongoDB backend application.

---

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/) (v2.0+)

---

### Environment Setup

A `.env.example` file is provided with default settings for local development. Copy it to `.env` if not already present:

```bash
cp .env.example .env
```

Key environment variables:
- `PORT`: Application port (default `3000`).
- `MONGO_URI`: `mongodb://mongodb:27017/factoryflow`

---

### Start

Start all services (`backend` and `mongodb`) in detached mode:

```bash
docker compose up -d
```

Docker Compose ensures `mongodb` is healthy before launching the `backend` container.

---

### View logs

Follow logs for all containers:

```bash
docker compose logs -f
```

### Backend logs

Follow logs specifically for the backend application:

```bash
docker compose logs -f backend
```

---

### Hot Reload & Development Mode

The backend service uses a bind mount (`./:/app`) combined with `nodemon`.

- Changes made to source files on the host are immediately reflected inside the container.
- `nodemon` automatically restarts the Express server upon detecting changes.
- Container dependencies (`node_modules`) are isolated within an anonymous volume (`/app/node_modules`) to avoid being overwritten by the host.
- Rebuilding the Docker image is **NOT required** for normal source-code changes.

---

### Rebuild

If you add new npm packages to `package.json` or modify the `Dockerfile`, rebuild the images:

```bash
docker compose up -d --build
```

---

### Check containers

Check the status and health of the running services:

```bash
docker compose ps
```

---

### Stop

Stop and remove the containers, networks, and internal resources without deleting database data:

```bash
docker compose down
```

> **Note:** Do NOT run `docker compose down -v` unless you explicitly intend to delete the persistent MongoDB data volume.

---

### MongoDB Persistence

MongoDB data is stored in a named Docker volume:

- **Volume Name:** `factoryflow_mongodb_data`
- **Mount Path:** `/data/db` inside the MongoDB container

Data persists across container restarts and `docker compose down` / `docker compose up` cycles.

---

### Networking

Containers communicate across Docker Compose's default bridge network:

- **Within containers (Backend to MongoDB):** The backend must connect using the Docker service name:
  ```
  mongodb://mongodb:27017/factoryflow
  ```
  Do **NOT** use `localhost` inside the backend container, because `localhost` refers to the backend container itself, not the MongoDB container.
- **From host to containers:** The host accesses the services via port forwards (`localhost:3000` for backend, `localhost:27017` for MongoDB).

---

### Access

- **Backend API:** [http://localhost:3000](http://localhost:3000)
- **Health Check Endpoint:** [http://localhost:3000/api/health](http://localhost:3000/api/health)
- **MongoDB:** `localhost:27017` (accessible from host tools such as MongoDB Compass or `mongosh` via the exposed port).
