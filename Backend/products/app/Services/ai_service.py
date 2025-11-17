import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
load_dotenv()
try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel('gemini-1.0-pro')
except Exception as e:
    print(f"Error configuring Generative AI: {e}")
    model = None

def parse_shopping_query(user_query: str) -> dict:
    if not model:
        raise ConnectionError("Generative AI model is not configured.")
    prompt = f"""
    You are an expert e-commerce search assistant. Your task is to analyze the user's
    request and extract structured search criteria.

    The available criteria for filtering are: 'category' (e.g., 'dresses', 'jackets')
    and 'tags' (e.g., 'warm', 'stylish', 'winter', 'formal', 'beach-wear').

    Analyze the user's request below and respond ONLY with a valid JSON object
    containing the extracted criteria. Do not include any other text or explanations.

    User Request: "{user_query}"

    Example:
    User Request: "I'm going to a beach wedding and need an elegant, light-colored dress."
    JSON Output:
    {{
      "category": "dresses",
      "tags": ["beach-wear", "elegant", "light-color", "wedding-guest"]
    }}
    """

    try:
        response = model.generate_content(prompt)
        # Clean up the response to ensure it's valid JSON
        json_text = response.text.strip().replace("```json", "").replace("```", "").strip()
        return json.loads(json_text)
    except (json.JSONDecodeError, AttributeError, ValueError) as e:
        print(f"Error decoding AI response: {e}")
        # Fallback in case of an error
        return {"tags": user_query.split()}
    except Exception as e:
        print(f"An unexpected error occurred with the AI service: {e}")
        return {}