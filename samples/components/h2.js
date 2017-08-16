/*
 _ _ _ _____ ____  _____ _____ _____ _____ ____  
| | | |     |    \|   __|__   |  _  | __  |    \ 
| | | |-   -|  |  |  |  |   __|     |    -|  |  |
|_____|_____|____/|_____|_____|__|__|__|__|____/
												v.0.2
*
* @build 16/8/2017
* @author Federico Ghedina <federico.ghedina@gmail.com>
* Y 2017
* ~0KB
*/
var t={tag:"h2",html:"#PARAM{html}",data:{times:0},cb:function(){var t=this,i=t.node;EW.events.on(i,"click",function(){var n=++t.data.times;i.innerHTML="clicked "+n+" time"+(1==n?"":"s")}),this.done()}};