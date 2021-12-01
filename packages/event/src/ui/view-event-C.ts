import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
//import { html, customElement, css } from 'lit-element'
import { Connected } from './connected'
import { sharedStyles } from './shared-styles'
import { cssVars } from './css-vars'
import { dispatch } from "../state";
import { UserEvent } from "../state/models/event";

declare global {
  interface HTMLElementTagNameMap {
    'view-event-c': UserEventC
  }
}

@customElement('view-event-c')
export class UserEventC extends Connected {

  // Why this? Allows the form submit to fire submit(form) method
  firstUpdated() {
    const form = this.shadowRoot?.getElementById("userEventForm");
    if (!!form) {
      form.onsubmit = (e: Event) => {
        e.preventDefault();
        this.submit(form);
      };
    }
  }

  submit(form) {
    let data = {};
    data["datetime"] = form["datetime"].value;
    data["type"] = form["type"].value;
    data["data"] = form["data"].value;
    data["ackby"] = form["ackby"].value;
    data["ackdatetime"] = form["ackdatetime"].value;
    dispatch.event.create(data as UserEvent)
  }

  render() {
    return html`
      <div if-c>
        <h3>Add UserEvent Document to the Collection:</h3>
        <form id="userEventForm">
          <fieldset>
            <label for="datetime">Datetime:</label><br/>
            <input type="text" id="datetime" name="datetime" value="Datetime  ${Date.now()}" /><br />
                        <label for="type">Type:</label><br/>
            <input type="text" id="type" name="type" value="Type  ${Date.now()}" /><br />
                        <label for="data">Data:</label><br/>
            <input type="text" id="data" name="data" value="Data  ${Date.now()}" /><br />
                        <label for="ackby">Ackby:</label><br/>
            <input type="text" id="ackby" name="ackby" value="Ackby  ${Date.now()}" /><br />
                        <label for="ackdatetime">Ackdatetime:</label><br/>
            <input type="text" id="ackdatetime" name="ackdatetime" value="Ackdatetime  ${Date.now()}" /><br />
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
