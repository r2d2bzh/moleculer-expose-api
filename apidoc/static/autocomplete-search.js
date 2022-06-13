/* eslint-disable no-console */

// eslint-disable-next-line import/no-unresolved
import { LitElement, css, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
// eslint-disable-next-line no-unused-vars
import { SearchResult } from './search-result.js';

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
              (result) =>
                html`
                  <li @click=${() => this.selectResult(result.location)}>
                    <search-result result=${JSON.stringify(result)}></search-result>
                  </li>
                `
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
