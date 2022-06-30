// ==UserScript==
// @name         Kitsu External Links
// @namespace    https://github.com
// @description  Add external links to Kitsu media pages
// @version      2.0.1
// @license      0BSD
// @author       Zarin
// @require      https://cdn.jsdelivr.net/npm/url-change-event@0.1.3
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @match        https://kitsu.io/*
// @grant        none
// ==/UserScript==

/* global VM */

(() => {
    const regex = /\/(anime|manga)\/([^/]+)\/?(?:\?.*)?$/;
    const mappingLinks = [
        {
            key: 'MYANIMELIST_ANIME',
            title: 'MyAnimeList',
            link: 'https://myanimelist.net/anime/',
        },
        {
            key: 'MYANIMELIST_MANGA',
            title: 'MyAnimeList',
            link: 'https://myanimelist.net/manga/',
        },
        {
            key: 'ANILIST_ANIME',
            title: 'AniList',
            link: 'https://anilist.co/anime/',
        },
        {
            key: 'ANILIST_MANGA',
            title: 'AniList',
            link: 'https://anilist.co/manga/',
        },
        {
            key: 'MANGAUPDATES',
            title: 'MangaUpdates',
            link: 'https://www.mangaupdates.com/series.html?id=',
        },
    ];

    async function fetchMappings(media, slug) {
        const mediaQuery = media === 'anime' ? 'findAnimeBySlug' : 'findMangaBySlug';
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const auth = JSON.parse(localStorage.getItem('ember_simple_auth:session'));
        const token = auth.authenticated?.access_token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        const res = await fetch('https://kitsu.io/api/graphql', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                query: `query ($slug: String!) { ${mediaQuery}(slug: $slug) { mappings(first: 20) { nodes { externalId externalSite } } } }`,
                variables: { slug },
            }),
        });
        if (res.ok) {
            const { data } = await res.json();
            if (data) {
                return data[mediaQuery].mappings?.nodes;
            }
        }
        return null;
    }

    function createLinks(mappings) {
        if (mappings.length) {
            const header = VM.h('h5', {}, 'External Links');
            const listWrap = VM.hm('ul');
            const section = VM.hm('section', {
                id: 'external-links',
                className: 'media--information',
            }, [header, listWrap]);
            mappings.forEach((site) => {
                const map = mappingLinks.find((extLink) => extLink.key === site.externalSite);
                if (map) {
                    const link = VM.h('a', {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        href: map.link + site.externalId,
                    }, map.title);
                    const list = VM.hm('li', {}, link);
                    listWrap.appendChild(list);
                }
            });
            return section;
        }
        return null;
    }

    async function init(side, path) {
        const [, media, slug] = path.match(regex);
        const mappings = await fetchMappings(media, slug);
        const check = document.querySelector('#external-links');
        if (check) check.remove();
        if (mappings) {
            const links = createLinks(mappings);
            if (links) {
                side.append(links);
            }
        }
    }

    window.addEventListener('urlchangeevent', (e) => {
        if (regex.test(e.newURL?.pathname)) {
            const sidebar = document.querySelector('.media-summary');
            if (sidebar) {
                init(sidebar, e.newURL.pathname);
            } else {
                VM.observe(document.body, () => {
                    const node = document.querySelector('.media-summary');
                    if (node) {
                        init(node, e.newURL.pathname);
                        return true;
                    }
                    return false;
                });
            }
        }
    });
})();
