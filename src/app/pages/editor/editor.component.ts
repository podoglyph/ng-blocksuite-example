import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
// import '../../element'; // <-- import the web component
import { Page, Schema, Workspace } from '@blocksuite/store';
import { AffineSchemas } from '@blocksuite/blocks';
import { EditorContainer } from '@blocksuite/editor';
import * as Y from 'yjs';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, AfterViewInit {

  workspace: Workspace;
  page: Page;
  editor!: EditorContainer;
  @ViewChild('container', {read: ElementRef, static: false})
  container!: ElementRef;
  ydoc!: Y.Doc;
  ytext!: Y.Text;

  constructor(
    private renderer: Renderer2
  ) {

    this.ydoc = new Y.Doc();
    this.ytext = this.ydoc.getText('v-text');
    
    const schema = new Schema();
    schema.register(AffineSchemas);
    this.workspace = new Workspace({ id: 'foo', schema });

    this.page = this.workspace.createPage({ id: 'test-id' });
    
    this.page?.waitForLoaded().then(() => {
      const pageBlockId = this.page.addBlock('affine:page');
      const noteId = this.page.addBlock('affine:note', {}, pageBlockId);
      const page1 = this.page.addBlock('affine:paragraph', { title: "hello world" }, noteId);
      const page2 = this.page.addBlock('affine:paragraph', { title: "goodbye" }, page1);
      this.page.addBlock('affine:paragraph', { title: "goodbye" }, page2);


      // Y.applyUpdate(this.ydoc, Y.encodeStateAsUpdate(this.workspace.doc))
    });
  }

  ngOnInit(): void {
    this.editor = new EditorContainer();
    this.editor.page = this.page!;
  }
  
  ngAfterViewInit(): void {
    this.renderer.appendChild(this.container.nativeElement, this.editor);
  }

  handleClick(): void {
    const update = Y.encodeStateAsUpdate(this.ydoc);
    console.log(update);
    Y.applyUpdate(this.ydoc, update);
    localStorage.setItem("test", JSON.stringify(update));
    // console.log(Y.encodeStateAsUpdate(this.ydoc))
  }
}
