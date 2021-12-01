import { html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
// import { property, html, customElement, css } from 'lit-element'
import { Connected, State } from './connected'
import { sharedStyles } from './shared-styles'
import { cssVars } from './css-vars'
import { dispatch } from "../state";
import { Syllabuslu, SyllabusluSelectors } from "../state/models/syllabuslu";

declare global {
  interface HTMLElementTagNameMap {
    'view-syllabuslu-u': SyllabusluU
  }
}

@customElement('view-syllabuslu-u')
export class SyllabusluU extends Connected {
  @property({ type: Object })
  syllabusluFocus: Syllabuslu

  mapState(state: State) {
    return {
      syllabusluFocus:  SyllabusluSelectors.syllabusluFocus(state),
    }
  }
  // What is this? Allows the form submit to fire submit(form) method
  firstUpdated() {
    if (!!this.shadowRoot) {
      const form = this.shadowRoot.getElementById("syllabusluForm");
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
    data["id"] = this.syllabusluFocus.id;
    data["foo"] = form["foo"].value;
    data["bar"] = form["bar"].value;
    data["meh"] = form["meh"].value;
    dispatch.syllabuslu.updateDcmnt(data as Syllabuslu)
  }

  render() {
    return html`
      <div if-u>
        <h3>Update Syllabuslu Document with ID of <em>'${this.syllabusluFocus.id}'</em> </h3>
        <form id="syllabusluForm">
          <fieldset>
            <label for="foo">Foo:</label><br/>
            <input type="text" id="foo" name="foo" value="${this.syllabusluFocus.foo?this.syllabusluFocus.foo:"" }" /><br />
                        <label for="bar">Bar:</label><br/>
            <input type="text" id="bar" name="bar" value="${this.syllabusluFocus.bar?this.syllabusluFocus.bar:"" }" /><br />
                        <label for="meh">Meh:</label><br/>
            <input type="text" id="meh" name="meh" value="${this.syllabusluFocus.meh?this.syllabusluFocus.meh:"" }" /><br />
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
