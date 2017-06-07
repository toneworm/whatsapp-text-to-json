# whatsapp-text-to-json
Convert exported Whatsapp chat text files to JSON

## Exporting chat from Whatsapp
Go to the chat you want to export, then go to Group Info, select Export Chat (Without Media), export it and unzip it to get to the txt file.

## How to use
This will convert the chat txt file to a JSON file of the same name.
```javascript
node convert.js [yourfile.txt]
```
-o flag will skip lines with &lt;image omitted&gt;
```javascript
node convert.js [yourfile.txt] -o
```
