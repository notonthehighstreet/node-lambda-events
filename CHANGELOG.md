# 0.1.12

- Added Lex Event Handling
- Improved handling for empty oldImage and newImage in DynamoDB event handler

# 0.1.6

- Added S3 Event handling

# 0.1.4

- Minor bug with CognitoEvent not being included properly

# 0.1.3

- Added CognitoEvent handler for validating SyncTrigger events from Cognito

# 0.1.2

- Added CognitoStream event, to handle Cognito sync events streamed through Kinesis

# 0.1.0

- Added DynamoDB Events
- Added SNS Events
- Added Simple Schedule Event
- Removed `this.response` and implemented `this.respond(OK | ERROR)`

# 0.0.1

- Initial Implementation
