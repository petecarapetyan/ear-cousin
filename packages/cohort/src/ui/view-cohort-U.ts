import { html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
// import { property, html, customElement, css } from 'lit-element'
import { Connected, State } from './connected'
import { sharedStyles } from './shared-styles'
import { cssVars } from './css-vars'
import { dispatch } from "../state";
import { Cohort, CohortSelectors } from "../state/models/cohort";

declare global {
  interface HTMLElementTagNameMap {
    'view-cohort-u': CohortU
  }
}

@customElement('view-cohort-u')
export class CohortU extends Connected {
  @property({ type: Object })
  cohortFocus: Cohort

  mapState(state: State) {
    return {
      cohortFocus:  CohortSelectors.cohortFocus(state),
    }
  }
  // What is this? Allows the form submit to fire submit(form) method
  firstUpdated() {
    if (!!this.shadowRoot) {
      const form = this.shadowRoot.getElementById("cohortForm");
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
    data["id"] = this.cohortFocus.id;
    data["foo"] = form["foo"].value;
    data["bar"] = form["bar"].value;
    data["yada"] = form["yada"].value;
    dispatch.cohort.updateDcmnt(data as Cohort)
  }

  render() {
    return html`
      <div if-u>
        <h3>Update Cohort Document with ID of <em>'${this.cohortFocus.id}'</em> </h3>
        <form id="cohortForm">
          <fieldset>
            <label for="foo">Foo:</label><br/>
            <input type="text" id="foo" name="foo" value="${this.cohortFocus.foo?this.cohortFocus.foo:"" }" /><br />
                        <label for="bar">Bar:</label><br/>
            <input type="text" id="bar" name="bar" value="${this.cohortFocus.bar?this.cohortFocus.bar:"" }" /><br />
                        <label for="yada">Yada:</label><br/>
            <input type="text" id="yada" name="yada" value="${this.cohortFocus.yada?this.cohortFocus.yada:"" }" /><br />
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
