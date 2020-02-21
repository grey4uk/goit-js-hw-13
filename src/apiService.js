import '../node_modules/pnotify/dist/PNotifyBrightTheme.css';
import PNotify from '../node_modules/pnotify/dist/es/PNotify.js';
import PNotifyButtons from '../node_modules/pnotify/dist/es/PNotifyButtons.js';
const KEY = '15313425-bc0f61e46a051ea2578b0fd6a';
export default function pixiApi(search, numberPage, callback) {
  const baseURL = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${search}&page=${numberPage}&per_page=12&key=${KEY}`;
  fetch(baseURL)
    .then(response => response.json())
    .then(data => {
      PNotify.notice(`Recieved : ${search}`);
      callback(data);
    })
    .then(() =>
      window.scrollTo({
        top: window.document.body.scrollHeight,
        behavior: 'smooth',
      }),
    )
    .catch(error => PNotify.error(error));
}
