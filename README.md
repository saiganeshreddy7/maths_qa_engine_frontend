# Math Q&A Engine Frontend

A clean and simple ChatGPT-style interface for asking mathematical questions and receiving detailed answers with LaTeX support.

## Features

- 💬 **Chat Interface**: Clean, modern chat window similar to ChatGPT
- 🧮 **Math Support**: Full LaTeX rendering for mathematical expressions
- 📝 **Markdown**: Rich text formatting for answers
- 👍 **Feedback System**: Rate answers and provide feedback
- 🔄 **New Conversations**: Start fresh conversations anytime
- 📱 **Responsive**: Works on desktop and mobile devices

## Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- Your backend API running on `http://localhost:8000`

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Open your browser** to `http://localhost:3000`

### Backend Configuration

The frontend expects your backend to be running on `http://localhost:8000` by default. If your backend runs on a different port, you can:

1. **Create a `.env` file** in the project root:
   ```
   REACT_APP_API_URL=http://localhost:YOUR_PORT
   ```

2. **Or update the proxy** in `package.json`:
   ```json
   "proxy": "http://localhost:YOUR_PORT"
   ```

## API Endpoints Used

The frontend connects to these backend endpoints:

- `POST /ask` - Send questions and get answers
- `POST /feedback` - Submit feedback for answers
- `GET /conversation/{conv_id}` - Load conversation history (future feature)

## Project Structure

```
src/
├── components/
│   ├── ChatWindow.js      # Main chat display
│   ├── ChatWindow.css
│   ├── Message.js         # Individual Q&A messages
│   ├── Message.css
│   ├── InputBar.js        # Input field and buttons
│   └── InputBar.css
├── services/
│   └── api.js            # API calls to backend
├── App.js                # Main application
├── App.css
├── index.js              # React entry point
└── index.css             # Global styles
```

## Usage

1. **Ask Questions**: Type mathematical questions in the input field
2. **View Answers**: Answers appear with proper math formatting
3. **Give Feedback**: Click "Give Feedback" to rate answers
4. **Start New Chats**: Use "New Chat" button to begin fresh conversations

## Example Questions

Try asking:
- "What is the derivative of x²?"
- "Solve 2x + 5 = 15"
- "Explain the Pythagorean theorem"
- "What is the integral of sin(x)?"

## Customization

### Changing Colors
Edit the CSS files in the `components/` folder to customize colors and styling.

### Backend URL
Set `REACT_APP_API_URL` environment variable to point to your backend.

### Feedback Options
Modify the `feedbackOptions` array in `Message.js` to change feedback choices.

## Troubleshooting

### "Network Error" or "Failed to get answer"
- Check that your backend is running
- Verify the API URL is correct
- Check browser console for detailed error messages

### Math expressions not rendering
- Ensure `katex` styles are loaded (should be automatic)
- Check that expressions use proper LaTeX syntax

### Styling issues
- Clear browser cache
- Check for CSS conflicts in browser dev tools

## Build for Production

```bash
npm run build
```

This creates a `build/` folder with optimized files ready for deployment.

## License

MIT License