# Jinlile


## Server

### Database Structure

```
users {
    _id: String,
    name: String,
    email: String,
    groups: Groups[],
    email_code: String,
}

groups {
    _id: String
}
```