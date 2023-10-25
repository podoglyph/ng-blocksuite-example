import { AffineSchemas } from "@blocksuite/blocks";
import { EditorContainer } from "@blocksuite/editor";
import { Workspace, Page, Schema } from "@blocksuite/store";
import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as Y from 'yjs';

@customElement('custom-editor')
export class CustomAffineEditor extends LitElement {
   
    @property() page!: Page;
    private editor: EditorContainer;

    constructor() {
        super();
        this.editor = new EditorContainer();
    }
    
    override updated(changedProperties: Map<string | number | symbol, unknown>): void {
        super.updated(changedProperties);        
        if (changedProperties.has('page') && this.page) {
            console.log(this.page);
            this.editor.page = this.page;
        }
    }
    
    override connectedCallback() {
        super.connectedCallback();
        console.log("connected Callback", this.page);
        if (!this.editor.isConnected) {
            this.appendChild(this.editor);
        }
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        if (this.editor.isConnected) {
            this.removeChild(this.editor);
        }
    }
}
