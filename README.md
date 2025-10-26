# Blueprint AI

the first AI structural engineer -> you say what you want to build, blueprint tells you how to build it

## Prerequisites

- Node.js 18+ installed
- Claude API key from Anthropic

## Setup Instructions

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure your Claude API key:**

   Open the `.env` file and add your API key:

   ```
   ANTHROPIC_API_KEY=your-api-key-here
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. Click "Select House Image" to upload a picture of a house
2. Click "Analyze House" to generate construction steps
3. View the detailed step-by-step instructions for building the house

## How It Works

The app uses Claude's vision capabilities to analyze uploaded house images and provide detailed construction guidance including:

- Foundation work
- Framing structure
- Exterior construction
- Interior work
- Finishing details

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Claude 3.5 Sonnet via Anthropic API
- **UI:** Responsive, modern design

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## License

MIT
