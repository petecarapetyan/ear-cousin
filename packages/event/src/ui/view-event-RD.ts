import { html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
//import { property, html, customElement, css } from 'lit-element'
import { Connected, State } from './connected'
import { sharedStyles } from './shared-styles'
import { cssVars } from './css-vars'
import { dispatch } from "../state";
import { EventSelectors } from "../state/models/event";

declare global {
  interface HTMLElementTagNameMap {
    'view-event-rd': EventRD
  }
}

@customElement('view-event-rd')
export class EventRD extends Connected {
  @property({ type: Object,
    hasChanged(_newVal, _oldVal) {
      return true; // thus always render. No, I don't understand why, just the only way to get it to work.
    }
  })
  userEvents

  mapState(state: State) {
    return {
      userEvents: EventSelectors.userEvents(state),
    }
  }

  delete(key: string) {
    dispatch.event.delete(key)
  }

  addView() {
    dispatch.event.crudMode('c')
  }

  loadUpdateView(_e: Event) {
    dispatch.event.crudMode('u')
    dispatch.event.loadUpdateView(_e?.target?.["id"])
  }

  render() {
    return html`
      <div if-r>
        <h3>Events</h3>
        <a><button type="button" @click=${() => (this.addView())}>Add Event Document</button></a>
        <div class="table">
            ${Object.keys(this.userEvents).map(key => {
              const dcmnt = this.userEvents[key];
              return html`
                <div class="row">
                  <div class="cell">
                    <button id=${dcmnt["id"]} @click=${() => (this.delete(dcmnt["id"]))}>delete</button>
                    <button id=${dcmnt["id"]} @click=${this.loadUpdateView}>update</button>
                  </div>
                  <div class="cell">${dcmnt["datetime"]}</div>
                  <div class="cell">${dcmnt["type"]}</div>
                  <div class="cell">${dcmnt["data"]}</div>
                  <div class="cell">${dcmnt["ackby"]}</div>
                  <div class="cell">${dcmnt["ackdatetime"]}</div>
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
          grid-template-columns: auto  1fr 1fr 1fr 1fr 1fr;
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
