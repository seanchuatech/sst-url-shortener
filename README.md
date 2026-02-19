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

### 1. Create Short URL

**Request:**

```bash
curl -X POST https://<API_URL>/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

**Response:**

```json
{
  "shortCode": "AbCdEf",
  "longUrl": "https://example.com",
  "createdAt": "2026-02-19T10:00:00.000Z"
}
```

### 2. Redirect to Original URL

**Request:**

```bash
curl -L -v https://<API_URL>/api/<SHORT_CODE>
```

**Result:** You will be redirected (302) to the original URL.

### 3. Get Stats

**Request:**

```bash
curl https://<API_URL>/api/stats/<SHORT_CODE>
```

**Response:**

```json
{
  "shortCode": "AbCdEf",
  "longUrl": "https://example.com",
  "clicks": 42,
  "createdAt": "2026-02-19T10:00:00.000Z"
}
```

### 4. Health Check

**Request:**

```bash
curl https://<API_URL>/api/health
```

**Response:** `{"status":"ok", "timestamp":"..."}`
