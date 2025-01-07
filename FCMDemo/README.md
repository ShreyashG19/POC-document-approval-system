## open terminal in FCMDemo directory

## run following

### 1.

```bash
npm install
```

## 2. download your firebase json file

and move that file at root of this project i.e. `FCMDemo/<your_json_file.json>`

in server.js file change the following path with `<your_json_file.json>`

```js
const serviceAccount = require("./fcmtest-7be5a-firebase-adminsdk-ll7i0-4214f79128.json");
```

## 3. get your android device token by logging it in console, and hardcode the token here in `server.js` in double quotes

```js
const registrationToken = req.body.token;
```

### 4. finally run follwoing

```bash
npm run dev
```
