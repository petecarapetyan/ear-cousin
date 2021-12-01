import { html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
// import { property, html, customElement, css } from 'lit-element'
import { Connected, State } from './connected'
import { sharedStyles } from './shared-styles'
import { cssVars } from './css-vars'
import { dispatch } from "../state";
import { Person, PersonSelectors } from "../state/models/person";

declare global {
  interface HTMLElementTagNameMap {
    'view-person-u': PersonU
  }
}

@customElement('view-person-u')
export class PersonU extends Connected {
  @property({ type: Object })
  personFocus: Person

  mapState(state: State) {
    return {
      personFocus:  PersonSelectors.personFocus(state),
    }
  }
  // What is this? Allows the form submit to fire submit(form) method
  firstUpdated() {
    if (!!this.shadowRoot) {
      const form = this.shadowRoot.getElementById("personForm");
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
    data["id"] = this.personFocus.id;
    data["fname"] = form["fname"].value;
    data["lname"] = form["lname"].value;
    data["email"] = form["email"].value;
    data["datecreated"] = form["datecreated"].value;
    data["currentstatus"] = form["currentstatus"].value;
    data["cohortlu"] = form["cohortlu"].value;
    dispatch.person.updateDcmnt(data as Person)
  }

  render() {
    return html`
      <div if-u>
        <h3>Update Person Document with ID of <em>'${this.personFocus.id}'</em> </h3>
        <form id="personForm">
          <fieldset>
            <label for="fname">Fname:</label><br/>
            <input type="text" id="fname" name="fname" value="${this.personFocus.fname?this.personFocus.fname:"" }" /><br />
                        <label for="lname">Lname:</label><br/>
            <input type="text" id="lname" name="lname" value="${this.personFocus.lname?this.personFocus.lname:"" }" /><br />
                        <label for="email">Email:</label><br/>
            <input type="text" id="email" name="email" value="${this.personFocus.email?this.personFocus.email:"" }" /><br />
                        <label for="datecreated">Datecreated:</label><br/>
            <input type="text" id="datecreated" name="datecreated" value="${this.personFocus.datecreated?this.personFocus.datecreated:"" }" /><br />
                        <label for="currentstatus">Currentstatus:</label><br/>
            <input type="text" id="currentstatus" name="currentstatus" value="${this.personFocus.currentstatus?this.personFocus.currentstatus:"" }" /><br />
                        <label for="cohortlu">Cohortlu:</label><br/>
            <input type="text" id="cohortlu" name="cohortlu" value="${this.personFocus.cohortlu?this.personFocus.cohortlu:"" }" /><br />
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
