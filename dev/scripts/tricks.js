/**
 * tricks.js
 * 
 * This script handles the search and filtering functionality for tricks data.
 * It uses jQuery to dynamically populate an autocomplete search bar and display
 * filtered results based on user input. The data is sourced from `tricksList.js`
 * via the global `window.getTricks` function.
 * 
 * Features:
 * - Autocomplete search for trick titles and descriptions.
 * - Dynamic filtering of results based on selected tags.
 * - Embeds YouTube videos for each trick.
 * - Displays additional metadata.
 * 
 * Dependencies:
 * - jQuery
 * - jQuery UI (for autocomplete functionality)
 * - tricksList.js (provides the `getTricks` function)
 */

const tricksJson = window.getTricks();

const autoCompleteSet = new Set();

tricksJson.tricks.forEach(trick => {
    autoCompleteSet.add(trick.title.toLowerCase());
    if (trick.description) autoCompleteSet.add(trick.description.toLowerCase());
});
const autocompleteValues = Array.from(autoCompleteSet);
const autocompleteFuse = new Fuse(autocompleteValues, {
    includeScore: true,
    ignoreLocation: true,
    threshold: 0.3,
    useExtendedSearch: true
});
const trickFuse = new Fuse(tricksJson.tricks, {
    keys: ['title', 'description'],
    includeScore: true,
    ignoreLocation: true,
    threshold: 0.3,
    useExtendedSearch: true
});


const $searchResults = $('#search-results');
const $searchInput = $('#search');
const baseShareUrl = window.location.href.split('?')[0] + '?trick=';


$(document).ready(function () {
    listTricksAsDirectory();
    $('#search').on('input', function () {
        const query = $(this).val().toLowerCase();
        filterDirectory(query);
    });
});

function CreateEmbedIframe(embedUrl) {
    const isTwitch = embedUrl.includes("twitch.tv");
    let finalUrl = embedUrl;
    if (!isTwitch && embedUrl.includes("youtube.com")) {
        // Convert YouTube watch URLs to embed format
        const watchMatch = embedUrl.match(/youtube\.com\/watch\?v=([\w-]+)/);
        if (watchMatch) {
            finalUrl = `https://www.youtube.com/embed/${watchMatch[1]}`;
        } else if (embedUrl.includes("shorts/")) {
            finalUrl = embedUrl.replace("shorts/", "embed/");
        }
    }
    const parentParam = isTwitch ? "&parent=ootrjsonsearch.org" : "";
    return `
           <div class="video-container">
               <iframe
                   src="${finalUrl}${parentParam}"
                   frameborder="0"
                   allowfullscreen
                   ${isTwitch ? 'scrolling="no"' : ''}
                   ${!isTwitch ? 'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin"' : ''}>
               </iframe>
           </div>
       `;
}

function filterTricks(query) {
    if (!query.trim()) return tricksJson.tricks;

    const fuseResults = trickFuse.search(query);
    return fuseResults.map(result => result.item);
}

function renderTrickCards(tricks) {
    var separator = tricks.length > 1 ? "top-border" : "";
    return tricks.map(trick => {
        const embed = CreateEmbedIframe(trick.url);
        const shareUrl = `${baseShareUrl}${encodeURIComponent(trick.title)}`;

        return `
        <div class="trick-card-container ${separator}">
            <article class="trick-card">
                <h2 class="trick-header">
                    ${trick.title}
                    <img class="trick-icon" src="../img/copy-link.svg" data-url="${shareUrl}" title="Copy Share Link" />
                </h2>
                <div class="description"><strong>How to do it:</strong> ${trick.description.replace(/\n/g, '<br>')}</div>
                ${embed}
            </article>
        </div>
        `;  
    }).join('');
}

function bindShareButtons() {
    document.querySelectorAll('.trick-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            const url = icon.getAttribute('data-url');
            if (url) ShareModule.show(url);
        });
    });
}

function handleSearch(query) {
    const filteredTricks = filterTricks(query);
    const htmlParts = [];

    if (filteredTricks.length > 0) {
        htmlParts.push(renderTrickCards(filteredTricks));
    }

    const resultsHtml = htmlParts.join('');
    $searchResults.html(resultsHtml || `<p>No results found for "${query}"</p>`);

    if (filteredTricks.length > 0) {
        bindShareButtons(); // bind click events on .trick-icon
    }
}


function listTricksAsDirectory(filteredTricks = null) {
    const tricks = filteredTricks || tricksJson.tricks;

    let html = '<div id="directory"><ul>';
    tricks.sort((a, b) => a.title.localeCompare(b.title)).forEach(trick => {
        html += `<li class="directory-item">${trick.title}</li>`;
    });
    html += '</ul></div>';

    $('#search-results').html(html);

    $('.directory-item').click(function () {
        const trickTitle = $(this).text().toLowerCase();
        const trick = tricksJson.tricks.find(t => t.title.toLowerCase() === trickTitle);
        if (trick) {
            const $modal = $('#trick-modal');
            if ($modal.length === 0) {
                $('body').append(`
                    <div id="trick-modal" class="modal">
                        <div class="modal-content">
                            <span class="close">&times;</span>
                            <div id="modal-body"></div>
                        </div>
                    </div>
                `);
            }
            $('#modal-body').html(renderTrickCards([trick]));
            $('#trick-modal').show();
            $('body').css('overflow', 'hidden');
            $('#trick-modal .close').click(function () {
                $('#trick-modal').hide();
                $('body').css('overflow', 'auto');
            });
            $('#trick-modal').on('click', function (e) {
                if (e.target === this) {
                    $(this).hide();
                    $('body').css('overflow', 'auto');
                }
            });
            bindShareButtons();
        }
    });
}

function filterDirectory(query) {
    if (!query.trim()) {
        listTricksAsDirectory();
        return;
    }
    const fuseResults = trickFuse.search(query);
    const filteredTricks = fuseResults.map(result => result.item);
    listTricksAsDirectory(filteredTricks);
}