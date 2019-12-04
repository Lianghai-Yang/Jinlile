# Jinlile


## Server

### Database Structure

```
users {
    _id: String,
    name: String,
    email: String,
    groups: [
        {
            groupId: String,
            groupName: String
        }
    ],
    email_code: String,
}

groups {
    _id: String,
    name: String,
    users: [
        {
            userId: String,
            userName: String,
        }
    ],
    messages: [
        {
            userId: String,
            name: String,
            content: String,
            time: Timestamp,
        }
    ]
}
```