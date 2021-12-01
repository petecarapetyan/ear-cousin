import { html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
//import { property, html, customElement, css } from 'lit-element'
import { Connected, State } from './connected'
import { sharedStyles } from './shared-styles'
import { cssVars } from './css-vars'
import { dispatch } from "../state";
import { PersonSelectors } from "../state/models/person";

declare global {
  interface HTMLElementTagNameMap {
    'view-person-rd': PersonRD
  }
}

@customElement('view-person-rd')
export class PersonRD extends Connected {
  @property({ type: Object,
    hasChanged(_newVal, _oldVal) {
      return true; // thus always render. No, I don't understand why, just the only way to get it to work.
    }
  })
  persons

  mapState(state: State) {
    return {
      persons: PersonSelectors.persons(state),
    }
  }

  delete(key: string) {
    dispatch.person.delete(key)
  }

  addView() {
    dispatch.person.crudMode('c')
  }

  loadUpdateView(_e: Event) {
    dispatch.person.crudMode('u')
    dispatch.person.loadUpdateView(_e?.target?.["id"])
  }

  render() {
    return html`
      <div if-r>
        <h3>Persons</h3>
        <a><button type="button" @click=${() => (this.addView())}>Add Person Document</button></a>
        <div class="table">
            ${Object.keys(this.persons).map(key => {
              const dcmnt = this.persons[key];
              return html`
                <div class="row">
                  <div class="cell">
                    <button id=${dcmnt["id"]} @click=${() => (this.delete(dcmnt["id"]))}>delete</button>
                    <button id=${dcmnt["id"]} @click=${this.loadUpdateView}>update</button>
                  </div>
                  <div class="cell">${dcmnt["fname"]}</div>
                  <div class="cell">${dcmnt["lname"]}</div>
                  <div class="cell">${dcmnt["email"]}</div>
                  <div class="cell">${dcmnt["datecreated"]}</div>
                  <div class="cell">${dcmnt["currentstatus"]}</div>
                  <div class="cell">${dcmnt["cohortlu"]}</div>
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
          grid-template-columns: auto  1fr 1fr 1fr 1fr 1fr 1fr;
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
