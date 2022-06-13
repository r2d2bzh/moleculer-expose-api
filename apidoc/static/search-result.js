// eslint-disable-next-line import/no-unresolved
import { LitElement, css, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

// Not using roro to keep arguments consistency with indexOf method
// eslint-disable-next-line max-params
const allIndexesOf = (string, searchElement, fromIndex = 0, indexes = []) => {
  if (fromIndex < string.length) {
    const index = string.indexOf(searchElement, fromIndex);
    if (index < 0) return indexes;
    indexes.push(index);
    return allIndexesOf(string, searchElement, index + 1, indexes);
  }
  return indexes;
};

const highlightIntervals = (string, searchElement) => {
  const indexes = allIndexesOf(string, searchElement);
  const highlights = indexes.map((index) => [index, index + searchElement.length]);
  const mergedHighlights = [];
  let latestHighlight = [-1, -1];
  for (const interval of highlights) {
    if (latestHighlight[1] < interval[0]) {
      mergedHighlights.push(interval);
      latestHighlight = interval;
    } else {
      latestHighlight[1] = interval[1];
    }
  }
  return mergedHighlights;
};

const excerpt = (string, borderSize, shortcut = '...') =>
  string.length > borderSize * 2
    ? string.slice(0, borderSize) + shortcut + string.slice(string.length - borderSize)
    : string;

const highlightExcerpts = (string, searchElement) => {
  const intervals = highlightIntervals(string.toLowerCase(), searchElement.toLowerCase());
  const slices = [];
  let lastIndex = 0;
  for (const interval of intervals) {
    slices.push(string.slice(lastIndex, interval[0]), string.slice(interval[0], interval[1]));
    lastIndex = interval[1];
  }
  slices.push(string.slice(lastIndex));
  return slices.map((slice, index) => (index % 2 ? excerpt(slice, searchElement.length) : excerpt(slice, 15)));
};

export class SearchResult extends LitElement {
  static properties = {
    result: {
      type: Array,
    },
  };

  constructor() {
    super();
  }

  static styles = css``;

  render() {
    const matches = [];
    for (const term of this.result.terms) {
      /* data does not come from a user input */
      /* eslint-disable security/detect-object-injection */
      for (const match of this.result.match[term]) {
        matches.push(highlightExcerpts(this.result[match], term));
      }
      /* eslint-enable security/detect-object-injection */
    }
    return html`
      ${matches.map(
        (match) =>
          html`<p>${match.map((excerpt, index) => (index % 2 ? html`<mark>${excerpt}</mark>` : html`${excerpt}`))}</p>`
      )}
    `;
  }
}

// eslint-disable-next-line no-undef
customElements.define('search-result', SearchResult);
