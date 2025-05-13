//Handlebars.js — это шаблонизатор,модуль hbs, доступный через npm. 
// HandleBars можно использовать для рендеринга веб-страниц на стороне клиента из данных на стороне сервера.
// шаблонизатор позволяет отделить макет сайта, его контент и блоки вв отдельные файлы

const express = require('express'); //Подключаю фреймворк Express, для создания веб-приложения и API в Node.js.
const app = express(); //Создю экземпляр Express-приложения. 
// Через  переменную app настраиваю маршруты, middleware и запускаю сервер.
require('dotenv').config(); // загрузка переменных окружения из .env файла
const router = express.Router();// Создаёт новый роутер (маршрутизатор).
//  Это способ группировать маршруты отдельно от app, например: router.get(...), а потом подключить его в app.
const { engine } = require('express-handlebars'); // Импортирует движок шаблонов Handlebars из express-handlebars.
// Handlebars — это шаблонизатор, с помощью которого можно писать HTML с динамическими переменными.
const path = require('path');//Подключает встроённый модуль path из Node.js. 
// нужен для правильной работы с путями к файлам
const cookieParser = require('cookie-parser');// подключение библиотеки, при ее установке мы сможем совершать 
// над cookie различные операции, читать их


//НАСТРОЙКА Express.js РАБОТАТЬ СО СТАТИЧНЫМИ ФАЙЛАМИ В ПАПКЕ public.
app.use(express.static(path.join(__dirname, 'public')))


// // НАСТРОЙКА МАРШРУТИЗАЦИИ
// app.use('/user', router);


// ПОДКЛЮЧЕНИЕ И НАВСТРОЙКА движка просмотра для handlebars
app.engine('handlebars', engine(
  //app.engine() — регистрирует шаблонизатор под расширением .handlebars.
//engine({...}) — конфигурация Handlebars-движка. Внутри объекта передаём настройки
  {


//НАСТРОЙКА ПУТЕЙ ДЛЯ ГЛАВНОГО МАЕТА 
  defaultLayout: 'users',             // главный макет по умолчанию
  layoutsDir: path.join(__dirname, 'views/layouts'),// главный макет для рендеринга
  partialsDir: path.join(__dirname, 'views/partials'), // папка с частичными шаблонами (header, nav и т.д.)
}      
));
app.set('view engine', 'handlebars');
//Говорит Express использовать Handlebars как основной шаблонизатор.
app.set('views', './views');
// в EXPRESS указываем местоположение файлов для компиляции, что все шаблоны (views) хранятся в папке ./views.


//СОЗДАНИЕ ПОЛЬЗОВАТЕЛЬ. РАБОТА БЕЗ ПОДКЛЮЧЕНИЯ К БАЗЕ
const users = [
  { id: 1, name: 'Alex', email: 'alex@example.com' },
  { id: 2, name: 'Yevhenii', email: 'eugene@example.com' }
];

app.use(express.urlencoded({ extended: true }));
//ПОДКЛЮЧАЕМ COOKIE КАК MIDLEWARE
app.use(cookieParser(process.env.SECRET))//передаем секретный ключ , что дает возможность
// подписывать и проверять файлы ,это  и защищает от взлома со стороні пользователя
//Благодаря добавлению cookie-parser приложение Express получает доступ к req.cookies — объекту,
//  содержащему все файлы cookie, отправленные клиентом.

//Для ручного добавления куки используем метод setHeader в Express 
// пример: res.setHeader('Set-Cookie', 'myCookie=cookie_value; Max-Age=3600'); 

const cookieSet = {
  httpOnly: true, // доступ только со стороны сервера
  maxAge: 1000000, // период сохраения 
  signed: true // только если имеется секретный ключ установленный на сервере
} 


//МАРШРУТ ДЛЯ ГЛАВОЙ СТРАНИЧКИ
app.get('/users', (req, res) => {
  res.render('allUsers.handlebars', { title: 'Все пользователи', users }); //функция response.render() создают страницу html и отправляет 
// ее пользователю с конткнтом прописаным в файле allUsers.hbs 
});


//МАРШРУТ ДЛЯ СТРАНИЦЫ ВЫЗОВОВ ПО id
app.get('/users/:userId', (req, res) => {
  const user = users.find(user => user.id == req.params.userId); 
  if (!user) return res.status(404).send('User not found');
  const title = `Пользователь: ${user.name}`;
  res.render('user.handlebars', { title, user });
});

app.post('/users', (req, res) => {
  res.cookie('my-theme', 'theme', cookieSet) 
//Функция res.cookie() используется для установки cookie в браузере клиента.
// Она позволяет назначить cookie, указав имя и значение.
// Значение может быть простой строкой или объектом, который будет автоматически преобразован в JSON.
// res.cookie(имя, значение [, параметры])
// имя: Имя файла cookie.
//value: Значение cookie. Это может быть строка или объект, преобразованный в JSON.
//параметры (необязательно): объект, который может содержать такие свойства, как срок действия, домен, путь, безопасность и т. д. 
  // Они помогают контролировать поведение cookie-файла. 
  res.redirect('/users');
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port http://localhost:${process.env.PORT}/users`);
});