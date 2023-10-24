import { AffineSchemas } from "@blocksuite/blocks";
import { EditorContainer } from "@blocksuite/editor";
import { Workspace, Page, Schema } from "@blocksuite/store";
import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('custom-editor')
export class CustomAffineEditor extends LitElement {
   
    @property() doc: any;
    readonly workspace: Workspace;
    readonly page: Page | null;

    constructor() {
        super();

        const schema = new Schema();
        schema.register(AffineSchemas);

        this.workspace = new Workspace({ id: 'foo', schema });
        this.page = this.workspace.createPage({id: 'test-id'});
        this.page?.waitForLoaded().then(() => {
            const pageBlockId = this.page?.addBlock('affine:page');
            const noteId = this.page?.addBlock('affine:note', {}, pageBlockId);
            this.page?.addBlock('affine:paragraph', {text: new Text("hello world")}, noteId);
        });
    }

    override connectedCallback() {
        const editor = new EditorContainer();
        editor.page = this.page!;
        this.appendChild(editor);
    }

    override disconnectedCallback() {
        this.removeChild(this.children[0]);
    }

}