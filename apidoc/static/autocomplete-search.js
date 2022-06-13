/* eslint-disable no-console */

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

export class AutocompleteSearch extends LitElement {
  static properties = {
    input: {
      type: String,
    },
    suggestions: {
      type: Array,
    },
    results: {
      type: Array,
    },
    documentationSrc: {
      type: String,
    },
  };

  constructor() {
    super();
    this.input = '';
    this.suggestions = [];
    this.results = [];
    this.documentationSrc = '';
  }

  static styles = css`
    :host {
      display: flex;
      width: 100%;
      gap: 10px;
    }

    :host div {
      display: block;
      flex-grow: 0;
      flex-basis: 350px;
    }

    #suggestions {
      position: absolute;
      left: 10px;
      border: 1px dotted #ccc;
      padding: 3px;
      background: white;
    }

    #suggestions[hidden] {
      display: none;
    }

    #suggestions ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }

    #suggestions ul li {
      padding: 5px 0;
    }

    #suggestions ul li:hover {
      background: #eee;
    }

    #results ul {
      list-style-type: none;
    }

    #results ul li:hover {
      background: #eee;
    }

    iframe {
      flex-grow: 1;
      border: 0;
    }
  `;

  async updateInput(event) {
    this.input = event.target.value;
    try {
      const response = await fetch(`suggest?input=${this.input}`);
      const suggestions = await response.json();
      this.suggestions = suggestions.map(({ suggestion }) => suggestion);
    } catch (error) {
      console.error(error);
      this.suggestions = [];
    }
  }

  selectSuggestion(event) {
    this.input = event.target.textContent;
    this.suggestions = [];
  }

  async search() {
    try {
      this.suggestions = [];
      const response = await fetch(`search?input=${this.input}`);
      this.results = await response.json();
    } catch (error) {
      console.error(error);
      this.results = [];
    }
  }

  selectResult(location) {
    this.documentationSrc = `html/${location}`;
  }

  renderResult(result) {
    const matches = [];
    for (const term of result.terms) {
      /* data does not come from a user input */
      /* eslint-disable security/detect-object-injection */
      for (const match of result.match[term]) {
        matches.push(highlightExcerpts(result[match], term));
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

  render() {
    return html`
      <div>
        <input @input=${this.updateInput} .value=${this.input}></input>
        <button @click=${this.search}>Search</button>
        <div id="suggestions" ?hidden=${this.suggestions.length === 0}>
          <ul>
            ${this.suggestions.map((suggestion) => html`<li @click=${this.selectSuggestion}>${suggestion}</li>`)}
          </ul>
        </div>
        <div id="results">
          <ul>
            ${this.results.map(
              (result) => html`<li @click=${() => this.selectResult(result.location)}>${this.renderResult(result)}</li>`
            )}
          </ul>
        </div>
      </div>
      <iframe src=${this.documentationSrc}>
      </iframe>
    `;
  }
}

// eslint-disable-next-line no-undef
customElements.define('autocomplete-search', AutocompleteSearch);
