import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
//import { html, customElement, css } from 'lit-element'
import { Connected } from './connected'
import { sharedStyles } from './shared-styles'
import { cssVars } from './css-vars'
import { dispatch } from "../state";
import { Cohort } from "../state/models/cohort";

declare global {
  interface HTMLElementTagNameMap {
    'view-cohort-c': CohortC
  }
}

@customElement('view-cohort-c')
export class CohortC extends Connected {

  // Why this? Allows the form submit to fire submit(form) method
  firstUpdated() {
    const form = this.shadowRoot?.getElementById("cohortForm");
    if (!!form) {
      form.onsubmit = (e: Event) => {
        e.preventDefault();
        this.submit(form);
      };
    }
  }

  submit(form) {
    let data = {};
    data["foo"] = form["foo"].value;
    data["bar"] = form["bar"].value;
    data["yada"] = form["yada"].value;
    dispatch.cohort.create(data as Cohort)
  }

  render() {
    return html`
      <div if-c>
        <h3>Add Cohort Document to the Collection:</h3>
        <form id="cohortForm">
          <fieldset>
            <label for="foo">Foo:</label><br/>
            <input type="text" id="foo" name="foo" value="Foo  ${Date.now()}" /><br />
                        <label for="bar">Bar:</label><br/>
            <input type="text" id="bar" name="bar" value="Bar  ${Date.now()}" /><br />
                        <label for="yada">Yada:</label><br/>
            <input type="text" id="yada" name="yada" value="Yada  ${Date.now()}" /><br />
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
