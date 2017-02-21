### Simple UUID Generator

The below example demonstrates how to return a simple unique identifier for a Cloudformation template.

```javascript
import uuidV4 from 'uuid/v4';
import { Cloudformation, OK, ERROR } from 'node-lambda-events';

class UUIDGenerator extends Cloudformation {
  create() {
    const id = uuidV4();
    const data = { foo: 'bar' };
    this.response.respond(OK, { id, data });
  }

  update() {
    this.create();
  }

  delete() {
    this.response.respond(OK, { id: this.id });
  }
}
```
