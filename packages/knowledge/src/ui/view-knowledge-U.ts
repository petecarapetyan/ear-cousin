import { html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
// import { property, html, customElement, css } from 'lit-element'
import { Connected, State } from './connected'
import { sharedStyles } from './shared-styles'
import { cssVars } from './css-vars'
import { dispatch } from "../state";
import { Knowledge, KnowledgeSelectors } from "../state/models/knowledge";

declare global {
  interface HTMLElementTagNameMap {
    'view-knowledge-u': KnowledgeU
  }
}

@customElement('view-knowledge-u')
export class KnowledgeU extends Connected {
  @property({ type: Object })
  knowledgeFocus: Knowledge

  mapState(state: State) {
    return {
      knowledgeFocus:  KnowledgeSelectors.knowledgeFocus(state),
    }
  }
  // What is this? Allows the form submit to fire submit(form) method
  firstUpdated() {
    if (!!this.shadowRoot) {
      const form = this.shadowRoot.getElementById("knowledgeForm");
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
    data["id"] = this.knowledgeFocus.id;
    data["foo"] = form["foo"].value;
    data["bar"] = form["bar"].value;
    data["yada"] = form["yada"].value;
    dispatch.knowledge.updateDcmnt(data as Knowledge)
  }

  render() {
    return html`
      <div if-u>
        <h3>Update Knowledge Document with ID of <em>'${this.knowledgeFocus.id}'</em> </h3>
        <form id="knowledgeForm">
          <fieldset>
            <label for="foo">Foo:</label><br/>
            <input type="text" id="foo" name="foo" value="${this.knowledgeFocus.foo?this.knowledgeFocus.foo:"" }" /><br />
                        <label for="bar">Bar:</label><br/>
            <input type="text" id="bar" name="bar" value="${this.knowledgeFocus.bar?this.knowledgeFocus.bar:"" }" /><br />
                        <label for="yada">Yada:</label><br/>
            <input type="text" id="yada" name="yada" value="${this.knowledgeFocus.yada?this.knowledgeFocus.yada:"" }" /><br />
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
