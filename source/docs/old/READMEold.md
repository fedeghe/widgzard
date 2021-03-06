# WIDGZARD  

![postoreder walk](media/img/Sorted_binary_tree_postorder.svg "postorder walk")


Widgzard is a simple module, which allows to build arbirary DOM tree through components with their own lifecycle.   

---

Widgzard is perfect if: 

- want to render arbitrary dom trees from literal objects and attach it somewhere. 

- each component needs to exploit his own and others component lifecycle

- all components can comunicate in a clear way

---

The _Widgzard_ aims to solve the problem in a clear way, receiving a main object literal containing all is needed to get whatever is needed really fast.  

As usual here is the due `hello world`:

```
<div id="trg"></div>
<script>
(function () {
	var trg = document.getElementById('trg'),
		W = getWidgzard();

	W.Widgzard.render({
		target: trg,
		content: [{
			text: "Hello world" 
		}]
	});
})();
</script>
```

Every node has basically the following structure  

	{
		// OPTIONAL, div is the default
		tag : 'span', 	
		
		// OPTIONAL
		attrs : {
			id : 'myid',
			"class" : "superspan"
		},
		
		// OPTIONAL, can be set inside attrs
		style : {
			color : '#f60'
		},
				
		// SEMI-MANDATORY (at least this or the next, or even both)
		html : '<h1>hello world</h1>',
		
		text : 'hello world',
		
		// SEMI-MADATORY (at least this or the previous, or even both)
		// HINT: `html` and `content` can coexist, the `html` will be appended
		// before appending childs in `content`
		content : [one or more elements like this]

		// OPTIONAL
		// The callback executed:
		// at node creation if is a leaf
		// or when all childs has claimed they`ve
		// finished their work.
		// Inside that function the scope is the Wnode itself
		// and to declare the work has been done, the user must 
		// explicitly call the `done` function from the callback`s
		// scope.
		cb : function () {
			var self = this;
			...
				...
					async func body here {
						
			  			// use data and then explicitly declare that as
			  			// far as concerns that node, work is finished.
			  			
			  			self.done();   		 
			      	}
			..
		},
		
		// OPTIONAL
		// executed right after the creation of the Wnode, the DOMnode is at its place but only on the Documentfragment,
		// can be used for binding events
		init : function () {
			var self = this;
			...
			... 
			...check some condition mandatory for the whole render
			
			// if returns false then the render is locked
			return true; 
		},
		
		// OPTIONAL
		// queued in preorder, executed in fifo
		// the relative DOMnode has been appended to the parent and the whole render is already completed
		end : function () {
			var self = this;
			....
		}
		
	}  

---


# Api  

<hr>
###render(Object Literal [,Boolean])

	Widgzard.render(cnf [,clean])
	
**Renders following the instructions specified in the _cnf_ object literal.**

Where  
**cnf** : the object literal discussed above, mandatory  
**clean** : a boolean value that allows to specify whether or not the target Node must be emptied before creation, the default value is `true`.

<hr>

###load(String)  

	Widgzard.load(scriptUrl)

##### Injects a script  
	
Where the only parameter is a script Url that is requested and eveluated via script injection (and removal after evaluation).  
This function allows to easily get SPA using it to load scripts that uses the Widgzard to create/substitute part of the page or its whole content.

<hr>


### get(Object literal)  

	Widgzard.get(cnf)
	
Returns the Domtree that would be obtained running the _render_ function.

<hr>

### cleanup(DOMnode [,String])  

	Widgzard.cleanup(trg [,msg])
	
Empties the DOMnode passed
	
Where  
**trg** : the target DOMnode that must be cleaned
**msg** : a string used for replacement, the default value is `""`.

<hr>

### htmlspecialchars()  

	Widgzard.htmlspecialchars(str)
	
This is a dummy function that through some RegExps substitute &, <, >, " and ' with their html code, useful if You need unfortunately to inject whole html code using the `html` Node parameter seen above.

---

# ENGY  

The configuration _object literal_ passed as first parameter to the `Widgzard.render` function could quickly become too big. Moreover if somewhere is needed a component which has to be used in more places, there would be a big source of repetitions and many problems. In the end a huge mess.
The `Engy.process` function will create the configuration object literal allowing us to employ _components_ which can receive parameters, recursively, allowing to solve many problems. A sample will clarify:

---

### Something more to say  

The Widgzard is shipped with a _minimal_ stylesheet that allows to easily create **responsive layouts**. [Here][2] is a complete responsive sample, try to dig a bit at what happens when You click 'LOAD SOME SAMPLES'.

---  



[2]: http://www.jmvc.org/widgzard/sample/