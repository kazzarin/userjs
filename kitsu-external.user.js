// ==UserScript==
// @name         Kitsu External Links
// @namespace    https://github.com
// @description  Add external links to Kitsu media pages
// @version      2.0.0
// @author       Zarin
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @match        *://kitsu.io/*
// @grant        none
// ==/UserScript==

(() => {
    const REGEX = /^https?:\/\/kitsu\.io\/(anime|manga)\/([^/]+)\/?(?:\?.*)?$/;

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
        const res = await fetch('https://kitsu.io/api/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `query ($slug: String!) { ${mediaQuery}(slug: $slug) { mappings(first: 20) { nodes { externalId externalSite } } } }`,
                variables: { slug },
            }),
        });
        if (res.ok) {
            const { data } = await res.json();
            if (data) {
                return data[mediaQuery].mappings.nodes;
            }
        }
        return null;
    }

    async function newElem(type, props) {
        const elem = document.createElement(type);
        if (props) {
            Object.entries(props).forEach((attr) => {
                const [k, v] = attr;
                if (k === 'style') {
                    Object.entries(v).forEach((prop) => {
                        const [l, w] = prop;
                        elem.style[l] = w;
                    });
                } else {
                    elem[k] = v;
                }
            });
        }
        return elem;
    }

    async function createLinks(mappings, url) {
        const check = document.querySelector('#external-links');
        if (check) check.remove();

        if (location.href === url && mappings?.length) {
            const section = await newElem('section', {
                id: 'external-links',
                className: 'media--information',
            });

            const header = await newElem('h5', {
                textContent: 'External Links',
            });

            const listWrap = await newElem('ul');

            mappings.forEach(async (site) => {
                const map = mappingLinks.find((extLink) => extLink.key === site.externalSite);
                if (map) {
                    const list = await newElem('li');
                    const link = await newElem('a', {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        href: map.link + site.externalId,
                        textContent: map.title,
                    });
                    list.appendChild(link);
                    listWrap.appendChild(list);
                }
            });

            section.appendChild(header);
            section.appendChild(listWrap);
            return section;
        }
        return null;
    }

    waitForUrl(REGEX, (url) => {
        const [, media, slug] = url.match(REGEX);
        waitForElems({
            sel: '.media-summary',
            stop: true,
            onmatch: async (node) => {
                const mappings = await fetchMappings(media, slug);
                if (mappings) {
                    const links = await createLinks(mappings, url);
                    if (links) {
                        node.append(links);
                    }
                }
            },
        });
    });
})();
