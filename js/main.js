/* ============================================
   Trados — динамическая кнопка «Заказать»
   --------------------------------------------
   Один файл на весь сайт. Делает две вещи:

   1) На страницах каталога (Tea / wet / furniture):
      берёт название из карточки товара и подставляет
      его в ссылку кнопки «Заказать» →  contact.html?item=НАЗВАНИЕ

   2) На странице контактов (contact.html):
      читает это название из ссылки и подставляет
      в текст сообщения на кнопках Telegram / WhatsApp / Email.

   Стиль: одно действие на строку, без длинных цепочек.
   ============================================ */


/* ---------- 1. КАТАЛОГ: прошиваем название в кнопку ---------- */

// Находим все карточки товара на странице
var cards = document.querySelectorAll('.product');

// Проходим по каждой карточке по очереди
cards.forEach(function (card) {

  // Достаём из этой карточки кнопку и заголовок
  var btn  = card.querySelector('.product__btn');
  var name = card.querySelector('.product__name');

  // Работаем только если оба нашлись
  if (btn && name) {

    // Текст названия, без лишних пробелов по краям
    var title = name.textContent.trim();

    // Кодируем название, чтобы оно не сломало адрес
    var safeTitle = encodeURIComponent(title);

    // Переписываем адрес кнопки: ведёт на контакты + товар
    btn.href = 'contact.html?item=' + safeTitle;
  }
});


/* ---------- 2. КОНТАКТЫ: подставляем товар в сообщения ---------- */

// Шаг 1: берём хвост адреса после «?»  (например "?item=Бин%20Дао")
var query = location.search;

// Шаг 2: разбираем этот хвост в удобный органайзер параметров
var params = new URLSearchParams(query);

// Шаг 3: достаём из органайзера значение параметра "item"
var item = params.get('item');

// Дальше работаем, только если товар в адресе действительно есть
if (item) {

  // Собираем текст сообщения для менеджера
  var text = 'Здравствуйте! Хочу заказать: ' + item;

  // Кодируем текст и тему для вставки в ссылки
  var message = encodeURIComponent(text);
  var subject = encodeURIComponent('Заказ с сайта Trados');


  // --- Плашка «Ваш выбор: ...» ---

  // Находим пустую скрытую строку по её id
  var note = document.getElementById('order-note');

  if (note) {
    // Пишем в неё текст и показываем (было display: none)
    note.textContent = 'Ваш выбор: ' + item;
    note.style.display = 'block';
  }


  // --- Кнопка Telegram ---

  var tg = document.getElementById('btn-telegram');

  if (tg) {
    // Берём адрес кнопки и отрезаем всё после «?» (старый хвост)
    var tgParts = tg.href.split('?');
    var tgBase  = tgParts[0];              // чистый адрес: https://t.me/ooonrsp

    // Приклеиваем свежий текст заказа
    tg.href = tgBase + '?text=' + message;
  }


  // --- Кнопка WhatsApp ---

  var wa = document.getElementById('btn-whatsapp');

  if (wa) {
    var waParts = wa.href.split('?');
    var waBase  = waParts[0];              // чистый адрес: https://wa.me/79028331795

    wa.href = waBase + '?text=' + message;
  }


  // --- Кнопка Email (Gmail) ---

  var em = document.getElementById('btn-email');

  if (em) {
    // У почты в адресе несколько параметров, поэтому разбираем весь адрес
    var emailUrl = new URL(em.href);

    // Достаём «кому» из существующей ссылки, чтобы не писать почту заново
    var to = emailUrl.searchParams.get('to');

    // Собираем адрес письма заново из кусочков
    em.href = 'https://mail.google.com/mail/?view=cm&fs=1'
            + '&to=' + to
            + '&su=' + subject
            + '&body=' + message;
  }
}
