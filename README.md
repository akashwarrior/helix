<p align="center">
  <img src="public/logo.png" alt="Zero Logo" width="64"/>
</p>

# Helix

Transform your ideas into full-stack intelligent apps and publish with a single click

## What is Helix?

Helix is an open-source AI powered website builder that lets anyone from solo makers to large teams ship immersive, performant and smoother web experiences in minutes..

## Why Helix?

Most website builder today are either **closed-source**, or **build bad designs**.
Helix is different:

- ✅ **Open-Source** – No hidden agendas, fully transparent.
- 🦾 **AI Driven** - Build your product  with Agents & LLMs.
- 🔒 **Data Privacy First** – Helix does not track, collect, or sell your data in any way.
- ⚙️ **Self-Hosting Freedom** – Run your own website builder with ease.
- 🚀 **Developer-Friendly** – Built with extensibility and integrations in mind.

## Tech Stack

Helix is built with modern and reliable technologies:

- **Frontend**: Next.js, React, TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Node.js, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Better Auth, Google OAuth

## Getting Started

### Prerequisites

**Required Versions:**

- [Node.js](https://nodejs.org/en/download) (v18 or higher)
- [npm](https://www.npmjs.com) (v10 or higher)
- [Docker](https://docs.docker.com/engine/install/) (v20 or higher)

Before running the application, you'll need to configure environment variables. For more details on environment variables, see the [Environment Variables](#environment-variables) section.

### Setup Options

1. **Clone and Install**

   ```bash
   # Clone the repository
   git clone https://github.com/akashwarrior/helix.git
   cd helix

   # Install dependencies
   npm install

   # Start database locally
   docker run -d 
    --name helix-db 
    -e POSTGRES_USER=postgres 
    -e POSTGRES_PASSWORD=mysecretpassword 
    -e POSTGRES_DB=helix 
    -p 5432:5432 postgres
   ```

2. **Set Up Environment**

   - Run `npm run env` to setup your environment variables
   - Start the database with the provided [setup](#database-setup)
   - Initialize the database: `npm run db:migrate --dev`

3. **Start the App**

   ```bash
   npm run dev
   ```

4. **Open in Browser**

   Visit [http://localhost:3000](http://localhost:3000)
   </details>

### Environment Setup

1. **Better Auth Setup**

   - Open the `.env` file and change the BETTER_AUTH_SECRET to a random string. (Use `openssl rand -hex 32` to generate a 32 character string)

     ```env
     BETTER_AUTH_SECRET=your_secret_key
     ```

2. **Google OAuth Setup**

   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Add the following APIs in your Google Cloud Project: [People API](https://console.cloud.google.com/apis/library/people.googleapis.com), [Gmail API](https://console.cloud.google.com/apis/library/gmail.googleapis.com)
     - Use the links above and click 'Enable' or
     - Go to 'APIs and Services' > 'Enable APIs and Services' > Search for 'Google People API' and click 'Enable'
     - Go to 'APIs and Services' > 'Enable APIs and Services' > Search for 'Gmail API' and click 'Enable'
   - Enable the Google OAuth2 API
   - Create OAuth 2.0 credentials (Web application type)
   - Add authorized redirect URIs:
     - Development:
       - `http://localhost:3000/api/auth/callback/google`
     - Production:
       - `https://your-production-url/api/auth/callback/google`
   - Add to `.env`:

     ```env
     GOOGLE_CLIENT_ID=your_client_id
     GOOGLE_CLIENT_SECRET=your_client_secret
     ```

   - Add yourself as a test user:

     - Go to [`Audience`](https://console.cloud.google.com/auth/audience)
     - Under 'Test users' click 'Add Users'
     - Add your email and click 'Save'

> [!WARNING]
> The authorized redirect URIs in Google Cloud Console must match **exactly** what you configure in the `.env`, including the protocol (http/https), domain, and path.

### Environment Variables

Run `npm run env` to setup your environment variables. It will copy the `.env.example` file to `.env` and fill in the variables for you.

### Database Setup

Helix uses PostgreSQL for storing data. Here's how to set it up:

1. **Start the Database**

   Run this command to start a local PostgreSQL instance:

   ```bash
   docker run -d 
    --name helix-db 
    -e POSTGRES_USER=postgres 
    -e POSTGRES_PASSWORD=mysecretpassword 
    -e POSTGRES_DB=helix 
    -p 5432:5432 postgres
   ```

   This creates a database with:

   - Name: `helix`
   - Username: `postgres`
   - Password: `mysecretpassword`
   - Port: `5432`

2. **Set Up Database Connection**

   Make sure your database connection string is in `.env` file.

   For local development use:

   ```
   DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/helix"
   ```

3. **Database Commands**

   - **Create migration files** (after schema changes):

     ```bash
     npm run db:generate
     ```

   - **Apply migrations**:

     ```bash
     npm run db:migrate
     ```

   - **View database content**:
     ```bash
     npm run db:studio
     ```