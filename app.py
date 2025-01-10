from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Configurations
BASE_API_URL = "https://api.langflow.astra.datastax.com"
LANGFLOW_ID = "7bf70436-b4ef-46e9-ac71-a79c55927694"
FLOW_ID = "43c68ebb-271d-4306-b1f6-841940d93bbb"
APPLICATION_TOKEN = os.getenv("APPLICATION_TOKEN", "AstraCS:zftuhGATgLKmYqwtlUnMeiIP:02c4544151bb5a6120ae1ee5b4774136ec63d48ef5d5e31c26a723d7288ef1cc")
SAVE_PATH = "responses"

# Default tweaks
TWEAKS = {
    "ChatInput-S82Ww": {},
    "GroqModel-SnoEd": {},
    "ParseData-8kKCE": {},
    "Prompt-SUQPw": {},
    "ChatOutput-w64rA": {},
    "AstraDB-OkTyr": {},
    "Google Generative AI Embeddings-fEuKx": {},
    "File-VSYDJ": {},
}

# Ensure responses directory exists
os.makedirs(SAVE_PATH, exist_ok=True)

def run_flow(message):
    """Send input to Langflow and get the response."""
    api_url = f"{BASE_API_URL}/lf/{LANGFLOW_ID}/api/v1/run/{FLOW_ID}"
    headers = {
        "Authorization": f"Bearer {APPLICATION_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "input_value": message,
        "output_type": "chat",
        "input_type": "chat",
        "tweaks": TWEAKS
    }

    response = requests.post(api_url, json=payload, headers=headers)
    response.raise_for_status()
    return response.json()

def save_response(response, message_type="json"):
    """Save response to a file."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"response_{timestamp}.{message_type}"
    filepath = os.path.join(SAVE_PATH, filename)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        if message_type == "json":
            json.dump(response, f, indent=2)
        else:
            f.write(response)
    return filename

def format_response(response):
    """Extract the text message from the response."""
    try:
        return response["outputs"][0]["outputs"][0]["results"]["message"]["text"]
    except (KeyError, IndexError):
        return "Unable to format response."

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat requests."""
    data = request.json
    message = data.get('message')
    
    if not message:
        return jsonify({
            "success": False,
            "error": "No message provided"
        }), 400

    try:
        # Get response from Langflow
        response = run_flow(message)
        
        # Save raw response
        raw_filename = save_response(response)
        
        # Format and save text response
        formatted_message = format_response(response)
        text_filename = save_response(formatted_message, "txt")
        
        return jsonify({
            "success": True,
            "message": formatted_message,
            "raw_file": f"/responses/{raw_filename}",
            "text_file": f"/responses/{text_filename}"
        })
    
    except requests.exceptions.RequestException as e:
        return jsonify({
            "success": False,
            "error": f"API request failed: {str(e)}"
        }), 500
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Server error: {str(e)}"
        }), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_data():
    """Analyze social media post data."""
    try:
        data = request.json.get('data')
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Add your analysis logic here
        total_posts = len(data)
        total_likes = sum(post.get('likes', 0) for post in data)
        total_shares = sum(post.get('shares', 0) for post in data)
        total_comments = sum(post.get('comments', 0) for post in data)

        analysis = f"""Analysis of {total_posts} social media posts:

• Average engagement per post:
  - Likes: {total_likes/total_posts:.2f}
  - Shares: {total_shares/total_posts:.2f}
  - Comments: {total_comments/total_posts:.2f}

• Total engagement:
  - Total Likes: {total_likes}
  - Total Shares: {total_shares}
  - Total Comments: {total_comments}"""

        # Prepare the first post's data for further analysis in chat
        first_post_avg = {
            "likes": data[0].get("likes", 0),
            "shares": data[0].get("shares", 0),
            "comments": data[0].get("comments", 0)
        }

        return jsonify({
            'success': True,
            'analysis': analysis,
            'first_post_avg': first_post_avg
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=3000)
