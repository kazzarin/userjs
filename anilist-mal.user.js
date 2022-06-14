// ==UserScript==
// @name         AniList MAL Links
// @namespace    https://github.com
// @description  Add links to MAL on media pages
// @version      2.7.0
// @license      0BSD
// @author       Zarin
// @match        https://anilist.co/*
// @grant        none
// ==/UserScript==

/*! @violentmonkey/dom v2.1.0 | ISC License */
/* eslint-disable-line */!function(e){"use strict";/* eslint-disable-next-line */
/*! @gera2ld/jsx-dom v2.1.0 | ISC License */var t="http://www.w3.org/1999/xlink",n={show:t,actuate:t,href:t};function r(e,t){for(var n=arguments.length,r=new Array(n>2?n-2:0),i=2;i<n;i++)r[i-2]=arguments[i];return o(e,t=Object.assign({},t,{children:1===r.length?r[0]:r}))}function o(e,t){var n;if("string"==typeof e)n=1;else{if("function"!=typeof e)throw new Error("Invalid VNode type");n=2}return{vtype:n,type:e,props:t}}function i(e){return e.children}var u={isSvg:!1};function s(e,t){if(1===t.type)null!=t.node&&e.append(t.node);else{if(4!==t.type)throw new Error("Unkown ref type "+JSON.stringify(t));t.children.forEach((function(t){s(e,t)}))}}var a={className:"class",labelFor:"for"};function c(e,t,r,o){if(t=a[t]||t,!0===r)e.setAttribute(t,"");else if(!1===r)e.removeAttribute(t);else{var i=o?n[t]:void 0;void 0!==i?e.setAttributeNS(i,t,r):e.setAttribute(t,r)}}function l(e,t){if(void 0===t&&(t=u),null==e||"boolean"==typeof e)return{type:1,node:null};if(e instanceof Node)return{type:1,node:e};if(2===(null==(f=e)?void 0:f.vtype)){var n=e,r=n.type,o=n.props;if(r===i){var a=document.createDocumentFragment();if(o.children)s(a,l(o.children,t));return{type:1,node:a}}return l(r(o),t)}var f;if(function(e){return"string"==typeof e||"number"==typeof e}(e))return{type:1,node:document.createTextNode(""+e)};if(function(e){return 1===(null==e?void 0:e.vtype)}(e)){var d,p,v=e,y=v.type,h=v.props;if(t.isSvg||"svg"!==y||(t=Object.assign({},t,{isSvg:!0})),function(e,t,n){for(var r in t)"key"!==r&&"children"!==r&&"ref"!==r&&("dangerouslySetInnerHTML"===r?e.innerHTML=t[r].__html:"innerHTML"===r||"textContent"===r||"innerText"===r?e[r]=t[r]:r.startsWith("on")?e[r.toLowerCase()]=t[r]:c(e,r,t[r],n.isSvg))}(d=t.isSvg?document.createElementNS("http://www.w3.org/2000/svg",y):document.createElement(y),h,t),h.children){var g=t;t.isSvg&&"foreignObject"===y&&(g=Object.assign({},g,{isSvg:!1})),p=l(h.children,g)}null!=p&&s(d,p);var m=h.ref;return"function"==typeof m&&m(d),{type:1,node:d}}if(Array.isArray(e))return{type:4,children:e.map((function(e){return l(e,t)}))};throw new Error("mount: Invalid Vnode!")}function f(e){for(var t=[],n=0;n<e.length;n+=1){var r=e[n];Array.isArray(r)?t=t.concat(f(r)):null!=r&&t.push(r)}return t}function d(e){return 1===e.type?e.node:e.children.map(d)}function p(e){return Array.isArray(e)?f(e.map(p)):d(l(e))}"object"==typeof VM&&(VM.versions=Object.assign({},VM.versions,{dom:"2.1.0"})),e.Fragment=i,e.createElement=r,e.getElementsByXPath=function(e,t=document){const n=document.evaluate(e,t,null,XPathResult.ANY_TYPE,null),r=[];let o;for(;o=n.iterateNext();)r.push(o);return r},e.getTextValues=function e(t){return t.nodeType===Node.TEXT_NODE?[t.nodeValue]:t.nodeType!==Node.ELEMENT_NODE||["script","style"].includes(t.tagName.toLowerCase())?[]:Array.from(t.childNodes).flatMap(e)},e.h=r,e.hm=function(){return p(r.apply(void 0,arguments))},e.m=p,e.mountDom=p,e.observe=function(e,t,n){let r;const o=new MutationObserver(((e,n)=>{t(e,n)&&r()}));return o.observe(e,Object.assign({childList:!0,subtree:!0},n)),r=()=>o.disconnect(),r}}(this.VM=this.VM||{});
/* global VM */

(() => {
    const store = new Map();
    const regex = /\/(anime|manga)\/([0-9]+)(\/.*)?/;

    async function updateStore(data) {
        const [k, v] = data;
        store.set(k, v);
    }

    async function fetchId(id) {
        const res = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: 'query media($id: Int) { Media(id: $id) { idMal } }',
                variables: { id },
            }),
        });
        const { data } = await res.json();
        const malId = data.Media?.idMal;
        updateStore([id, malId]);
        return malId;
    }

    async function checkStore(id) {
        if (store) {
            if (store.has(id)) {
                return store.get(id);
            }
        }
        const malId = await fetchId(id);
        return malId;
    }

    // TODO: Split this up and add more URL checks before checking storage
    async function getLink(elem) {
        const [, media, id] = location.pathname.match(regex);
        const malId = await checkStore(parseInt(id));
        const checkLink = document.querySelector('#mal-link');
        if (malId) {
            if (checkLink) {
                checkLink.href = `https://myanimelist.net/${media}/${malId}`;
            } else {
                const dataAttr = document.querySelector('.header-wrap').__vue__.$options._scopeId;
                const label = VM.hm('div', {
                    className: 'adult-label',
                    id: 'mal-label',
                    [dataAttr]: '',
                    style: 'background: #2e51a2;',
                }, 'MAL');
                const link = VM.hm('a', {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    id: 'mal-link',
                    href: `https://myanimelist.net/${media}/${malId}`,
                }, label);
                elem.appendChild(link);
            }
        } else if (checkLink) {
            checkLink.remove();
        }
    }

    function watchElem() {
        VM.observe(document.body, () => {
            const node = document.querySelector('.media .header .content > h1');
            if (node) {
                getLink(node);
                return true;
            }
            return false;
        });
    }

    function routeWatch() {
        const app = document.getElementById('app');
        if (app.__vue__) {
            app.__vue__.$router.afterEach((newRoute) => {
                if (regex.test(newRoute.path)) {
                    watchElem();
                }
            });
        } else {
            setTimeout(routeWatch, 300);
        }
    }

    if (regex.test(location.pathname)) {
        watchElem();
    }

    routeWatch();
})();
