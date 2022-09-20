// Change these values as you prefer:
// DownloadViaYtDlp: enable this if you want to download a batch file that will download TikTok videos via yt-dlp
var DownloadViaYtDlp = false;
// minRandom & maxRandom: to avoid lots of calls to TikTok server (and so to avoid captchas or similar), a delay is applied to every download request.
// You can change these values with the mininum and maxinum time you prefer.
var minRandom = 1800;
var maxRandom = 5000;
// max/minRandomForLikedDownload: the maxinum and the mininum time this script will ask TikTok API to get the next 30 liked videos.
var maxRandomForLikedDownload = 1500;
var minRandomForLikedDownload = 50;
// preferScrolling: instead of directly calling the TikTok API, scroll the webpage to get liked videos. TikTok website then will load the results.
// Note: independently of this bool, scrolling is done to download all the videos from an user / all the videos that uses a sound etc.
var preferScrolling = false;

// ---- SCRIPT START ---- 
var videoDesc = Array(1).fill("");
var videoLink = Array(1).fill("");
var videoName = Array(1).fill("");
var videoId = Array(1).fill("");
var videoProgress = 0;
var prepareLink = "";
var infoText = document.createElement("label");
function clickOn() {
    if (document.location.href.indexOf("/video/") !== -1) {
        if (DownloadViaYtDlp) {
            forceDownload("data:text/plain;charset=utf-8," + encodeURIComponent("yt-dlp " + document.location.href), "TikTokSingleVideo.bat");
            return;
        }
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", document.location.href, false);
        xmlHttp.send(null);
        var documentBody = xmlHttp.responseText;
        var webLink = documentBody.substring(documentBody.indexOf("\"preloadList\":[{\"url\":\"")).replace("\"preloadList\":[{\"url\":\"", "");
        webLink = webLink.substring(0, webLink.indexOf("\"")).replaceAll("\\u002F", "/");
        var description = documentBody.substring(documentBody.indexOf("\",\"desc\":\"")).replace("\",\"desc\":\"", "");
        description = description.substring(0, description.indexOf("\""));
        var videoId = documentBody.substring(documentBody.indexOf("\"video\":{\"id\":\"")).replace("\"video\":{\"id\":\"", "");
        videoId = videoId.substring(0, videoId.indexOf("\""));
        var videoAuthor = document.location.href.substring(document.location.href.indexOf("@"));
        videoAuthor = videoAuthor.substring(0, videoAuthor.indexOf("/"));
        var composeFileName = description + " - " + videoId + " [" + videoAuthor + "]";
        composeFileName = composeFileName.replaceAll("/", "").replaceAll("?", "").replaceAll("<", "").replaceAll(">", "").replaceAll("\\", "").replaceAll(":", "").replaceAll("*", "").replaceAll("|", "").replaceAll("\"", "");
        forceDownload(webLink, composeFileName);
    } else if (document.body.innerHTML.indexOf("e33dl3i1 tiktok-ipqbxf-Button-StyledEditButton ehk74z00") == -1 || preferScrolling) {
        createDiv();
        loadWebpage();
    } else {
        createDiv();
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
}
function createDiv() {
    var addInfoTop = document.createElement("div");
    addInfoTop.height = "100px";
    addInfoTop.style.paddingTop = "60px";
    addInfoTop.style.paddingLeft = "60px";
    infoText.innerHTML = "Preparing for download...";
    document.getElementsByClassName("tiktok-1kydcf4-DivHeaderWrapperMain-StyledDivHeaderWrapperMainV2 e10win0d2")[0].prepend(addInfoTop);
    addInfoTop.appendChild(infoText);
}
function loadWebpage() {
    if (document.body.innerHTML.indexOf("<svg preserveAspectRatio=\"none\" viewBox=\"0 0 200 200\" width=\"48\" height=\"48\" class=\"tiktok-qmnyxf-SvgContainer e1ugmybf1\">") == -1) {
        window.scrollTo(0, document.body.scrollHeight);
        infoText.innerHTML = "Scrolling webpage (getting all items)..."; 
        setTimeout(function () {

            if (document.body.innerHTML.indexOf("<svg preserveAspectRatio=\"none\" viewBox=\"0 0 200 200\" width=\"48\" height=\"48\" class=\"tiktok-qmnyxf-SvgContainer e1ugmybf1\">") !== -1) {
                setTimeout(function () {
                    loadWebpage();
                }, Math.floor(Math.random() * 2000 + 400));
            } else {
                console.log(document.body.innerHTML);
                getUserVideo();
            }
        }, 50);
    } else {
        setTimeout(function () {
            loadWebpage()
        }, 1000);
    }
}
function getTikTok() {
    infoText.innerHTML = "Getting liked TikToks list (" + videoId.length + ")...";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", prepareLink, false);
    xmlHttp.send(null);
    var getJson = JSON.parse(xmlHttp.responseText);
    var getFutureCursor = "not required";
    console.log(getJson);
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
            getTikTok();
        } else {
            if (!DownloadViaYtDlp) {
                actuallyDownload();
            } else {
                prepareYtDlp();
            }
        }
    }, Math.floor(Math.random() * maxRandomForLikedDownload + minRandomForLikedDownload));
}
async function getUserVideo() {
    console.log("here");
    var videoClass = document.body.getElementsByClassName("tiktok-x6y88p-DivItemContainerV2 e19c29qe7");
    var integer = 0;
    function videoGet() {
        infoText.innerHTML = "Downloading video " + (integer + 1) + " of " + videoClass.length; 
        var htmlContent = videoClass[integer].innerHTML;
        var getLink = htmlContent.substring(htmlContent.indexOf("href=\"")).replace("href=\"");
        getLink = getLink.substring(0, getLink.indexOf("\""));
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", document.location.href, false);
        xmlHttp.send(null);
        var documentBody = xmlHttp.responseText;
        var webLink = documentBody.substring(documentBody.indexOf("\"preloadList\":[{\"url\":\"")).replace("\"preloadList\":[{\"url\":\"", "");
        webLink = webLink.substring(0, webLink.indexOf("\"")).replaceAll("\\u002F", "/");
        videoLink[integer] = webLink;
        var getDesc = htmlContent.substring(htmlContent.indexOf("alt=\"")).replace("alt=\"", "");
        getDesc = getDesc.substring(0, getDesc.indexOf("\""))
        videoDesc[integer] = getDesc;
        var getVideoId = getLink.substring(getLink.indexOf("/video/")).replace("/video/", "");
        videoId = getVideoId;
        var userName = document.location.href.substring(document.location.href.indexOf("@"));
        userName = userName.substring(0, userName.indexOf("/"));
        videoName[integer] = userName;
        if (!DownloadViaYtDlp) {
                forceDownload(webLink, getDesc.replaceAll("/", "").replaceAll("?", "").replaceAll("<", "").replaceAll(">", "").replaceAll("\\", "").replaceAll(":", "").replaceAll("*", "").replaceAll("|", "").replaceAll("\"", "") + "[" + userName + " - " + getVideoId + "].mp4");
                downloadProgress++;
                if (downloadProgress < videoLink.length) {
                    actuallyDownload();
                }   
        }
        integer = integer+1;
        setNextVideoGet();
    }
    videoGet();
    function setNextVideoGet() {
        if (DownloadViaYtDlp) {
            var ytDlpString = "";
            for (let i = 0; i < videoClass.length; i++) {
                var htmlContent = videoClass[i].innerHTML;
                var getLink = htmlContent.substring(htmlContent.indexOf("href=\"")).replace("href=\"");
                getLink = getLink.substring(0, getLink.indexOf("\""));
                if (getLink.indexOf("undefined") !== -1) {
                    getLink = getLink.replaceAll("undefined", "");
                }
                ytDlpString = ytDlpString + "yt-dlp " + getLink + "\n";        
            }
            forceDownload("data:text/plain;charset=utf-8," + encodeURIComponent(ytDlpString), "TikTokContent.bat");
        } else {
        if (integer < videoClass.length) {
        setInterval(function() {
            videoGet();
        }, Math.floor(Math.random() * maxRandom + minRandom));
    }
    }

}
}
function prepareYtDlp() {
    var setupYtDlpScript = "";
    for (let i = 0; i < videoId.length; i++) {
        setupYtDlpScript = setupYtDlpScript + "\nyt-dlp https://www.tiktok.com/@" + videoName[i] + "/video/" + videoId[i];
    }
    forceDownload("data:text/plain;charset=utf-8," + encodeURIComponent(setupYtDlpScript), "tiktokliked.bat");
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
    }, Math.floor(Math.random() * maxRandom + minRandom));
}


function forceDownload(url, fileName) {
    if (url.indexOf("undefined") !== -1) {
        url = url.replace("undefined", "");
    }
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
