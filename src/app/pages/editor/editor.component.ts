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
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {

  workspace: Workspace;
  page: Page | null;
  editor!: EditorContainer;
  @ViewChild('container', { read: ElementRef, static: false })
  container!: ElementRef;
  ydoc!: Y.Doc;
  ytext!: Y.Array<any>;

  constructor(
    private renderer: Renderer2
  ) {

    this.ydoc = new Y.Doc();
    this.ytext = this.ydoc.getArray('v-text');

    this.workspace = new Workspace({ id: 'foo', schema });

    let data = localStorage.getItem("test") || null;
    if (data) {
      const jsonObject = JSON.parse(data);
      const numberArray = Object.keys(jsonObject).map(key => jsonObject[key]);
      const binary = new Uint8Array(numberArray);
      Y.applyUpdate(this.workspace.doc, binary);

      this.page = this.workspace.getPage("test-id") || null
      console.log(this.page);
    } else {
      this.page = this.workspace.createPage({ id: 'test-id' });
      console.log(this.page)
      if (this.page) {
        this.page?.waitForLoaded().then(() => {
          const pageBlockId = this.page?.addBlock('affine:page');
          const noteId = this.page?.addBlock('affine:note', {}, pageBlockId);
          this.page?.addBlock('affine:paragraph', { title: "hello world" }, noteId);
          Y.applyUpdate(this.workspace.doc, Y.encodeStateAsUpdate(this.workspace.doc))
        });
      }
    }

    const wsProvider = new WebsocketProvider('ws://localhost:1234', 'my-roomname', this.workspace.doc)
    wsProvider.on('status', (event: { status: any; }) => {
      console.log(event.status) // logs "connected" or "disconnected"
    })
  }

  ngOnInit(): void {
    if (this.page) {
      console.log("create edtior")
      this.editor = new EditorContainer();
      this.editor.page = this.page;
    }
  }

  ngAfterViewInit(): void {
    if (this.editor && this.page) {
      console.log("render editor");
      this.renderer.appendChild(this.container.nativeElement, this.editor);
      this.monitorChanges();
    }
  }

  monitorChanges(): void {
    this.workspace.doc.on('update', (updates: Uint8Array, origin: any, doc: Y.Doc, tr: Y.Transaction) => {
      if (tr.local) {
        const update = Y.encodeStateAsUpdate(this.workspace.doc);
        Y.applyUpdate(this.workspace.doc, update);
        localStorage.setItem("test", JSON.stringify(Y.encodeStateAsUpdate(this.workspace.doc)));
      }
    })

    this.ydoc.on('update', (updates: Uint8Array, origin: any, doc: Y.Doc, tr: Y.Transaction) => {
      console.log("ydoc update", this.page?.id)
      // if (tr.local) {
      console.log("ydoc updates here");

      // const jsonString = JSON.stringify(Y.encodeStateAsUpdate(this.workspace.doc, updates));
      // localStorage.setItem("test2", jsonString);
      // }
    })

  }

  ngOnDestroy(): void {

    if (this.workspace.doc) {
      this.workspace.doc.destroy();
    }
  }

  // handleClick(): void {
  //   const update = Y.encodeStateAsUpdate(this.workspace.doc);
  //   console.log(update);
  //   Y.applyUpdate(this.workspace.doc, update);
  //   localStorage.setItem("test", JSON.stringify(Y.encodeStateAsUpdate(this.workspace.doc)));
  //   // console.log(Y.encodeStateAsUpdate(this.ydoc))
  // }
}
