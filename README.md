# Coding Challenge for Frontend Developers

## Installation

Follow these steps to set up the project:

1. Clone the repository:

```bash
git clone <repository-url>
cd home-assignment-frontend
```

2. Switch to project's node version (Node v20)

```bash
nvm use
```

3. Install dependencies:

```bash
npm install
# or if you use Yarn
yarn install
```

## Testing

This project uses both Jest and Playwright for testing.

### Running Jest Tests

For components unit tests:

```bash
npm test
```

### Running Playwright Tests

1. Install Playwright browsers (first time only):

```bash
npx playwright install
```

2. Run the tests:

```bash
npx playwright test
```

## Project Structure

```
src/
  ├── components/       # React components
  ├── pages/            # Page components
  ├── reducers/         # Redux slices
  ├── services/         # Service layer for data management and external interactions
  ├── types/            # TypeScript type definitions
  ├── utils/            # Utility functions
  ├── hooks/            # React hooks
  ├── App.tsx           # Main App component
  └── index.tsx         # Entry point
```
