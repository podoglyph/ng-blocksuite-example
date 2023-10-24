# Ngblock

Demo of Blocksuite with Angular 16.

## Create a new blocksuite workspace and page
```
createNewWorkspace() {

    const schema = new Schema();
    schema.register(AffineSchemas);
    const workspace = new Workspace({ id: 'foo', schema });
    const page = workspace.createPage({ id: 'test-id' });
    page.waitForLoaded().then(() => {
      const pageBlockId = page.addBlock('affine:page');
      const noteId = page.addBlock('affine:note', {}, pageBlockId);
      page.addBlock('affine:paragraph', {title: new Text("hello")}, noteId);
    });

    const { doc } = workspace;

    this.newDocGQL.mutate({ content: JSON.stringify(Y.encodeStateAsUpdate(doc)) }).pipe(take(1)).subscribe(data => {
      if (data.data?.newDocument.id) {
        const id = data.data?.newDocument.id;
        this.router.navigate(['/doc', id]);
      }
    });
  }
  ```