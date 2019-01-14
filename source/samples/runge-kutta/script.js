// var p = RK.pen(3);

// var p = RK.penforsin(3, 1.5, 1.2);
// var p = RK.penSmorz(3, 1.5);
// var p = RK.oscillator(3);
// var p = RK.repulsor(3);
// var p = RK.oscillatorSmor(3, 1.2);
// var p = RK.oscillatorForSin(3, 1.2, 2.3);
// var p = RK.lotkavolterra(50, 1, 150, 1);
// var p = RK.vanderpol(3);
// var p = RK.repulsor(2);
// var p = RK.regWatt(3, 1.2);

// console.log(p)


var trg = document.getElementById('trg');
var lastFunc = null,
  lastParams = null,
  lastOrigin = null,
  last = null,
  width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
  height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
Engy.render({
  target: trg,
  data : {
    width: width,
    height: height
  },
  content: [{
    tag: 'input',
    attrs: {
      type:'range',
      min:0.0001,
      max:0.015,
      step: 0.000005,
      value: 0.009
    },
    style:{
      width:'100%'
    },
    onInput: function () {
      RK.setIncr(this.node.value);
      var self = this,
        canvas = self.getNode('canvas');
      typeof last === 'function' && canvas.data.paint(last());
    }
  }, {
    wid: 'panel',
    attrs: {
      id:'panel'
    },
    html : ''
  },{
    tag: 'br'
  }, {
    component: 'rkbutton',
    params: {
      label: 'van der pol',
      name: 'Van der pol',
      func: 'vanderpol',
      orig: [20, 10],
      pars: [1.3, 5000],
      panel: {
        mu: {min: 0.01, max:5, step: 0.01, value: 1.3},
        gamma: {min: 1000, max:10000, step: 100, value: 5000}
      }
    }
  }, {
    component: 'rkbutton',
    params: {
      label: 'lotka volterra',
      name: 'Lotka-Volterra',
      func: 'lotkavolterra',
      orig: [300, 200],
      pars: [200, 1, 200, 1],
      panel: {
        alfa: {min:1, max: 500, step: 1, value: 200},
        beta: {min:0.1, max: 2, step: 0.01, value: 1},
        gamma: {min:1, max: 500, step: 1, value: 200},
        delta: {min:0.1, max: 2, step: 0.01, value: 1}
      }
    }
  }, {
    component: 'rkbutton',
    params: {
      label: 'pendulum',
      name: 'Pendulum',
      func: 'pen',
      orig: [90, 0],
      pars: [0.6],
      panel: {
        w: {min: 0.1, max: 10, step: 0.1, value: 0.1}
      }
    }
  }, {
    component: 'rkbutton',
    params: {
      label: 'pendulum for sin',
      name: 'Sin forced pendulum',
      func: 'penforsin',
      orig: [90, 30],
      pars: [1.1, 1, 5.3],
      panel: {
        w: {min: 0.1, max: 10, step: 0.1, value: 1.1},
        a: {min: 0.1, max: 10, step: 0.1, value: 1},
        c: {min: 0.1, max: 10, step: 0.1, value: 5.3}
      }
    }
  }, {
    component: 'rkbutton',
    params: {
      label: 'pendulum smor',
      name: 'Unforced Pendulum',
      func: 'penSmorz',
      orig: [-900, 200],
      pars: [0.7, 20],
      panel: {
        w: { min: 0.1, max: 3, step: 0.01, value: 0.7 },
        c: { min: 0, max: 50, step: 0.1, value: 20 }
      }
    }
  }, {
    component: 'rkbutton',
    params: {
      label: 'oscill arm',
      name: 'Armonic oscillator',
      func: 'oscillator',
      orig: [300, 350],
      pars: [0.7],
      panel: {
        w: { min: 0.1, max: 3, step: 0.01, value: 0.7 }
      }
    }
  }, {
    component: 'rkbutton',
    params: {
      label: 'repulsor arm',
      name: 'Armonic repulsor',
      func: 'repulsor',
      orig: [-300, 150],
      pars: [0.7],
      panel: {
        w: { min: 0.1, max: 3, step: 0.01, value: 0.7 }
      }
    }
  }, {
    component: 'rkbutton',
    params: {
      label: 'oscill arm smor',
      name: 'Unforced armonic oscillator',
      func: 'oscillatorSmor',
      orig: [300, 350],
      pars: [1.3, 0.1],
      panel: {
        w: { min: 0.1, max: 3, step: 0.01, value: 1.3 },
        c: { min: 0.001, max: 2, step: 0.001, value: 0.1 }
      }
    }
  }, {
    component: 'rkbutton',
    params: {
      label: 'oscill for sin',
      name: 'Sin forced oscillator',
      func: 'oscillatorForSin',
      orig: [300, 350],
      pars: [1.3, 0.5, 1.4],
      panel: {
        w: { min: 0.1, max: 10, step: 0.1, value: 1.3 },
        a: { min: 0.1, max: 10, step: 0.1, value: 0.5 },
        c: { min: 0.1, max: 10, step: 0.1, value: 1.4 }
      }
    }
  }, {
    component: 'rkbutton',
    params: {
      label: 'watt regulator',
      name: 'Watt regulator',
      func: 'regWatt',
      orig: [-500, 280],
      pars: [1.3, 3.1],
      panel: {
        w: { min: 0.1, max: 3, step: 0.01, value: 1.3 },
        c: { min: 0, max: 10, step: 0.1, value: 3.1 }
      }
    }
  }, {
    tag: 'label',
    html : 'cleanup points',
    attrs: {
      for: 'label'
    },
    style: {
      color:'white',
      cursor: 'pointer',
      'margin-left': '10px'
    }
  },{
    tag: 'input',
    attrs: {
      id: 'label',
      type: 'checkbox',
      checked: 'checked'
    },
    onChange: function () {
      var self = this,
        canvas = self.getNode('canvas');
      canvas.data.autoClear = !!(self.node.checked);
    }
  },{
    tag : 'hr'
  },{
    tag : 'canvas',
    wid: 'canvas',
    attrs: {
      width: width + 'px',
      height: height + 'px'
    },
    data: {
      autoClear: true
    },
    onClick: function (e) {
      RK.setOrigin(
        e.layerX - width / 2,
        height / 2  - e.layerY
      );
      var self = this,
        canvas = self.getNode('canvas');
      typeof last === 'function' && canvas.data.paint(last());
    },
    init : function () {
      var self = this,
        $elf = this.node,
        pdata = self.parent.data,
        w = pdata.width,
        h = pdata.height,
        pointSize = 1,
        ctx = $elf.getContext('2d'),
        colors = ["#00FF00", "#FF0000", "#0000FF"],
        axesDrawn = false;

      RK.setSize(w / 4);

      self.data.paint = function (points) {
        ctx.fillStyle = "#000000";
        if (self.data.autoClear || !axesDrawn){ 
          ctx.fillRect(0, 0, w, h);
          ctx.strokeStyle = "#444444";
          ctx.beginPath();
          ctx.moveTo(0, h / 2);
          ctx.lineTo(w, h / 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(w / 2, 0);
          ctx.lineTo(w / 2, h);
          ctx.stroke();
          axesDrawn = true;
        }
        
        ctx.fillStyle = colors[0];
        for (var i = 0, l = points.length; i < l; i ++) {
          ctx.fillRect(width / 2 + points[i][0], height / 2 + points[i][1], pointSize, pointSize)
        }
      }
      return true;
    }
  }]
})