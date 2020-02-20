import './styles.css';
import '../node_modules/pnotify/dist/PNotifyBrightTheme.css';
import PNotify from '../node_modules/pnotify/dist/es/PNotify.js';
import PNotifyButtons from '../node_modules/pnotify/dist/es/PNotifyButtons.js';
import '../node_modules/material-design-icons/iconfont/MaterialIcons-Regular.woff';
import '../node_modules/material-design-icons/iconfont/MaterialIcons-Regular.woff2';
import '../node_modules/material-design-icons/iconfont/material-icons.css';
import '../node_modules/basiclightbox/dist/basicLightbox.min.css';
import * as basicLightbox from '../node_modules/basiclightbox/dist/basicLightbox.min.js';

import inputForm from './templates/form.hbs';
import pixiApi from './apiService.js';
import listPhoto from './templates/list-item-template.hbs';
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollToPlugin);
let currentPage = 0;
let listImage;
function parseData(data) {
  const rez = listPhoto(data);
  classDiv.innerHTML += rez;
  classBtn.removeAttribute('disabled');
  listImage = Array.from(document.querySelectorAll('.noLoad'));
  listImage.forEach((elem, index) => {
    if (index === 0) {
      elem.dataset.pageIndex = currentPage;
    }
    observer1.observe(elem);
  });
  listImage = Array.from(document.querySelectorAll('[data-page-index]'));
  listImage.forEach(elem => {
    pageObserver.observe(elem);
  });
}
const onPageObserver = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cPage = Number(entry.target.dataset.pageIndex) - 1;
    //   console.log('Page:', cPage);
    }
  });
};
const pageObserver = new IntersectionObserver(onPageObserver, {
  rootMargin: '50px',
  threshold: 0,
});
const classDiv = document.querySelector('#div-section');
const classBtn = document.querySelector('#btn-load-more');
classDiv.insertAdjacentHTML('afterend', inputForm());
const searchForm = document.querySelector('#search-form');

classBtn.addEventListener('click', onClickBtn);
function onClickBtn(event) {
  classBtn.setAttribute('disabled', true);
  pixiApi(searchForm.querySelector('input').value, ++currentPage, parseData);
}

if(searchForm.querySelector('input').value){pixiApi(searchForm.querySelector('input').value, ++currentPage, parseData);}


const options = {
  rootMargin: '50px',
  threshold: 0.1,
};
const onEntry = (entries, observer1) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('noLoad');
      entry.target.src = entry.target.dataset.origin;
      observer1.unobserve(entry.target);
    }
  });
};
const observer1 = new IntersectionObserver(onEntry, options);


classDiv.addEventListener('click', onImgClick);
function onImgClick(e) {
  if (e.target.dataset.origin) {
    const instance = basicLightbox.create(`
    <img width="1400" height="900" src="${e.target.dataset.origin}">
`);
    instance.show();
  }
  
}
window.scrollTo(classBtn);