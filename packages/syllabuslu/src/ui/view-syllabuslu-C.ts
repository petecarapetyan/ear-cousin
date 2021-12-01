import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
//import { html, customElement, css } from 'lit-element'
import { Connected } from './connected'
import { sharedStyles } from './shared-styles'
import { cssVars } from './css-vars'
import { dispatch } from "../state";
import { Syllabuslu } from "../state/models/syllabuslu";

declare global {
  interface HTMLElementTagNameMap {
    'view-syllabuslu-c': SyllabusluC
  }
}

@customElement('view-syllabuslu-c')
export class SyllabusluC extends Connected {

  // Why this? Allows the form submit to fire submit(form) method
  firstUpdated() {
    const form = this.shadowRoot?.getElementById("syllabusluForm");
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
    data["meh"] = form["meh"].value;
    dispatch.syllabuslu.create(data as Syllabuslu)
  }

  render() {
    return html`
      <div if-c>
        <h3>Add Syllabuslu Document to the Collection:</h3>
        <form id="syllabusluForm">
          <fieldset>
            <label for="foo">Foo:</label><br/>
            <input type="text" id="foo" name="foo" value="Foo  ${Date.now()}" /><br />
                        <label for="bar">Bar:</label><br/>
            <input type="text" id="bar" name="bar" value="Bar  ${Date.now()}" /><br />
                        <label for="meh">Meh:</label><br/>
            <input type="text" id="meh" name="meh" value="Meh  ${Date.now()}" /><br />
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
