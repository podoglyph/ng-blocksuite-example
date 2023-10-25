import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AffineSchemas } from '@blocksuite/blocks';
import { Schema, Workspace } from '@blocksuite/store';
import * as Y from 'yjs';

export interface Doc {
  id: string
  content: string
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

@Component({
  selector: 'app-new-doc',
  templateUrl: './new-doc.component.html',
  styleUrls: ['./new-doc.component.css']
})
export class NewDocComponent {

  constructor(private router: Router) {
    
  }

  // handleClick(): void {
  //   const doc: Doc = {
  //     id: getRandomInt(10000, 99999).toString(),
  //     content: "some content here"
  //   }

  //   localStorage.setItem(doc.id, JSON.stringify(doc))
  //   this.router.navigate(['/doc', doc.id]);

  // }

  handleClick() {
    const schema = new Schema();
    schema.register(AffineSchemas);
    const workspace = new Workspace({ id: 'foo', schema });
    const id = getRandomInt(10000, 99999).toString();
    const page = workspace.createPage({ id });

    page.waitForLoaded().then(() => {
      const pageBlockId = page.addBlock('affine:page', {title: "new page 11"});
      const noteId = page.addBlock('affine:note', {}, pageBlockId);
      page.addBlock('affine:paragraph', {title: "hello", text: "this is some paragraph text"}, noteId);
      const { doc } = workspace;
  
      localStorage.setItem(id, JSON.stringify(Y.encodeStateAsUpdate(doc)))
      this.router.navigate(['/doc', id]);
    });

  }
}

