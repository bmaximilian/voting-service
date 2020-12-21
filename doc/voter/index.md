# Voter
In the context of the voting service, the voter is the system that actually votes
and uses the frontend interface.
The voter will be the consumer of the client's system.

This document describes use cases and API routes that the voter needs.

## Use Cases

### Vote (REST)
> status: `Open`

**As voter of the voting service, i want to be able to vote.**

The voting service will expose an API the voter can call.<br/>
By calling `POST /api/v1/session/{id}/topic/{id}/vote` with the payload described in the API docs, a new ballot will be created and returned from the endpoint.

### Get Session results (REST)
> status: `Open`

**As voter of the voting service, i want to get the results of the voting session.**

The voting service will expose an API the voter can call.<br/>
By calling `GET /api/v1/session/{id}/results`, the results of the session will be returned.

### Vote (WS)
> status: `Open`

**As voter of the voting service, i want to be able to vote.**

The voting service will expose a Socket.io-API the client can call.<br/>
By dispatching the event `vote` with the following payload, a new vote will be created:
```js
const payload = {
    "topicId": "string",
    "mandatedFor": "participant", // the participant that should be mandated
    "answer": "string"
}
```
This event won't be dispatched to other clients.

### Vote counted (WS)
> status: `Open`

**As voter of the voting service, i want to track the voting progress in real time.**

The voting service will expose a Socket.io-API the client can call.<br/>
When a new vote is saved, the `voteCounted` event with the following payload will be dispatched to all clients:
```js
const payload = {
    "topicId": "string",
    "votes": {
      ["answer as key"]: {
        "votes": "number", // actual number of participants that voted this answer
        "shares": "number" // accumulated number of shares of the participants that voted this answer
      }
    },
    "missing": {
      "votes": "number", // number of participants in the session that haven't voted
      "shares": "number" // accumulated number of shares of the participants that haven't voted
    }
}
```
This event won't be dispatched to other clients.

### onConnect (WS)
> status: `Open`

**As voter of the voting service, i want see how many users are connected and if a quorum can be found**

When a new participant connects, the following payload will be dispatched as connection handshake
```js
const payload = {
    "currentTopic": Topic, // see topic started - can be undefined if no topic is active
}
```

### Broadcast connect (WS)
> status: `Open`

**As voter of the voting service, i want see how many users are connected and if a quorum can be found**

When a new participant connects, a `participantJoined` event with the following payload will be dispatched:
```js
const payload = {
    "activeParticipants": "number",
    "activeShares": "number",
    "requiredSharesForQuorum": "number"
}
```

### Broadcast disconnect (WS)
> status: `Open`

**As voter of the voting service, i want see how many users are connected and if a quorum can be found**

When a new participant disconnects, a `participantDisconnected` event with the following payload will be dispatched:
```js
const payload = {
    "activeParticipants": "number",
    "activeShares": "number",
    "requiredSharesForQuorum": "number"
}
```

### Event topic started (WS)
> status: `Open`

**As voter of the voting service, i want be notified when a topic starts**

When the topic start route is called in the backend, a `topicStarted` event with the following payload will be dispatched:
```js
const payload = {
    "topic": {
      "id": "number",
      "requiredNumberOfShares": "number",
      "answerOptions": ["string"],
      "majority": {
        "type": "string",
        "quorumInPercent": "number"
      }
    }
}
```

### Event topic ended (WS)
> status: `Open`

**As voter of the voting service, i want be notified when a topic ends**

When the topic end route is called in the backend, a `topicEnded` event with the following payload will be dispatched:
```js
const payload = {
    "topic": Topic, // see topicStarted event
    "countedVotes": Votes, // see voteCounted event
}
```

### Event session ended (WS)
> status: `Open`

**As voter of the voting service, i want be notified when a session ends**

When the session end route is called in the backend, a `sessionEnded` event dispatched.
