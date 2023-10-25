import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
// import '../../element'; // <-- import the web component
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
// import { Doc } from 'src/app/components/new-doc/new-doc.component';
import * as Y from 'yjs';
import { Page, Schema, Workspace } from '@blocksuite/store';
import { AffineSchemas } from '@blocksuite/blocks';
import { EditorContainer } from '@blocksuite/editor';

const schema = new Schema();
schema.register(AffineSchemas);

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent {
  workspace!: Workspace;
  page: Page | null = null;
  doc!: Uint8Array;

  loaded: boolean = false;

  @ViewChild('editor', {read: ElementRef, static: false})
  editor!: ElementRef;

  constructor(
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute) {
  }
  
  ngOnInit(): void {
    this.activatedRoute.paramMap
    .pipe(first())
    .subscribe(m => {
      const id = m.get("id")
      if (id) {
        this.workspace = new Workspace({ id: id, schema });
        this.page = this.workspace.createPage({id: "page22"})

        
        // let data = localStorage.getItem(id) || null;
          // if (data) {
          //   const jsonObject = JSON.parse(data);
          //   const numberArray = Object.keys(jsonObject).map(key => jsonObject[key]);
          //   const binary = new Uint8Array(numberArray);
          //   this.doc = binary;
          //   Y.applyUpdate(workspace.doc, this.doc)
          //   this.page = workspace.getPage(id);
          //   if (!this.page) {
          //     console.error("no page found")
          //   }
          // }
      }
    })
  }

  ngAfterViewInit(): void {
    const editor = new EditorContainer();
    if (this.page) {
      editor.page = this.page
      console.log(editor.page)
      this.editor.nativeElement.appendChild(editor)
      this.renderer.appendChild(this.editor.nativeElement, editor)
    }
  }
}
