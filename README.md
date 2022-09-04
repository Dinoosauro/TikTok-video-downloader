# TikTok-liked-downloader
Download all the liked videos from TikTok by pasting a simple script into the DevTools console. Simple and doesn't require any installation. 
## Before you start
Make sure your browser doesn't require input to save a download (ex. Edge, Firefox). If you are using one of these browser, disable it from the browser's settings.
## How to start
Copy the [script.js file](https://github.com/Dinoosauro/TikTok-liked-downloader/blob/main/script.js) content. Then, go to your profile on TikTok. Do a right click, then press inspect. Click on the console and then paste the script. Wait that the download starts. If you have saved lots of TikToks, this would take long.
### Thread sleeps
By default, to avoid lots of calls to the server, videos are downloaded from a range between 1800 and 5000 milliseconds. You can change that by editing the values at line 75. The same applies for getting the list of liked videos (line 64)
