//Handlebars.js — это шаблонизатор,модуль hbs, доступный через npm. 
// HandleBars можно использовать для рендеринга веб-страниц на стороне клиента из данных на стороне сервера.
// шаблонизатор позволяет отделить макет сайта, его контент и блоки вв отдельные файлы

const express = require('express');
const app = express();
require('dotenv').config(); // загрузка переменных окружения из .env файла
const router = express.Router();
const { engine } = require('express-handlebars'); // подключение 

// // НАСТРОЙКА МАРШРУТИЗАЦИИ
// app.use('/user', router);

// настраиваю движок просмотра для handlebars
app.engine('handlebars', engine(
  {
//настрйка путей для главного макета 
  defaultLayout: 'users',             // главный макет по умолчанию
  layoutsDir: 'views/layouts',     // папка с макетами
  partialsDir: 'views/partials'    // папка с частичными шаблонами (header, nav и т.д.)
}
));
app.set('view engine', 'handlebars');
// в EXPRESS указываем местоположение файлов для компиляции
app.set('views', './views');

const users = [
  { id: 1, name: 'Alex', email: 'alex@example.com' },
  { id: 2, name: 'Yevhenii', email: 'eugene@example.com' }
];

// Маршрут для головної сторінки
app.get('/users', (req, res) => {
  res.render('allUsers.hbs', { title: 'Все пользователи', users }); //функция response.render() создают страницу html и отправляет 
  // ее пользователю с конткнтом прописаным в файле allUsers.hbs 
});

//маршрут для страницы вызовов по id
app.get('/users/:userId', (req, res) => {
  const user = users.find(user => user.id == req.params.userId); 
  if (!user) return res.status(404).send('User not found');
  const title = `Пользователь: ${user.name}`;
  res.render('user.hbs', { title, user });
});


app.listen(process.env.PORT, () => {
  console.log(`Server running on port http://localhost:${process.env.PORT}`);
});