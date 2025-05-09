db = db.getSiblingDB('chat_app');
db.users.insertOne({
  "username": "soufiane@gmail.com",
  "password": "soufiane123",
  "created_at": new Date()
});