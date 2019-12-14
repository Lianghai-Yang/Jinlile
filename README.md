# Jinlile

In order to have a better experience, you can use your phone to test. When we developing this platform, we have tried various way to fix bugs caused by storage from the front end. It seems that we have fix all. But to make our platform running smoothly, we recommend you to use the private mode in your phone or incognito mode in your browser. Thank you!

## Live Demo:

[Jinlile](https://jinlile.tech)

https://jinlile.tech

Please allow the website to get your location

---

## Setup

1. Clone the repository

```
git clone https://github.com/Lianghai-Yang/Jinlile.git
```

2. `cd Jinlile/server`
3. `npm install`
4. Rename `jinlile.server.config.example.js` to `jinlile.server.config.js`
5. Set configuration in `jinlile.server.config.js`
6. Run `npm start`
7. Change directory to `Jinlile/Client`, run `npm install`
8. Rename `jinlile.client.config.example.js` to `jinlile.client.config.js`
9. Set your `google_map_api_key`,`api_base_url`,`socketio_url` in `jinlile.client.config.js`
10. Run `npm start`

---

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
