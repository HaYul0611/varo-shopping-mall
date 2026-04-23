const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');

const indexHtml = fs.readFileSync('c:/Users/admin/Desktop/HAYUL/eclipse/ShoppingMall/public/varo/index.html', 'utf8');
const dom = new JSDOM(indexHtml);

const nav = dom.window.document.getElementById('varoCategoryNav');
console.log('in index.html directly:', !!nav);

const headerHtml = fs.readFileSync('c:/Users/admin/Desktop/HAYUL/eclipse/ShoppingMall/public/varo/includes/header.html', 'utf8');
const headerDom = new JSDOM(headerHtml);
const headerNav = headerDom.window.document.getElementById('varoCategoryNav');
console.log('in header.html directly:', !!headerNav);
if (headerNav) console.log('header.html Nav style:', headerNav.getAttribute('style'));
