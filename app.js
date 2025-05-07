const express = require('express');
const app = express();
require('dotenv').config(); // загрузка переменных окружения из .env файла

// Налаштування PUG як движка шаблонів
app.set('view engine', 'pug');
app.set('views', './views');

// Маршрут для головної сторінки
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Home Page',
    message: 'Welcome to my website!' 
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port http://localhost:${process.env.PORT}`);
});