<img src="http://www.freakstyle.it/wp-content/uploads/2015/02/2000px-Sorted_binary_tree_postorder.svg_-1024x874.png" alt="2000px-Sorted_binary_tree_postorder.svg" width="605" height="516" class="alignleft size-large wp-image-511" />

I want to talk about a javascript module I wrote and his evolution over the time. That mainly concerns DOM creation enhanced with some useful tools.

The first requirement for me at the very beginning was to have a function to create an arbitrary tree into an arbitrary node, giving as parameters all the informations needed in a object literal. That is pretty straightforward, can be done in many ways, the choice and the implementation will mainly determine the efficiency of the creation loop, I'm not here to discuss that, but one important aspect that should not be forgiven is to use a documentFragment as main container. A basic sample of usage could be, given a node with id `targetNode`

    <div id="targetNode"> ... </div>
    

engage such a function passing something like:

    {
        target : document.getElementById('targetNode'),
        content : [
            {html : 'Hello'},
            {html : ' - '},
            {html : 'World'}
        ]
    }
    

to obtain

    <div id='targetNode'>
        <div>Hello</div>
        <div>-</div>
        <div>World</div>
    </div>
    

... not so interesting having all *divs*, no deepness, and moreover having poor control on em, what if we want simply to do something at click on *World*?

Maybe it would not be a bad idea if the basic node would have a structure like (I'll call it from now on _Wnode_) :

	{
		target : myDOMnode,
		tag : 'p', /* div will be the default */
		style : {/* literal of style for that node */},
		attrs : {/* literal of attributes for that node, but style */},
		html : '<strong>First content</strong>',
		text : 'Second content',
		content : [Wnode1, ..., ..., WnodeN],
		wid : 'aIdentifyingString',
		data : {}, /* a data literal */
		cb : function () { ... }, /* solving function */
    	init : function () { ... }, /* init function */
		end : function () { ... } /* end function */
	}  
  
  
  

where:


| label | description
|:-----------|------------
|_target_|for the root node can be any existing node in the DOM, if not specified will be used _document.body_, for all others if not specified is the parent Wnode, but could be an existing node anywhere in the DOM (maybe previously created by another render)
|_tag_|used only in inner nodes
|_style_|object literal for inline styles
|_attrs_|usage is obvious
|_html_|will set the innerHTML, useful mainly next to the leafs
|_text_|will append a TextNode, containing the String passed, to the corresponding node
|_content_|an array containing any number of **Wnodes**, as deep as needed
|_wid_|a string that will be useful to let this node be referenced from within any cb of any node in the created tree
|_data_|a storage object
|_cb_|a function called at **some right time**, with as context an object that can easily reference the DomNode just created, and do much more
|_init_|a function called when the node is created (but not appended yet)
|_end_|a function called when rendering has completed and after the root callback has finished|

**NOTE** : All parameters are OPTIONALS

---

###When should come that **some right time** for the callback execution?

To me it seems fine to set that "right time" the moment when all child nodes have executed their callbacks, and that corresponds to a callbacks call in a postorder traversal.

The way a Wnode that specifies a callback frees his parent (for what concerns him) is a call to:

    this.solve(); //or an alias like done/resolve
    

this can be obtained through a simple implementation of a chain of promises, where a non-leaf node automatically execute his callback only when all his child Wnodes explicitly declare that they`ve finished their work, recursion is our friend.

Let's try to put all together and write a minimal interesting example:

    {
        target : document.getElementById('targetNode'),
        style : {backgroundColor:'red'},
        attrs : {'data-id' : 'ID-1234'},
        content : [{
           tag : 'p',
           wid : 'tit', //let it be referenced from others node
           text : 'From 0 to 9:'
           // no cb specified, autoresolved when ul cb will solve
        },{
           tag : 'ul',
           cb : function () {
               console.log ('ul created');
    
               var l = ~~(Math.random() * 10);
    
               // get the reference to the p and use it
               this.getNode('wid').node.innerHTML = 'From 0 to '+ (l - 1);
    
               // here the ul exists and is accessible as this.node
               for (var i = 0, e; i < l; i++) {
                   e = document.createElement('li');
                   e.innerHTML = i;
                   this.node.appendChild(e);
               }
               console.log ('... and filled. ');
               
               this.solve(); // trying to remove it You will not get anything rendered
           }
        }],
        cb : function () {
          console.log('Everything solved');
          // being the root cb a _solve_ call is useless
        }
    }
    

and obtain

    <div id='targetNode' style="background-color:red" data-id="ID-1234">
        <p>From 0 to 6</p>
        <ul>
            <li>0</li>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
            <li>6</li>
        </ul>
    </div>
    

Somehow is an hybrid sample seen we're still using createElement explicitly, later the solutions will be straightforward. What properties and functions will be available from within a callback context? We used the *node* property and the *getNode* and *solve* functions ... but there is more:

*   **properties**
    
    *   *node* : a reference to the DOMnode related
    *   *parent* : a reference to the parent Wnode (if not root)
    *   *root* : a reference to the Wnode associated with the target node
    *   *data* : a reference to the data object literal that maybe has been passed or filled later
    *   *wid* : the Wnode identifier, can be set lately calling te _lateWid_ function

*   **functions**
    
    *   *getNode(String wid)* : allows to get a reference to any involved Wnode, given the *wid* passed belongs to some Wnode
    *   *getNodes()* : get an object literal with all the objects that can be referenced by their wid
    *   *climb(Int n = 1)* : steps up by a number of hops as specified by the natural parameter passed
    *   *descendant()* : accepts any number of non negative integers, each one will specify the position of the child to dig into
    *   *abort()* : stops the callback chain, thus rendering, recovers the original html if present
    *   *done()* : solves te promise (alias: solve, resolve)
    *   *lateWid(String wid)* : allows to assign a *wid* to a node programmatically

* * *

## The module

Everything is enclosed into a javascript module called *Widgzard* , yes quite unspeakable, which has the following public methods:

- **Widgzard.render(Object conf, Boolean clean)**  
	engage the rendering with the instructions given by the configuration Object literal; the second parameter if set to true
	
- **Widgzard.get(Object conf)**  
	get the complete dom tree that would be created without appending it anywhere

- **Widgzard.load(String urlConf)**  
	get the conf file from a url and renders

- **Widgzard.htmlspecialchars(String str)**  
	useful to replace all characters that should be encoded as html chars when using the *html* property in a Wnode.

***

## The path to get real

A real example can be found <a href="http://www.jmvc.org/widgzard/sample/" target="_blank">here</a>. The whole page is created with the Widgzard, as well the samples menu comes from a Widgzard.load call and all the 3 samples too.
  
  
## Scent of components

Somehow a _Wnode_ configuration file can contain every information needed to render a component and set its behavior, completely. But if for example we have an element representing a book review card as :

    <div class="bookReview">
    	<img src="somePathToBook1" class="bookImage">
    	<div>
    		<h3>ISBN-123456789</h3>
    		<p>Lorem ipsum sit amet..... </p>
    	</div>
    </div>
    	
Noone would write down a json with more than 2 books, so **something** more is needed.  

We write one file _book.js_ containing a template object like: 

    var myBook = {
    	tag : "div",
    	attrs : {"class" : "bookReview"},
    	content : [{
    		tag : "img",
    		attrs : {
    			"class" : "bookImage",
    			src : "#PARAM{imageSrc}"
    		}
    	},{
			content : [{
				tag : "h3",
				html : "#PARAM{cnt.isbn|No isbn given}"
			},{
				tag : "p",
				html : "#PARAM{cnt.description}"
			}]
    	}]
    }
   
then we could obtain from the server only necessary data (I suppose here to get a json but for xml is almost the same) like :  

	[{
		imageSrc : "pathToimage1",
		cnt : {
			isbn : "ISBN - 3289j238d2f94h23",
			description : "Wonderful book"
		}
	},{
		.... 
	},
	...,
	...
	]
	
now there is everything needed, we have only to quickly build it using another function called __Engy.process__  

	Engy.process({
		target : document.getElementById('trg1'),
		content : [{
			component: "bookcontainers",
			params : {
				books : [books]
			}
		}]
	});