var browser="";
var page_type=0;
var num_text=0;
var pop_text=0;
var pageid=0;
var inum_tab=0;
var varKeyCode=0;
var js_file=0;
var iclassnone=1;
var coursename="";
var c=0;
/*******************/
// Global Functions   
function MM_swapImgRestore() { //v3.0

  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

function MM_findObj(n, d) { //v4.0
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && document.getElementById) x=document.getElementById(n); return x;
}

function tmt_findObj(n){
	var x,t; if((n.indexOf("?"))>0&&parent.frames.length){t=n.split("?");
	x=eval("parent.frames['"+t[1]+"'].document.getElementById('"+t[0]+"')");
	}else{x=document.getElementById(n)}return x;
}

function MM_showHideLayers() { //v3.0A Modified by Al Sparber and Massimo Foti for NN6 Compatibility
  var i,p,v,obj,args=MM_showHideLayers.arguments;if(document.getElementById){
   for (i=0; i<(args.length-2); i+=3){ obj=tmt_findObj(args[i]);v=args[i+2];
   v=(v=='show')?'visible':(v='hide')?'hidden':v;
   if(obj)obj.style.visibility=v;}} else{
  for (i=0; i<(args.length-2); i+=3) if ((obj=MM_findObj(args[i]))!=null) { v=args[i+2];
    if (obj.style) { obj=obj.style; v=(v=='show')?'visible':(v='hide')?'hidden':v; }
    obj.visibility=v; }}
}

function MM_setTextOfLayer(objName,x,newText) {//v3.0A Modified by Uncle Massimo and packaged by Uncle Al  for NN6 Compatibility
  var obj = (document.getElementById) ? tmt_findObj(objName) : MM_findObj(objName);
  if (obj!=null) with (obj)
    if (document.layers) {alert();document.write(unescape(newText)); document.close();}
    else innerHTML = unescape(newText);
}
/********************/



function showLayer(lyrId,typ)
{
//alert("show");
		var layerNm ='', dislayerNm='';
		layerNm = 'click'+lyrId;
		dislayerNm = 'disbutton'+lyrId;

		if(typ==0)
			{
			
			MM_showHideLayers(layerNm,'','hide');
			MM_showHideLayers(dislayerNm,'','hide');
			}
			 
		else
			{
		
			MM_showHideLayers(layerNm,'','show');
			MM_showHideLayers(dislayerNm,'','show');

			}
	

}

function writePageText()
{

var lyrName="";
var lyr;
var str="";


for(var i=0;i<arrtext.length;i++){
	lyrName="click"+ (i+1);
	lyr=eval(lyrName);

if(iclassnone==1)
	str="<span class='normaltext'>" + arrtext[i] + "</span>";
else	
	str=arrtext[i];


str=str+'<a href="javascript:showLayer('+eval(i+1)+',0)" tabindex='+eval(inum_tab*(i+1))+'><img src="../images/closenew.jpg" border="0" alt="Close" title="Close" align="right" valign="bottom" name="close'+i+'"></a>'


	MM_setTextOfLayer(lyrName,'',str);
	}
}


function openNewUrl(file,w,h)
{

	var wn=window.open(file, 'Pop_Url', 'width='+w+',height='+h+',scrollbars=1,resizable=0,menubar=0,toolbar=0,location=0,status=0,top=40,left=40');
	//wn.focus();

}	


function closeLayer()
{

				MM_showHideLayers("click",'','hide');

					

}


function closewindow()
{
			if(window.confirm("Are you sure you want to Close the window?"))
				self.close();
		
}

// Browser Detection Javascript
// copyright 1 February 2003, by Stephen Chapman, Felgall Pty Ltd

// You have permission to copy and use this javascript provided that
// the content of the script is not changed in any way.

function whichBrs() {

var agt=navigator.userAgent.toLowerCase();
if (agt.indexOf("opera") != -1) return 'Opera';
if (agt.indexOf("staroffice") != -1) return 'Star Office';
if (agt.indexOf("beonex") != -1) return 'Beonex';
if (agt.indexOf("chimera") != -1) return 'Chimera';
if (agt.indexOf("netpositive") != -1) return 'NetPositive';
if (agt.indexOf("phoenix") != -1) return 'Phoenix';
if (agt.indexOf("firefox") != -1) return 'Firefox';
if (agt.indexOf("safari") != -1) return 'Safari';
if (agt.indexOf("skipstone") != -1) return 'SkipStone';
if (agt.indexOf("msie") != -1) return 'Internet Explorer';
if (agt.indexOf("netscape") != -1) return 'Netscape';
if (agt.indexOf("mozilla/5.0") != -1) return 'Mozilla';
if (agt.indexOf('\/') != -1) {
if (agt.substr(0,agt.indexOf('\/')) != 'mozilla') {
return navigator.userAgent.substr(0,agt.indexOf('\/'));}
else return 'Netscape';} else if (agt.indexOf(' ') != -1)
return navigator.userAgent.substr(0,agt.indexOf(' '));
else return navigator.userAgent;
}



function MM_showHideLayers() { //v6.0
  var i,p,v,obj,args=MM_showHideLayers.arguments;
  for (i=0; i<(args.length-2); i+=3) if ((obj=MM_findObj(args[i]))!=null) { v=args[i+2];
    if (obj.style) { obj=obj.style; v=(v=='show')?'visible':(v=='hide')?'hidden':v; }
    obj.visibility=v; }
}


/*function showFunctions(vedioEnable,interactiveEnable,activityEnable,readingEnable)
{
		if(vedioEnable == 1)
			enable_vedio();
		else
			dis_vedio();
			
		if(interactiveEnable == 1)
			enable_interactive();
		else
			dis_interactive();
			
		if(activityEnable == 1)
		enable_activity();
		else
			 dis_activity();
			 
	 
			 if(readingEnable == 1)
		enable_reading();
		else
			 dis_reading();	

}

function enable_vedio()
{
	MM_showHideLayers('disVediolyr','','show');
}

function dis_vedio()
{
	MM_showHideLayers('lyrVedio','','show');
}


function enable_interactive()
{
	MM_showHideLayers('disinteractivelyr','','show');
}

function dis_interactive()
{
	MM_showHideLayers('lyrinteractive','','show');
}



function enable_activity()
{
	MM_showHideLayers('disactivitylyr','','show');
}

function dis_activity()
{
	MM_showHideLayers('lyractivity','','show');
}


function enable_reading()
{
	MM_showHideLayers('disreadinglyr','','show');
}

function dis_reading()
{
	MM_showHideLayers('lyrreading','','show');
}*/


