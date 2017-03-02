### Anti-Cheating Cognito Event Handler

This example is based off [the one documented here](https://aws.amazon.com/blogs/mobile/using-amazon-cognito-and-aws-lambda-to-detect-cheating/).

```javascript
import { CognitoEvent, OK, ERROR } from 'node-lambda-events';

class ScoreKeyValidator extends Cloudformation {
  perform() {
    const { scoreKey } = this.records;
    if(scoreKey && scoreKey.newValue > 2112) {
      this.delete(scoreKey);
    }
    this.respond(OK, this.event);
  }
}
```
