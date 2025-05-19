from google import genai

client = genai.Client(api_key="AIzaSyDDZzxpuwLN12Fw_BRT0f3MjgxmQcArYwI")

response = client.models.generate_content(
    model="gemini-2.0-flash", contents="Hello, How are you?"
)
print(response.text)
