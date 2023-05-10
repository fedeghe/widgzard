# WIDGZARD  

![postoreder walk](https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Sorted_binary_tree_preorder.svg/2000px-Sorted_binary_tree_preorder.svg.png "postorder walk")


Widgzard is a simple module, which allows to build arbirary DOM tree through components with their own lifecycle.   

---


### Widgzard will be useful if 

- You want to render arbitrary dom trees from literal objects and attach it somewhere. 

- each component needs to exploit his own and others component lifecycle

- all components should comunicate in a clear way  

<br/>

The _Widgzard_ aims to solve the problem in a clear way, receiving a main object literal containing all is needed to get whatever is needed really fast.  

---
### Install it  
```
@ npm install widgzard
```

### Use it 

In the `<head>` of your html attach the   
``` html
<script src="THE_PATH_TO_WIDGZARD/dist/theWidgzard.js"></script>
```

### Run the demos

In your `node_modules/widgzard` folder run  

    > npm i
    // and then 
	> npm run buildev

**hint**: buildev launches a demon process watching for relevant changes in the `source` folder, also starts a small dev-srv:  
navigate to http://localhost:3001/samples


### ... to be continued !!!