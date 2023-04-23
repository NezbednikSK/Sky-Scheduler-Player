function resizing() {
    var player = document.getElementById("player");

    var preferredWidth = Math.floor(window.innerHeight * (16/9));
    var _width = ((window.innerWidth - preferredWidth) / 2) | 0;
    
    if (_width >= 0) {
        player.style.marginLeft = _width + "px";
        player.style.marginTop = "0px";
        player.style.width = preferredWidth + "px";
        player.style.height = window.innerHeight + "px";
    }
    else {
        var preferredHeight = Math.floor(window.innerWidth * (9/16));
        var _height = ((window.innerHeight - preferredHeight) / 2) | 0;

        player.style.marginLeft = "0px";
        player.style.marginTop = _height + "px";
        player.style.width = window.innerWidth + "px";
        player.style.height = preferredHeight + "px";
    }
}

window.addEventListener("resize", resizing);
window.addEventListener("DOMContentLoaded", resizing);
