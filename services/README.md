## Description

Some Features require additional backend services to communicate with 3rd Party API's and so on.
Security crutial features like the Paymaster API will be hidden behind a Proxy and our main api to prevent attacks and malicious requests.

### Circle Notification Service

In order to automatically react to settled payments to, or from the Circle API, this service is [registered in circle](https://developers.circle.com/docs/notifications-quickstart).

### Paymaster API

TO BE DONE
Currently the paymaster features exist within the `/gasless` sub-path in the main api. For security reasons these features will exist within a separate service.
Prevent access to this service will not be possible.
