# whatsapp-text-to-json
Convert exported Whatsapp chat text files to JSON message file containing messages. Also convert JSON message file to JSON word 'frequency of use' file.

## Exporting chat from Whatsapp
Go to the chat you want to export, then go to Group Info, select Export Chat (Without Media), export and unzip it to extract the txt file.

## Converting chat txt to JSON message file
How to convert the chat txt file to a JSON file containing an array of all messages with timestamp and user information.
```javascript
node chat-to-obj.js [yourfile.txt]
```
Appending -o flag will skip lines with **&lt;image omitted&gt;**
```javascript
node chat-to-obj.js [yourfile.txt] -o
```
Appending -t flag will not include **type** of message property in generated JSON file.
```javascript
node chat-to-obj.js [yourfile.txt] -t
```

## Converting JSON message file to JSON 'frequency of use' file
How to convert the JSON message file into a JSON file of all words and their frequency of use.
```javascript
node obj-to-words.js [yourfile.txt]
```

## Example of generated JSON message file 
```JSON
{
  "data":[
    {"date":"2014-02-11T14:41:17.000Z","user":"Dave","message":"Dave changed the subject to “Test Chat”","type":"action"},
    {"date":"2014-02-11T14:41:24.000Z","user":"Dave","message":"Dave was added","type":"action"},
    {"date":"2014-02-11T14:41:24.000Z","user":"You","message":"You were added","type":"action"},
    {"date":"2014-02-11T14:41:25.000Z","user":"John","message":"John was added","type":"action"},
    {"date":"2014-02-11T14:41:38.000Z","user":"Dave","message":"Testing testing, this is a test message","type":"message"},
    {"date":"2014-02-11T14:42:32.000Z","user":"Rich","message":"Testing again.","type":"message"},
    {"date":"2014-02-11T14:42:43.000Z","user":"John","message":"Still testing...?","type":"message"}
  ]
}
```
## Example of generated JSON 'frequency of use' file 
```JSON
{
  "data":[
    "guys":297,
    "down":343,
    "trumpets":10,
    "weekend":218,
    "mate":171
  ]
}
```
