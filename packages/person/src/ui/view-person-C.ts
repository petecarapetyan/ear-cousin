import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
//import { html, customElement, css } from 'lit-element'
import { Connected } from './connected'
import { sharedStyles } from './shared-styles'
import { cssVars } from './css-vars'
import { dispatch } from "../state";
import { Person } from "../state/models/person";

declare global {
  interface HTMLElementTagNameMap {
    'view-person-c': PersonC
  }
}

@customElement('view-person-c')
export class PersonC extends Connected {

  // Why this? Allows the form submit to fire submit(form) method
  firstUpdated() {
    const form = this.shadowRoot?.getElementById("personForm");
    if (!!form) {
      form.onsubmit = (e: Event) => {
        e.preventDefault();
        this.submit(form);
      };
    }
  }

  submit(form) {
    let data = {};
    data["fname"] = form["fname"].value;
    data["lname"] = form["lname"].value;
    data["email"] = form["email"].value;
    data["datecreated"] = form["datecreated"].value;
    data["currentstatus"] = form["currentstatus"].value;
    data["cohortlu"] = form["cohortlu"].value;
    dispatch.person.create(data as Person)
  }

  render() {
    return html`
      <div if-c>
        <h3>Add Person Document to the Collection:</h3>
        <form id="personForm">
          <fieldset>
            <label for="fname">Fname:</label><br/>
            <input type="text" id="fname" name="fname" value="Fname  ${Date.now()}" /><br />
                        <label for="lname">Lname:</label><br/>
            <input type="text" id="lname" name="lname" value="Lname  ${Date.now()}" /><br />
                        <label for="email">Email:</label><br/>
            <input type="text" id="email" name="email" value="Email  ${Date.now()}" /><br />
                        <label for="datecreated">Datecreated:</label><br/>
            <input type="text" id="datecreated" name="datecreated" value="Datecreated  ${Date.now()}" /><br />
                        <label for="currentstatus">Currentstatus:</label><br/>
            <input type="text" id="currentstatus" name="currentstatus" value="Currentstatus  ${Date.now()}" /><br />
                        <label for="cohortlu">Cohortlu:</label><br/>
            <input type="text" id="cohortlu" name="cohortlu" value="Cohortlu  ${Date.now()}" /><br />
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
