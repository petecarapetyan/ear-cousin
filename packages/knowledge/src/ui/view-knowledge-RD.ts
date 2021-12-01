import { html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
//import { property, html, customElement, css } from 'lit-element'
import { Connected, State } from './connected'
import { sharedStyles } from './shared-styles'
import { cssVars } from './css-vars'
import { dispatch } from "../state";
import { KnowledgeSelectors } from "../state/models/knowledge";

declare global {
  interface HTMLElementTagNameMap {
    'view-knowledge-rd': KnowledgeRD
  }
}

@customElement('view-knowledge-rd')
export class KnowledgeRD extends Connected {
  @property({ type: Object,
    hasChanged(_newVal, _oldVal) {
      return true; // thus always render. No, I don't understand why, just the only way to get it to work.
    }
  })
  knowledges

  mapState(state: State) {
    return {
      knowledges: KnowledgeSelectors.knowledges(state),
    }
  }

  delete(key: string) {
    dispatch.knowledge.delete(key)
  }

  addView() {
    dispatch.knowledge.crudMode('c')
  }

  loadUpdateView(_e: Event) {
    dispatch.knowledge.crudMode('u')
    dispatch.knowledge.loadUpdateView(_e?.target?.["id"])
  }

  render() {
    return html`
      <div if-r>
        <h3>Knowledges</h3>
        <a><button type="button" @click=${() => (this.addView())}>Add Knowledge Document</button></a>
        <div class="table">
            ${Object.keys(this.knowledges).map(key => {
              const dcmnt = this.knowledges[key];
              return html`
                <div class="row">
                  <div class="cell">
                    <button id=${dcmnt["id"]} @click=${() => (this.delete(dcmnt["id"]))}>delete</button>
                    <button id=${dcmnt["id"]} @click=${this.loadUpdateView}>update</button>
                  </div>
                  <div class="cell">${dcmnt["foo"]}</div>
                  <div class="cell">${dcmnt["bar"]}</div>
                  <div class="cell">${dcmnt["yada"]}</div>
                </div>
              `;
            })}
        </div>
      </div>

    `;
  }

  static get styles() {
    return [
      cssVars,
      sharedStyles,
      css`
        button {
          padding: 1em;
          margin-bottom: 2em;
        }
        .table .row {
          display: grid;
          grid-gap: 10px;
          padding: 0;
          list-style: none;
          grid-template-columns: auto  1fr 1fr 1fr;
        }
        .cell {
          background: #f9f7f5;
          display: block;
          text-decoration: none;
          padding: 10px;
          text-align: center;
          font-size: 10px;
        }
      `,
    ]
  }
}
