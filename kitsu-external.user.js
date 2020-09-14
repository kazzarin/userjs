// ==UserScript==
// @name         Kitsu External Links
// @namespace    https://github.com/synthtech
// @description  Add external links to Kitsu media pages
// @version      1.0
// @author       synthtech
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @match        *://kitsu.io/*
// @grant        none
// ==/UserScript==

(() => {
    const REGEX = /^https?:\/\/kitsu\.io\/(anime|manga)\/([^\/]+)\/?(?:\?.*)?$/;

    const App = {
        getMappings(slug, media, cb) {
            fetch('https://kitsu.io/api/graphql', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    query: `query ($slug: String!) { ${this.getMediaQuery(media)}(slug: $slug) { mappings(first: 20) { nodes { externalId externalSite } } } }`,
                    variables: { slug }
                })
            })
            .then(res => { return res.json() })
            .then(({data}) => {
                let mappings;
                if (data) {
                    if (media === 'anime') mappings = data.findAnimeBySlug.mappings.nodes;
                    else if (media === 'manga') mappings = data.findMangaBySlug.mappings.nodes;
                }
                cb(mappings);
            })
        },
        getMediaQuery(media) {
            if (media === 'anime') {
                return 'findAnimeBySlug';
            } else {
                return 'findMangaBySlug';
            }
        }
    };

    waitForUrl(REGEX, () => {
        const [url, media, slug] = location.href.match(REGEX);
        waitForElems({
            sel: '.media-summary',
            stop: true,
            onmatch(node) {
                let url = location.href;
                App.getMappings(slug, media, mappings => {
                    let check = document.querySelector('#external-links');
                    if (check) check.remove();

                    if (location.href === url && mappings?.length) {
                        let frag = new DocumentFragment();
                        let section = document.createElement('section');
                        section.id = 'external-links';
                        section.className = 'media--information';

                        let header = document.createElement('h5');
                        header.textContent = 'External Links';
                        section.append(header);

                        let listWrap = document.createElement('ul');

                        mappings.forEach(site => {
                            let list = document.createElement('li');
                            let link = document.createElement('a');
                            link.target = '_blank';
                            link.rel = 'noopener noreferrer';
                            switch (site.externalSite) {
                                case 'MYANIMELIST_ANIME':
                                    link.href = `https://myanimelist.net/anime/${site.externalId}`;
                                    link.textContent = 'MyAnimeList';
                                    break;
                                case 'MYANIMELIST_MANGA':
                                    link.href = `https://myanimelist.net/manga/${site.externalId}`;
                                    link.textContent = 'MyAnimeList';
                                    break;
                                case 'ANILIST_ANIME':
                                    link.href = `https://anilist.co/anime/${site.externalId}`;
                                    link.textContent = 'AniList';
                                    break;
                                case 'ANILIST_MANGA':
                                    link.href = `https://anilist.co/manga/${site.externalId}`;
                                    link.textContent = 'AniList';
                                    break;
                                case 'MANGAUPDATES':
                                    link.href = `https://www.mangaupdates.com/series.html?id=${site.externalId}`;
                                    link.textContent = 'MangaUpdates';
                                    break;
                            }
                            list.append(link);
                            listWrap.append(list);
                        });

                        section.append(listWrap);
                        frag.append(section);
                        node.append(frag);
                    }
                });
            }
        });
    });
})();
