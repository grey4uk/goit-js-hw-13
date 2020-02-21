import './styles.css';
import '../node_modules/material-design-icons/iconfont/material-icons.css';
import '../node_modules/basiclightbox/dist/basicLightbox.min.css';
import * as basicLightbox from '../node_modules/basiclightbox/dist/basicLightbox.min.js';
import debounce from '../node_modules/lodash/debounce.js';

import inputForm from './templates/form.hbs';
import pixiApi from './apiService.js';
import listPhoto from './templates/list-item-template.hbs';
import 'pnotify/dist/PNotifyBrightTheme.css';
import PNotify from 'pnotify/dist/es/PNotify';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons.js';

const classDiv = document.querySelector('#div-section');
classDiv.insertAdjacentHTML(
  'afterbegin',
  '<ul class="gallery" style="display:flex;flex-wrap:wrap;width:100vw; list-style: none;"></ul>',
);
const classDivList = classDiv.querySelector('.gallery');
let currentPage = 1;
let listImage;

function parseData(data) {
  const rez = listPhoto(data);
  classDivList.insertAdjacentHTML('beforeend', rez);
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
    }
  });
};
const pageObserver = new IntersectionObserver(onPageObserver, {
  rootMargin: '50px',
  threshold: 0,
});

const classBtn = document.querySelector('#btn-load-more');
classDiv.insertAdjacentHTML('beforebegin', inputForm());
const searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', onEnterClick);
const searchBtn = document.querySelector('#search-button');
searchBtn.addEventListener('click', onEnterClick);
const scrollTopBtn = document.querySelector('#scroll-to-top');
scrollTopBtn.addEventListener('click', scrollTopBtnClick);

function scrollTopBtnClick(e) {
  window.scrollTo(0,document.innerHeight);
}

function onEnterClick(e) {
  classDivList.innerHTML = '';
  e.preventDefault();
  currentPage = 0;
  runBuildResult();
}

classBtn.addEventListener('click', onClickBtn);

function onClickBtn(event) {
  classBtn.setAttribute('disabled', true);
  runBuildResult();
}

function runBuildResult() {
  if (!searchForm.querySelector('input').value) {
    PNotify.alert('Empty input, choose target)');
    return;
  } else {
    PNotify.closeAll();
    pixiApi(searchForm.querySelector('input').value, ++currentPage, parseData);
  }
}

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
