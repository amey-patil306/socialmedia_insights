# Social Media Insights Platform

A modern web application that provides AI-powered insights for social media content using a React frontend and Flask backend. The application leverages the Langflow API to analyze social media posts and provide intelligent feedback.

## Features

- 🤖 AI-powered social media content analysis using langflow
- 💬 Real-time chat interface
- 📊 Data visualization for social media metrics
- 📁 Automatic response logging and storage
- 🎨 Cyberpunk-inspired UI design

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Recharts for data visualization
- Lucide React for icons
- Axios for API communication

### Backend
- Flask
- Flask-CORS
- Python Requests library

## Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/amey-patil306/socialmedia_insights
cd main
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash (execute this commands in new terminal)
python -m venv myenv   
myenv\Scripts\activate
pip install -r requirements.txt
```


## Running the Application (start both the servers in seperate terminals)

1. Start the Flask backend server:
```bash()
python app.py
```
The server will run on `http://localhost:3000`

2. Start the React development server:
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173`

3. Uncomment the the configurations code in server.js file and add your own
//const LANGFLOW_ID = "";
//const FLOW_ID = "";



## Project Structure

```
├── src/
│   ├── components/
│   │   ├── ChatBot.tsx
│   │   └── DataVisualizer.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── app.py
├── requirements.txt
└── README.md
```

## API Endpoints

### POST /api/chat
Processes chat messages and returns AI-generated insights.

**Request Body:**
```json
{
  "message": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "string",
  "raw_file": "string",
  "text_file": "string"
}
```

## Response Storage

All API responses are automatically saved in the `responses` directory:
- Raw JSON responses: `response_YYYYMMDD_HHMMSS.json`
- Formatted text responses: `response_YYYYMMDD_HHMMSS.txt`

## Error Handling

The application includes comprehensive error handling for:
- Network errors
- API failures
- Invalid input
- Server errors

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Langflow API for providing the AI capabilities
- React and Flask communities for excellent documentation
- Contributors and maintainers of all used libraries