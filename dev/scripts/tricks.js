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

function escapeHtml(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

$(document).ready(function () {
    listTricksAsDirectory();
    openTrickFromUrl();
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
    } else if (!isTwitch && embedUrl.includes("youtu.be/")) {
        // Convert youtu.be short links to embed format
        const shortMatch = embedUrl.match(/youtu\.be\/([\w-]+)/);
        if (shortMatch) {
            finalUrl = `https://youtube.com/embed/${shortMatch[1]}`;
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
        const descHtml = escapeHtml(trick.description).replace(/\n/g, '<br>');

        return `
        <div class="trick-card-container ${separator}">
            <article class="trick-card">
                <h2 class="trick-header">
                    ${escapeHtml(trick.title)}
                    <img class="trick-icon" src="../img/copy-link.svg" data-url="${escapeHtml(shareUrl)}" title="Copy Share Link" />
                </h2>
                <div class="description"><strong>How to do it:</strong> ${descHtml}</div>
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
    $searchResults.html(resultsHtml || `<p>No results found for "${escapeHtml(query)}"</p>`);

    if (filteredTricks.length > 0) {
        bindShareButtons(); // bind click events on .trick-icon
    }
}


function listTricksAsDirectory(filteredTricks = null) {
    const tricks = filteredTricks || tricksJson.tricks;

    let html = '<div id="directory"><ul>';
    tricks.forEach(trick => {
        html += `<li class="directory-item">${escapeHtml(trick.title)}</li>`;
    });
    html += '</ul></div>';

    $('#search-results').html(html);

    $('.directory-item').click(function () {
        const trickTitle = $(this).text().toLowerCase();
        const trick = tricksJson.tricks.find(t => t.title.toLowerCase() === trickTitle);
        if (trick) openTrickModal(trick);
    });
}

function openTrickModal(trick) {
    let $modal = $('#trick-modal');
    if ($modal.length === 0) {
        $('body').append(`
            <div id="trick-modal" class="modal">
                <div class="modal-content">
                    <button type="button" class="modal-share-btn" aria-label="Share this trick">
                        <img class="modal-share-icon" src="../img/copy-link.svg" alt="" />
                        <span>Share</span>
                    </button>
                    <span class="close">&times;</span>
                    <div id="modal-body"></div>
                </div>
            </div>
        `);
        $modal = $('#trick-modal');
    }
    $('#modal-body').html(renderTrickCards([trick]));
    $modal.show();
    $('body').css('overflow', 'hidden');
    $('#trick-modal .close').off('click.trickmodal').on('click.trickmodal', closeTrickModal);
    $modal.off('click.trickmodal').on('click.trickmodal', function (e) {
        if (e.target === this) closeTrickModal();
    });

    const shareUrl = `${baseShareUrl}${encodeURIComponent(trick.title)}`;
    $('#trick-modal .modal-share-btn').off('click.trickmodal').on('click.trickmodal', function (e) {
        e.stopPropagation();
        ShareModule.show(shareUrl);
    });

    bindShareButtons();
}

function closeTrickModal() {
    $('#trick-modal').hide();
    $('body').css('overflow', 'auto');
}

// Reads ?trick=<title> from URL and opens that trick's modal on landing.
// XSS-safe: the param is only used for a case-insensitive lookup against
// tricksJson — never written to the DOM. Matched trick is rendered through
// renderTrickCards, which now html-escapes every field.
function openTrickFromUrl() {
    const trickParam = new URLSearchParams(window.location.search).get('trick');
    if (!trickParam) return;
    const needle = trickParam.toLowerCase();
    const trick = tricksJson.tricks.find(t => t.title.toLowerCase() === needle);
    if (trick) openTrickModal(trick);
}

function filterDirectory(query) {
    if (!query.trim()) {
        listTricksAsDirectory();
        return;
    }
    const fuseResults = trickFuse.search(query);
    const filteredTricks = fuseResults
        .sort((a, b) => a.score - b.score)
        .map(result => result.item);
    listTricksAsDirectory(filteredTricks);
}