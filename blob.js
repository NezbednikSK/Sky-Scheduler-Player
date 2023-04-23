/* look, i apologize for the horrible quality of the code below
   sometimes i blank out and the code starts looking like it came out of an obfuscator
   but that's just how i write sometimes, sorry! - nez */

var TVServer = "https://sky-oldies.services.nez-cf.net.eu.org:1812/";
var _URL = new URL(window.location.href);
if (_URL.searchParams.has("server")) TVServer = _URL.searchParams.get("server");

if (_URL.searchParams.has("websocket")) {
    var socket = new WebSocket(_URL.searchParams.get("websocket"));
    console.log("initiating websocket to " + _URL.searchParams.get("websocket"));
    socket.addEventListener("open", () => {
        socket.send("client");
    });
    socket.addEventListener("message", (event) => {
        if (event.data == "skip") document.getElementById("debugnext2").click();
    });
}

function fetchFromTVServer() {
    return new Promise((resolve, reject) => {
        fetch(TVServer).then(data => data.json()).then(data => {
            resolve(data);
        });
    });
}

async function onYouTubeIframeAPIReady() {
    console.log("iframe api loaded");
    preload = {};
    var ytplayer = document.getElementById("ytplayer");
    var wrap = document.getElementById("ytplayerwrapper");
    var logoobj = document.getElementById("logo");
    
    if (_URL.searchParams.has("logo")) logoobj.setAttribute("src", _URL.searchParams.get("logo"));
    initContent = await fetchFromTVServer();
    preload = initContent;
    document.getElementById("debugid").innerHTML = JSON.stringify(initContent);
    if (!initContent.w) wrap.setAttribute("class", "shrunk");
    if (initContent.wvid && !initContent.taxi) logoobj.classList.add("logo_wide");
    if (initContent.taxi) logoobj.classList.add("logo_taxi");
    var startAt = initContent.start;
    var endAt = initContent.end;
    var player = new YT.Player("ytplayer", {
        width: (initContent.w ? "100%" : "75%"),
        height: "100%",
        videoId: initContent.id,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
            autoplay: 1,
            playsinline: 1,
            start: initContent.castLen,
            end: initContent.end
        },
        events: {
            onReady: function(event) {
                console.log("ready lol", event);
                document.getElementById("debugnext").addEventListener("click", function(e) {
                    console.log("clickedo");
                    player.seekTo((endAt < 0 ? player.getDuration() : endAt) - 7);
                });
                setInterval(function() {
                    var duration = (endAt < 0 ? (player.getDuration() | 0) : endAt) - 4 - startAt;
                    var current = (player.getCurrentTime() | 0) - startAt;
                    console.log(duration, current);
                    if (current > 4 && current < duration && duration > 0 && logoobj.classList.contains("logo_h")) {
                        logoobj.classList.remove("logo_h");
                        logoobj.classList.add("logo_w");
                    }
                    if (current > duration && logoobj.classList.contains("logo_w")) {
                        fetchFromTVServer().then(data => {
                            preload = data;
                        });
                        logoobj.classList.remove("logo_w");
                        logoobj.classList.add("logo_h");
                    }
                }, 1000);
            },
            onStateChange: function(event) {
                console.log(event);
                if (event.data == 0) {
                    var nextSong = preload;
                    // debug
                    document.getElementById("debugid").innerHTML = JSON.stringify(nextSong);
                    
                    // change size & load ID
                    if (nextSong.w) wrap.removeAttribute("class");
                    else wrap.setAttribute("class", "shrunk");
                    if (nextSong.wvid && !nextSong.taxi) logoobj.classList.add("logo_wide");
                    else logoobj.classList.remove("logo_wide");
                    if (nextSong.taxi) logoobj.classList.add("logo_taxi");
                    else logoobj.classList.remove("logo_taxi");
                    startAt = nextSong.start;
                    endAt = nextSong.end;
                    player.setSize((nextSong.w ? "100%" : "75%"), "100%");
                    player.loadVideoById({
                        "videoId": nextSong.id,
                        "startSeconds": startAt,
                        "endSeconds": endAt
                    });
                }
            }
        }
    });
}

function fullscreen_func() {
    if (!window.fullScreen) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
}
