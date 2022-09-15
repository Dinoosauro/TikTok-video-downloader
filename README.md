# TikTok-liked-downloader
Download all the TikTok liked videos, all the TikTok videos from an user and also single TikTok videos by pasting a simple script into the DevTools console. Simple and doesn't require any installation. 
## Before you start
Make sure your browser doesn't require user input to save a download (ex. [Edge requires user input](edge://settings/downloads)). If your browser does this, disable that function from the browser's settings.
## How to start
Copy the [script.js file](https://github.com/Dinoosauro/TikTok-liked-downloader/blob/main/script.js) content. Then, open 
- Your profile if you want to download your liked TikToks
- A video if you want to download a single video
- Another user's profile if you want to download all of their videos.

Do a right click, then press inspect. Click on the console and then paste the script. Wait until the download starts. If you have saved lots of TikToks, this would take a long time.
### Thread sleeps
By default, to avoid lots of calls to the server, videos are downloaded from a range between 1800 and 5000 milliseconds. You can change that by editing the random values at the start of the script. 
### Download via yt-dlp
If you don't want the TikTok watermark onto your downloaded videos, you can generate a script that will use [yt-dlp](https://github.com/yt-dlp/yt-dlp) to download the TikTok video. For that, change the value of the DownloadViaYtDlp variable to true (in the first line). 

Then, open the file in the same folder you've downloaded yt-dlp (if you're on Windows, otherwise you can install yt-dlp from your package manager).
