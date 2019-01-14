var RK = (function () {
    var nPoints = 5E4,
        incr = 0.009 ,
        A = 1,
        V = 1,
        AMP = 100,
        points  = [],
        funcz = {};

    function rk(f1, f2) {
        var Ks = [],
            Hs = [],
            Ai = A,
            Vi = V;
        for(var i  = 0; i < nPoints; i++) {
            Ks[0] = incr * f1(Ai, Vi);
            Hs[0] = incr * f2(Ai, Vi);

            Ks[1] = incr * f1(Ai + (Ks[0] / 2), Vi + (Hs[0] / 2));
            Hs[1] = incr * f2(Ai + (Ks[0] / 2), Vi + (Hs[0] / 2));

            Ks[2] = incr * f1(Ai + (Ks[1] / 2), Vi + (Hs[1] / 2));
            Hs[2] = incr * f2(Ai + (Ks[1] / 2), Vi + (Hs[1] / 2));

            Ks[3] = incr * f1(Ai + Ks[2], Vi + Hs[2]);
            Hs[3] = incr * f2(Ai + Ks[2], Vi + Hs[2]);

            Ai = Ai + (Ks[0] + 2 * Ks[1] + 2 * Ks[2] + Ks[3]) * 1 / 6,
            Vi = Vi + (Hs[0] + 2 * Hs[1] + 2 * Hs[2] + Hs[3]) * 1 / 6;
            points.push([
                + Math.round(Ai),
                - Math.round(Vi)
            ]);
        }
    }

    
    function setInit() {
        points = [];
    }
    function getPoints() {
        return points;
    }
    function sin(n) {
        return Math.sin(n * Math.PI / 180)
    }
    function cos(n) {
        return Math.cos(n * Math.PI / 180)
    }

    funcz.setSize = function (amp) {
        AMP = amp;
    }
    funcz.setOrigin = function (a, v) {
        A = a;
        V = v;
    };
    funcz.getOrigin = function () {
        return [A, V];
    };
    funcz.setIncr = function (i) {
        incr = i;
    };
    funcz.setnPoints = function (n) {
        nPoints = n;
    };
 

    funcz.pen = function (W) {
        setInit();
        rk(
            function (th, th1) {
                return th1;
            },
            function (th, th1) {
                return -AMP * (W * W) * sin(th);
            }
        );
        return getPoints();
    };
    
    funcz.penforsin = function (W, A, C) {
        setInit();
        var EE = C * incr;
        rk(
            function (th, th1) {
                return th1;
            },
            function (th, th1) {
                return AMP * W * W * sin(th) + A * cos(EE);
            }
        );
        return getPoints();
    };

    funcz.penSmorz = function (W, A) {
        setInit();
        rk(
            function (th, th1) {
                return th1;
            },
            function (th, th1) {
                return -AMP * W * W * sin(th) - A *  (Math.abs(th1) / th1);
            }
        );
        return getPoints();
    };

    funcz.oscillator = function (W) {
        setInit();
        rk(
            function (th, th1) {
                return th1;
            },
            function (th, th1) {
                return -W * W * th;
            }
        );
        return getPoints();
    };

    funcz.repulsor = function (W) {
        setInit();
        rk(
            function (th, th1) {
                return th1;
            },
            function (th, th1) {
                return W * W * th;
            }
        );
        return getPoints();
    };

    funcz.oscillatorSmor = function (W, MU) {
        setInit();
        rk(
            function (th, th1) {
                return th1;
            },
            function (th, th1) {
                return -2 * (MU * th1) - (W * W * th);
            }
        );
        return getPoints();
    };

    funcz.oscillatorForSin = function (W, A, C) {
        setInit();
        var EE = A * incr;
        rk(
            function (th, th1) {
                return th1;
            },
            function (th, th1) {
                return - (W * W * th) + C * cos(EE);
            }
        );
        return getPoints();
    };

    funcz.lotkavolterra = function (ALFA, BETA, GAMMA, DELTA) {
        setInit();
        rk(
            function (th, th1) {
                return ALFA * th - BETA * th * th1;
            },
            function (th, th1) {
                return -GAMMA * th1 + DELTA * th * th1;
            }
        );
        return getPoints();
    };

    funcz.vanderpol = function (BETA, GAMMA) {
        setInit();
        rk(
            function (th, th1) {
                return th1;
            },
            function (th, th1) {
                return -(BETA / GAMMA) * (th * th - GAMMA) * th1 - th;
            }
        );
        return getPoints();
    };
    
    funcz.regWatt = function (W, MU) {
        setInit();
        rk(
            function (th, th1) {
                return th1;
            },
            function (th, th1) {
                return -100 * W * W * sin(th) + 100 * MU * MU * sin(th) * cos(th);
            }
        );
        return getPoints();
    };



    return funcz;
})();