import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
// import '../../element'; // <-- import the web component
import { Page, Schema, Workspace } from '@blocksuite/store';
import { AffineSchemas } from '@blocksuite/blocks';
import { EditorContainer } from '@blocksuite/editor';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const schema = new Schema();
schema.register(AffineSchemas);

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {

  workspace: Workspace;
  page!: Page | null;
  editor!: EditorContainer;
  @ViewChild('container', { read: ElementRef, static: true })
  container!: ElementRef;
  ydoc!: Y.Doc;
  ytext!: Y.Array<any>;

  constructor(
    private renderer: Renderer2
  ) {
    this.ydoc = new Y.Doc();
    this.ytext = this.ydoc.getArray('v-text');
    this.workspace = new Workspace({ id: 'foo', schema });
    // const wsProvider = new WebsocketProvider('ws://localhost:1234', 'my-roomname', this.workspace.doc)
    // wsProvider.on('status', (event: { status: any; }) => {
    //   console.log(event.status) // logs "connected" or "disconnected"
    // })
  }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    let data = localStorage.getItem("test") || null;
    if (!data) {
      this.page = this.workspace.createPage({ id: 'test-id' });
      if (this.page) {
        this.page?.waitForLoaded().then(() => {
          const pageBlockId = this.page?.addBlock('affine:page');
          const noteId = this.page?.addBlock('affine:note', {}, pageBlockId);
          this.page?.addBlock('affine:paragraph', { title: "hello world" }, noteId);
          this.createEditor(this.page!);
        });
      }
    } else {
      const jsonObject = JSON.parse(data);
      this.workspace.importPageSnapshot(jsonObject, "test-id")
      this.page = this.workspace.getPage("test-id") || null;
      if (this.page) {
        this.page?.waitForLoaded().then(() => {
          this.createEditor(this.page!);
        })
      }
    }
  }

  createEditor(page: Page): void {
    console.log("manual create", page)
    this.editor = new EditorContainer();
    this.editor.page = page;
    this.renderer.appendChild(this.container.nativeElement, this.editor);
    this.monitorChanges();
  }

  monitorChanges(): void {
    this.workspace.doc.on('update', (updates: Uint8Array, origin: any, doc: Y.Doc, tr: Y.Transaction) => {
      console.log("on update")
      if (tr.local) {
        const update = Y.encodeStateAsUpdate(this.workspace.doc, updates);
        Y.applyUpdate(this.workspace.doc, update);
        const snap = this.workspace.exportPageSnapshot("test-id");
        localStorage.setItem("test", JSON.stringify(snap))
      } else {
        console.log("not local")
      }
    })

  }

  ngOnDestroy(): void {
    if (this.workspace.doc) {
      this.workspace.doc.destroy();
    }
  }
}
