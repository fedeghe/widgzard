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

	> npm install widgzard

### Install dependencies  

go in the `node_modules/widgzard` folder and install devDependencies for the build

	> cd node_modules/widgzard && npm i

then build it 

	> npm run build

**hint**: build is a demon process that watch for changesin the scource files, also starts a small dev-srv:  
navigate to http://localhost:3001


### use it 

Are you crazy? 

	> npm run build:pro

use the `theWidgzard.js` that is on the root

### ... to be continued !!!