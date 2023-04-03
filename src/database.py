import json

class Database:
  def __init__(self, root_path="database"):
    self.path = root_path

  def load(self, node):
    with open(f'{self.path}/{node}.json', 'r') as file:
      return json.loads(file.read())

  def set_key(self, node, key, value):
    data = self.load(node)
    data[key] = value
    self.save(node, data)

  def get_key(self, node, key):
    return self.load(node)[key]
  
  def save(self, node, data):
    with open(f'{self.path}/{node}.json', 'w') as file:
      file.write(json.dumps(data, indent=2))
      
