function id(obj) {
    return document.getElementById(obj);
}
function bind(obj, ev, fn) { 
    if (obj.addEventListener) {
        obj.addEventListener(ev, fn, false);
    } else {
        obj.attachEvent('on' + ev, function() {
            fn.call(obj);
        });
    }
}

function view() {
    return {
        w: document.documentElement.clientWidth,
        h: document.documentElement.clientHeight
    };
}
function addClass(obj, sClass) { 
    var aClass = obj.className.split(' ');
    if (!obj.className) {
        obj.className = sClass;
        return;
    }
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) return;
    }
    obj.className += ' ' + sClass;
}

function removeClass(obj, sClass) { 
    var aClass = obj.className.split(' ');
    if (!obj.className) return;
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) {
            aClass.splice(i, 1);
            obj.className = aClass.join(' ');
            break;
        }
    }
}
// 入场动画
var iTime=new Date().getTime();
var Wo = id('welcome');
var arr = [""];
var Bimg = true;
var Btime = false;
var timer = 0;
bind(Wo,'transitionend',end);
bind(Wo,'webkitTransitionEnd',end);
timer= setInterval(function(){
	if(new Date().getTime()-iTime>=4000){
		Btime = true;
	}
	if(Bimg&&Btime){
		clearInterval(timer);
		Wo.style.opacity = 0;
	}
},1000)
function end(){
	removeClass(Wo,"pageShow");
	fnTab();
}
// 首页
function fnTab(){
	var tabFj = id('tabFj');
	var Fjlist = id('Fjlist');
	var as = tabFj.getElementsByTagName('nav')[0].children;
	var aNow = 0;
	var ax = 0;
	var aw = view().w;
	var timer = 0;
	var touchX = 0;
	var startX = 0;
	if(!window.BfnScore){
		fnscore();
		window.BfnScore = true;
	}
	
	timer = setInterval(function(){
		aNow++;
		aNow = aNow%as.length;
		tab()
	},2000)
	bind(tabFj,"touchstart",fnstart);
	bind(tabFj,"touchmove",fnmove);
	bind(tabFj,"touchend",fnend);
	function tab(){
		ax = -aNow*aw;
		Fjlist.style.transition = '0.5s';
		Fjlist.style.WebkitTransform=Fjlist.style.transform="translateX("+ax+"px)";
		for (var i=0;i<as.length;i++) {
			removeClass(as[i],"active")
		}
		addClass(as[aNow],"active")
	}
	function fnstart(ev){
		clearInterval(timer);
		ev = ev.changedTouches[0];
		touchX = ev.pageX;
		startX = ax;
		Fjlist.style.transition="none";
	}
	function fnmove(ev){
		ev = ev.changedTouches[0];
		var dis = ev.pageX - touchX;
		ax = startX+dis;
		Fjlist.style.WebkitTransform=Fjlist.style.transform="translateX("+ax+"px)";
	}
	function fnend(){
		aNow = -Math.round(ax/aw);
		if(aNow<0){
			aNow = 0;
		}
		if(aNow>as.length-1){
			aNow = as.length-1;
		}
		tab();
		timer = setInterval(function(){
			aNow++;
			aNow = aNow%as.length;
			tab()
		},2000);
	}
}
function fnscore(){
	var score = id("score");
	var lis = score.getElementsByTagName('li');
	var arr=["好失望","没有想象的那么差","很一般","良好","棒极了"];
	for (var i=0;i<lis.length;i++) {
		fn(lis[i]);
	} 
	function fn(oli){
		var as1 = oli.getElementsByTagName('a');
		var Oinput = oli.getElementsByTagName('input')[0];
		for (var i = 0;i<as1.length;i++) {
			as1[i].index = i;
			bind(as1[i],"touchstart",function(){
				for (var i = 0;i<as1.length;i++) {
					if(i<=this.index){
						addClass(as1[i],'active');
					}else{
						removeClass(as1[i],'active');
					}
				}
				Oinput.value = arr[this.index];
				
			});
		}
		fnindex();
	}
}
function fninfo(oInfo,sInfo){
	oInfo.innerHTML = sInfo;
	oInfo.style.WebkitTransform="scale(1)";
	oInfo.style.opacity = 1;
	setTimeout(function(){
		oInfo.style.WebkitTransform="scale(0)";
		oInfo.style.opacity=0;
	},1500);
}
function fnindex(){
	var indexs = id('index');
	var Btn = indexs.getElementsByClassName('btn')[0];
	var Info = indexs.getElementsByClassName('info')[0];
	var Bscore = false;
	bind(Btn,'touchend',fnend);
	function fnend(){
		Bscore = pingfen();
		if(Bscore){
			if(bTag()){
				fnindexout();
			}else{
				fninfo(Info,'给景区添加标签');
			}
		}else{
			fninfo(Info,'给景区评分');
		}

	}
	//评分有木有被选中
	function pingfen(){
		var Oscore = id('score');
		var Inputs = Oscore.getElementsByTagName('input');
		for (var i=0;i<Inputs.length;i++) {
			if(Inputs[i].value==0){
				return false;
			}
		}
		return true;
	}
	//单选有木有被选中
	function bTag(){
		var Otag = id('tag1');
		var inputs = Otag.getElementsByTagName('input');
		for (var i=0;i<inputs.length;i++) {
			if(inputs[i].check){
				return false;
			}
		}
		return true; 
	}
}
function fnindexout(){
	var Mask = id("masks");
	var Index = id("index");
	var New = id("news");
	addClass(Mask,"pageShow");
	addClass(New,"pageShow");
	fnnews()
	setTimeout(function(){
		Mask.style.opacity = 1;
		Index.style.WebkitFilter=Index.style.filter="blur(5px)";
	},14)
	setTimeout(function(){
		New.style.transition="0.5s";
		Mask.style.opacity=0;	
		Index.style.WebkitFilter=Index.style.filter="blur(0px)";	
		New.style.opacity=1;
		removeClass(Mask,"pageShow");
	},3000);
}
function fnnews(){
	var New = id("news");
	var Info = New.getElementsByClassName('info')[0];
	var Inputs = New.getElementsByTagName('input');
	
	Inputs[0].onchange = function(){
		if(this.files[0].type.split("/")[0]=="video"){
			fnnewsout();
			this.value="";
		}else{
			fninfo(Info,"请上传视频");
		}
	}
	Inputs[1].onchange = function(){
		if(this.files[0].type.split("/")[0]=="image"){
			fnnewsout();
			this.value="";
		}else{
			fninfo(Info,"请上传图片");
		}
	}
}
function fnnewsout(){
	var New = id("news");
	var from = id("from");
	addClass(from,"pageShow");
	New.style.cssText="";
	removeClass(New,'pageShow');
	formIn();
}
function formIn(){
	var Form = id('from');
	var End = id('end');
	var FormTag = id('fromTag').getElementsByTagName('label');
	var Btn = Form.getElementsByClassName('btn')[0];
	var boff = false;
	for(var i = 0;i<FormTag.length;i++){
		bind(FormTag[i],"touchend",function(){
			boff=true;
			addClass(Btn,"submit");
		});
	}
	bind(Btn,'touchend',function(){
		if(boff){
			for(var i=0;i<FormTag.length;i++){
				FormTag[i].getElementsByTagName('input')[0].checked = false;
			}
			boff = false;
			addClass(End,"pageShow");
			removeClass(Form,"pageShow");
			removeClass(Btn,"submit");
			over()
		}
	})
	
}
function over(){
	var end = id('end');
	var Btn = end.getElementsByClassName('btn')[0];
	bind(Btn,'touchend',function(){
		removeClass(end,'pageShow');
	});
}
