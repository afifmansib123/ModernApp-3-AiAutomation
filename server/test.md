1. uploading and analysing a pic from desktop 

curl -X POST http://localhost:5001/api/quotes/upload \
  -F "drawing=@drawing.jpg"