let videoDesc = Array(1).fill("");
let videoLink = Array(1).fill("");
var videoName = Array(1).fill("");
var videoId = Array(1).fill("");
var videoProgress = 0;
var prepareLink = "";
var infoText = document.createElement("label");
function clickOn() {
    var addInfoTop = document.createElement("div");
    addInfoTop.width = "100%";
    addInfoTop.height = "100px";
    addInfoTop.style.paddingLeft = "200px";
    addInfoTop.style.paddingTop = "100px";
    infoText.innerHTML = "Preparing for download...";
    document.body.prepend(addInfoTop);
    addInfoTop.appendChild(infoText);
    var tikTokHtml = document.body.innerHTML;
    var token = tikTokHtml.substring(tikTokHtml.indexOf(",\"secUid\":\"")).replace(",\"secUid\":\"", "");
    token = token.substring(0, token.indexOf("\""));
    console.log("Your token is: " + token);
    var deviceId = tikTokHtml.substring(tikTokHtml.indexOf("\"wid\":\"")).replace("\"wid\":\"", "");
    deviceId = deviceId.substring(0, deviceId.indexOf("\""));
    var appLang = tikTokHtml.substring(tikTokHtml.indexOf("hrefLang=\"")).replace("hrefLang=\"", "");
    appLang = appLang.substring(0, appLang.indexOf("\""));
    var getRegion = tikTokHtml.substring(tikTokHtml.indexOf(",\"region\":\"")).replace(",\"region\":\"", "");
    getRegion = getRegion.substring(0, getRegion.indexOf("\""));
    var OSName = "windows";
    if (navigator.appVersion.indexOf("Win") != -1) OSName = "windows";
    if (navigator.appVersion.indexOf("Mac") != -1) OSName = "macOS";
    if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
    if (navigator.appVersion.indexOf("Linux") != -1) OSName = "linux";
    prepareLink = "https://www.tiktok.com/api/favorite/item_list/?aid=1988&app_language=" + appLang + "&app_name=tiktok_web&battery_info=0.50&browser_language=en&browser_name=" + navigator.appCodeName + "&browser_online=true&browser_platform=" + navigator.platform + "&browser_version=" + encodeURIComponent(navigator.appVersion).replaceAll("(", "%28").replaceAll(")", "%29") + "&channel=tiktok_web&cookie_enabled=true&count=30&cursor=0&device_id=" + deviceId + "&device_platform=web_pc&focus_state=true&from_page=user&history_len=3&is_fullscreen=false&is_page_visible=true&language=" + appLang + "&os=" + OSName + "&priority_region=" + getRegion + "&referer=&region=" + getRegion + "IT&screen_height=" + screen.height + "&screen_width=" + screen.width + "&secUid=" + token;
    getTikTok();
}
function getTikTok() {
    infoText.innerHTML = "Getting liked TikToks list (" + videoId.length + ")...";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", prepareLink, false);
    xmlHttp.send(null);
    console.log(xmlHttp.responseText);
    var getJson = JSON.parse(xmlHttp.responseText);
    console.log(getJson);
    var getFutureCursor = "not required";

    for (let i = 0; i < getJson.itemList.length; i++) {
        let item = getJson.itemList[i];
        videoDesc[videoProgress] = item.desc;
        videoLink[videoProgress] = item.video.playAddr;
        videoId[videoProgress] = item.video.id;
        videoName[videoProgress] = item.author.uniqueId;
        videoProgress++;
    }
    setTimeout(function () {


        if (getJson.hasMore) {
            getFutureCursor = getJson.cursor;
            prepareLink = prepareLink.replace("&cursor=0&", "&cursor=" + getFutureCursor + "&");
            console.log(getFutureCursor);
           getTikTok();
        } else {
           actuallyDownload();
        }
    }, Math.floor(Math.random() * 1500 + 50));
}
var downloadProgress = 0;
function actuallyDownload() {
    infoText.innerHTML = "Downloaded liked TikTok: " + downloadProgress;
    setTimeout(function () {
        forceDownload(videoLink[downloadProgress], videoDesc[downloadProgress].replaceAll("/", "").replaceAll("?", "").replaceAll("<", "").replaceAll(">", "").replaceAll("\\", "").replaceAll(":", "").replaceAll("*", "").replaceAll("|", "").replaceAll("\"", "") + "[" + videoName[downloadProgress] + " - " + videoId[downloadProgress] + "].mp4");
        downloadProgress++;
        if (downloadProgress < videoLink.length) {
            actuallyDownload();
        }
    }, Math.floor(Math.random() * 5000 + 1800));
}


function forceDownload(url, fileName) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(this.response);
        var tag = document.createElement('a');
        tag.href = imageUrl;
        tag.download = fileName;
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
    }
    xhr.send();
}
clickOn();
