System.register(["./index-legacy-DB93JEaN.js"],(function(t,e){"use strict";var n,r,i;return{setters:[t=>{n=t.i,r=t.a,i=t.d}],execute:function(){
/*!
             * (C) Ionic http://ionicframework.com - MIT License
             */
t("createSwipeBackGesture",((t,e,s,o,c)=>{const a=t.ownerDocument.defaultView;let u=n(t);const d=t=>u?-t.deltaX:t.deltaX;return r({el:t,gestureName:"goback-swipe",gesturePriority:101,threshold:10,canStart:r=>(u=n(t),(t=>{const{startX:e}=t;return u?e>=a.innerWidth-50:e<=50})(r)&&e()),onStart:s,onMove:t=>{const e=d(t)/a.innerWidth;o(e)},onEnd:t=>{const e=d(t),n=a.innerWidth,r=e/n,s=(t=>u?-t.velocityX:t.velocityX)(t),o=s>=0&&(s>.2||e>n/2),l=(o?1-r:r)*n;let h=0;if(l>5){const t=l/Math.abs(s);h=Math.min(t,540)}c(o,r<=0?.01:i(0,r,.9999),h)}})}))}}}));
