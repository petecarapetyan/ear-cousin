import { html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
// import { property, html, customElement, css } from 'lit-element'
import { Connected, State } from './connected'
import { sharedStyles } from './shared-styles'
import { cssVars } from './css-vars'
import { dispatch } from "../state";
import { UserEvent, EventSelectors } from "../state/models/event";

declare global {
  interface HTMLElementTagNameMap {
    'view-event-u': EventU
  }
}

@customElement('view-event-u')
export class EventU extends Connected {
  @property({ type: Object })
  userEventFocus: UserEvent

  mapState(state: State) {
    return {
      userEventFocus:  EventSelectors.userEventFocus(state),
    }
  }
  // What is this? Allows the form submit to fire submit(form) method
  firstUpdated() {
    if (!!this.shadowRoot) {
      const form = this.shadowRoot.getElementById("eventForm");
      if (!!form) {
        form.onsubmit = (e: Event) => {
          e.preventDefault();
          this.submit(form);
        };
      }
    }
  }

  submit(form) {
    let data = {};
    data["id"] = this.userEventFocus.id;
    data["datetime"] = form["datetime"].value;
    data["type"] = form["type"].value;
    data["data"] = form["data"].value;
    data["ackby"] = form["ackby"].value;
    data["ackdatetime"] = form["ackdatetime"].value;
    dispatch.event.updateDcmnt(data as UserEvent)
  }

  render() {
    return html`
      <div if-u>
        <h3>Update Event Document with ID of <em>'${this.userEventFocus.id}'</em> </h3>
        <form id="eventForm">
          <fieldset>
            <label for="datetime">Datetime:</label><br/>
            <input type="text" id="datetime" name="datetime" value="${this.userEventFocus.datetime?this.userEventFocus.datetime:"" }" /><br />
                        <label for="type">Type:</label><br/>
            <input type="text" id="type" name="type" value="${this.userEventFocus.type?this.userEventFocus.type:"" }" /><br />
                        <label for="data">Data:</label><br/>
            <input type="text" id="data" name="data" value="${this.userEventFocus.data?this.userEventFocus.data:"" }" /><br />
                        <label for="ackby">Ackby:</label><br/>
            <input type="text" id="ackby" name="ackby" value="${this.userEventFocus.ackby?this.userEventFocus.ackby:"" }" /><br />
                        <label for="ackdatetime">Ackdatetime:</label><br/>
            <input type="text" id="ackdatetime" name="ackdatetime" value="${this.userEventFocus.ackdatetime?this.userEventFocus.ackdatetime:"" }" /><br />
            <br />
            <input type="submit" value="Submit" />
          </fieldset>
        </form>
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
        }
        input {
          margin-bottom: 1em;
        }
      `,
    ]
  }
}
