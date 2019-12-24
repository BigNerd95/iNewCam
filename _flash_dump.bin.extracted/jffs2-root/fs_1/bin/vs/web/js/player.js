// JavaScript Document
/*
afx_msg void OnSUrlChanged();
	afx_msg void InvalidateWnd();
	afx_msg long OpenMDSetPage(long lOpenTag, long lLanguage, long lSensor);
	afx_msg void Snapshot();
	afx_msg void SetWndPos(long lLeft, long lTop, long lRight, long lBottom);
	afx_msg long Record(long lMode);
	afx_msg void Play();
	afx_msg void Stop(long lDestroyFlag);
	afx_msg long ShowRatio();
	afx_msg long GetVersion(long FAR* plVerInfo, long lLen);
	afx_msg BOOL SetUrl(LPCTSTR sUrl, long lPort, long lChn);
	afx_msg long GetPlayState(long FAR* plFps, long FAR* plBps);
	afx_msg long PlayBack();
	afx_msg long PauseVideo(long lVideoTag);
	afx_msg long PauseAudio(long lAudioTag);
	afx_msg void SetColor();
	afx_msg long StartTalk();
	afx_msg long StopTalk();
	afx_msg long SetVolume(long lDir, long lVolume);
	afx_msg long GetVolume(long lDir, long FAR* plVolume);
	afx_msg long SetMute(long lDir, long lMute);
	afx_msg long GetMute(long lDir, long FAR* plMute);
	afx_msg long GetRecState();
**/

function OCX() {

    var PicWidth, PicHeight;

    this.Load = function() {
        document.open();
        //str = '<object classid="clsid:D1B45656-348B-4700-BD73-623A8378870A" ';
		str = '<object classid="clsid:5A3BCA6B-36CF-4447-BFFB-A66FF59AC84B" ';
        //str += ' codebase="/qvipc.cab#version=1,0,1,26"';
        str += ' id="DHiMPlayer" align="absbottom"';
        str += 'width="' + GetPlayerLayerWidthHeight().w + '" height="' + GetPlayerLayerWidthHeight().h + '">';
        str += ' <param name="_Version" value="65536">';
        str += ' <param name="_ExtentX" value="8890">';
        str += ' <param name="_ExtentY" value="7461">';
        str += ' <param name="_StockProps" value="0">';
        str += ' <embed src="65536"  align="middle" _version="65536" ';
        str += ' width="0" height="0" _extentx="10954" _extenty="6826" _stockprops="0"> ';
        str += ' </object>';
        document.write(str);
        document.close();
    }

    this.play = function(width, height) {
        switch (GetPlayStream()) {
        case '11':
            playchn = 11;
            break;
        default:
        case '12':
            playchn = 12;
            break;
        }
        PicWidth = width;
        PicHeight = height;

        try {
            if (GetBrowserVer().ver == "6.0") { //FUCK IE6
                setTimeout(function() {
                    DHiMPlayer.SetUrl("http://" + document.location.host, 80, playchn);
                    DHiMPlayer.SetWndPos(0, 0, PicWidth, PicHeight);
                    //DHiMPlayer.OpenMdSetPage(0, 0, 0);
                    DHiMPlayer.Play();
					DHiMPlayer.SetMute(0, 1);
					DHiMPlayer.StopTalk();
                },
                1000)
            } else {
                DHiMPlayer.SetUrl("http://" + document.location.host, 80, playchn);
                DHiMPlayer.SetWndPos(0, 0, PicWidth, PicHeight);
                //DHiMPlayer.OpenMdSetPage(0, 0, 0);
                DHiMPlayer.Play();
				DHiMPlayer.SetMute(0, 1);
				DHiMPlayer.StopTalk();
            }
            return true;
        } catch(err) {
            return false;
        }
        return true;
    }
    this.StopPlay = function() {
        try {
            //   DHiMPlayer.stop();
        } catch(e) {
            return false;
        }
        return true;
    }
    this.Record = function() {
        try {
            DHiMPlayer.Record(0);
            return DHiMPlayer.GetRecState();
        } catch(e) {
            return false;
        }
        return true;

    }
    this.Snap = function() {
        try {
            DHiMPlayer.Snapshot();
        } catch(e) {
            return false;
        }
        return true;
    }
    this.PlayBack = function() {
        try {
            DHiMPlayer.PlayBack();
        } catch(e) {
		alert(e);
            return false;
        }
        return true;
    }
    this.SetVolume = function(stat) {
        try {
            /*0:on 1:off*/
            DHiMPlayer.SetVolume(stat);
        } catch(e) {
            return false;
        }

        return true;
    }
    this.SetMute = function(stat) {
        try {
            /*0:on 1:off*/
            DHiMPlayer.SetMute(0, stat);
        } catch(e) {
            return false;
        }
        return true;
    }
    this.PlayerResize = function(width, height) {
        try {
            PicWidth = width;
            PicHeight = height;
            DHiMPlayer.SetWndPos(0, 0, width, height);
        } catch(e) {
            return false;
        }
        return true;
    }
    this.StartTalk = function(bStart) {
        try {
            if (bStart == 1) DHiMPlayer.StopTalk();
            else DHiMPlayer.StartTalk();
        } catch(e) {
            return false;
        }
        return true;
        return true;
    }
    this.GetVideoWidthHeight = function() {
        return {
            w: PicWidth,
            h: PicHeight
        };
    }
}

function VLC() {
    var PicWidth, PicHeight;
	
    this.Load = function() {
        document.open();
        str = '<object classid="clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921" id="VLCPlayer" ';
        str += 'width="' + GetPlayerLayerWidthHeight().w + 'px" height="' + GetPlayerLayerWidthHeight().h + 'px" events="True">';
        str += '<param name="MRL" value="" />';
        str += '<param name="Src" value="" />';
        str += '<param name="ShowDisplay" value="True" />';
        str += '<param name="AutoLoop" value="False" />';
        str += '<param name="AutoPlay" value="False" />';
        str += '<param name="Time" value="True" />';
        str += '<param name="toolbar" value="false">';

        str += '<embed pluginspage="http://www.videolan.org" type="application/x-vlc-plugin" ';
        str += ' version="VideoLAN.VLCPlugin.2" ';
        str += ' width=" ' + GetPlayerLayerWidthHeight().w + ' px" height="' + GetPlayerLayerWidthHeight().h + 'px" ';
        str += 'toolbar="false" ';
        str += ' text="Waiting for video" name="VLCPlayer"> </embed> ';
        str += '</object>';
        document.write(str);
        document.close();
    }

    this.getVLC = function(name) {
        if (window.document[name]) {
            return window.document[name];
        }
        if (navigator.appName.indexOf("Microsoft Internet") == -1) {
            if (document.embeds && document.embeds[name]) return document.embeds[name];
        } else // if (navigator.appName.indexOf("Microsoft Internet")!=-1)
        {
            return document.getElementById(name);
        }
    },
    this.play = function(width, height) {
	  var cgiurl = "cgi-bin/hi3510/getrtsplisnport.cgi";
     var port = 554;   
		$.ajax({   
        url:cgiurl,   
        type: "GET",   
        dataType:"text",   
        timeout: 3000,   
        error: function(data){},        
        success: function(data){eval(data); port = rtsplisnport;},
		 async:false
	})

        switch (GetPlayStream()) {
        case '11':
            playchn = 11;
            break;
        default:
        case '12':
            playchn = 12;
            break;
        }
        PicWidth = width;
        PicHeight = height;
        try {
		
            var vlc = this.getVLC("VLCPlayer");
            itemId = vlc.playlist.add("rtsp://" + document.location.hostname + ":" + port + "/" + playchn);
            vlc.playlist.playItem(itemId);
        } catch(e) {
            return false;
        }
        return true;

    },
    this.StopPlay = function() {
        try {
            var vlc = getVLC("VLCPlayer");
            vlc.playlist.stop();
        } catch(e) {
            return false;
        }

    },
    this.Record = function() {return false;},
    this.Snap = function() {return false;},
    this.PlayBack = function() {return false;},
    this.SetVolume = function(stat) {return false;},
    this.SetMute = function(stat) {return false;},
    this.PlayerResize = function(width, height) {
        try {

            PicWidth = width;
            PicHeight = height;
            var vlc = this.getVLC("VLCPlayer");
            vlc.style.width = width;
            vlc.style.height = height;

        } catch(e) {
            return false;
        }

    },
    this.GetVideoWidthHeight = function() {
        return {
            w: PicWidth,
            h: PicHeight
        };
    },
    this.StartTalk = function(bStart) {return false;}
}

function PlayerObj() {
    var Player;
    if (GetBrowserVer().brower == "IE") Player = new OCX();
    else Player = new VLC();

    this.Load = function() {
        return Player.Load();
    }

    this.Play = function(width, height) {
        return Player.play(width, height);
    }
    this.StopPlay = function() {
        return Player.StopPlay();
    }
    this.PlayerResize = function(w, h) {
        return Player.PlayerResize(w, h);
    }

    this.GetVideoWidthHeight = function() {
        return Player.GetVideoWidthHeight();
    }
    this.Record = function() {
        return Player.Record();
    }
    this.Snap = function() {
        return Player.Snap();
    }
    this.StartTalk = function(stat) {
        return Player.StartTalk(stat);
    }
    this.SetMute = function(stat) {
        return Player.SetMute(stat);
    }
	 this.PlayBack = function() {
        return Player.PlayBack();
    }
}
