# 🚀 SST URL Shortener

A production-ready URL shortener backend built with **Node.js**, **Hono**, and
**TypeScript**, deployed on **AWS** using **SST**.

## 🛠 Tech Stack

- **Framework:** [Hono](https://hono.dev/) (Serverless)
- **Infrastructure:** [SST v3 (Ion)](https://sst.dev/)
- **Database:** Amazon DynamoDB
- **Validation:** Zod
- **Tooling:** Biome (Linting/Formatting), Vitest (Testing)

## 🏗 Project Structure

This is a monorepo using npm workspaces:

- `packages/core`: Shared business logic and DynamoDB client.
- `packages/functions`: AWS Lambda handlers and Hono API.

## 🚀 Getting Started

### 1. Prerequisites

- **Bun** (for local scripts/tests) or **Node.js** (LTS)
- **AWS Account** with free tier eligible resources.
- **AWS CLI** installed.

#### Configuring AWS Credentials (Safe)

SST needs permission to deploy resources to your AWS account. You can set this
up in two ways:

**Option A: AWS CLI (Recommended)** Run the following command and enter your
keys when prompted. This saves them securely in `~/.aws/credentials`.

```bash
aws configure
```

**Option B: Environment Variables** For a temporary session, you can export
these in your terminal:

```bash
export AWS_ACCESS_KEY_ID=your_access_key_id
export AWS_SECRET_ACCESS_KEY=your_secret_access_key
export AWS_REGION=ap-southeast-1
```

> [!IMPORTANT] **Security Tip:** Never commit your actual keys to this README or
> any file in your repository. Always use `aws configure` or environment
> variables that are ignored by Git.

#### Verify Setup

Run this to confirm your credentials are active:

```bash
aws sts get-caller-identity
```

### 2. Installation

```bash
npm install
```

### 3. Local Development (Live Lambda)

This project uses SST's hybrid development mode. The infrastructure is deployed
to AWS, but the code runs on your local machine for instant feedback.

```bash
npx sst dev
```

### 4. Running Tests

```bash
npm test
```

## 🔌 API Endpoints

- `POST /api/shorten` - Create a short URL.
- `GET /api/:code` - Redirect to the original URL.
- `GET /api/stats/:code` - Get click analytics.
- `GET /api/health` - Check API status.
