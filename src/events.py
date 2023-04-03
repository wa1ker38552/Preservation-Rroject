from bs4 import BeautifulSoup
import requests
import random

def logged_in(request): 
  if request.cookies.get('Authorization') is None:
    return False
  return True

def scrapeNYT(query):
  request = requests.get(f'https://www.nytimes.com/search?query={query}')
  soup = BeautifulSoup(request.text, 'html.parser')
  articles = soup.find_all('div', attrs={'class': 'css-1i8vfl5'})
  data = []

  for a in articles:
    raw = BeautifulSoup(str(a), 'html.parser')
    title = raw.find('h4', attrs={'class': 'css-2fgx4k'}).get_text()
    blurb = raw.find('p', attrs={'class': 'css-16nhkrn'}).get_text()
    link = raw.find_all('a', href=True)
    data.append({
      'link': f'https://nytimes.com{link[0]["href"]}',
      'title': title,
      'blurb': blurb,
      'img': raw.find('img')['src']
    })
  return data


def get_response(key, prompt):
  headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {key}'
  }
  data = {
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": prompt}],
    "temperature": 0.7
  }
  r = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=data)
  return random.choice(r.json()['choices'])['message']['content'].strip()
