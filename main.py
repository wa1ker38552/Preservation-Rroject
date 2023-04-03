from flask import render_template
from flask import make_response
from flask import send_file
from flask import redirect
from flask import request
from src import database
from flask import Flask
from src import events
import json
import time
import os

app = Flask(__name__)
db = database.Database()

@app.route('/')
def index():
  if events.logged_in(request):
    return render_template('index.html')
  return redirect('/login', code=302)

@app.route('/chat', methods=['GET', 'POST'])
def chat():
  if events.logged_in(request):
    if request.method == 'GET':
      return render_template('chat.html')
    else:
      data = json.loads(request.data.decode('utf-8'))
      resp = events.get_response(os.environ['TOKEN'], data['prompt'])
      return {'result': resp}
  return redirect('/login', code=302)

@app.route('/profile/<username>')
def profile(username):
  if events.logged_in(request):
    return render_template('profile.html', username=username)
  else:
    return redirect('/login', code=302)

@app.route('/issues')
def issues():
  if events.logged_in(request):
    return render_template('issues.html')
  return redirect('/login', code=302)

@app.route('/issues/<type>')
def issues_t(type):
  if events.logged_in(request):
    return render_template('issues-landing.html', type=type)
  else:
    return redirect('/login', code=302)

@app.route('/issues/<type>/<id>')
def issues_t_i(type, id):
  print(id)
  if events.logged_in(request):
    return render_template('issues-post.html')
  else:
    redirect('/login', code=302)

@app.route('/posts/<type>/<id>')
def posts(type, id):
  return db.get_key('posts', type)[id]

@app.route('/fetch/<type>')
def fetch_issue(type):
  raw = db.get_key('posts', type)
  data = []
  for item in raw:
    data.append(raw[item])
  data.reverse()
  return data

@app.route('/callback')
def callback():
  token = request.args.get('token')
  response = make_response(redirect('/'))
  response.set_cookie('Authorization', token)
  return response

@app.route('/login', methods=['GET', 'POST'])
def login():
  if events.logged_in(request):
    return redirect('/', code=302)
  else:
    if request.method == "GET":
      return render_template('login.html')
    else:
      data = json.loads(request.data.decode('utf-8'))
      username = data['username']
      password = data['password']

      if username in db.load('user'):
        if password == db.get_key('user', username)['password']:
          token = f'{hash(password+username+str(time.time()))}.{username}'
          return {'errors': None, 'token': token}
        else:
          return {'errors': 1}
      else:
        return {'errors': 0}
        

@app.route('/signup', methods=['GET', 'POST'])
def signup():
  if events.logged_in(request):
    return redirect('/', code=302)
  else:
    if request.method == "GET":
      return render_template('signup.html')
    else:
      data = json.loads(request.data.decode('utf-8'))
      username = data['username']
      password = data['password']

      if not username in db.load('user'):
        if not password.strip() == "":
          if not username.strip() == "":
            if len(username) > 3 and len(username) <= 20:
              db.set_key('user', username, {
                'password': password,
                'posts': [],
                'profile': "/static/assets/default.png",
                'bio': 'Hey there! 👋'
              })
              token = f'{hash(password+username+str(time.time()))}.{username}'
              return {'errors': None, 'token': token}
            else:
              return {'errors': 3}
          else:
            return {'errors': 2}
        else:
          return {'errors': 1}
      else:
        return {'errors': 0}

@app.route('/profile')
def change_profile():
  url = request.args.get('url')
  username = request.cookies.get('Authorization').split('.')[1]
  data = db.get_key('user', username)
  data['profile'] = url
  db.set_key('user', username, data)
  return {'success': True}

@app.route('/bio')
def change_bio():
  text = request.args.get('text')
  username = request.cookies.get('Authorization').split('.')[1]
  data = db.get_key('user', username)
  data['bio'] = text
  db.set_key('user', username, data)
  return {'success': True}

@app.route('/users/<username>')
def users(username):
  data = db.get_key('user', username)
  del data['password']
  return data

@app.route('/users/<username>/posts')
def user_posts(username):
  data = db.get_key('user', username)
  return data['posts']

@app.route('/news/<query>')
def news(query):
  return events.scrapeNYT(query)

@app.route('/logout')
def logout():
  response = make_response(redirect('/login', code=302))
  response.set_cookie('Authorization', '', expires=0)
  return response

@app.route('/create', methods=['POST'])
def create():
  type = request.args.get('type')
  data = json.loads(request.data.decode('utf-8'))
  username = request.cookies.get('Authorization').split('.')[1]
  id = len(db.get_key('posts', type))+1

  data['type'] = type
  data['id'] = id
  data['time'] = time.time()
  data['author'] = {
    "username": username,
    "profile": db.get_key('user', username)['profile']
  }
  user = db.get_key('user', username)
  user['posts'].append(data)
  db.set_key('user', username, user)
  posts = db.get_key('posts', type)
  posts[id] = data
  print(id)
  db.set_key('posts', type, posts)
  
  return {'success': True, 'id': id}

app.run(host='0.0.0.0', port=8080)
