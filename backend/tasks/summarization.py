from google import genai
from google.genai import types
import os
import json
from dotenv import load_dotenv

load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")


def summarise(content):
    client = genai.Client(api_key=gemini_api_key)

    response = client.models.generate_content(
        model="gemini-2.0-flash", config=types.GenerateContentConfig(
            system_instruction="""You are an assistant that summarizes articles and extracts useful, user-friendly tags for bookmarking and categorization.

            Given the full text or metadata of a webpage(title, content, and description), return:
            1. A short, clear summary in 2-3 sentences, suitable for previewing the content.
            2. A list of relevant tags that describe the topic of the article in a user-friendly way. Use lowercase words and phrases. Tags should be broad, descriptive, and helpful for organizing content(e.g., "technology", "privacy", "ios", "gaming", "startups").

            Return the result in the following JSON format:

            {
                "summary": "<short summary here>",
                "tags": ["tag1", "tag2", "tag3", ...]
            }

            only return the json object without any unwanted characters, so that the content can be parsed easily
            """
        ), contents=content
    )

    text = response.text.strip()

    # the gemini response is wrapped in a markdown style code; this block removes the fences (```json.... ```)
    if text.startswith("```json"):
        text = text.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        print("Failed to parse JSON")
        print(text)
        raise
