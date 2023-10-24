# Ngblock

Demo of Blocksuite with Angular 16.

## Create a new blocksuite workspace and page (is this the way to create a new doc to be saved in the database)
```
createNewWorkspace() {

    const schema = new Schema();
    schema.register(AffineSchemas);
    const workspace = new Workspace({ id: 'foo', schema });
    const page = workspace.createPage({ id: 'test-id' });
    page.waitForLoaded().then(() => {
      const pageBlockId = page.addBlock('affine:page');
      const noteId = page.addBlock('affine:note', {}, pageBlockId);
      page.addBlock('affine:paragraph', {title: new Text("hello world")}, noteId);
    });

    const { doc } = workspace;
    const encodedDoc = Y.encodeStateAsUpdate(doc);

    // save the binary to the database
    saveBinaryToDB(JSON.stringify(encodedDoc))

  }
  ```

  ## How to load an existing page from the database?
  ```
  const workspace = new Workspace({ id: 'foo', schema });
  
  const data = getBinaryFromDB();
  const jsonObject = JSON.parse(data);
  const numberArray = Object.keys(jsonObject).map(key => jsonObject[key]);
  const encodedDoc = new Uint8Array(numberArray);

  const ydoc = new Y.Doc();

  Y.applyUpdate(this.workspace.doc, encodedDoc);

  <!-- now what? -->
  ```