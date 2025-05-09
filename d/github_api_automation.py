import requests
import base64

# GitHub API configuration
TOKEN = "your_personal_access_token"
OWNER = "Johnthesuper117"
REPO = "Web-Game-test"
FILE_PATH = "result.txt"

# Encode the content in Base64
content = "Hello, backend result!"
encoded_content = base64.b64encode(content.encode()).decode()

# Check if the file already exists (to get the SHA)
url = f"https://api.github.com/repos/{OWNER}/{REPO}/contents/{FILE_PATH}"
headers = {"Authorization": f"token {TOKEN}"}
response = requests.get(url, headers=headers)
if response.status_code == 200:
    sha = response.json()["sha"]
else:
    sha = None  # File does not exist

# Create or update the file
data = {
    "message": "Update result file",
    "content": encoded_content,
    "sha": sha
}
response = requests.put(url, headers=headers, json=data)
print(response.json())
