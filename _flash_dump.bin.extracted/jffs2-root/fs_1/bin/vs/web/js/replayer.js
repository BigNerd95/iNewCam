// JavaScript Document

function RePlayerOCX() {

    var PicWidth, PicHeight;
	var chn = 0;
	var firstLogin = 0;
    this.Load = function() {
        document.open();
        //btuuid str = '<object classid="clsid:DF384CEB-0AAA-428A-880A-C550929FB35F" ';
		str = '<object classid="clsid:6A85E800-DE22-48c2-9EED-25A900FFCD4F" ';
		
        //str += ' codebase="/qvipc.cab#version=1,0,1,26"';
        str += ' id="DHiMPlayer" align="absbottom"';
        str += 'width="' + GetRePlayerLayerWidthHeight().w + '" height="' + GetRePlayerLayerWidthHeight().h + '">';
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

    this.play = function(fileName, fileLength, fileTimeLength) {
        try {
				if(firstLogin == 0){
				if(document.location.port.length == 0){//port=80 will be return null
                    var port = 80;                                              
				}else{                                                              
					var port = parseInt(document.location.port);                
				}     
				
					DHiMPlayer.SetDeviceIPandPort(document.location.hostname,  port);
                	DHiMPlayer.Login(name0, password0);
					firstLogin = 1;
				}
				DHiMPlayer.PlayFile(fileName, fileLength, chn);
           
            return true;
        } catch(err) {
			alert(err);
            return false;
        }
        return true;
    }
	
	
	  this.Pause = function() {
       
        try {
				
				DHiMPlayer.Pause();
           
            return true;
        } catch(err) {
            return false;
        }
        return true;
    }
	
    this.Stop = function() {
        try {
              DHiMPlayer.Stop();
        } catch(e) {
            return false;
        }
        return true;
    }
	
	this.GetDownPos = function(){
		 try {
            return  DHiMPlayer.GetDownPos()+1;
        } catch(e) {
            return false;
        }
        return true;
	}
	this.GetPlayPos = function(){
		 try {
            return  DHiMPlayer.GetPlayPos()+1;
        } catch(e) {
            return false;
        }
        return true;
	}
	
	this.SetPlaySpeed = function(PlaySpeed){
		 try {
            return  DHiMPlayer.SetPlaySpeed(PlaySpeed);
        } catch(e) {
            return false;
        }
        return true;
	}
	this.NextFrame = function(){
		 try {
            return  DHiMPlayer.NextFrame();
        } catch(e) {
            return false;
        }
        return true;
	}
	this.SetPlayPos = function(pos){
		try {
            return  DHiMPlayer.SetPlayPos(pos);
        } catch(e) {
            return false;
        }
        return true;
	}
	
	
	this.SetVolume=function(vol){
		
			try {
            return   DHiMPlayer.SetVolume(vol);	
        } catch(e) {
            return false;
        }
        return true;
		
	
	}
	
     this.GetVideoWidthHeight = function() {
        return {
            w: PicWidth,
            h: PicHeight
        };
    }
	
	this.GetPlayState=function(vol){
		
			try {		 
			return  DHiMPlayer.GetPlayState();
        } catch(e) {
			//alert(e);
            return false;
        }
        return true;
		
	
	}
  
	
}

function RePlayerVLC() {
    var PicWidth, PicHeight;
	var CurRecTimeLength = 0;
    this.Load = function() {
        document.open();
        str = '<object classid="clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921" id="RePlayerVLCPlayer" ';
        str += 'width="' + GetRePlayerLayerWidthHeight().w + 'px" height="' + GetRePlayerLayerWidthHeight().h + 'px" events="True">';
        str += '<param name="MRL" value="" />';
        str += '<param name="Src" value="" />';
        str += '<param name="ShowDisplay" value="True" />';
        str += '<param name="AutoLoop" value="False" />';
        str += '<param name="AutoPlay" value="False" />';
        str += '<param name="Time" value="True" />';
        str += '<param name="toolbar" value="false">';

        str += '<embed pluginspage="http://www.videolan.org" type="application/x-vlc-plugin" ';
        str += ' version="VideoLAN.VLCPlugin.2" ';
        str += ' width=" ' + GetRePlayerLayerWidthHeight().w + ' px" height="' + GetRePlayerLayerWidthHeight().h + 'px" ';
        str += 'toolbar="false" ';
        str += ' text="Waiting for video" name="RePlayerVLCPlayer"> </embed> ';
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
    this.play = function(fileName, fileLength, fileTimeLength) {
      CurRecTimeLength = fileTimeLength;
        try {
            var vlc = this.getVLC("RePlayerVLCPlayer");
		
			if(vlc.input.state == 4){//pause->play
			vlc.input.rate = 1;
			vlc.playlist.togglePause();
		
			}
			else
			{
					var str = fileName.substr(7);
            itemId = vlc.playlist.add(str);
            vlc.playlist.playItem(itemId);
			vlc.input.rate = 1;
			}
        } catch(e) {
            return false;
        }
        return true;

    },
  
  	
	  this.Pause = function() {
       
        try {
				 var vlc = this.getVLC("RePlayerVLCPlayer");
				 if(vlc.input.state != 4)
          			vlc.playlist.togglePause();
					
            return true;
        } catch(err) {
            return false;
        }
        return true;
    }
	
    this.Stop = function() {
        try {
			 var vlc = this.getVLC("RePlayerVLCPlayer");
			 this.Pause();
              vlc.playlist.stop();
			  vlc.input.rate = 1;
        } catch(e) {
            return false;
        }
        return true;
    }
	
	this.GetDownPos = function(Length){
		 try {
              var vlc = this.getVLC("RePlayerVLCPlayer");
            return parseInt( ( vlc.input.time/ (parseInt(Length) * 1000 )) * 100);
        } catch(e) {
            return false;
        }
        return true;
	}
	this.GetPlayPos = function(Length){
		 try {
			  var vlc = this.getVLC("RePlayerVLCPlayer");
            return parseInt( ( vlc.input.time/ (parseInt(Length) * 1000 )) * 100);
        } catch(e) {
            return false;
        }
        return true;
	}
	
	this.SetPlaySpeed = function(PlaySpeed){
		 try {
           var vlc = this.getVLC("RePlayerVLCPlayer");
		  
		 switch(PlaySpeed){
			case 0:
				  vlc.input.rate = 1;
			break;
			case 1:
			 vlc.input.rate = 2;
			break;
			case 2:
			 vlc.input.rate = 4;
			break;
			case 3:
			vlc.input.rate = 8;
			break;	 
		}
		 
        } catch(e) {
            return false;
        }
        return true;
	}
	this.NextFrame = function(){
		 try {
//			   var vlc = this.getVLC("RePlayerVLCPlayer");
//				vlc.input.rate = 0.04;
//				vlc.playlist.togglePause();
        } catch(e) {
            return false;
        }
        return true;
	}
	this.SetPlayPos = function(pos){
		try {
   	  var vlc = this.getVLC("RePlayerVLCPlayer");
//	 vlc.input.time  = (parseInt(CurRecTimeLength) * 1000 ) * (pos/100);
	  

        } catch(e) {
            return false;
        }
        return true;
	}
	
	
	this.SetVolume=function(vol){
		
			try {
				  var vlc = this.getVLC("RePlayerVLCPlayer");
				vlc.audio.volume = vol*2;//0~200
        } catch(e) {
			//alert(e);
            return false;
        }
        return true;
		
	
	}
	
	this.GetPlayState=function(vol){
		/************会做一个转换，适配IE控件的返回值************/
			try {
				  var vlc = this.getVLC("RePlayerVLCPlayer");
			if( vlc.input.state == 3){//play
				if(vlc.input.rate == 1)//normal play
					return  1;
				else
					return 3;	
			}else if( vlc.input.state == 4){//pause
				return 2;
			}else if( vlc.input.state == 5){//stop
				return 0;
			}
			
        } catch(e) {
			//alert(e);
            return false;
        }
        return true;
		
	
	}
  
  
}

function RePlayerObj() {
    var Player;
    if (GetBrowserVer().brower == "IE") Player = new RePlayerOCX();
    else Player = new RePlayerVLC();

    this.Load = function() {
        return Player.Load();
    }

    this.Play = function(fileName, fileLength, fileTimeLength) {
        return Player.play(fileName, fileLength, fileTimeLength);
    }
	this.Pause = function(){
		 return Player.Pause();
	}
	this.Stop = function(){
		 return Player.Stop();
	}
	this.GetDownPos = function(Length){
		 return Player.GetDownPos(Length);
	}
	this.GetPlayPos = function(Length){
		 return Player.GetPlayPos(Length);
	}
	this.SetPlaySpeed=function(PlaySpeed){
		return Player.SetPlaySpeed(PlaySpeed);	
	}
	this.NextFrame=function(){
	
		return Player.NextFrame();	
	}
	this.SetPlayPos=function(pos){
		return Player.SetPlayPos(pos);	
	}
	this.SetVolume=function(vol){
		return Player.SetVolume(vol);	
	}
	this.GetPlayState=function(vol){
		return Player.GetPlayState(vol);	
	}
	
}

var RePlayer = new RePlayerObj();


function LoadPlayer() {
    return RePlayer.Load();
}

function Play(fileName, fileLength, fileTimeLength)
{
	return RePlayer.Play(fileName, fileLength, fileTimeLength);
}

function Pause()
{
	return RePlayer.Pause();
}

function Stop()
{
	return RePlayer.Stop();
}

function GetDownPos(Length)
{
	return RePlayer.GetDownPos(Length);
}

function GetPlayPos(Length)
{
	return RePlayer.GetPlayPos(Length);
}
function SetPlaySpeed(PlaySpeed)
{
	return RePlayer.SetPlaySpeed(PlaySpeed);
}
function NextFrame()
{
	return 	RePlayer.NextFrame();
}
function SetPlayPos(pos)
{
	return 	RePlayer.SetPlayPos(pos);
}

function SetVolume(vol)
{
	return 	RePlayer.SetVolume(vol);
}

function GetPlayState()
{
	return 	RePlayer.GetPlayState();
}

