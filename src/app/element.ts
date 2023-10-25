import { AffineSchemas } from "@blocksuite/blocks";
import { EditorContainer } from "@blocksuite/editor";
import { Workspace, Page, Schema } from "@blocksuite/store";
import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as Y from 'yjs';

const schema = new Schema();
schema.register(AffineSchemas);

@customElement('custom-editor')
export class CustomAffineEditor extends LitElement {
   
    @property() page!: Page;
    private editor: EditorContainer;
    private workspace!: Workspace;
    private wPage!: Page;

    constructor() {
        super();
        this.editor = new EditorContainer();
        this.workspace = new Workspace({ id: 'foo', schema });
        this.wPage = this.workspace.createPage({id: "2332"});
    }
    
    // override updated(changedProperties: Map<string | number | symbol, unknown>): void {
    //     super.updated(changedProperties);        
    //     if (changedProperties.has('page') && this.page) {
    //         console.log(this.page);
    //         this.editor.page = this.page;

    //         // Check if the editor is connected, if not, append it
    //         if (!this.editor.isConnected) {
    //             this.page.waitForLoaded().then(() => {
    //                 console.log("attaching editor in updated")
    //                 this.appendChild(this.editor);
    //             })
    //         }
    //     }
    // }
    
    override connectedCallback() {
        // super.connectedCallback();
        console.log("connected Callback", this.wPage);
        const editor = new EditorContainer();
        editor.page = this.wPage

        this.appendChild(editor);
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        if (this.editor.isConnected) {
            this.removeChild(this.editor);
        }
    }
}
