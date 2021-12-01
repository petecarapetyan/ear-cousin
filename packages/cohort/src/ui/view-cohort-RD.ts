import { html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
//import { property, html, customElement, css } from 'lit-element'
import { Connected, State } from './connected'
import { sharedStyles } from './shared-styles'
import { cssVars } from './css-vars'
import { dispatch } from "../state";
import { CohortSelectors } from "../state/models/cohort";

declare global {
  interface HTMLElementTagNameMap {
    'view-cohort-rd': CohortRD
  }
}

@customElement('view-cohort-rd')
export class CohortRD extends Connected {
  @property({ type: Object,
    hasChanged(_newVal, _oldVal) {
      return true; // thus always render. No, I don't understand why, just the only way to get it to work.
    }
  })
  cohorts

  mapState(state: State) {
    return {
      cohorts: CohortSelectors.cohorts(state),
    }
  }

  delete(key: string) {
    dispatch.cohort.delete(key)
  }

  addView() {
    dispatch.cohort.crudMode('c')
  }

  loadUpdateView(_e: Event) {
    dispatch.cohort.crudMode('u')
    dispatch.cohort.loadUpdateView(_e?.target?.["id"])
  }

  render() {
    return html`
      <div if-r>
        <h3>Cohorts</h3>
        <a><button type="button" @click=${() => (this.addView())}>Add Cohort Document</button></a>
        <div class="table">
            ${Object.keys(this.cohorts).map(key => {
              const dcmnt = this.cohorts[key];
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
