# URL Shortener Application

A modern URL shortening service built with TypeScript, Express, and PostgreSQL that allows users to create and manage shortened URLs with analytics.


## 📚 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Local Setup](#local-setup)
- [Docker Setup](#docker-setup)
- [Environment Variables](#environment-variables)

## ✨ Features

- Create shortened URLs with custom titles
- User authentication and registration
- Track click analytics for each URL
- User dashboard with URL management
- JWT-based authentication

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT, Passport
- **Containerization**: Docker

## 💻 Local Setup

### Prerequisites

- Node.js (v14+)
- npm or yarn
- PostgreSQL

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/Nsarob/url-charmer.git
cd url-charmer
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env` file in the root directory and add the following variables:
```
DATABASE_URL=your_postgresql_database_url
JWT_SECRET=your_jwt_secret
```

4. **Run database migrations**
```bash
npx sequelize-cli db:migrate
```

5. **Start the development server**
```bash
npm run dev
# or
yarn dev
```

The server should now be running at `http://localhost:3000`.
