# Client
In the context of the voting service, the client is the system that embeds the voting service
and uses the backend interface.
The client will be the actual customer that pays to make use of the service.

This document describes use cases and API routes that the client needs.

## Use Cases

### Create a voting session
> status: `In progress`

**As customer of the voting service, i want to be able to create a new voting session to embed it in my system.**

The voting service will expose an API the client can call.<br/>
By calling `POST /api/v1/session` with the payload described in the API docs, a new voting session will be created and returned from the endpoint.
Sessions do not need to be created right away, they can also be scheduled for a future date.

### End a voting session
> status: `Open` <br>
> priority: `Low`

**As a customer of the voting service, i want to close a session to mark results as final**

By calling `POST /api/v1/session/{id}/end`, the session with the passed id will be marked as ended.

### Get a voting session
> status: `Open` <br>
> priority: `Low`

**As a customer of the voting service, i want to retrieve session information**

By calling `GET /api/v1/session/{id}`, the session with the passed id will be returned

### Invite a new participant to the session
> status: `Open` <br>
> priority: `Normal`

**As a customer of the voting service, i want to add participants to the voting session, so they can join via the frontend**

By calling `POST /api/v1/session/{id}/participants`, with the payload described in the API docs, a new participant will be created and added to the session.

### Remove a participant from the session
> status: `Open` <br>
> priority: `Low`

**As a customer of the voting service, i want to remove participants from the voting session, to deny access to the voting session**

By calling `DELETE /api/v1/session/{id}/participants/{id}`, the participant will be removed from the session.
If some participants have mandates for the removed participant, they will be deleted as well.

Participants that have voted cannot be removed.

### Grant a mandate between two participants
> status: `Open` <br>
> priority: `Normal`

**As a customer of the voting service, i want to grant mandates for participants, that other participants can vote in case of e.g. illness**

By calling `POST /api/v1/session/{id}/participants/{id}/mandates`, with the payload described in the API docs
(the participant ids for the mandate), a new participant will be created. The mandate will enable the participant in the URL to vote for the passed participant in the payload.

### Revoke a mandate between two participants
> status: `Open` <br>
> priority: `Low`

**As a customer of the voting service, i want to revoke mandates for participants**

By calling `DELETE /api/v1/session/{id}/participants/{id}/mandates/{mandatedParticipantId}`, the mandate will be revoked.

Mandates that are used (if participants have voted via the mandate) cannot be revoked.

### Add a topic to a session
> status: `Open` <br>
> priority: `Normal`

**As a customer of the voting service, i want to add new topics to the voting session to be able to vote them**

By calling `POST /api/v1/session/{id}/topics`, with the payload described in the API docs, a new topic will be created.

### Remove a topic from a session
> status: `Open` <br>
> priority: `Normal`

**As a customer of the voting service, i want to remove topics from a voting session in case they are obsolete**

By calling `DELETE /api/v1/session/{id}/topics/{id}`, a topic will be removed.

### Update a topic
> status: `Open` <br>
> priority: `Normal`

**As a customer of the voting service, i want to update topics of a voting session**

By calling `PUT /api/v1/session/{id}/topics/{id}`, a topic will be updated with the passed payload (described in the API docs).
Fields that might need to update are:
* `requiredNumberOfShares`: In case a new participant is added, the required number of shares might change
* `completed`: To manually mark the topic as completed and end the vote

### Start voting for a topic
> status: `Open` <br>
> priority: `High`

**As a customer of the voting service, i want to start the vote for a topic**

By calling `POST /api/v1/session/{id}/topics/start`, the voting for a topic is enabled. Votes for the topic can be received now.

### End voting for a topic
> status: `Open` <br>
> priority: `High`

**As a customer of the voting service, i want to end the vote for a topic**

By calling `POST /api/v1/session/{id}/topics/end`, the voting for a topic is disabled. Votes won't be received anymore.


### Get all participants of the client
> status: `Open` <br>
> priority: `Low`

**As a customer of the voting service, i want to view all the participants**

By calling `GET /api/v1/participants`, i receive all my registered participants.

### Get all sessions of the client
> status: `Open` <br>
> priority: `Low`

**As a customer of the voting service, i want to view all the sessions**

By calling `GET /api/v1/sessions`, i receive all sessions as overview.



