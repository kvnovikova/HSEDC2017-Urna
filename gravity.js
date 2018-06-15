function $A(t) {
    if (!t) return [];
    if (t.toArray) return t.toArray();
    for (var i = t.length || 0, o = new Array(i); i--;) o[i] = t[i];
    return o
}

function init() {
    elements = [], bodies = [], properties = [], window.addEventListener("resize", init), document.addEventListener("mousedown", onDocumentMouseDown, !1), document.addEventListener("mouseup", onDocumentMouseUp, !1), document.addEventListener("mousemove", onDocumentMouseMove, !1), document.addEventListener("touchstart", onDocumentTouchStart, !1), document.addEventListener("touchmove", onDocumentTouchMove, !1), document.addEventListener("touchend", onDocumentTouchEnd, !1), (worldAABB = new b2AABB).minVertex.Set(-200, -200), worldAABB.maxVertex.Set(window.innerWidth + 200, window.innerHeight + 200), world = new b2World(worldAABB, new b2Vec2(0, 0), !0), setWalls(), elements = getElementsByClass("gravity");
    for (t = 0; t < elements.length; t++) properties[t] = getElementProperties(elements[t]);
    for (var t = 0; t < elements.length; t++) {
        var i = elements[t];
        for (i.style.position = "absolute", i.style.left = properties[t][0] + "px", i.style.top = properties[t][1] + "px", i.style.zIndex = 3, i.addEventListener("mousedown", onElementMouseDown, !1), i.addEventListener("mouseup", onElementMouseUp, !1), i.addEventListener("click", onElementClick, !1), bodies[t] = createBox(world, properties[t][0] + (properties[t][2] >> 1), properties[t][1] + (properties[t][3] >> 1), properties[t][2] / 2, properties[t][3] / 2, !1); i.offsetParent;)(i = i.offsetParent).style.position = "static"
    }
}

function onDocumentMouseDown(t) {
    isMouseDown = !0
}

function onDocumentMouseUp(t) {
    isMouseDown = !1
}

function onDocumentMouseMove(t) {
    mouse.x = t.clientX, mouse.y = t.clientY
}

function onDocumentTouchStart(t) {
    1 == t.touches.length && (mouse.x = t.touches[0].pageX, mouse.y = t.touches[0].pageY, isMouseDown = !0)
}

function onDocumentTouchMove(t) {
    1 == t.touches.length && (t.preventDefault(), mouse.x = t.touches[0].pageX, mouse.y = t.touches[0].pageY)
}

function onDocumentTouchEnd(t) {
    0 == t.touches.length && (isMouseDown = !1)
}

function onElementMouseDown(t) {
    t.preventDefault(), mouseOnClick[0] = t.clientX, mouseOnClick[1] = t.clientY
}

function onElementMouseUp(t) {
    t.preventDefault()
}

function onElementClick(t) {
    (mouseOnClick[0] > t.clientX + 5 || mouseOnClick[0] < t.clientX - 5 && mouseOnClick[1] > t.clientY + 5 || mouseOnClick[1] < t.clientY - 5) && t.preventDefault()
}

function loop() {
    for (getBrowserDimensions() && setWalls(), delta[0] += .5 * (0 - delta[0]), delta[1] += .5 * (0 - delta[1]), world.m_gravity.x = 350 * gravity.x + delta[0], world.m_gravity.y = 350 * gravity.y + delta[1], mouseDrag(), world.Step(timeStep, iterations), i = 0; i < elements.length; i++) {
        var t = bodies[i],
            o = elements[i];
        o.style.left = t.m_position0.x - (properties[i][2] >> 1) + "px", o.style.top = t.m_position0.y - (properties[i][3] >> 1) + "px";
        var e = "rotate(" + 57.2957795 * t.m_rotation0 + "deg)";
        o.style.transform = e, o.style.WebkitTransform = e + " translateZ(0)", o.style.MozTransform = e, o.style.OTransform = e, o.style.msTransform = e
    }
    window.requestAnimationFrame(loop)
}

function createBox(t, i, o, e, n, s, a) {
    var r = new b2BoxDef;
    void 0 === s && (s = !0), !1 === s && (r.density = 1), r.extents.Set(e, n);
    var l = new b2BodyDef;
    return l.AddShape(r), l.position.Set(i, o), l.linearVelocity.Set(20 * Math.random() - 10, 20 * Math.random() - 10), l.angularVelocity = .1 * Math.random() - .05, l.userData = {
        element: a
    }, t.CreateBody(l)
}

function mouseDrag() {
    if (isMouseDown && !mouseJoint) {
        var t = getBodyAtMouse();
        if (t) {
            var i = new b2MouseJointDef;
            i.body1 = world.m_groundBody, i.body2 = t, i.target.Set(mouse.x, mouse.y), i.maxForce = 3e4 * t.m_mass, i.timeStep = timeStep, mouseJoint = world.CreateJoint(i), t.WakeUp()
        }
    }
    if (isMouseDown || mouseJoint && (world.DestroyJoint(mouseJoint), mouseJoint = null), mouseJoint) {
        var o = new b2Vec2(mouse.x, mouse.y);
        mouseJoint.SetTarget(o)
    }
}

function getBodyAtMouse() {
    var t = new b2Vec2;
    t.Set(mouse.x, mouse.y);
    var i = new b2AABB;
    i.minVertex.Set(mouse.x - 1, mouse.y - 1), i.maxVertex.Set(mouse.x + 1, mouse.y + 1);
    for (var o = [], e = world.Query(i, o, 10), n = null, s = 0; s < e; s++)
        if (0 == o[s].m_body.IsStatic() && o[s].TestPoint(t)) {
            n = o[s].m_body;
            break
        }
    return n
}

function setWalls() {
    wallsSetted && (world.DestroyBody(walls[0]), world.DestroyBody(walls[1]), world.DestroyBody(walls[2]), world.DestroyBody(walls[3]), walls[0] = null, walls[1] = null, walls[2] = null, walls[3] = null), walls[0] = createBox(world, stage[2] / 2, -wall_thickness, stage[2], wall_thickness), walls[1] = createBox(world, stage[2] / 2, stage[3] + wall_thickness, stage[2], wall_thickness), walls[2] = createBox(world, -wall_thickness, stage[3] / 2, wall_thickness, stage[3]), walls[3] = createBox(world, stage[2] + wall_thickness, stage[3] / 2, wall_thickness, stage[3]), wallsSetted = !0
}

function getElementsByClass(t) {
    var o = [],
        e = document.getElementsByTagName("*"),
        n = e.length;
    for (i = 0, j = 0; i < n; i++) {
        var s = e[i].className.split(" ");
        for (k = 0; k < s.length; k++) s[k] == t && (o[j++] = e[i])
    }
    return o
}

function getElementProperties(t) {
    var i = 0,
        o = 0,
        e = t.offsetWidth,
        n = t.offsetHeight;
    do {
        i += t.offsetLeft, o += t.offsetTop
    } while (t = t.offsetParent);
    return [i, o, e, n]
}

function getBrowserDimensions() {
    var t = !1;
    return stage[0] != window.screenX && (delta[0] = 50 * (window.screenX - stage[0]), stage[0] = window.screenX, t = !0), stage[1] != window.screenY && (delta[1] = 50 * (window.screenY - stage[1]), stage[1] = window.screenY, t = !0), stage[2] != window.innerWidth && (stage[2] = window.innerWidth, t = !0), stage[3] != window.innerHeight && (stage[3] = window.innerHeight, t = !0), t
}! function(t) {
    t.fn.marquee = function(i) {
        return this.each(function() {
            var o, e, n, s, a, r = t.extend({}, t.fn.marquee.defaults, i),
                l = t(this),
                m = 3,
                _ = "animation-play-state",
                h = !1,
                c = function(t, i, o) {
                    for (var e = ["webkit", "moz", "MS", "o", ""], n = 0; n < e.length; n++) e[n] || (i = i.toLowerCase()), t.addEventListener(e[n] + i, o, !1)
                },
                u = function(t) {
                    var i, o = [];
                    for (i in t) t.hasOwnProperty(i) && o.push(i + ":" + t[i]);
                    return o.push(), "{" + o.join(",") + "}"
                },
                y = {
                    pause: function() {
                        h && r.allowCss3Support ? o.css(_, "paused") : t.fn.pause && o.pause(), l.data("runningStatus", "paused"), l.trigger("paused")
                    },
                    resume: function() {
                        h && r.allowCss3Support ? o.css(_, "running") : t.fn.resume && o.resume(), l.data("runningStatus", "resumed"), l.trigger("resumed")
                    },
                    toggle: function() {
                        y["resumed" == l.data("runningStatus") ? "pause" : "resume"]()
                    },
                    destroy: function() {
                        clearTimeout(l.timer), l.find("*").andSelf().unbind(), l.html(l.find(".js-marquee:first").html())
                    }
                };
            if ("string" == typeof i) t.isFunction(y[i]) && (o || (o = l.find(".js-marquee-wrapper")), !0 === l.data("css3AnimationIsSupported") && (h = !0), y[i]());
            else {
                var b;
                t.each(r, function(t, i) {
                    if (void 0 !== (b = l.attr("data-" + t))) {
                        switch (b) {
                            case "true":
                                b = !0;
                                break;
                            case "false":
                                b = !1
                        }
                        r[t] = b
                    }
                }), r.speed && (r.duration = r.speed * parseInt(l.width(), 10)), s = "up" == r.direction || "down" == r.direction, r.gap = r.duplicated ? parseInt(r.gap) : 0, l.wrapInner('<div class="js-marquee"></div>');
                x = l.find(".js-marquee").css({
                    "margin-right": r.gap,
                    float: "left"
                });
                if (r.duplicated && x.clone(!0).appendTo(l), l.wrapInner('<div style="width:100000px" class="js-marquee-wrapper"></div>'), o = l.find(".js-marquee-wrapper"), s) {
                    var p = l.height();
                    o.removeAttr("style"), l.height(p), l.find(".js-marquee").css({
                        float: "none",
                        "margin-bottom": r.gap,
                        "margin-right": 0
                    }), r.duplicated && l.find(".js-marquee:last").css({
                        "margin-bottom": 0
                    });
                    var d = l.find(".js-marquee:first").height() + r.gap;
                    r.startVisible && !r.duplicated ? (r._completeDuration = (parseInt(d, 10) + parseInt(p, 10)) / parseInt(p, 10) * r.duration, r.duration *= parseInt(d, 10) / parseInt(p, 10)) : r.duration *= (parseInt(d, 10) + parseInt(p, 10)) / parseInt(p, 10)
                } else a = l.find(".js-marquee:first").width() + r.gap, e = l.width(), r.startVisible && !r.duplicated ? (r._completeDuration = (parseInt(a, 10) + parseInt(e, 10)) / parseInt(e, 10) * r.duration, r.duration *= parseInt(a, 10) / parseInt(e, 10)) : r.duration *= (parseInt(a, 10) + parseInt(e, 10)) / parseInt(e, 10);
                if (r.duplicated && (r.duration /= 2), r.allowCss3Support) {
                    var x = document.body || document.createElement("div"),
                        f = "marqueeAnimation-" + Math.floor(1e7 * Math.random()),
                        v = ["Webkit", "Moz", "O", "ms", "Khtml"],
                        g = "animation",
                        M = "",
                        S = "";
                    if (x.style.animation && (S = "@keyframes " + f + " ", h = !0), !1 === h)
                        for (var C = 0; C < v.length; C++)
                            if (void 0 !== x.style[v[C] + "AnimationName"]) {
                                x = "-" + v[C].toLowerCase() + "-", g = x + g, _ = x + _, S = "@" + x + "keyframes " + f + " ", h = !0;
                                break
                            }
                    h && (M = f + " " + r.duration / 1e3 + "s " + r.delayBeforeStart / 1e3 + "s infinite " + r.css3easing, l.data("css3AnimationIsSupported", !0))
                }
                var V = function() {
                        o.css("margin-top", "up" == r.direction ? p + "px" : "-" + d + "px")
                    },
                    w = function() {
                        o.css("margin-left", "left" == r.direction ? e + "px" : "-" + a + "px")
                    };
                r.duplicated ? (s ? r.startVisible ? o.css("margin-top", 0) : o.css("margin-top", "up" == r.direction ? p + "px" : "-" + (2 * d - r.gap) + "px") : r.startVisible ? o.css("margin-left", 0) : o.css("margin-left", "left" == r.direction ? e + "px" : "-" + (2 * a - r.gap) + "px"), r.startVisible || (m = 1)) : r.startVisible ? m = 2 : s ? V() : w();
                var A = function() {
                    if (r.duplicated && (1 === m ? (r._originalDuration = r.duration, r.duration = s ? "up" == r.direction ? r.duration + p / (d / r.duration) : 2 * r.duration : "left" == r.direction ? r.duration + e / (a / r.duration) : 2 * r.duration, M && (M = f + " " + r.duration / 1e3 + "s " + r.delayBeforeStart / 1e3 + "s " + r.css3easing), m++) : 2 === m && (r.duration = r._originalDuration, M && (f += "0", S = t.trim(S) + "0 ", M = f + " " + r.duration / 1e3 + "s 0s infinite " + r.css3easing), m++)), s ? r.duplicated ? (2 < m && o.css("margin-top", "up" == r.direction ? 0 : "-" + d + "px"), n = {
                            "margin-top": "up" == r.direction ? "-" + d + "px" : 0
                        }) : r.startVisible ? 2 === m ? (M && (M = f + " " + r.duration / 1e3 + "s " + r.delayBeforeStart / 1e3 + "s " + r.css3easing), n = {
                            "margin-top": "up" == r.direction ? "-" + d + "px" : p + "px"
                        }, m++) : 3 === m && (r.duration = r._completeDuration, M && (f += "0", S = t.trim(S) + "0 ", M = f + " " + r.duration / 1e3 + "s 0s infinite " + r.css3easing), V()) : (V(), n = {
                            "margin-top": "up" == r.direction ? "-" + o.height() + "px" : p + "px"
                        }) : r.duplicated ? (2 < m && o.css("margin-left", "left" == r.direction ? 0 : "-" + a + "px"), n = {
                            "margin-left": "left" == r.direction ? "-" + a + "px" : 0
                        }) : r.startVisible ? 2 === m ? (M && (M = f + " " + r.duration / 1e3 + "s " + r.delayBeforeStart / 1e3 + "s " + r.css3easing), n = {
                            "margin-left": "left" == r.direction ? "-" + a + "px" : e + "px"
                        }, m++) : 3 === m && (r.duration = r._completeDuration, M && (f += "0", S = t.trim(S) + "0 ", M = f + " " + r.duration / 1e3 + "s 0s infinite " + r.css3easing), w()) : (w(), n = {
                            "margin-left": "left" == r.direction ? "-" + a + "px" : e + "px"
                        }), l.trigger("beforeStarting"), h) {
                        o.css(g, M);
                        var i = S + " { 100%  " + u(n) + "}",
                            _ = o.find("style");
                        0 !== _.length ? _.filter(":last").html(i) : o.append("<style>" + i + "</style>"), c(o[0], "AnimationIteration", function() {
                            l.trigger("finished")
                        }), c(o[0], "AnimationEnd", function() {
                            A(), l.trigger("finished")
                        })
                    } else o.animate(n, r.duration, r.easing, function() {
                        l.trigger("finished"), r.pauseOnCycle ? l.timer = setTimeout(A, r.delayBeforeStart) : A()
                    });
                    l.data("runningStatus", "resumed")
                };
                l.bind("pause", y.pause), l.bind("resume", y.resume), r.pauseOnHover && l.bind("mouseenter mouseleave", y.toggle), h && r.allowCss3Support ? A() : l.timer = setTimeout(A, r.delayBeforeStart)
            }
        })
    }, t.fn.marquee.defaults = {
        allowCss3Support: !0,
        css3easing: "linear",
        easing: "linear",
        delayBeforeStart: 1e3,
        direction: "left",
        duplicated: !1,
        duration: 5e3,
        gap: 20,
        pauseOnCycle: !1,
        pauseOnHover: !1,
        startVisible: !1
    }
}(jQuery),
function(t, i) {
    "function" == typeof define && define.amd ? define(["jquery"], i) : i("object" == typeof exports ? require("jquery") : t.jQuery)
}(this, function(t) {
    "use strict";

    function i(t) {
        var i, o, e, n, s, a, r, l = {};
        for (r = 0, a = (s = t.replace(/\s*:\s*/g, ":").replace(/\s*,\s*/g, ",").split(",")).length; r < a && -1 === (o = s[r]).search(/^(http|https|ftp):\/\//) && -1 !== o.search(":"); r++) i = o.indexOf(":"), e = o.substring(0, i), (n = o.substring(i + 1)) || (n = void 0), "string" == typeof n && (n = "true" === n || "false" !== n && n), "string" == typeof n && (n = isNaN(n) ? n : +n), l[e] = n;
        return null == e && null == n ? t : l
    }

    function o(t) {
        var i, o, e, n = (t = "" + t).split(/\s+/),
            s = "50%",
            a = "50%";
        for (e = 0, i = n.length; e < i; e++) "left" === (o = n[e]) ? s = "0%" : "right" === o ? s = "100%" : "top" === o ? a = "0%" : "bottom" === o ? a = "100%" : "center" === o ? 0 === e ? s = "50%" : a = "50%" : 0 === e ? s = o : a = o;
        return {
            x: s,
            y: a
        }
    }

    function e(i, o) {
        var e = function() {
            o(this.src)
        };
        t('<img src="' + i + '.gif">').on("load", e), t('<img src="' + i + '.jpg">').on("load", e), t('<img src="' + i + '.jpeg">').on("load", e), t('<img src="' + i + '.png">').on("load", e)
    }

    function n(o, e, n) {
        if (this.$element = t(o), "string" == typeof e && (e = i(e)), n ? "string" == typeof n && (n = i(n)) : n = {}, "string" == typeof e) e = e.replace(/\.\w*$/, "");
        else if ("object" == typeof e)
            for (var s in e) e.hasOwnProperty(s) && (e[s] = e[s].replace(/\.\w*$/, ""));
        this.settings = t.extend({}, a, n), this.path = e;
        try {
            this.init()
        } catch (t) {
            if (t.message !== r) throw t
        }
    }
    var s = "vide",
        a = {
            volume: 1,
            playbackRate: 1,
            muted: !0,
            loop: !0,
            autoplay: !0,
            position: "50% 50%",
            posterType: "detect",
            resizing: !0,
            bgColor: "transparent",
            className: ""
        },
        r = "Not implemented";
    n.prototype.init = function() {
        var i, n, s = this,
            a = s.path,
            l = a,
            m = "",
            _ = s.$element,
            h = s.settings,
            c = o(h.position),
            u = h.posterType;
        n = s.$wrapper = t("<div>").addClass(h.className).css({
            position: "absolute",
            "z-index": 0,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            overflow: "hidden",
            "-webkit-background-size": "cover",
            "-moz-background-size": "cover",
            "-o-background-size": "cover",
            "background-size": "cover",
            "background-color": h.bgColor,
            "background-repeat": "no-repeat",
            "background-position": c.x + " " + c.y
        }), "object" == typeof a && (a.poster ? l = a.poster : a.mp4 ? l = a.mp4 : a.webm ? l = a.webm : a.ogv && (l = a.ogv)), "detect" === u ? e(l, function(t) {
            n.css("background-image", "url(" + t + ")")
        }) : "none" !== u && n.css("background-image", "url(" + l + "." + u + ")"), "static" === _.css("position") && _.css("position", "relative"), _.prepend(n), "object" == typeof a ? (a.mp4 && (m += '<source src="' + a.mp4 + '.mp4" type="video/mp4">'), a.webm && (m += '<source src="' + a.webm + '.webm" type="video/webm">'), a.ogv && (m += '<source src="' + a.ogv + '.ogv" type="video/ogg">'), i = s.$video = t("<video>" + m + "</video>")) : i = s.$video = t('<video><source src="' + a + '.mp4" type="video/mp4"><source src="' + a + '.webm" type="video/webm"><source src="' + a + '.ogv" type="video/ogg"></video>');
        try {
            i.prop({
                autoplay: h.autoplay,
                loop: h.loop,
                volume: h.volume,
                muted: h.muted,
                defaultMuted: h.muted,
                playbackRate: h.playbackRate,
                defaultPlaybackRate: h.playbackRate
            })
        } catch (t) {
            throw new Error(r)
        }
        i.css({
            margin: "auto",
            position: "absolute",
            "z-index": -1,
            top: c.y,
            left: c.x,
            "-webkit-transform": "translate(-" + c.x + ", -" + c.y + ")",
            "-ms-transform": "translate(-" + c.x + ", -" + c.y + ")",
            "-moz-transform": "translate(-" + c.x + ", -" + c.y + ")",
            transform: "translate(-" + c.x + ", -" + c.y + ")",
            visibility: "hidden",
            opacity: 0
        }).one("canplaythrough.vide", function() {
            s.resize()
        }).one("playing.vide", function() {
            i.css({
                visibility: "visible",
                opacity: 1
            }), n.css("background-image", "none")
        }), _.on("resize.vide", function() {
            h.resizing && s.resize()
        }), n.append(i)
    }, n.prototype.getVideoObject = function() {
        return this.$video[0]
    }, n.prototype.resize = function() {
        if (this.$video) {
            var t = this.$wrapper,
                i = this.$video,
                o = i[0],
                e = o.videoHeight,
                n = o.videoWidth,
                s = t.height(),
                a = t.width();
            a / n > s / e ? i.css({
                width: a + 2,
                height: "auto"
            }) : i.css({
                width: "auto",
                height: s + 2
            })
        }
    }, n.prototype.destroy = function() {
        delete t[s].lookup[this.index], this.$video && this.$video.off(s), this.$element.off(s).removeData(s), this.$wrapper.remove()
    }, t[s] = {
        lookup: []
    }, t.fn[s] = function(i, o) {
        var e;
        return this.each(function() {
            (e = t.data(this, s)) && e.destroy(), (e = new n(this, i, o)).index = t[s].lookup.push(e) - 1, t.data(this, s, e)
        }), this
    }, t(document).ready(function() {
        var i = t(window);
        i.on("resize.vide", function() {
            for (var i, o = t[s].lookup.length, e = 0; e < o; e++)(i = t[s].lookup[e]) && i.settings.resizing && i.resize()
        }), i.on("unload.vide", function() {
            return !1
        }), t(document).find("[data-vide-bg]").each(function(i, o) {
            var e = t(o),
                n = e.data("vide-options"),
                a = e.data("vide-bg");
            e[s](a, n)
        })
    })
});
var Class = {
    create: function() {
        function t() {
            this.initialize.apply(this, arguments)
        }
        var i = null,
            o = $A(arguments);
        if (Object.isFunction(o[0]) && (i = o.shift()), Object.extend(t, Class.Methods), t.superclass = i, t.subclasses = [], i) {
            var e = function() {};
            e.prototype = i.prototype, t.prototype = new e, i.subclasses.push(t)
        }
        for (var n = 0; n < o.length; n++) t.addMethods(o[n]);
        return t.prototype.initialize || (t.prototype.initialize = this.emptyFunction), t.prototype.constructor = t, t
    },
    emptyFunction: function() {}
};
Class.Methods = {
    addMethods: function(t) {
        var i = this.superclass && this.superclass.prototype,
            o = Object.keys(t);
        Object.keys({
            toString: !0
        }).length || o.push("toString", "valueOf");
        for (var e = 0, n = o.length; e < n; e++) {
            var s = o[e],
                a = t[s];
            if (i && Object.isFunction(a) && "$super" == a.argumentNames().first()) var r = a,
                a = Object.extend(function(t) {
                    return function() {
                        return i[t].apply(this, arguments)
                    }
                }(s).wrap(r), {
                    valueOf: function() {
                        return r
                    },
                    toString: function() {
                        return r.toString()
                    }
                });
            this.prototype[s] = a
        }
        return this
    }
}, Object.extend = function(t, i) {
    for (var o in i) t[o] = i[o];
    return t
}, Object.extend(Object, {
    inspect: function(t) {
        try {
            return Object.isUndefined(t) ? "undefined" : null === t ? "null" : t.inspect ? t.inspect() : String(t)
        } catch (t) {
            if (t instanceof RangeError) return "...";
            throw t
        }
    },
    toJSON: function(t) {
        switch (typeof t) {
            case "undefined":
            case "function":
            case "unknown":
                return;
            case "boolean":
                return t.toString()
        }
        if (null === t) return "null";
        if (t.toJSON) return t.toJSON();
        if (!Object.isElement(t)) {
            var i = [];
            for (var o in t) {
                var e = Object.toJSON(t[o]);
                Object.isUndefined(e) || i.push(o.toJSON() + ": " + e)
            }
            return "{" + i.join(", ") + "}"
        }
    },
    toQueryString: function(t) {
        return $H(t).toQueryString()
    },
    toHTML: function(t) {
        return t && t.toHTML ? t.toHTML() : String.interpret(t)
    },
    keys: function(t) {
        var i = [];
        for (var o in t) i.push(o);
        return i
    },
    values: function(t) {
        var i = [];
        for (var o in t) i.push(t[o]);
        return i
    },
    clone: function(t) {
        return Object.extend({}, t)
    },
    isElement: function(t) {
        return t && 1 == t.nodeType
    },
    isArray: function(t) {
        return null != t && "object" == typeof t && "splice" in t && "join" in t
    },
    isHash: function(t) {
        return t instanceof Hash
    },
    isFunction: function(t) {
        return "function" == typeof t
    },
    isString: function(t) {
        return "string" == typeof t
    },
    isNumber: function(t) {
        return "number" == typeof t
    },
    isUndefined: function(t) {
        return void 0 === t
    }
}), (WebKit = navigator.userAgent.indexOf("AppleWebKit/") > -1) && ($A = function(t) {
    if (!t) return [];
    if ((!Object.isFunction(t) || "[object NodeList]" != t) && t.toArray) return t.toArray();
    for (var i = t.length || 0, o = new Array(i); i--;) o[i] = t[i];
    return o
});
var b2Settings = Class.create();
b2Settings.prototype = {
    initialize: function() {}
}, b2Settings.USHRT_MAX = 65535, b2Settings.b2_pi = Math.PI, b2Settings.b2_massUnitsPerKilogram = 1, b2Settings.b2_timeUnitsPerSecond = 1, b2Settings.b2_lengthUnitsPerMeter = 30, b2Settings.b2_maxManifoldPoints = 2, b2Settings.b2_maxShapesPerBody = 64, b2Settings.b2_maxPolyVertices = 8, b2Settings.b2_maxProxies = 1024, b2Settings.b2_maxPairs = 8 * b2Settings.b2_maxProxies, b2Settings.b2_linearSlop = .005 * b2Settings.b2_lengthUnitsPerMeter, b2Settings.b2_angularSlop = 2 / 180 * b2Settings.b2_pi, b2Settings.b2_velocityThreshold = 1 * b2Settings.b2_lengthUnitsPerMeter / b2Settings.b2_timeUnitsPerSecond, b2Settings.b2_maxLinearCorrection = .2 * b2Settings.b2_lengthUnitsPerMeter, b2Settings.b2_maxAngularCorrection = 8 / 180 * b2Settings.b2_pi, b2Settings.b2_contactBaumgarte = .2, b2Settings.b2_timeToSleep = .5 * b2Settings.b2_timeUnitsPerSecond, b2Settings.b2_linearSleepTolerance = .01 * b2Settings.b2_lengthUnitsPerMeter / b2Settings.b2_timeUnitsPerSecond, b2Settings.b2_angularSleepTolerance = 2 / 180 / b2Settings.b2_timeUnitsPerSecond, b2Settings.b2Assert = function(t) {
    if (!t) {
        (void 0).x++
    }
};
var b2Vec2 = Class.create();
b2Vec2.prototype = {
    initialize: function(t, i) {
        this.x = t, this.y = i
    },
    SetZero: function() {
        this.x = 0, this.y = 0
    },
    Set: function(t, i) {
        this.x = t, this.y = i
    },
    SetV: function(t) {
        this.x = t.x, this.y = t.y
    },
    Negative: function() {
        return new b2Vec2(-this.x, -this.y)
    },
    Copy: function() {
        return new b2Vec2(this.x, this.y)
    },
    Add: function(t) {
        this.x += t.x, this.y += t.y
    },
    Subtract: function(t) {
        this.x -= t.x, this.y -= t.y
    },
    Multiply: function(t) {
        this.x *= t, this.y *= t
    },
    MulM: function(t) {
        var i = this.x;
        this.x = t.col1.x * i + t.col2.x * this.y, this.y = t.col1.y * i + t.col2.y * this.y
    },
    MulTM: function(t) {
        var i = b2Math.b2Dot(this, t.col1);
        this.y = b2Math.b2Dot(this, t.col2), this.x = i
    },
    CrossVF: function(t) {
        var i = this.x;
        this.x = t * this.y, this.y = -t * i
    },
    CrossFV: function(t) {
        var i = this.x;
        this.x = -t * this.y, this.y = t * i
    },
    MinV: function(t) {
        this.x = this.x < t.x ? this.x : t.x, this.y = this.y < t.y ? this.y : t.y
    },
    MaxV: function(t) {
        this.x = this.x > t.x ? this.x : t.x, this.y = this.y > t.y ? this.y : t.y
    },
    Abs: function() {
        this.x = Math.abs(this.x), this.y = Math.abs(this.y)
    },
    Length: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    },
    Normalize: function() {
        var t = this.Length();
        if (t < Number.MIN_VALUE) return 0;
        var i = 1 / t;
        return this.x *= i, this.y *= i, t
    },
    IsValid: function() {
        return b2Math.b2IsValid(this.x) && b2Math.b2IsValid(this.y)
    },
    x: null,
    y: null
}, b2Vec2.Make = function(t, i) {
    return new b2Vec2(t, i)
};
var b2Mat22 = Class.create();
b2Mat22.prototype = {
    initialize: function(t, i, o) {
        if (null == t && (t = 0), this.col1 = new b2Vec2, this.col2 = new b2Vec2, null != i && null != o) this.col1.SetV(i), this.col2.SetV(o);
        else {
            var e = Math.cos(t),
                n = Math.sin(t);
            this.col1.x = e, this.col2.x = -n, this.col1.y = n, this.col2.y = e
        }
    },
    Set: function(t) {
        var i = Math.cos(t),
            o = Math.sin(t);
        this.col1.x = i, this.col2.x = -o, this.col1.y = o, this.col2.y = i
    },
    SetVV: function(t, i) {
        this.col1.SetV(t), this.col2.SetV(i)
    },
    Copy: function() {
        return new b2Mat22(0, this.col1, this.col2)
    },
    SetM: function(t) {
        this.col1.SetV(t.col1), this.col2.SetV(t.col2)
    },
    AddM: function(t) {
        this.col1.x += t.col1.x, this.col1.y += t.col1.y, this.col2.x += t.col2.x, this.col2.y += t.col2.y
    },
    SetIdentity: function() {
        this.col1.x = 1, this.col2.x = 0, this.col1.y = 0, this.col2.y = 1
    },
    SetZero: function() {
        this.col1.x = 0, this.col2.x = 0, this.col1.y = 0, this.col2.y = 0
    },
    Invert: function(t) {
        var i = this.col1.x,
            o = this.col2.x,
            e = this.col1.y,
            n = this.col2.y,
            s = i * n - o * e;
        return s = 1 / s, t.col1.x = s * n, t.col2.x = -s * o, t.col1.y = -s * e, t.col2.y = s * i, t
    },
    Solve: function(t, i, o) {
        var e = this.col1.x,
            n = this.col2.x,
            s = this.col1.y,
            a = this.col2.y,
            r = e * a - n * s;
        return r = 1 / r, t.x = r * (a * i - n * o), t.y = r * (e * o - s * i), t
    },
    Abs: function() {
        this.col1.Abs(), this.col2.Abs()
    },
    col1: new b2Vec2,
    col2: new b2Vec2
};
var b2Math = Class.create();
b2Math.prototype = {
    initialize: function() {}
}, b2Math.b2IsValid = function(t) {
    return isFinite(t)
}, b2Math.b2Dot = function(t, i) {
    return t.x * i.x + t.y * i.y
}, b2Math.b2CrossVV = function(t, i) {
    return t.x * i.y - t.y * i.x
}, b2Math.b2CrossVF = function(t, i) {
    return new b2Vec2(i * t.y, -i * t.x)
}, b2Math.b2CrossFV = function(t, i) {
    return new b2Vec2(-t * i.y, t * i.x)
}, b2Math.b2MulMV = function(t, i) {
    return new b2Vec2(t.col1.x * i.x + t.col2.x * i.y, t.col1.y * i.x + t.col2.y * i.y)
}, b2Math.b2MulTMV = function(t, i) {
    return new b2Vec2(b2Math.b2Dot(i, t.col1), b2Math.b2Dot(i, t.col2))
}, b2Math.AddVV = function(t, i) {
    return new b2Vec2(t.x + i.x, t.y + i.y)
}, b2Math.SubtractVV = function(t, i) {
    return new b2Vec2(t.x - i.x, t.y - i.y)
}, b2Math.MulFV = function(t, i) {
    return new b2Vec2(t * i.x, t * i.y)
}, b2Math.AddMM = function(t, i) {
    return new b2Mat22(0, b2Math.AddVV(t.col1, i.col1), b2Math.AddVV(t.col2, i.col2))
}, b2Math.b2MulMM = function(t, i) {
    return new b2Mat22(0, b2Math.b2MulMV(t, i.col1), b2Math.b2MulMV(t, i.col2))
}, b2Math.b2MulTMM = function(t, i) {
    var o = new b2Vec2(b2Math.b2Dot(t.col1, i.col1), b2Math.b2Dot(t.col2, i.col1)),
        e = new b2Vec2(b2Math.b2Dot(t.col1, i.col2), b2Math.b2Dot(t.col2, i.col2));
    return new b2Mat22(0, o, e)
}, b2Math.b2Abs = function(t) {
    return t > 0 ? t : -t
}, b2Math.b2AbsV = function(t) {
    return new b2Vec2(b2Math.b2Abs(t.x), b2Math.b2Abs(t.y))
}, b2Math.b2AbsM = function(t) {
    return new b2Mat22(0, b2Math.b2AbsV(t.col1), b2Math.b2AbsV(t.col2))
}, b2Math.b2Min = function(t, i) {
    return t < i ? t : i
}, b2Math.b2MinV = function(t, i) {
    return new b2Vec2(b2Math.b2Min(t.x, i.x), b2Math.b2Min(t.y, i.y))
}, b2Math.b2Max = function(t, i) {
    return t > i ? t : i
}, b2Math.b2MaxV = function(t, i) {
    return new b2Vec2(b2Math.b2Max(t.x, i.x), b2Math.b2Max(t.y, i.y))
}, b2Math.b2Clamp = function(t, i, o) {
    return b2Math.b2Max(i, b2Math.b2Min(t, o))
}, b2Math.b2ClampV = function(t, i, o) {
    return b2Math.b2MaxV(i, b2Math.b2MinV(t, o))
}, b2Math.b2Swap = function(t, i) {
    var o = t[0];
    t[0] = i[0], i[0] = o
}, b2Math.b2Random = function() {
    return 2 * Math.random() - 1
}, b2Math.b2NextPowerOfTwo = function(t) {
    return t |= t >> 1 & 2147483647, t |= t >> 2 & 1073741823, t |= t >> 4 & 268435455, t |= t >> 8 & 16777215, (t |= t >> 16 & 65535) + 1
}, b2Math.b2IsPowerOfTwo = function(t) {
    return t > 0 && 0 == (t & t - 1)
}, b2Math.tempVec2 = new b2Vec2, b2Math.tempVec3 = new b2Vec2, b2Math.tempVec4 = new b2Vec2, b2Math.tempVec5 = new b2Vec2, b2Math.tempMat = new b2Mat22;
var b2AABB = Class.create();
b2AABB.prototype = {
    IsValid: function() {
        var t = this.maxVertex.x,
            i = this.maxVertex.y;
        t = this.maxVertex.x, i = this.maxVertex.y, t -= this.minVertex.x, i -= this.minVertex.y;
        var o = t >= 0 && i >= 0;
        return o = o && this.minVertex.IsValid() && this.maxVertex.IsValid()
    },
    minVertex: new b2Vec2,
    maxVertex: new b2Vec2,
    initialize: function() {
        this.minVertex = new b2Vec2, this.maxVertex = new b2Vec2
    }
};
var b2Bound = Class.create();
b2Bound.prototype = {
    IsLower: function() {
        return 0 == (1 & this.value)
    },
    IsUpper: function() {
        return 1 == (1 & this.value)
    },
    Swap: function(t) {
        var i = this.value,
            o = this.proxyId,
            e = this.stabbingCount;
        this.value = t.value, this.proxyId = t.proxyId, this.stabbingCount = t.stabbingCount, t.value = i, t.proxyId = o, t.stabbingCount = e
    },
    value: 0,
    proxyId: 0,
    stabbingCount: 0,
    initialize: function() {}
};
var b2BoundValues = Class.create();
b2BoundValues.prototype = {
    lowerValues: [0, 0],
    upperValues: [0, 0],
    initialize: function() {
        this.lowerValues = [0, 0], this.upperValues = [0, 0]
    }
};
var b2Pair = Class.create();
b2Pair.prototype = {
    SetBuffered: function() {
        this.status |= b2Pair.e_pairBuffered
    },
    ClearBuffered: function() {
        this.status &= ~b2Pair.e_pairBuffered
    },
    IsBuffered: function() {
        return (this.status & b2Pair.e_pairBuffered) == b2Pair.e_pairBuffered
    },
    SetRemoved: function() {
        this.status |= b2Pair.e_pairRemoved
    },
    ClearRemoved: function() {
        this.status &= ~b2Pair.e_pairRemoved
    },
    IsRemoved: function() {
        return (this.status & b2Pair.e_pairRemoved) == b2Pair.e_pairRemoved
    },
    SetFinal: function() {
        this.status |= b2Pair.e_pairFinal
    },
    IsFinal: function() {
        return (this.status & b2Pair.e_pairFinal) == b2Pair.e_pairFinal
    },
    userData: null,
    proxyId1: 0,
    proxyId2: 0,
    next: 0,
    status: 0,
    initialize: function() {}
}, b2Pair.b2_nullPair = b2Settings.USHRT_MAX, b2Pair.b2_nullProxy = b2Settings.USHRT_MAX, b2Pair.b2_tableCapacity = b2Settings.b2_maxPairs, b2Pair.b2_tableMask = b2Pair.b2_tableCapacity - 1, b2Pair.e_pairBuffered = 1, b2Pair.e_pairRemoved = 2, b2Pair.e_pairFinal = 4;
var b2PairCallback = Class.create();
b2PairCallback.prototype = {
    PairAdded: function(t, i) {
        return null
    },
    PairRemoved: function(t, i, o) {},
    initialize: function() {}
};
var b2BufferedPair = Class.create();
b2BufferedPair.prototype = {
    proxyId1: 0,
    proxyId2: 0,
    initialize: function() {}
};
var b2PairManager = Class.create();
b2PairManager.prototype = {
    initialize: function() {
        var t = 0;
        for (this.m_hashTable = new Array(b2Pair.b2_tableCapacity), t = 0; t < b2Pair.b2_tableCapacity; ++t) this.m_hashTable[t] = b2Pair.b2_nullPair;
        for (this.m_pairs = new Array(b2Settings.b2_maxPairs), t = 0; t < b2Settings.b2_maxPairs; ++t) this.m_pairs[t] = new b2Pair;
        for (this.m_pairBuffer = new Array(b2Settings.b2_maxPairs), t = 0; t < b2Settings.b2_maxPairs; ++t) this.m_pairBuffer[t] = new b2BufferedPair;
        for (t = 0; t < b2Settings.b2_maxPairs; ++t) this.m_pairs[t].proxyId1 = b2Pair.b2_nullProxy, this.m_pairs[t].proxyId2 = b2Pair.b2_nullProxy, this.m_pairs[t].userData = null, this.m_pairs[t].status = 0, this.m_pairs[t].next = t + 1;
        this.m_pairs[b2Settings.b2_maxPairs - 1].next = b2Pair.b2_nullPair, this.m_pairCount = 0
    },
    Initialize: function(t, i) {
        this.m_broadPhase = t, this.m_callback = i
    },
    AddBufferedPair: function(t, i) {
        var o = this.AddPair(t, i);
        0 == o.IsBuffered() && (o.SetBuffered(), this.m_pairBuffer[this.m_pairBufferCount].proxyId1 = o.proxyId1, this.m_pairBuffer[this.m_pairBufferCount].proxyId2 = o.proxyId2, ++this.m_pairBufferCount), o.ClearRemoved(), b2BroadPhase.s_validate && this.ValidateBuffer()
    },
    RemoveBufferedPair: function(t, i) {
        var o = this.Find(t, i);
        null != o && (0 == o.IsBuffered() && (o.SetBuffered(), this.m_pairBuffer[this.m_pairBufferCount].proxyId1 = o.proxyId1, this.m_pairBuffer[this.m_pairBufferCount].proxyId2 = o.proxyId2, ++this.m_pairBufferCount), o.SetRemoved(), b2BroadPhase.s_validate && this.ValidateBuffer())
    },
    Commit: function() {
        var t = 0,
            i = 0,
            o = this.m_broadPhase.m_proxyPool;
        for (t = 0; t < this.m_pairBufferCount; ++t) {
            var e = this.Find(this.m_pairBuffer[t].proxyId1, this.m_pairBuffer[t].proxyId2);
            e.ClearBuffered();
            var n = o[e.proxyId1],
                s = o[e.proxyId2];
            e.IsRemoved() ? (1 == e.IsFinal() && this.m_callback.PairRemoved(n.userData, s.userData, e.userData), this.m_pairBuffer[i].proxyId1 = e.proxyId1, this.m_pairBuffer[i].proxyId2 = e.proxyId2, ++i) : 0 == e.IsFinal() && (e.userData = this.m_callback.PairAdded(n.userData, s.userData), e.SetFinal())
        }
        for (t = 0; t < i; ++t) this.RemovePair(this.m_pairBuffer[t].proxyId1, this.m_pairBuffer[t].proxyId2);
        this.m_pairBufferCount = 0, b2BroadPhase.s_validate && this.ValidateTable()
    },
    AddPair: function(t, i) {
        if (t > i) {
            var o = t;
            t = i, i = o
        }
        var e = b2PairManager.Hash(t, i) & b2Pair.b2_tableMask,
            n = n = this.FindHash(t, i, e);
        if (null != n) return n;
        var s = this.m_freePair;
        return n = this.m_pairs[s], this.m_freePair = n.next, n.proxyId1 = t, n.proxyId2 = i, n.status = 0, n.userData = null, n.next = this.m_hashTable[e], this.m_hashTable[e] = s, ++this.m_pairCount, n
    },
    RemovePair: function(t, i) {
        if (t > i) {
            var o = t;
            t = i, i = o
        }
        for (var e = b2PairManager.Hash(t, i) & b2Pair.b2_tableMask, n = this.m_hashTable[e], s = null; n != b2Pair.b2_nullPair;) {
            if (b2PairManager.Equals(this.m_pairs[n], t, i)) {
                var a = n;
                s ? s.next = this.m_pairs[n].next : this.m_hashTable[e] = this.m_pairs[n].next;
                var r = this.m_pairs[a],
                    l = r.userData;
                return r.next = this.m_freePair, r.proxyId1 = b2Pair.b2_nullProxy, r.proxyId2 = b2Pair.b2_nullProxy, r.userData = null, r.status = 0, this.m_freePair = a, --this.m_pairCount, l
            }
            n = (s = this.m_pairs[n]).next
        }
        return null
    },
    Find: function(t, i) {
        if (t > i) {
            var o = t;
            t = i, i = o
        }
        var e = b2PairManager.Hash(t, i) & b2Pair.b2_tableMask;
        return this.FindHash(t, i, e)
    },
    FindHash: function(t, i, o) {
        for (var e = this.m_hashTable[o]; e != b2Pair.b2_nullPair && 0 == b2PairManager.Equals(this.m_pairs[e], t, i);) e = this.m_pairs[e].next;
        return e == b2Pair.b2_nullPair ? null : this.m_pairs[e]
    },
    ValidateBuffer: function() {},
    ValidateTable: function() {},
    m_broadPhase: null,
    m_callback: null,
    m_pairs: null,
    m_freePair: 0,
    m_pairCount: 0,
    m_pairBuffer: null,
    m_pairBufferCount: 0,
    m_hashTable: null
}, b2PairManager.Hash = function(t, i) {
    var o = i << 16 & 4294901760 | t;
    return o = ~o + (o << 15 & 4294934528), o ^= o >> 12 & 1048575, o += o << 2 & 4294967292, o ^= o >> 4 & 268435455, o *= 2057, o ^= o >> 16 & 65535
}, b2PairManager.Equals = function(t, i, o) {
    return t.proxyId1 == i && t.proxyId2 == o
}, b2PairManager.EqualsPair = function(t, i) {
    return t.proxyId1 == i.proxyId1 && t.proxyId2 == i.proxyId2
};
var b2BroadPhase = Class.create();
b2BroadPhase.prototype = {
    initialize: function(t, i) {
        this.m_pairManager = new b2PairManager, this.m_proxyPool = new Array(b2Settings.b2_maxPairs), this.m_bounds = new Array(2 * b2Settings.b2_maxProxies), this.m_queryResults = new Array(b2Settings.b2_maxProxies), this.m_quantizationFactor = new b2Vec2;
        var o = 0;
        for (this.m_pairManager.Initialize(this, i), this.m_worldAABB = t, this.m_proxyCount = 0, o = 0; o < b2Settings.b2_maxProxies; o++) this.m_queryResults[o] = 0;
        for (this.m_bounds = new Array(2), o = 0; o < 2; o++) {
            this.m_bounds[o] = new Array(2 * b2Settings.b2_maxProxies);
            for (var e = 0; e < 2 * b2Settings.b2_maxProxies; e++) this.m_bounds[o][e] = new b2Bound
        }
        var n = t.maxVertex.x,
            s = t.maxVertex.y;
        n -= t.minVertex.x, s -= t.minVertex.y, this.m_quantizationFactor.x = b2Settings.USHRT_MAX / n, this.m_quantizationFactor.y = b2Settings.USHRT_MAX / s;
        var a;
        for (o = 0; o < b2Settings.b2_maxProxies - 1; ++o) a = new b2Proxy, this.m_proxyPool[o] = a, a.SetNext(o + 1), a.timeStamp = 0, a.overlapCount = b2BroadPhase.b2_invalid, a.userData = null;
        a = new b2Proxy, this.m_proxyPool[b2Settings.b2_maxProxies - 1] = a, a.SetNext(b2Pair.b2_nullProxy), a.timeStamp = 0, a.overlapCount = b2BroadPhase.b2_invalid, a.userData = null, this.m_freeProxy = 0, this.m_timeStamp = 1, this.m_queryResultCount = 0
    },
    InRange: function(t) {
        var i, o, e, n;
        return i = t.minVertex.x, o = t.minVertex.y, i -= this.m_worldAABB.maxVertex.x, o -= this.m_worldAABB.maxVertex.y, e = this.m_worldAABB.minVertex.x, n = this.m_worldAABB.minVertex.y, e -= t.maxVertex.x, n -= t.maxVertex.y, i = b2Math.b2Max(i, e), o = b2Math.b2Max(o, n), b2Math.b2Max(i, o) < 0
    },
    GetProxy: function(t) {
        return t == b2Pair.b2_nullProxy || 0 == this.m_proxyPool[t].IsValid() ? null : this.m_proxyPool[t]
    },
    CreateProxy: function(t, i) {
        var o, e = 0,
            n = this.m_freeProxy;
        o = this.m_proxyPool[n], this.m_freeProxy = o.GetNext(), o.overlapCount = 0, o.userData = i;
        var s = 2 * this.m_proxyCount,
            a = new Array,
            r = new Array;
        this.ComputeBounds(a, r, t);
        for (var l = 0; l < 2; ++l) {
            var m = this.m_bounds[l],
                _ = 0,
                h = 0,
                c = [_],
                u = [h];
            this.Query(c, u, a[l], r[l], m, s, l), _ = c[0], h = u[0];
            var y, b, p = new Array,
                d = 0,
                x = s - h;
            for (d = 0; d < x; d++) p[d] = new b2Bound, y = p[d], b = m[h + d], y.value = b.value, y.proxyId = b.proxyId, y.stabbingCount = b.stabbingCount;
            x = p.length;
            var f = h + 2;
            for (d = 0; d < x; d++) b = p[d], (y = m[f + d]).value = b.value, y.proxyId = b.proxyId, y.stabbingCount = b.stabbingCount;
            for (p = new Array, x = h - _, d = 0; d < x; d++) p[d] = new b2Bound, y = p[d], b = m[_ + d], y.value = b.value, y.proxyId = b.proxyId, y.stabbingCount = b.stabbingCount;
            for (x = p.length, f = _ + 1, d = 0; d < x; d++) b = p[d], (y = m[f + d]).value = b.value, y.proxyId = b.proxyId, y.stabbingCount = b.stabbingCount;
            for (++h, m[_].value = a[l], m[_].proxyId = n, m[h].value = r[l], m[h].proxyId = n, m[_].stabbingCount = 0 == _ ? 0 : m[_ - 1].stabbingCount, m[h].stabbingCount = m[h - 1].stabbingCount, e = _; e < h; ++e) m[e].stabbingCount++;
            for (e = _; e < s + 2; ++e) {
                var v = this.m_proxyPool[m[e].proxyId];
                m[e].IsLower() ? v.lowerBounds[l] = e : v.upperBounds[l] = e
            }
        }++this.m_proxyCount;
        for (var g = 0; g < this.m_queryResultCount; ++g) this.m_pairManager.AddBufferedPair(n, this.m_queryResults[g]);
        return this.m_pairManager.Commit(), this.m_queryResultCount = 0, this.IncrementTimeStamp(), n
    },
    DestroyProxy: function(t) {
        for (var i = this.m_proxyPool[t], o = 2 * this.m_proxyCount, e = 0; e < 2; ++e) {
            var n, s, a = this.m_bounds[e],
                r = i.lowerBounds[e],
                l = i.upperBounds[e],
                m = a[r].value,
                _ = a[l].value,
                h = new Array,
                c = 0,
                u = l - r - 1;
            for (c = 0; c < u; c++) h[c] = new b2Bound, n = h[c], s = a[r + 1 + c], n.value = s.value, n.proxyId = s.proxyId, n.stabbingCount = s.stabbingCount;
            u = h.length;
            var y = r;
            for (c = 0; c < u; c++) s = h[c], (n = a[y + c]).value = s.value, n.proxyId = s.proxyId, n.stabbingCount = s.stabbingCount;
            for (h = new Array, u = o - l - 1, c = 0; c < u; c++) h[c] = new b2Bound, n = h[c], s = a[l + 1 + c], n.value = s.value, n.proxyId = s.proxyId, n.stabbingCount = s.stabbingCount;
            for (u = h.length, y = l - 1, c = 0; c < u; c++) s = h[c], (n = a[y + c]).value = s.value, n.proxyId = s.proxyId, n.stabbingCount = s.stabbingCount;
            u = o - 2;
            for (var b = r; b < u; ++b) {
                var p = this.m_proxyPool[a[b].proxyId];
                a[b].IsLower() ? p.lowerBounds[e] = b : p.upperBounds[e] = b
            }
            u = l - 1;
            for (var d = r; d < u; ++d) a[d].stabbingCount--;
            this.Query([0], [0], m, _, a, o - 2, e)
        }
        for (var x = 0; x < this.m_queryResultCount; ++x) this.m_pairManager.RemoveBufferedPair(t, this.m_queryResults[x]);
        this.m_pairManager.Commit(), this.m_queryResultCount = 0, this.IncrementTimeStamp(), i.userData = null, i.overlapCount = b2BroadPhase.b2_invalid, i.lowerBounds[0] = b2BroadPhase.b2_invalid, i.lowerBounds[1] = b2BroadPhase.b2_invalid, i.upperBounds[0] = b2BroadPhase.b2_invalid, i.upperBounds[1] = b2BroadPhase.b2_invalid, i.SetNext(this.m_freeProxy), this.m_freeProxy = t, --this.m_proxyCount
    },
    MoveProxy: function(t, i) {
        var o, e, n, s, a = 0,
            r = 0,
            l = 0;
        if (!(t == b2Pair.b2_nullProxy || b2Settings.b2_maxProxies <= t) && 0 != i.IsValid()) {
            var m = 2 * this.m_proxyCount,
                _ = this.m_proxyPool[t],
                h = new b2BoundValues;
            this.ComputeBounds(h.lowerValues, h.upperValues, i);
            var c = new b2BoundValues;
            for (a = 0; a < 2; ++a) c.lowerValues[a] = this.m_bounds[a][_.lowerBounds[a]].value, c.upperValues[a] = this.m_bounds[a][_.upperBounds[a]].value;
            for (a = 0; a < 2; ++a) {
                var u = this.m_bounds[a],
                    y = _.lowerBounds[a],
                    b = _.upperBounds[a],
                    p = h.lowerValues[a],
                    d = h.upperValues[a],
                    x = p - u[y].value,
                    f = d - u[b].value;
                if (u[y].value = p, u[b].value = d, x < 0)
                    for (r = y; r > 0 && p < u[r - 1].value;) {
                        o = u[r];
                        var v = (e = u[r - 1]).proxyId,
                            g = this.m_proxyPool[e.proxyId];
                        e.stabbingCount++, 1 == e.IsUpper() ? (this.TestOverlap(h, g) && this.m_pairManager.AddBufferedPair(t, v), g.upperBounds[a]++, o.stabbingCount++) : (g.lowerBounds[a]++, o.stabbingCount--), _.lowerBounds[a]--, o.Swap(e), --r
                    }
                if (f > 0)
                    for (r = b; r < m - 1 && u[r + 1].value <= d;) o = u[r], l = (n = u[r + 1]).proxyId, s = this.m_proxyPool[l], n.stabbingCount++, 1 == n.IsLower() ? (this.TestOverlap(h, s) && this.m_pairManager.AddBufferedPair(t, l), s.lowerBounds[a]--, o.stabbingCount++) : (s.upperBounds[a]--, o.stabbingCount--), _.upperBounds[a]++, o.Swap(n), r++;
                if (x > 0)
                    for (r = y; r < m - 1 && u[r + 1].value <= p;) o = u[r], l = (n = u[r + 1]).proxyId, s = this.m_proxyPool[l], n.stabbingCount--, n.IsUpper() ? (this.TestOverlap(c, s) && this.m_pairManager.RemoveBufferedPair(t, l), s.upperBounds[a]--, o.stabbingCount--) : (s.lowerBounds[a]--, o.stabbingCount++), _.lowerBounds[a]++, o.Swap(n), r++;
                if (f < 0)
                    for (r = b; r > 0 && d < u[r - 1].value;) o = u[r], v = (e = u[r - 1]).proxyId, g = this.m_proxyPool[v], e.stabbingCount--, 1 == e.IsLower() ? (this.TestOverlap(c, g) && this.m_pairManager.RemoveBufferedPair(t, v), g.lowerBounds[a]++, o.stabbingCount--) : (g.upperBounds[a]++, o.stabbingCount++), _.upperBounds[a]--, o.Swap(e), r--
            }
        }
    },
    Commit: function() {
        this.m_pairManager.Commit()
    },
    QueryAABB: function(t, i, o) {
        var e = new Array,
            n = new Array;
        this.ComputeBounds(e, n, t);
        var s = [0],
            a = [0];
        this.Query(s, a, e[0], n[0], this.m_bounds[0], 2 * this.m_proxyCount, 0), this.Query(s, a, e[1], n[1], this.m_bounds[1], 2 * this.m_proxyCount, 1);
        for (var r = 0, l = 0; l < this.m_queryResultCount && r < o; ++l, ++r) {
            var m = this.m_proxyPool[this.m_queryResults[l]];
            i[l] = m.userData
        }
        return this.m_queryResultCount = 0, this.IncrementTimeStamp(), r
    },
    Validate: function() {
        for (var t = 0; t < 2; ++t)
            for (var i = this.m_bounds[t], o = 2 * this.m_proxyCount, e = 0, n = 0; n < o; ++n) 1 == i[n].IsLower() ? e++ : e--
    },
    ComputeBounds: function(t, i, o) {
        var e = o.minVertex.x,
            n = o.minVertex.y;
        e = b2Math.b2Min(e, this.m_worldAABB.maxVertex.x), n = b2Math.b2Min(n, this.m_worldAABB.maxVertex.y), e = b2Math.b2Max(e, this.m_worldAABB.minVertex.x), n = b2Math.b2Max(n, this.m_worldAABB.minVertex.y);
        var s = o.maxVertex.x,
            a = o.maxVertex.y;
        s = b2Math.b2Min(s, this.m_worldAABB.maxVertex.x), a = b2Math.b2Min(a, this.m_worldAABB.maxVertex.y), s = b2Math.b2Max(s, this.m_worldAABB.minVertex.x), a = b2Math.b2Max(a, this.m_worldAABB.minVertex.y), t[0] = this.m_quantizationFactor.x * (e - this.m_worldAABB.minVertex.x) & b2Settings.USHRT_MAX - 1, i[0] = this.m_quantizationFactor.x * (s - this.m_worldAABB.minVertex.x) & 65535 | 1, t[1] = this.m_quantizationFactor.y * (n - this.m_worldAABB.minVertex.y) & b2Settings.USHRT_MAX - 1, i[1] = this.m_quantizationFactor.y * (a - this.m_worldAABB.minVertex.y) & 65535 | 1
    },
    TestOverlapValidate: function(t, i) {
        for (var o = 0; o < 2; ++o) {
            var e = this.m_bounds[o];
            if (e[t.lowerBounds[o]].value > e[i.upperBounds[o]].value) return !1;
            if (e[t.upperBounds[o]].value < e[i.lowerBounds[o]].value) return !1
        }
        return !0
    },
    TestOverlap: function(t, i) {
        for (var o = 0; o < 2; ++o) {
            var e = this.m_bounds[o];
            if (t.lowerValues[o] > e[i.upperBounds[o]].value) return !1;
            if (t.upperValues[o] < e[i.lowerBounds[o]].value) return !1
        }
        return !0
    },
    Query: function(t, i, o, e, n, s, a) {
        for (var r = b2BroadPhase.BinarySearch(n, s, o), l = b2BroadPhase.BinarySearch(n, s, e), m = r; m < l; ++m) n[m].IsLower() && this.IncrementOverlapCount(n[m].proxyId);
        if (r > 0)
            for (var _ = r - 1, h = n[_].stabbingCount; h;) n[_].IsLower() && r <= this.m_proxyPool[n[_].proxyId].upperBounds[a] && (this.IncrementOverlapCount(n[_].proxyId), --h), --_;
        t[0] = r, i[0] = l
    },
    IncrementOverlapCount: function(t) {
        var i = this.m_proxyPool[t];
        i.timeStamp < this.m_timeStamp ? (i.timeStamp = this.m_timeStamp, i.overlapCount = 1) : (i.overlapCount = 2, this.m_queryResults[this.m_queryResultCount] = t, ++this.m_queryResultCount)
    },
    IncrementTimeStamp: function() {
        if (this.m_timeStamp == b2Settings.USHRT_MAX) {
            for (var t = 0; t < b2Settings.b2_maxProxies; ++t) this.m_proxyPool[t].timeStamp = 0;
            this.m_timeStamp = 1
        } else ++this.m_timeStamp
    },
    m_pairManager: new b2PairManager,
    m_proxyPool: new Array(b2Settings.b2_maxPairs),
    m_freeProxy: 0,
    m_bounds: new Array(2 * b2Settings.b2_maxProxies),
    m_queryResults: new Array(b2Settings.b2_maxProxies),
    m_queryResultCount: 0,
    m_worldAABB: null,
    m_quantizationFactor: new b2Vec2,
    m_proxyCount: 0,
    m_timeStamp: 0
}, b2BroadPhase.s_validate = !1, b2BroadPhase.b2_invalid = b2Settings.USHRT_MAX, b2BroadPhase.b2_nullEdge = b2Settings.USHRT_MAX, b2BroadPhase.BinarySearch = function(t, i, o) {
    for (var e = 0, n = i - 1; e <= n;) {
        var s = Math.floor((e + n) / 2);
        if (t[s].value > o) n = s - 1;
        else {
            if (!(t[s].value < o)) return s;
            e = s + 1
        }
    }
    return e
};
var b2Collision = Class.create();
b2Collision.prototype = {
    initialize: function() {}
}, b2Collision.b2_nullFeature = 255, b2Collision.ClipSegmentToLine = function(t, i, o, e) {
    var n = 0,
        s = i[0].v,
        a = i[1].v,
        r = b2Math.b2Dot(o, i[0].v) - e,
        l = b2Math.b2Dot(o, i[1].v) - e;
    if (r <= 0 && (t[n++] = i[0]), l <= 0 && (t[n++] = i[1]), r * l < 0) {
        var m = r / (r - l),
            _ = t[n].v;
        _.x = s.x + m * (a.x - s.x), _.y = s.y + m * (a.y - s.y), t[n].id = r > 0 ? i[0].id : i[1].id, ++n
    }
    return n
}, b2Collision.EdgeSeparation = function(t, i, o) {
    var e = t.m_vertices,
        n = o.m_vertexCount,
        s = o.m_vertices,
        a = t.m_normals[i].x,
        r = t.m_normals[i].y,
        l = a,
        m = t.m_R,
        _ = a = m.col1.x * l + m.col2.x * r,
        h = r = m.col1.y * l + m.col2.y * r;
    l = _ * (m = o.m_R).col1.x + h * m.col1.y, h = _ * m.col2.x + h * m.col2.y, _ = l;
    for (var c = 0, u = Number.MAX_VALUE, y = 0; y < n; ++y) {
        var b = s[y],
            p = b.x * _ + b.y * h;
        p < u && (u = p, c = y)
    }
    m = t.m_R;
    var d = t.m_position.x + (m.col1.x * e[i].x + m.col2.x * e[i].y),
        x = t.m_position.y + (m.col1.y * e[i].x + m.col2.y * e[i].y);
    m = o.m_R;
    var f = o.m_position.x + (m.col1.x * s[c].x + m.col2.x * s[c].y),
        v = o.m_position.y + (m.col1.y * s[c].x + m.col2.y * s[c].y);
    return (f -= d) * a + (v -= x) * r
}, b2Collision.FindMaxSeparation = function(t, i, o, e) {
    for (var n = i.m_vertexCount, s = o.m_position.x - i.m_position.x, a = o.m_position.y - i.m_position.y, r = s * i.m_R.col1.x + a * i.m_R.col1.y, l = s * i.m_R.col2.x + a * i.m_R.col2.y, m = 0, _ = -Number.MAX_VALUE, h = 0; h < n; ++h) {
        var c = i.m_normals[h].x * r + i.m_normals[h].y * l;
        c > _ && (_ = c, m = h)
    }
    var u = b2Collision.EdgeSeparation(i, m, o);
    if (u > 0 && 0 == e) return u;
    var y = m - 1 >= 0 ? m - 1 : n - 1,
        b = b2Collision.EdgeSeparation(i, y, o);
    if (b > 0 && 0 == e) return b;
    var p = m + 1 < n ? m + 1 : 0,
        d = b2Collision.EdgeSeparation(i, p, o);
    if (d > 0 && 0 == e) return d;
    var x, f = 0,
        v = 0;
    if (b > u && b > d) v = -1, f = y, x = b;
    else {
        if (!(d > u)) return t[0] = m, u;
        v = 1, f = p, x = d
    }
    for (;;) {
        if (m = -1 == v ? f - 1 >= 0 ? f - 1 : n - 1 : f + 1 < n ? f + 1 : 0, (u = b2Collision.EdgeSeparation(i, m, o)) > 0 && 0 == e) return u;
        if (!(u > x)) break;
        f = m, x = u
    }
    return t[0] = f, x
}, b2Collision.FindIncidentEdge = function(t, i, o, e) {
    var n = i.m_vertexCount,
        s = i.m_vertices,
        a = e.m_vertexCount,
        r = e.m_vertices,
        l = o,
        m = s[o + 1 == n ? 0 : o + 1],
        _ = m.x,
        h = m.y,
        c = _ -= (m = s[l]).x;
    _ = h -= m.y, h = -c;
    var u = 1 / Math.sqrt(_ * _ + h * h),
        y = _ *= u,
        b = h *= u;
    c = y;
    var p = i.m_R,
        d = y = p.col1.x * c + p.col2.x * b,
        x = b = p.col1.y * c + p.col2.y * b;
    c = d * (p = e.m_R).col1.x + x * p.col1.y, x = d * p.col2.x + x * p.col2.y, d = c;
    for (var f = 0, v = 0, g = Number.MAX_VALUE, M = 0; M < a; ++M) {
        var S = M,
            C = M + 1 < a ? M + 1 : 0,
            V = (m = r[C]).x,
            w = m.y;
        c = V -= (m = r[S]).x, V = w -= m.y, w = -c;
        var A = (V *= u = 1 / Math.sqrt(V * V + w * w)) * d + (w *= u) * x;
        A < g && (g = A, f = S, v = C)
    }
    var I;
    (m = (I = t[0]).v).SetV(r[f]), m.MulM(e.m_R), m.Add(e.m_position), I.id.features.referenceFace = o, I.id.features.incidentEdge = f, I.id.features.incidentVertex = f, (m = (I = t[1]).v).SetV(r[v]), m.MulM(e.m_R), m.Add(e.m_position), I.id.features.referenceFace = o, I.id.features.incidentEdge = f, I.id.features.incidentVertex = v
}, b2Collision.b2CollidePolyTempVec = new b2Vec2, b2Collision.b2CollidePoly = function(t, i, o, e) {
    t.pointCount = 0;
    var n = 0,
        s = [n],
        a = b2Collision.FindMaxSeparation(s, i, o, e);
    if (n = s[0], !(a > 0 && 0 == e)) {
        var r = 0,
            l = [r],
            m = b2Collision.FindMaxSeparation(l, o, i, e);
        if (r = l[0], !(m > 0 && 0 == e)) {
            var _, h, c = 0,
                u = 0;
            m > .98 * a + .001 ? (_ = o, h = i, c = r, u = 1) : (_ = i, h = o, c = n, u = 0);
            var y = [new ClipVertex, new ClipVertex];
            b2Collision.FindIncidentEdge(y, _, c, h);
            var b = _.m_vertexCount,
                p = _.m_vertices,
                d = p[c],
                x = c + 1 < b ? p[c + 1] : p[0],
                f = (x.x, d.x, x.y, d.y, x.x - d.x),
                v = x.y - d.y,
                g = f,
                M = _.m_R;
            f = M.col1.x * g + M.col2.x * v, v = M.col1.y * g + M.col2.y * v;
            var S = 1 / Math.sqrt(f * f + v * v),
                C = f *= S,
                V = v *= S;
            g = C, C = V, V = -g;
            var w = d.x,
                A = d.y;
            g = w, w = (M = _.m_R).col1.x * g + M.col2.x * A, A = M.col1.y * g + M.col2.y * A, w += _.m_position.x, A += _.m_position.y;
            var I = x.x,
                P = x.y;
            g = I, I = (M = _.m_R).col1.x * g + M.col2.x * P, P = M.col1.y * g + M.col2.y * P;
            var B = C * w + V * A,
                R = -(f * w + v * A),
                J = f * (I += _.m_position.x) + v * (P += _.m_position.y),
                L = [new ClipVertex, new ClipVertex],
                D = [new ClipVertex, new ClipVertex];
            if (b2Collision.b2CollidePolyTempVec.Set(-f, -v), !(b2Collision.ClipSegmentToLine(L, y, b2Collision.b2CollidePolyTempVec, R) < 2 || (b2Collision.b2CollidePolyTempVec.Set(f, v), b2Collision.ClipSegmentToLine(D, L, b2Collision.b2CollidePolyTempVec, J) < 2))) {
                u ? t.normal.Set(-C, -V) : t.normal.Set(C, V);
                for (var F = 0, k = 0; k < b2Settings.b2_maxManifoldPoints; ++k) {
                    var j = D[k].v,
                        T = C * j.x + V * j.y - B;
                    if (T <= 0 || 1 == e) {
                        var z = t.points[F];
                        z.separation = T, z.position.SetV(D[k].v), z.id.Set(D[k].id), z.id.features.flip = u, ++F
                    }
                }
                t.pointCount = F
            }
        }
    }
}, b2Collision.b2CollideCircle = function(t, i, o, e) {
    t.pointCount = 0;
    var n = o.m_position.x - i.m_position.x,
        s = o.m_position.y - i.m_position.y,
        a = n * n + s * s,
        r = i.m_radius + o.m_radius;
    if (!(a > r * r && 0 == e)) {
        var l;
        if (a < Number.MIN_VALUE) l = -r, t.normal.Set(0, 1);
        else {
            var m = Math.sqrt(a);
            l = m - r;
            var _ = 1 / m;
            t.normal.x = _ * n, t.normal.y = _ * s
        }
        t.pointCount = 1;
        var h = t.points[0];
        h.id.set_key(0), h.separation = l, h.position.x = o.m_position.x - o.m_radius * t.normal.x, h.position.y = o.m_position.y - o.m_radius * t.normal.y
    }
}, b2Collision.b2CollidePolyAndCircle = function(t, i, o, e) {
    t.pointCount = 0;
    var n, s, a, r = o.m_position.x - i.m_position.x,
        l = o.m_position.y - i.m_position.y,
        m = i.m_R,
        _ = r * m.col1.x + l * m.col1.y;
    l = r * m.col2.x + l * m.col2.y, r = _;
    for (var h, c = 0, u = -Number.MAX_VALUE, y = o.m_radius, b = 0; b < i.m_vertexCount; ++b) {
        var p = i.m_normals[b].x * (r - i.m_vertices[b].x) + i.m_normals[b].y * (l - i.m_vertices[b].y);
        if (p > y) return;
        p > u && (u = p, c = b)
    }
    if (u < Number.MIN_VALUE) {
        t.pointCount = 1;
        var d = i.m_normals[c];
        return t.normal.x = m.col1.x * d.x + m.col2.x * d.y, t.normal.y = m.col1.y * d.x + m.col2.y * d.y, n = t.points[0], n.id.features.incidentEdge = c, n.id.features.incidentVertex = b2Collision.b2_nullFeature, n.id.features.referenceFace = b2Collision.b2_nullFeature, n.id.features.flip = 0, n.position.x = o.m_position.x - y * t.normal.x, n.position.y = o.m_position.y - y * t.normal.y, void(n.separation = u - y)
    }
    var x = c,
        f = x + 1 < i.m_vertexCount ? x + 1 : 0,
        v = i.m_vertices[f].x - i.m_vertices[x].x,
        g = i.m_vertices[f].y - i.m_vertices[x].y,
        M = Math.sqrt(v * v + g * g);
    if (v /= M, g /= M, M < Number.MIN_VALUE) {
        if (s = r - i.m_vertices[x].x, a = l - i.m_vertices[x].y, h = Math.sqrt(s * s + a * a), s /= h, a /= h, h > y) return;
        return t.pointCount = 1, t.normal.Set(m.col1.x * s + m.col2.x * a, m.col1.y * s + m.col2.y * a), n = t.points[0], n.id.features.incidentEdge = b2Collision.b2_nullFeature, n.id.features.incidentVertex = x, n.id.features.referenceFace = b2Collision.b2_nullFeature, n.id.features.flip = 0, n.position.x = o.m_position.x - y * t.normal.x, n.position.y = o.m_position.y - y * t.normal.y, void(n.separation = h - y)
    }
    var S = (r - i.m_vertices[x].x) * v + (l - i.m_vertices[x].y) * g;
    (n = t.points[0]).id.features.incidentEdge = b2Collision.b2_nullFeature, n.id.features.incidentVertex = b2Collision.b2_nullFeature, n.id.features.referenceFace = b2Collision.b2_nullFeature, n.id.features.flip = 0;
    var C, V;
    S <= 0 ? (C = i.m_vertices[x].x, V = i.m_vertices[x].y, n.id.features.incidentVertex = x) : S >= M ? (C = i.m_vertices[f].x, V = i.m_vertices[f].y, n.id.features.incidentVertex = f) : (C = v * S + i.m_vertices[x].x, V = g * S + i.m_vertices[x].y, n.id.features.incidentEdge = x), s = r - C, a = l - V, s /= h = Math.sqrt(s * s + a * a), a /= h, h > y || (t.pointCount = 1, t.normal.Set(m.col1.x * s + m.col2.x * a, m.col1.y * s + m.col2.y * a), n.position.x = o.m_position.x - y * t.normal.x, n.position.y = o.m_position.y - y * t.normal.y, n.separation = h - y)
}, b2Collision.b2TestOverlap = function(t, i) {
    var o = i.minVertex,
        e = t.maxVertex,
        n = o.x - e.x,
        s = o.y - e.y;
    o = t.minVertex, e = i.maxVertex;
    var a = o.x - e.x,
        r = o.y - e.y;
    return !(n > 0 || s > 0) && !(a > 0 || r > 0)
};
var Features = Class.create();
Features.prototype = {
    set_referenceFace: function(t) {
        this._referenceFace = t, this._m_id._key = 4294967040 & this._m_id._key | 255 & this._referenceFace
    },
    get_referenceFace: function() {
        return this._referenceFace
    },
    _referenceFace: 0,
    set_incidentEdge: function(t) {
        this._incidentEdge = t, this._m_id._key = 4294902015 & this._m_id._key | this._incidentEdge << 8 & 65280
    },
    get_incidentEdge: function() {
        return this._incidentEdge
    },
    _incidentEdge: 0,
    set_incidentVertex: function(t) {
        this._incidentVertex = t, this._m_id._key = 4278255615 & this._m_id._key | this._incidentVertex << 16 & 16711680
    },
    get_incidentVertex: function() {
        return this._incidentVertex
    },
    _incidentVertex: 0,
    set_flip: function(t) {
        this._flip = t, this._m_id._key = 16777215 & this._m_id._key | this._flip << 24 & 4278190080
    },
    get_flip: function() {
        return this._flip
    },
    _flip: 0,
    _m_id: null,
    initialize: function() {}
};
var b2ContactID = Class.create();
b2ContactID.prototype = {
    initialize: function() {
        this.features = new Features, this.features._m_id = this
    },
    Set: function(t) {
        this.set_key(t._key)
    },
    Copy: function() {
        var t = new b2ContactID;
        return t.set_key(this._key), t
    },
    get_key: function() {
        return this._key
    },
    set_key: function(t) {
        this._key = t, this.features._referenceFace = 255 & this._key, this.features._incidentEdge = (65280 & this._key) >> 8 & 255, this.features._incidentVertex = (16711680 & this._key) >> 16 & 255, this.features._flip = (4278190080 & this._key) >> 24 & 255
    },
    features: new Features,
    _key: 0
};
var b2ContactPoint = Class.create();
b2ContactPoint.prototype = {
    position: new b2Vec2,
    separation: null,
    normalImpulse: null,
    tangentImpulse: null,
    id: new b2ContactID,
    initialize: function() {
        this.position = new b2Vec2, this.id = new b2ContactID
    }
};
var b2Distance = Class.create();
b2Distance.prototype = {
    initialize: function() {}
}, b2Distance.ProcessTwo = function(t, i, o, e, n) {
    var s = -n[1].x,
        a = -n[1].y,
        r = n[0].x - n[1].x,
        l = n[0].y - n[1].y,
        m = Math.sqrt(r * r + l * l),
        _ = s * (r /= m) + a * (l /= m);
    return _ <= 0 || m < Number.MIN_VALUE ? (t.SetV(o[1]), i.SetV(e[1]), o[0].SetV(o[1]), e[0].SetV(e[1]), n[0].SetV(n[1]), 1) : (_ /= m, t.x = o[1].x + _ * (o[0].x - o[1].x), t.y = o[1].y + _ * (o[0].y - o[1].y), i.x = e[1].x + _ * (e[0].x - e[1].x), i.y = e[1].y + _ * (e[0].y - e[1].y), 2)
}, b2Distance.ProcessThree = function(t, i, o, e, n) {
    var s = n[0].x,
        a = n[0].y,
        r = n[1].x,
        l = n[1].y,
        m = n[2].x,
        _ = n[2].y,
        h = r - s,
        c = l - a,
        u = m - s,
        y = _ - a,
        b = m - r,
        p = _ - l,
        d = -(s * u + a * y),
        x = m * u + _ * y,
        f = -(r * b + l * p),
        v = m * b + _ * p;
    if (x <= 0 && v <= 0) return t.SetV(o[2]), i.SetV(e[2]), o[0].SetV(o[2]), e[0].SetV(e[2]), n[0].SetV(n[2]), 1;
    var g = h * y - c * u,
        M = g * (s * l - a * r),
        S = g * (r * _ - l * m);
    if (S <= 0 && f >= 0 && v >= 0) {
        V = f / (f + v);
        return t.x = o[1].x + V * (o[2].x - o[1].x), t.y = o[1].y + V * (o[2].y - o[1].y), i.x = e[1].x + V * (e[2].x - e[1].x), i.y = e[1].y + V * (e[2].y - e[1].y), o[0].SetV(o[2]), e[0].SetV(e[2]), n[0].SetV(n[2]), 2
    }
    var C = g * (m * a - _ * s);
    if (C <= 0 && d >= 0 && x >= 0) {
        var V = d / (d + x);
        return t.x = o[0].x + V * (o[2].x - o[0].x), t.y = o[0].y + V * (o[2].y - o[0].y), i.x = e[0].x + V * (e[2].x - e[0].x), i.y = e[0].y + V * (e[2].y - e[0].y), o[1].SetV(o[2]), e[1].SetV(e[2]), n[1].SetV(n[2]), 2
    }
    var w = S + C + M,
        A = S * (w = 1 / w),
        I = C * w,
        P = 1 - A - I;
    return t.x = A * o[0].x + I * o[1].x + P * o[2].x, t.y = A * o[0].y + I * o[1].y + P * o[2].y, i.x = A * e[0].x + I * e[1].x + P * e[2].x, i.y = A * e[0].y + I * e[1].y + P * e[2].y, 3
}, b2Distance.InPoinsts = function(t, i, o) {
    for (var e = 0; e < o; ++e)
        if (t.x == i[e].x && t.y == i[e].y) return !0;
    return !1
}, b2Distance.Distance = function(t, i, o, e) {
    var n = new Array(3),
        s = new Array(3),
        a = new Array(3),
        r = 0;
    t.SetV(o.m_position), i.SetV(e.m_position);
    for (var l = 0, m = 0; m < 20; ++m) {
        var _ = i.x - t.x,
            h = i.y - t.y,
            c = o.Support(_, h),
            u = e.Support(-_, -h);
        l = _ * _ + h * h;
        var y = u.x - c.x,
            b = u.y - c.y;
        if (l - b2Dot(_ * y + h * b) <= .01 * l) return 0 == r && (t.SetV(c), i.SetV(u)), b2Distance.g_GJK_Iterations = m, Math.sqrt(l);
        switch (r) {
            case 0:
                n[0].SetV(c), s[0].SetV(u), a[0] = w, t.SetV(n[0]), i.SetV(s[0]), ++r;
                break;
            case 1:
                n[1].SetV(c), s[1].SetV(u), a[1].x = y, a[1].y = b, r = b2Distance.ProcessTwo(t, i, n, s, a);
                break;
            case 2:
                n[2].SetV(c), s[2].SetV(u), a[2].x = y, a[2].y = b, r = b2Distance.ProcessThree(t, i, n, s, a)
        }
        if (3 == r) return b2Distance.g_GJK_Iterations = m, 0;
        for (var p = -Number.MAX_VALUE, d = 0; d < r; ++d) p = b2Math.b2Max(p, a[d].x * a[d].x + a[d].y * a[d].y);
        if (3 == r || l <= 100 * Number.MIN_VALUE * p) return b2Distance.g_GJK_Iterations = m, Math.sqrt(l)
    }
    return b2Distance.g_GJK_Iterations = 20, Math.sqrt(l)
}, b2Distance.g_GJK_Iterations = 0;
var b2Manifold = Class.create();
b2Manifold.prototype = {
    initialize: function() {
        this.points = new Array(b2Settings.b2_maxManifoldPoints);
        for (var t = 0; t < b2Settings.b2_maxManifoldPoints; t++) this.points[t] = new b2ContactPoint;
        this.normal = new b2Vec2
    },
    points: null,
    normal: null,
    pointCount: 0
};
var b2OBB = Class.create();
b2OBB.prototype = {
    R: new b2Mat22,
    center: new b2Vec2,
    extents: new b2Vec2,
    initialize: function() {
        this.R = new b2Mat22, this.center = new b2Vec2, this.extents = new b2Vec2
    }
};
var b2Proxy = Class.create();
b2Proxy.prototype = {
    GetNext: function() {
        return this.lowerBounds[0]
    },
    SetNext: function(t) {
        this.lowerBounds[0] = t
    },
    IsValid: function() {
        return this.overlapCount != b2BroadPhase.b2_invalid
    },
    lowerBounds: [0, 0],
    upperBounds: [0, 0],
    overlapCount: 0,
    timeStamp: 0,
    userData: null,
    initialize: function() {
        this.lowerBounds = [0, 0], this.upperBounds = [0, 0]
    }
};
var ClipVertex = Class.create();
ClipVertex.prototype = {
    v: new b2Vec2,
    id: new b2ContactID,
    initialize: function() {
        this.v = new b2Vec2, this.id = new b2ContactID
    }
};
var b2Shape = Class.create();
b2Shape.prototype = {
    TestPoint: function(t) {
        return !1
    },
    GetUserData: function() {
        return this.m_userData
    },
    GetType: function() {
        return this.m_type
    },
    GetBody: function() {
        return this.m_body
    },
    GetPosition: function() {
        return this.m_position
    },
    GetRotationMatrix: function() {
        return this.m_R
    },
    ResetProxy: function(t) {},
    GetNext: function() {
        return this.m_next
    },
    initialize: function(t, i) {
        this.m_R = new b2Mat22, this.m_position = new b2Vec2, this.m_userData = t.userData, this.m_friction = t.friction, this.m_restitution = t.restitution, this.m_body = i, this.m_proxyId = b2Pair.b2_nullProxy, this.m_maxRadius = 0, this.m_categoryBits = t.categoryBits, this.m_maskBits = t.maskBits, this.m_groupIndex = t.groupIndex
    },
    DestroyProxy: function() {
        this.m_proxyId != b2Pair.b2_nullProxy && (this.m_body.m_world.m_broadPhase.DestroyProxy(this.m_proxyId), this.m_proxyId = b2Pair.b2_nullProxy)
    },
    Synchronize: function(t, i, o, e) {},
    QuickSync: function(t, i) {},
    Support: function(t, i, o) {},
    GetMaxRadius: function() {
        return this.m_maxRadius
    },
    m_next: null,
    m_R: new b2Mat22,
    m_position: new b2Vec2,
    m_type: 0,
    m_userData: null,
    m_body: null,
    m_friction: null,
    m_restitution: null,
    m_maxRadius: null,
    m_proxyId: 0,
    m_categoryBits: 0,
    m_maskBits: 0,
    m_groupIndex: 0
}, b2Shape.Create = function(t, i, o) {
    switch (t.type) {
        case b2Shape.e_circleShape:
            return new b2CircleShape(t, i, o);
        case b2Shape.e_boxShape:
        case b2Shape.e_polyShape:
            return new b2PolyShape(t, i, o)
    }
    return null
}, b2Shape.Destroy = function(t) {
    t.m_proxyId != b2Pair.b2_nullProxy && t.m_body.m_world.m_broadPhase.DestroyProxy(t.m_proxyId)
}, b2Shape.e_unknownShape = -1, b2Shape.e_circleShape = 0, b2Shape.e_boxShape = 1, b2Shape.e_polyShape = 2, b2Shape.e_meshShape = 3, b2Shape.e_shapeTypeCount = 4, b2Shape.PolyMass = function(t, i, o, e) {
    var n = new b2Vec2;
    n.SetZero();
    for (var s = 0, a = 0, r = new b2Vec2(0, 0), l = 0; l < o; ++l) {
        var m = r,
            _ = i[l],
            h = l + 1 < o ? i[l + 1] : i[0],
            c = b2Math.SubtractVV(_, m),
            u = b2Math.SubtractVV(h, m),
            y = b2Math.b2CrossVV(c, u),
            b = .5 * y;
        s += b;
        var p = new b2Vec2;
        p.SetV(m), p.Add(_), p.Add(h), p.Multiply(1 / 3 * b), n.Add(p);
        var d = m.x,
            x = m.y,
            f = c.x,
            v = c.y,
            g = u.x,
            M = u.y;
        a += y * (1 / 3 * (.25 * (f * f + g * f + g * g) + (d * f + d * g)) + .5 * d * d + (1 / 3 * (.25 * (v * v + M * v + M * M) + (x * v + x * M)) + .5 * x * x))
    }
    t.mass = e * s, n.Multiply(1 / s), t.center = n, a = e * (a - s * b2Math.b2Dot(n, n)), t.I = a
}, b2Shape.PolyCentroid = function(t, i, o) {
    for (var e = 0, n = 0, s = 0, a = 0; a < i; ++a) {
        var r = t[a].x,
            l = t[a].y,
            m = a + 1 < i ? t[a + 1].x : t[0].x,
            _ = a + 1 < i ? t[a + 1].y : t[0].y,
            h = .5 * ((r - 0) * (_ - 0) - (l - 0) * (m - 0));
        s += h, e += h * (1 / 3) * (0 + r + m), n += h * (1 / 3) * (0 + l + _)
    }
    e *= 1 / s, n *= 1 / s, o.Set(e, n)
};
var b2ShapeDef = Class.create();
b2ShapeDef.prototype = {
    initialize: function() {
        this.type = b2Shape.e_unknownShape, this.userData = null, this.localPosition = new b2Vec2(0, 0), this.localRotation = 0, this.friction = .2, this.restitution = 0, this.density = 0, this.categoryBits = 1, this.maskBits = 65535, this.groupIndex = 0
    },
    ComputeMass: function(t) {
        switch (t.center = new b2Vec2(0, 0), 0 == this.density && (t.mass = 0, t.center.Set(0, 0), t.I = 0), this.type) {
            case b2Shape.e_circleShape:
                var i = this;
                t.mass = this.density * b2Settings.b2_pi * i.radius * i.radius, t.center.Set(0, 0), t.I = .5 * t.mass * i.radius * i.radius;
                break;
            case b2Shape.e_boxShape:
                var o = this;
                t.mass = 4 * this.density * o.extents.x * o.extents.y, t.center.Set(0, 0), t.I = t.mass / 3 * b2Math.b2Dot(o.extents, o.extents);
                break;
            case b2Shape.e_polyShape:
                var e = this;
                b2Shape.PolyMass(t, e.vertices, e.vertexCount, this.density);
                break;
            default:
                t.mass = 0, t.center.Set(0, 0), t.I = 0
        }
    },
    type: 0,
    userData: null,
    localPosition: null,
    localRotation: null,
    friction: null,
    restitution: null,
    density: null,
    categoryBits: 0,
    maskBits: 0,
    groupIndex: 0
};
var b2BoxDef = Class.create();
Object.extend(b2BoxDef.prototype, b2ShapeDef.prototype), Object.extend(b2BoxDef.prototype, {
    initialize: function() {
        this.type = b2Shape.e_unknownShape, this.userData = null, this.localPosition = new b2Vec2(0, 0), this.localRotation = 0, this.friction = .2, this.restitution = 0, this.density = 0, this.categoryBits = 1, this.maskBits = 65535, this.groupIndex = 0, this.type = b2Shape.e_boxShape, this.extents = new b2Vec2(1, 1)
    },
    extents: null
});
var b2CircleDef = Class.create();
Object.extend(b2CircleDef.prototype, b2ShapeDef.prototype), Object.extend(b2CircleDef.prototype, {
    initialize: function() {
        this.type = b2Shape.e_unknownShape, this.userData = null, this.localPosition = new b2Vec2(0, 0), this.localRotation = 0, this.friction = .2, this.restitution = 0, this.density = 0, this.categoryBits = 1, this.maskBits = 65535, this.groupIndex = 0, this.type = b2Shape.e_circleShape, this.radius = 1
    },
    radius: null
});
var b2CircleShape = Class.create();
Object.extend(b2CircleShape.prototype, b2Shape.prototype), Object.extend(b2CircleShape.prototype, {
    TestPoint: function(t) {
        var i = new b2Vec2;
        return i.SetV(t), i.Subtract(this.m_position), b2Math.b2Dot(i, i) <= this.m_radius * this.m_radius
    },
    initialize: function(t, i, o) {
        this.m_R = new b2Mat22, this.m_position = new b2Vec2, this.m_userData = t.userData, this.m_friction = t.friction, this.m_restitution = t.restitution, this.m_body = i, this.m_proxyId = b2Pair.b2_nullProxy, this.m_maxRadius = 0, this.m_categoryBits = t.categoryBits, this.m_maskBits = t.maskBits, this.m_groupIndex = t.groupIndex, this.m_localPosition = new b2Vec2;
        var e = t;
        this.m_localPosition.Set(t.localPosition.x - o.x, t.localPosition.y - o.y), this.m_type = b2Shape.e_circleShape, this.m_radius = e.radius, this.m_R.SetM(this.m_body.m_R);
        var n = this.m_R.col1.x * this.m_localPosition.x + this.m_R.col2.x * this.m_localPosition.y,
            s = this.m_R.col1.y * this.m_localPosition.x + this.m_R.col2.y * this.m_localPosition.y;
        this.m_position.x = this.m_body.m_position.x + n, this.m_position.y = this.m_body.m_position.y + s, this.m_maxRadius = Math.sqrt(n * n + s * s) + this.m_radius;
        var a = new b2AABB;
        a.minVertex.Set(this.m_position.x - this.m_radius, this.m_position.y - this.m_radius), a.maxVertex.Set(this.m_position.x + this.m_radius, this.m_position.y + this.m_radius);
        var r = this.m_body.m_world.m_broadPhase;
        r.InRange(a) ? this.m_proxyId = r.CreateProxy(a, this) : this.m_proxyId = b2Pair.b2_nullProxy, this.m_proxyId == b2Pair.b2_nullProxy && this.m_body.Freeze()
    },
    Synchronize: function(t, i, o, e) {
        if (this.m_R.SetM(e), this.m_position.x = e.col1.x * this.m_localPosition.x + e.col2.x * this.m_localPosition.y + o.x, this.m_position.y = e.col1.y * this.m_localPosition.x + e.col2.y * this.m_localPosition.y + o.y, this.m_proxyId != b2Pair.b2_nullProxy) {
            var n = t.x + (i.col1.x * this.m_localPosition.x + i.col2.x * this.m_localPosition.y),
                s = t.y + (i.col1.y * this.m_localPosition.x + i.col2.y * this.m_localPosition.y),
                a = Math.min(n, this.m_position.x),
                r = Math.min(s, this.m_position.y),
                l = Math.max(n, this.m_position.x),
                m = Math.max(s, this.m_position.y),
                _ = new b2AABB;
            _.minVertex.Set(a - this.m_radius, r - this.m_radius), _.maxVertex.Set(l + this.m_radius, m + this.m_radius);
            var h = this.m_body.m_world.m_broadPhase;
            h.InRange(_) ? h.MoveProxy(this.m_proxyId, _) : this.m_body.Freeze()
        }
    },
    QuickSync: function(t, i) {
        this.m_R.SetM(i), this.m_position.x = i.col1.x * this.m_localPosition.x + i.col2.x * this.m_localPosition.y + t.x, this.m_position.y = i.col1.y * this.m_localPosition.x + i.col2.y * this.m_localPosition.y + t.y
    },
    ResetProxy: function(t) {
        if (this.m_proxyId != b2Pair.b2_nullProxy) {
            t.GetProxy(this.m_proxyId);
            t.DestroyProxy(this.m_proxyId), null;
            var i = new b2AABB;
            i.minVertex.Set(this.m_position.x - this.m_radius, this.m_position.y - this.m_radius), i.maxVertex.Set(this.m_position.x + this.m_radius, this.m_position.y + this.m_radius), t.InRange(i) ? this.m_proxyId = t.CreateProxy(i, this) : this.m_proxyId = b2Pair.b2_nullProxy, this.m_proxyId == b2Pair.b2_nullProxy && this.m_body.Freeze()
        }
    },
    Support: function(t, i, o) {
        var e = Math.sqrt(t * t + i * i);
        t /= e, i /= e, o.Set(this.m_position.x + this.m_radius * t, this.m_position.y + this.m_radius * i)
    },
    m_localPosition: new b2Vec2,
    m_radius: null
});
var b2MassData = Class.create();
b2MassData.prototype = {
    mass: 0,
    center: new b2Vec2(0, 0),
    I: 0,
    initialize: function() {
        this.center = new b2Vec2(0, 0)
    }
};
var b2PolyDef = Class.create();
Object.extend(b2PolyDef.prototype, b2ShapeDef.prototype), Object.extend(b2PolyDef.prototype, {
    initialize: function() {
        this.type = b2Shape.e_unknownShape, this.userData = null, this.localPosition = new b2Vec2(0, 0), this.localRotation = 0, this.friction = .2, this.restitution = 0, this.density = 0, this.categoryBits = 1, this.maskBits = 65535, this.groupIndex = 0, this.vertices = new Array(b2Settings.b2_maxPolyVertices), this.type = b2Shape.e_polyShape, this.vertexCount = 0;
        for (var t = 0; t < b2Settings.b2_maxPolyVertices; t++) this.vertices[t] = new b2Vec2
    },
    vertices: new Array(b2Settings.b2_maxPolyVertices),
    vertexCount: 0
});
var b2PolyShape = Class.create();
Object.extend(b2PolyShape.prototype, b2Shape.prototype), Object.extend(b2PolyShape.prototype, {
    TestPoint: function(t) {
        var i = new b2Vec2;
        i.SetV(t), i.Subtract(this.m_position), i.MulTM(this.m_R);
        for (var o = 0; o < this.m_vertexCount; ++o) {
            var e = new b2Vec2;
            if (e.SetV(i), e.Subtract(this.m_vertices[o]), b2Math.b2Dot(this.m_normals[o], e) > 0) return !1
        }
        return !0
    },
    initialize: function(t, i, o) {
        this.m_R = new b2Mat22, this.m_position = new b2Vec2, this.m_userData = t.userData, this.m_friction = t.friction, this.m_restitution = t.restitution, this.m_body = i, this.m_proxyId = b2Pair.b2_nullProxy, this.m_maxRadius = 0, this.m_categoryBits = t.categoryBits, this.m_maskBits = t.maskBits, this.m_groupIndex = t.groupIndex, this.syncAABB = new b2AABB, this.syncMat = new b2Mat22, this.m_localCentroid = new b2Vec2, this.m_localOBB = new b2OBB;
        var e, n, s, a = 0,
            r = new b2AABB;
        this.m_vertices = new Array(b2Settings.b2_maxPolyVertices), this.m_coreVertices = new Array(b2Settings.b2_maxPolyVertices), this.m_normals = new Array(b2Settings.b2_maxPolyVertices), this.m_type = b2Shape.e_polyShape;
        var l = new b2Mat22(t.localRotation);
        if (t.type == b2Shape.e_boxShape) {
            this.m_localCentroid.x = t.localPosition.x - o.x, this.m_localCentroid.y = t.localPosition.y - o.y;
            var m = t;
            this.m_vertexCount = 4, e = m.extents.x, n = m.extents.y;
            var _ = Math.max(0, e - 2 * b2Settings.b2_linearSlop),
                h = Math.max(0, n - 2 * b2Settings.b2_linearSlop);
            (s = this.m_vertices[0] = new b2Vec2).x = l.col1.x * e + l.col2.x * n, s.y = l.col1.y * e + l.col2.y * n, (s = this.m_vertices[1] = new b2Vec2).x = l.col1.x * -e + l.col2.x * n, s.y = l.col1.y * -e + l.col2.y * n, (s = this.m_vertices[2] = new b2Vec2).x = l.col1.x * -e + l.col2.x * -n, s.y = l.col1.y * -e + l.col2.y * -n, (s = this.m_vertices[3] = new b2Vec2).x = l.col1.x * e + l.col2.x * -n, s.y = l.col1.y * e + l.col2.y * -n, (s = this.m_coreVertices[0] = new b2Vec2).x = l.col1.x * _ + l.col2.x * h, s.y = l.col1.y * _ + l.col2.y * h, (s = this.m_coreVertices[1] = new b2Vec2).x = l.col1.x * -_ + l.col2.x * h, s.y = l.col1.y * -_ + l.col2.y * h, (s = this.m_coreVertices[2] = new b2Vec2).x = l.col1.x * -_ + l.col2.x * -h, s.y = l.col1.y * -_ + l.col2.y * -h, (s = this.m_coreVertices[3] = new b2Vec2).x = l.col1.x * _ + l.col2.x * -h, s.y = l.col1.y * _ + l.col2.y * -h
        } else {
            var c = t;
            this.m_vertexCount = c.vertexCount, b2Shape.PolyCentroid(c.vertices, c.vertexCount, b2PolyShape.tempVec);
            var u = b2PolyShape.tempVec.x,
                y = b2PolyShape.tempVec.y;
            for (this.m_localCentroid.x = t.localPosition.x + (l.col1.x * u + l.col2.x * y) - o.x, this.m_localCentroid.y = t.localPosition.y + (l.col1.y * u + l.col2.y * y) - o.y, a = 0; a < this.m_vertexCount; ++a) {
                this.m_vertices[a] = new b2Vec2, this.m_coreVertices[a] = new b2Vec2, e = c.vertices[a].x - u, n = c.vertices[a].y - y, this.m_vertices[a].x = l.col1.x * e + l.col2.x * n, this.m_vertices[a].y = l.col1.y * e + l.col2.y * n;
                var b = this.m_vertices[a].x,
                    p = this.m_vertices[a].y,
                    d = Math.sqrt(b * b + p * p);
                d > Number.MIN_VALUE && (b *= 1 / d, p *= 1 / d), this.m_coreVertices[a].x = this.m_vertices[a].x - 2 * b2Settings.b2_linearSlop * b, this.m_coreVertices[a].y = this.m_vertices[a].y - 2 * b2Settings.b2_linearSlop * p
            }
        }
        var x = Number.MAX_VALUE,
            f = Number.MAX_VALUE,
            v = -Number.MAX_VALUE,
            g = -Number.MAX_VALUE;
        for (this.m_maxRadius = 0, a = 0; a < this.m_vertexCount; ++a) {
            var M = this.m_vertices[a];
            x = Math.min(x, M.x), f = Math.min(f, M.y), v = Math.max(v, M.x), g = Math.max(g, M.y), this.m_maxRadius = Math.max(this.m_maxRadius, M.Length())
        }
        this.m_localOBB.R.SetIdentity(), this.m_localOBB.center.Set(.5 * (x + v), .5 * (f + g)), this.m_localOBB.extents.Set(.5 * (v - x), .5 * (g - f));
        var S = 0,
            C = 0;
        for (a = 0; a < this.m_vertexCount; ++a) this.m_normals[a] = new b2Vec2, S = a, C = a + 1 < this.m_vertexCount ? a + 1 : 0, this.m_normals[a].x = this.m_vertices[C].y - this.m_vertices[S].y, this.m_normals[a].y = -(this.m_vertices[C].x - this.m_vertices[S].x), this.m_normals[a].Normalize();
        for (a = 0; a < this.m_vertexCount; ++a) S = a, C = a + 1 < this.m_vertexCount ? a + 1 : 0;
        this.m_R.SetM(this.m_body.m_R), this.m_position.x = this.m_body.m_position.x + (this.m_R.col1.x * this.m_localCentroid.x + this.m_R.col2.x * this.m_localCentroid.y), this.m_position.y = this.m_body.m_position.y + (this.m_R.col1.y * this.m_localCentroid.x + this.m_R.col2.y * this.m_localCentroid.y), b2PolyShape.tAbsR.col1.x = this.m_R.col1.x * this.m_localOBB.R.col1.x + this.m_R.col2.x * this.m_localOBB.R.col1.y, b2PolyShape.tAbsR.col1.y = this.m_R.col1.y * this.m_localOBB.R.col1.x + this.m_R.col2.y * this.m_localOBB.R.col1.y, b2PolyShape.tAbsR.col2.x = this.m_R.col1.x * this.m_localOBB.R.col2.x + this.m_R.col2.x * this.m_localOBB.R.col2.y, b2PolyShape.tAbsR.col2.y = this.m_R.col1.y * this.m_localOBB.R.col2.x + this.m_R.col2.y * this.m_localOBB.R.col2.y, b2PolyShape.tAbsR.Abs(), e = b2PolyShape.tAbsR.col1.x * this.m_localOBB.extents.x + b2PolyShape.tAbsR.col2.x * this.m_localOBB.extents.y, n = b2PolyShape.tAbsR.col1.y * this.m_localOBB.extents.x + b2PolyShape.tAbsR.col2.y * this.m_localOBB.extents.y;
        var V = this.m_position.x + (this.m_R.col1.x * this.m_localOBB.center.x + this.m_R.col2.x * this.m_localOBB.center.y),
            w = this.m_position.y + (this.m_R.col1.y * this.m_localOBB.center.x + this.m_R.col2.y * this.m_localOBB.center.y);
        r.minVertex.x = V - e, r.minVertex.y = w - n, r.maxVertex.x = V + e, r.maxVertex.y = w + n;
        var A = this.m_body.m_world.m_broadPhase;
        A.InRange(r) ? this.m_proxyId = A.CreateProxy(r, this) : this.m_proxyId = b2Pair.b2_nullProxy, this.m_proxyId == b2Pair.b2_nullProxy && this.m_body.Freeze()
    },
    syncAABB: new b2AABB,
    syncMat: new b2Mat22,
    Synchronize: function(t, i, o, e) {
        if (this.m_R.SetM(e), this.m_position.x = this.m_body.m_position.x + (e.col1.x * this.m_localCentroid.x + e.col2.x * this.m_localCentroid.y), this.m_position.y = this.m_body.m_position.y + (e.col1.y * this.m_localCentroid.x + e.col2.y * this.m_localCentroid.y), this.m_proxyId != b2Pair.b2_nullProxy) {
            var n, s, a = i.col1,
                r = i.col2,
                l = this.m_localOBB.R.col1,
                m = this.m_localOBB.R.col2;
            this.syncMat.col1.x = a.x * l.x + r.x * l.y, this.syncMat.col1.y = a.y * l.x + r.y * l.y, this.syncMat.col2.x = a.x * m.x + r.x * m.y, this.syncMat.col2.y = a.y * m.x + r.y * m.y, this.syncMat.Abs(), n = this.m_localCentroid.x + this.m_localOBB.center.x, s = this.m_localCentroid.y + this.m_localOBB.center.y;
            var _ = t.x + (i.col1.x * n + i.col2.x * s),
                h = t.y + (i.col1.y * n + i.col2.y * s);
            n = this.syncMat.col1.x * this.m_localOBB.extents.x + this.syncMat.col2.x * this.m_localOBB.extents.y, s = this.syncMat.col1.y * this.m_localOBB.extents.x + this.syncMat.col2.y * this.m_localOBB.extents.y, this.syncAABB.minVertex.x = _ - n, this.syncAABB.minVertex.y = h - s, this.syncAABB.maxVertex.x = _ + n, this.syncAABB.maxVertex.y = h + s, a = e.col1, r = e.col2, l = this.m_localOBB.R.col1, m = this.m_localOBB.R.col2, this.syncMat.col1.x = a.x * l.x + r.x * l.y, this.syncMat.col1.y = a.y * l.x + r.y * l.y, this.syncMat.col2.x = a.x * m.x + r.x * m.y, this.syncMat.col2.y = a.y * m.x + r.y * m.y, this.syncMat.Abs(), n = this.m_localCentroid.x + this.m_localOBB.center.x, s = this.m_localCentroid.y + this.m_localOBB.center.y, _ = o.x + (e.col1.x * n + e.col2.x * s), h = o.y + (e.col1.y * n + e.col2.y * s), n = this.syncMat.col1.x * this.m_localOBB.extents.x + this.syncMat.col2.x * this.m_localOBB.extents.y, s = this.syncMat.col1.y * this.m_localOBB.extents.x + this.syncMat.col2.y * this.m_localOBB.extents.y, this.syncAABB.minVertex.x = Math.min(this.syncAABB.minVertex.x, _ - n), this.syncAABB.minVertex.y = Math.min(this.syncAABB.minVertex.y, h - s), this.syncAABB.maxVertex.x = Math.max(this.syncAABB.maxVertex.x, _ + n), this.syncAABB.maxVertex.y = Math.max(this.syncAABB.maxVertex.y, h + s);
            var c = this.m_body.m_world.m_broadPhase;
            c.InRange(this.syncAABB) ? c.MoveProxy(this.m_proxyId, this.syncAABB) : this.m_body.Freeze()
        }
    },
    QuickSync: function(t, i) {
        this.m_R.SetM(i), this.m_position.x = t.x + (i.col1.x * this.m_localCentroid.x + i.col2.x * this.m_localCentroid.y), this.m_position.y = t.y + (i.col1.y * this.m_localCentroid.x + i.col2.y * this.m_localCentroid.y)
    },
    ResetProxy: function(t) {
        if (this.m_proxyId != b2Pair.b2_nullProxy) {
            t.GetProxy(this.m_proxyId);
            t.DestroyProxy(this.m_proxyId), null;
            var i = b2Math.b2MulMM(this.m_R, this.m_localOBB.R),
                o = b2Math.b2AbsM(i),
                e = b2Math.b2MulMV(o, this.m_localOBB.extents),
                n = b2Math.b2MulMV(this.m_R, this.m_localOBB.center);
            n.Add(this.m_position);
            var s = new b2AABB;
            s.minVertex.SetV(n), s.minVertex.Subtract(e), s.maxVertex.SetV(n), s.maxVertex.Add(e), t.InRange(s) ? this.m_proxyId = t.CreateProxy(s, this) : this.m_proxyId = b2Pair.b2_nullProxy, this.m_proxyId == b2Pair.b2_nullProxy && this.m_body.Freeze()
        }
    },
    Support: function(t, i, o) {
        for (var e = t * this.m_R.col1.x + i * this.m_R.col1.y, n = t * this.m_R.col2.x + i * this.m_R.col2.y, s = 0, a = this.m_coreVertices[0].x * e + this.m_coreVertices[0].y * n, r = 1; r < this.m_vertexCount; ++r) {
            var l = this.m_coreVertices[r].x * e + this.m_coreVertices[r].y * n;
            l > a && (s = r, a = l)
        }
        o.Set(this.m_position.x + (this.m_R.col1.x * this.m_coreVertices[s].x + this.m_R.col2.x * this.m_coreVertices[s].y), this.m_position.y + (this.m_R.col1.y * this.m_coreVertices[s].x + this.m_R.col2.y * this.m_coreVertices[s].y))
    },
    m_localCentroid: new b2Vec2,
    m_localOBB: new b2OBB,
    m_vertices: null,
    m_coreVertices: null,
    m_vertexCount: 0,
    m_normals: null
}), b2PolyShape.tempVec = new b2Vec2, b2PolyShape.tAbsR = new b2Mat22;
var b2Body = Class.create();
b2Body.prototype = {
    SetOriginPosition: function(t, i) {
        if (!this.IsFrozen()) {
            this.m_rotation = i, this.m_R.Set(this.m_rotation), this.m_position = b2Math.AddVV(t, b2Math.b2MulMV(this.m_R, this.m_center)), this.m_position0.SetV(this.m_position), this.m_rotation0 = this.m_rotation;
            for (var o = this.m_shapeList; null != o; o = o.m_next) o.Synchronize(this.m_position, this.m_R, this.m_position, this.m_R);
            this.m_world.m_broadPhase.Commit()
        }
    },
    GetOriginPosition: function() {
        return b2Math.SubtractVV(this.m_position, b2Math.b2MulMV(this.m_R, this.m_center))
    },
    SetCenterPosition: function(t, i) {
        if (!this.IsFrozen()) {
            this.m_rotation = i, this.m_R.Set(this.m_rotation), this.m_position.SetV(t), this.m_position0.SetV(this.m_position), this.m_rotation0 = this.m_rotation;
            for (var o = this.m_shapeList; null != o; o = o.m_next) o.Synchronize(this.m_position, this.m_R, this.m_position, this.m_R);
            this.m_world.m_broadPhase.Commit()
        }
    },
    GetCenterPosition: function() {
        return this.m_position
    },
    GetRotation: function() {
        return this.m_rotation
    },
    GetRotationMatrix: function() {
        return this.m_R
    },
    SetLinearVelocity: function(t) {
        this.m_linearVelocity.SetV(t)
    },
    GetLinearVelocity: function() {
        return this.m_linearVelocity
    },
    SetAngularVelocity: function(t) {
        this.m_angularVelocity = t
    },
    GetAngularVelocity: function() {
        return this.m_angularVelocity
    },
    ApplyForce: function(t, i) {
        0 == this.IsSleeping() && (this.m_force.Add(t), this.m_torque += b2Math.b2CrossVV(b2Math.SubtractVV(i, this.m_position), t))
    },
    ApplyTorque: function(t) {
        0 == this.IsSleeping() && (this.m_torque += t)
    },
    ApplyImpulse: function(t, i) {
        0 == this.IsSleeping() && (this.m_linearVelocity.Add(b2Math.MulFV(this.m_invMass, t)), this.m_angularVelocity += this.m_invI * b2Math.b2CrossVV(b2Math.SubtractVV(i, this.m_position), t))
    },
    GetMass: function() {
        return this.m_mass
    },
    GetInertia: function() {
        return this.m_I
    },
    GetWorldPoint: function(t) {
        return b2Math.AddVV(this.m_position, b2Math.b2MulMV(this.m_R, t))
    },
    GetWorldVector: function(t) {
        return b2Math.b2MulMV(this.m_R, t)
    },
    GetLocalPoint: function(t) {
        return b2Math.b2MulTMV(this.m_R, b2Math.SubtractVV(t, this.m_position))
    },
    GetLocalVector: function(t) {
        return b2Math.b2MulTMV(this.m_R, t)
    },
    IsStatic: function() {
        return (this.m_flags & b2Body.e_staticFlag) == b2Body.e_staticFlag
    },
    IsFrozen: function() {
        return (this.m_flags & b2Body.e_frozenFlag) == b2Body.e_frozenFlag
    },
    IsSleeping: function() {
        return (this.m_flags & b2Body.e_sleepFlag) == b2Body.e_sleepFlag
    },
    AllowSleeping: function(t) {
        t ? this.m_flags |= b2Body.e_allowSleepFlag : (this.m_flags &= ~b2Body.e_allowSleepFlag, this.WakeUp())
    },
    WakeUp: function() {
        this.m_flags &= ~b2Body.e_sleepFlag, this.m_sleepTime = 0
    },
    GetShapeList: function() {
        return this.m_shapeList
    },
    GetContactList: function() {
        return this.m_contactList
    },
    GetJointList: function() {
        return this.m_jointList
    },
    GetNext: function() {
        return this.m_next
    },
    GetUserData: function() {
        return this.m_userData
    },
    initialize: function(t, i) {
        this.sMat0 = new b2Mat22, this.m_position = new b2Vec2, this.m_R = new b2Mat22(0), this.m_position0 = new b2Vec2;
        var o, e, n = 0;
        this.m_flags = 0, this.m_position.SetV(t.position), this.m_rotation = t.rotation, this.m_R.Set(this.m_rotation), this.m_position0.SetV(this.m_position), this.m_rotation0 = this.m_rotation, this.m_world = i, this.m_linearDamping = b2Math.b2Clamp(1 - t.linearDamping, 0, 1), this.m_angularDamping = b2Math.b2Clamp(1 - t.angularDamping, 0, 1), this.m_force = new b2Vec2(0, 0), this.m_torque = 0, this.m_mass = 0;
        var s = new Array(b2Settings.b2_maxShapesPerBody);
        for (n = 0; n < b2Settings.b2_maxShapesPerBody; n++) s[n] = new b2MassData;
        for (this.m_shapeCount = 0, this.m_center = new b2Vec2(0, 0), n = 0; n < b2Settings.b2_maxShapesPerBody && null != (o = t.shapes[n]); ++n) e = s[n], o.ComputeMass(e), this.m_mass += e.mass, this.m_center.x += e.mass * (o.localPosition.x + e.center.x), this.m_center.y += e.mass * (o.localPosition.y + e.center.y), ++this.m_shapeCount;
        for (this.m_mass > 0 ? (this.m_center.Multiply(1 / this.m_mass), this.m_position.Add(b2Math.b2MulMV(this.m_R, this.m_center))) : this.m_flags |= b2Body.e_staticFlag, this.m_I = 0, n = 0; n < this.m_shapeCount; ++n) {
            o = t.shapes[n], e = s[n], this.m_I += e.I;
            var a = b2Math.SubtractVV(b2Math.AddVV(o.localPosition, e.center), this.m_center);
            this.m_I += e.mass * b2Math.b2Dot(a, a)
        }
        for (this.m_mass > 0 ? this.m_invMass = 1 / this.m_mass : this.m_invMass = 0, this.m_I > 0 && 0 == t.preventRotation ? this.m_invI = 1 / this.m_I : (this.m_I = 0, this.m_invI = 0), this.m_linearVelocity = b2Math.AddVV(t.linearVelocity, b2Math.b2CrossFV(t.angularVelocity, this.m_center)), this.m_angularVelocity = t.angularVelocity, this.m_jointList = null, this.m_contactList = null, this.m_prev = null, this.m_next = null, this.m_shapeList = null, n = 0; n < this.m_shapeCount; ++n) {
            o = t.shapes[n];
            var r = b2Shape.Create(o, this, this.m_center);
            r.m_next = this.m_shapeList, this.m_shapeList = r
        }
        this.m_sleepTime = 0, t.allowSleep && (this.m_flags |= b2Body.e_allowSleepFlag), t.isSleeping && (this.m_flags |= b2Body.e_sleepFlag), (this.m_flags & b2Body.e_sleepFlag || 0 == this.m_invMass) && (this.m_linearVelocity.Set(0, 0), this.m_angularVelocity = 0), this.m_userData = t.userData
    },
    Destroy: function() {
        for (var t = this.m_shapeList; t;) {
            var i = t;
            t = t.m_next, b2Shape.Destroy(i)
        }
    },
    sMat0: new b2Mat22,
    SynchronizeShapes: function() {
        this.sMat0.Set(this.m_rotation0);
        for (var t = this.m_shapeList; null != t; t = t.m_next) t.Synchronize(this.m_position0, this.sMat0, this.m_position, this.m_R)
    },
    QuickSyncShapes: function() {
        for (var t = this.m_shapeList; null != t; t = t.m_next) t.QuickSync(this.m_position, this.m_R)
    },
    IsConnected: function(t) {
        for (var i = this.m_jointList; null != i; i = i.next)
            if (i.other == t) return 0 == i.joint.m_collideConnected;
        return !1
    },
    Freeze: function() {
        this.m_flags |= b2Body.e_frozenFlag, this.m_linearVelocity.SetZero(), this.m_angularVelocity = 0;
        for (var t = this.m_shapeList; null != t; t = t.m_next) t.DestroyProxy()
    },
    m_flags: 0,
    m_position: new b2Vec2,
    m_rotation: null,
    m_R: new b2Mat22(0),
    m_position0: new b2Vec2,
    m_rotation0: null,
    m_linearVelocity: null,
    m_angularVelocity: null,
    m_force: null,
    m_torque: null,
    m_center: null,
    m_world: null,
    m_prev: null,
    m_next: null,
    m_shapeList: null,
    m_shapeCount: 0,
    m_jointList: null,
    m_contactList: null,
    m_mass: null,
    m_invMass: null,
    m_I: null,
    m_invI: null,
    m_linearDamping: null,
    m_angularDamping: null,
    m_sleepTime: null,
    m_userData: null
}, b2Body.e_staticFlag = 1, b2Body.e_frozenFlag = 2, b2Body.e_islandFlag = 4, b2Body.e_sleepFlag = 8, b2Body.e_allowSleepFlag = 16, b2Body.e_destroyFlag = 32;
var b2BodyDef = Class.create();
b2BodyDef.prototype = {
    initialize: function() {
        this.shapes = new Array, this.userData = null;
        for (var t = 0; t < b2Settings.b2_maxShapesPerBody; t++) this.shapes[t] = null;
        this.position = new b2Vec2(0, 0), this.rotation = 0, this.linearVelocity = new b2Vec2(0, 0), this.angularVelocity = 0, this.linearDamping = 0, this.angularDamping = 0, this.allowSleep = !0, this.isSleeping = !1, this.preventRotation = !1
    },
    userData: null,
    shapes: new Array,
    position: null,
    rotation: null,
    linearVelocity: null,
    angularVelocity: null,
    linearDamping: null,
    angularDamping: null,
    allowSleep: null,
    isSleeping: null,
    preventRotation: null,
    AddShape: function(t) {
        for (var i = 0; i < b2Settings.b2_maxShapesPerBody; ++i)
            if (null == this.shapes[i]) {
                this.shapes[i] = t;
                break
            }
    }
};
var b2CollisionFilter = Class.create();
b2CollisionFilter.prototype = {
    ShouldCollide: function(t, i) {
        return t.m_groupIndex == i.m_groupIndex && 0 != t.m_groupIndex ? t.m_groupIndex > 0 : 0 != (t.m_maskBits & i.m_categoryBits) && 0 != (t.m_categoryBits & i.m_maskBits)
    },
    initialize: function() {}
}, b2CollisionFilter.b2_defaultFilter = new b2CollisionFilter;
var b2Island = Class.create();
b2Island.prototype = {
    initialize: function(t, i, o, e) {
        var n = 0;
        for (this.m_bodyCapacity = t, this.m_contactCapacity = i, this.m_jointCapacity = o, this.m_bodyCount = 0, this.m_contactCount = 0, this.m_jointCount = 0, this.m_bodies = new Array(t), n = 0; n < t; n++) this.m_bodies[n] = null;
        for (this.m_contacts = new Array(i), n = 0; n < i; n++) this.m_contacts[n] = null;
        for (this.m_joints = new Array(o), n = 0; n < o; n++) this.m_joints[n] = null;
        this.m_allocator = e
    },
    Clear: function() {
        this.m_bodyCount = 0, this.m_contactCount = 0, this.m_jointCount = 0
    },
    Solve: function(t, i) {
        var o, e = 0;
        for (e = 0; e < this.m_bodyCount; ++e) 0 != (o = this.m_bodies[e]).m_invMass && (o.m_linearVelocity.Add(b2Math.MulFV(t.dt, b2Math.AddVV(i, b2Math.MulFV(o.m_invMass, o.m_force)))), o.m_angularVelocity += t.dt * o.m_invI * o.m_torque, o.m_linearVelocity.Multiply(o.m_linearDamping), o.m_angularVelocity *= o.m_angularDamping, o.m_position0.SetV(o.m_position), o.m_rotation0 = o.m_rotation);
        var n = new b2ContactSolver(this.m_contacts, this.m_contactCount, this.m_allocator);
        for (n.PreSolve(), e = 0; e < this.m_jointCount; ++e) this.m_joints[e].PrepareVelocitySolver();
        for (e = 0; e < t.iterations; ++e) {
            n.SolveVelocityConstraints();
            for (var s = 0; s < this.m_jointCount; ++s) this.m_joints[s].SolveVelocityConstraints(t)
        }
        for (e = 0; e < this.m_bodyCount; ++e) 0 != (o = this.m_bodies[e]).m_invMass && (o.m_position.x += t.dt * o.m_linearVelocity.x, o.m_position.y += t.dt * o.m_linearVelocity.y, o.m_rotation += t.dt * o.m_angularVelocity, o.m_R.Set(o.m_rotation));
        for (e = 0; e < this.m_jointCount; ++e) this.m_joints[e].PreparePositionSolver();
        if (b2World.s_enablePositionCorrection)
            for (b2Island.m_positionIterationCount = 0; b2Island.m_positionIterationCount < t.iterations; ++b2Island.m_positionIterationCount) {
                var a = n.SolvePositionConstraints(b2Settings.b2_contactBaumgarte),
                    r = !0;
                for (e = 0; e < this.m_jointCount; ++e) {
                    var l = this.m_joints[e].SolvePositionConstraints();
                    r = r && l
                }
                if (a && r) break
            }
        for (n.PostSolve(), e = 0; e < this.m_bodyCount; ++e) 0 != (o = this.m_bodies[e]).m_invMass && (o.m_R.Set(o.m_rotation), o.SynchronizeShapes(), o.m_force.Set(0, 0), o.m_torque = 0)
    },
    UpdateSleep: function(t) {
        var i, o = 0,
            e = Number.MAX_VALUE,
            n = b2Settings.b2_linearSleepTolerance * b2Settings.b2_linearSleepTolerance,
            s = b2Settings.b2_angularSleepTolerance * b2Settings.b2_angularSleepTolerance;
        for (o = 0; o < this.m_bodyCount; ++o) 0 != (i = this.m_bodies[o]).m_invMass && (0 == (i.m_flags & b2Body.e_allowSleepFlag) && (i.m_sleepTime = 0, e = 0), 0 == (i.m_flags & b2Body.e_allowSleepFlag) || i.m_angularVelocity * i.m_angularVelocity > s || b2Math.b2Dot(i.m_linearVelocity, i.m_linearVelocity) > n ? (i.m_sleepTime = 0, e = 0) : (i.m_sleepTime += t, e = b2Math.b2Min(e, i.m_sleepTime)));
        if (e >= b2Settings.b2_timeToSleep)
            for (o = 0; o < this.m_bodyCount; ++o)(i = this.m_bodies[o]).m_flags |= b2Body.e_sleepFlag
    },
    AddBody: function(t) {
        this.m_bodies[this.m_bodyCount++] = t
    },
    AddContact: function(t) {
        this.m_contacts[this.m_contactCount++] = t
    },
    AddJoint: function(t) {
        this.m_joints[this.m_jointCount++] = t
    },
    m_allocator: null,
    m_bodies: null,
    m_contacts: null,
    m_joints: null,
    m_bodyCount: 0,
    m_jointCount: 0,
    m_contactCount: 0,
    m_bodyCapacity: 0,
    m_contactCapacity: 0,
    m_jointCapacity: 0,
    m_positionError: null
}, b2Island.m_positionIterationCount = 0;
var b2TimeStep = Class.create();
b2TimeStep.prototype = {
    dt: null,
    inv_dt: null,
    iterations: 0,
    initialize: function() {}
};
var b2ContactNode = Class.create();
b2ContactNode.prototype = {
    other: null,
    contact: null,
    prev: null,
    next: null,
    initialize: function() {}
};
var b2Contact = Class.create();
b2Contact.prototype = {
    GetManifolds: function() {
        return null
    },
    GetManifoldCount: function() {
        return this.m_manifoldCount
    },
    GetNext: function() {
        return this.m_next
    },
    GetShape1: function() {
        return this.m_shape1
    },
    GetShape2: function() {
        return this.m_shape2
    },
    initialize: function(t, i) {
        if (this.m_node1 = new b2ContactNode, this.m_node2 = new b2ContactNode, this.m_flags = 0, !t || !i) return this.m_shape1 = null, void(this.m_shape2 = null);
        this.m_shape1 = t, this.m_shape2 = i, this.m_manifoldCount = 0, this.m_friction = Math.sqrt(this.m_shape1.m_friction * this.m_shape2.m_friction), this.m_restitution = b2Math.b2Max(this.m_shape1.m_restitution, this.m_shape2.m_restitution), this.m_prev = null, this.m_next = null, this.m_node1.contact = null, this.m_node1.prev = null, this.m_node1.next = null, this.m_node1.other = null, this.m_node2.contact = null, this.m_node2.prev = null, this.m_node2.next = null, this.m_node2.other = null
    },
    Evaluate: function() {},
    m_flags: 0,
    m_prev: null,
    m_next: null,
    m_node1: new b2ContactNode,
    m_node2: new b2ContactNode,
    m_shape1: null,
    m_shape2: null,
    m_manifoldCount: 0,
    m_friction: null,
    m_restitution: null
}, b2Contact.e_islandFlag = 1, b2Contact.e_destroyFlag = 2, b2Contact.AddType = function(t, i, o, e) {
    b2Contact.s_registers[o][e].createFcn = t, b2Contact.s_registers[o][e].destroyFcn = i, b2Contact.s_registers[o][e].primary = !0, o != e && (b2Contact.s_registers[e][o].createFcn = t, b2Contact.s_registers[e][o].destroyFcn = i, b2Contact.s_registers[e][o].primary = !1)
}, b2Contact.InitializeRegisters = function() {
    b2Contact.s_registers = new Array(b2Shape.e_shapeTypeCount);
    for (var t = 0; t < b2Shape.e_shapeTypeCount; t++) {
        b2Contact.s_registers[t] = new Array(b2Shape.e_shapeTypeCount);
        for (var i = 0; i < b2Shape.e_shapeTypeCount; i++) b2Contact.s_registers[t][i] = new b2ContactRegister
    }
    b2Contact.AddType(b2CircleContact.Create, b2CircleContact.Destroy, b2Shape.e_circleShape, b2Shape.e_circleShape), b2Contact.AddType(b2PolyAndCircleContact.Create, b2PolyAndCircleContact.Destroy, b2Shape.e_polyShape, b2Shape.e_circleShape), b2Contact.AddType(b2PolyContact.Create, b2PolyContact.Destroy, b2Shape.e_polyShape, b2Shape.e_polyShape)
}, b2Contact.Create = function(t, i, o) {
    0 == b2Contact.s_initialized && (b2Contact.InitializeRegisters(), b2Contact.s_initialized = !0);
    var e = t.m_type,
        n = i.m_type,
        s = b2Contact.s_registers[e][n].createFcn;
    if (s) {
        if (b2Contact.s_registers[e][n].primary) return s(t, i, o);
        for (var a = s(i, t, o), r = 0; r < a.GetManifoldCount(); ++r) {
            var l = a.GetManifolds()[r];
            l.normal = l.normal.Negative()
        }
        return a
    }
    return null
}, b2Contact.Destroy = function(t, i) {
    t.GetManifoldCount() > 0 && (t.m_shape1.m_body.WakeUp(), t.m_shape2.m_body.WakeUp());
    var o = t.m_shape1.m_type,
        e = t.m_shape2.m_type;
    (0, b2Contact.s_registers[o][e].destroyFcn)(t, i)
}, b2Contact.s_registers = null, b2Contact.s_initialized = !1;
var b2ContactConstraint = Class.create();
b2ContactConstraint.prototype = {
    initialize: function() {
        this.normal = new b2Vec2, this.points = new Array(b2Settings.b2_maxManifoldPoints);
        for (var t = 0; t < b2Settings.b2_maxManifoldPoints; t++) this.points[t] = new b2ContactConstraintPoint
    },
    points: null,
    normal: new b2Vec2,
    manifold: null,
    body1: null,
    body2: null,
    friction: null,
    restitution: null,
    pointCount: 0
};
var b2ContactConstraintPoint = Class.create();
b2ContactConstraintPoint.prototype = {
    localAnchor1: new b2Vec2,
    localAnchor2: new b2Vec2,
    normalImpulse: null,
    tangentImpulse: null,
    positionImpulse: null,
    normalMass: null,
    tangentMass: null,
    separation: null,
    velocityBias: null,
    initialize: function() {
        this.localAnchor1 = new b2Vec2, this.localAnchor2 = new b2Vec2
    }
};
var b2ContactRegister = Class.create();
b2ContactRegister.prototype = {
    createFcn: null,
    destroyFcn: null,
    primary: null,
    initialize: function() {}
};
var b2ContactSolver = Class.create();
b2ContactSolver.prototype = {
    initialize: function(t, i, o) {
        this.m_constraints = new Array, this.m_allocator = o;
        var e, n, s = 0;
        for (this.m_constraintCount = 0, s = 0; s < i; ++s) this.m_constraintCount += t[s].GetManifoldCount();
        for (s = 0; s < this.m_constraintCount; s++) this.m_constraints[s] = new b2ContactConstraint;
        var a = 0;
        for (s = 0; s < i; ++s)
            for (var r = t[s], l = r.m_shape1.m_body, m = r.m_shape2.m_body, _ = r.GetManifoldCount(), h = r.GetManifolds(), c = r.m_friction, u = r.m_restitution, y = l.m_linearVelocity.x, b = l.m_linearVelocity.y, p = m.m_linearVelocity.x, d = m.m_linearVelocity.y, x = l.m_angularVelocity, f = m.m_angularVelocity, v = 0; v < _; ++v) {
                var g = h[v],
                    M = g.normal.x,
                    S = g.normal.y,
                    C = this.m_constraints[a];
                C.body1 = l, C.body2 = m, C.manifold = g, C.normal.x = M, C.normal.y = S, C.pointCount = g.pointCount, C.friction = c, C.restitution = u;
                for (var V = 0; V < C.pointCount; ++V) {
                    var w = g.points[V],
                        A = C.points[V];
                    A.normalImpulse = w.normalImpulse, A.tangentImpulse = w.tangentImpulse, A.separation = w.separation;
                    var I = w.position.x - l.m_position.x,
                        P = w.position.y - l.m_position.y,
                        B = w.position.x - m.m_position.x,
                        R = w.position.y - m.m_position.y;
                    e = A.localAnchor1, n = l.m_R, e.x = I * n.col1.x + P * n.col1.y, e.y = I * n.col2.x + P * n.col2.y, e = A.localAnchor2, n = m.m_R, e.x = B * n.col1.x + R * n.col1.y, e.y = B * n.col2.x + R * n.col2.y;
                    var J = I * I + P * P,
                        L = B * B + R * R,
                        D = I * M + P * S,
                        F = B * M + R * S,
                        k = l.m_invMass + m.m_invMass;
                    k += l.m_invI * (J - D * D) + m.m_invI * (L - F * F), A.normalMass = 1 / k;
                    var j = S,
                        T = -M,
                        z = I * j + P * T,
                        O = B * j + R * T,
                        G = l.m_invMass + m.m_invMass;
                    G += l.m_invI * (J - z * z) + m.m_invI * (L - O * O), A.tangentMass = 1 / G, A.velocityBias = 0, A.separation > 0 && (A.velocityBias = -60 * A.separation);
                    var q = p + -f * R - y - -x * P,
                        N = d + f * B - b - x * I,
                        E = C.normal.x * q + C.normal.y * N;
                    E < -b2Settings.b2_velocityThreshold && (A.velocityBias += -C.restitution * E)
                }++a
            }
    },
    PreSolve: function() {
        for (var t, i, o = 0; o < this.m_constraintCount; ++o) {
            var e = this.m_constraints[o],
                n = e.body1,
                s = e.body2,
                a = n.m_invMass,
                r = n.m_invI,
                l = s.m_invMass,
                m = s.m_invI,
                _ = e.normal.x,
                h = e.normal.y,
                c = h,
                u = -_,
                y = 0,
                b = 0;
            if (b2World.s_enableWarmStarting)
                for (b = e.pointCount, y = 0; y < b; ++y) {
                    var p = e.points[y],
                        d = p.normalImpulse * _ + p.tangentImpulse * c,
                        x = p.normalImpulse * h + p.tangentImpulse * u;
                    i = n.m_R, t = p.localAnchor1;
                    var f = i.col1.x * t.x + i.col2.x * t.y,
                        v = i.col1.y * t.x + i.col2.y * t.y;
                    i = s.m_R, t = p.localAnchor2;
                    var g = i.col1.x * t.x + i.col2.x * t.y,
                        M = i.col1.y * t.x + i.col2.y * t.y;
                    n.m_angularVelocity -= r * (f * x - v * d), n.m_linearVelocity.x -= a * d, n.m_linearVelocity.y -= a * x, s.m_angularVelocity += m * (g * x - M * d), s.m_linearVelocity.x += l * d, s.m_linearVelocity.y += l * x, p.positionImpulse = 0
                } else
                    for (b = e.pointCount, y = 0; y < b; ++y) {
                        var S = e.points[y];
                        S.normalImpulse = 0, S.tangentImpulse = 0, S.positionImpulse = 0
                    }
        }
    },
    SolveVelocityConstraints: function() {
        for (var t, i, o, e, n, s, a, r, l, m, _, h, c, u = 0, y = 0; y < this.m_constraintCount; ++y) {
            var b = this.m_constraints[y],
                p = b.body1,
                d = b.body2,
                x = p.m_angularVelocity,
                f = p.m_linearVelocity,
                v = d.m_angularVelocity,
                g = d.m_linearVelocity,
                M = p.m_invMass,
                S = p.m_invI,
                C = d.m_invMass,
                V = d.m_invI,
                w = b.normal.x,
                A = b.normal.y,
                I = A,
                P = -w,
                B = b.pointCount;
            for (u = 0; u < B; ++u) {
                t = b.points[u], h = p.m_R, c = t.localAnchor1, i = h.col1.x * c.x + h.col2.x * c.y, o = h.col1.y * c.x + h.col2.y * c.y, h = d.m_R, c = t.localAnchor2, e = h.col1.x * c.x + h.col2.x * c.y, n = h.col1.y * c.x + h.col2.y * c.y;
                var R = (s = g.x + -v * n - f.x - -x * o) * w + (a = g.y + v * e - f.y - x * i) * A;
                r = -t.normalMass * (R - t.velocityBias), m = (r = (l = b2Math.b2Max(t.normalImpulse + r, 0)) - t.normalImpulse) * w, _ = r * A, f.x -= M * m, f.y -= M * _, x -= S * (i * _ - o * m), g.x += C * m, g.y += C * _, v += V * (e * _ - n * m), t.normalImpulse = l;
                var J = (s = g.x + -v * n - f.x - -x * o) * I + (a = g.y + v * e - f.y - x * i) * P;
                r = t.tangentMass * -J;
                var L = b.friction * t.normalImpulse;
                m = (r = (l = b2Math.b2Clamp(t.tangentImpulse + r, -L, L)) - t.tangentImpulse) * I, _ = r * P, f.x -= M * m, f.y -= M * _, x -= S * (i * _ - o * m), g.x += C * m, g.y += C * _, v += V * (e * _ - n * m), t.tangentImpulse = l
            }
            p.m_angularVelocity = x, d.m_angularVelocity = v
        }
    },
    SolvePositionConstraints: function(t) {
        for (var i, o, e = 0, n = 0; n < this.m_constraintCount; ++n) {
            for (var s = this.m_constraints[n], a = s.body1, r = s.body2, l = a.m_position, m = a.m_rotation, _ = r.m_position, h = r.m_rotation, c = a.m_invMass, u = a.m_invI, y = r.m_invMass, b = r.m_invI, p = s.normal.x, d = s.normal.y, x = s.pointCount, f = 0; f < x; ++f) {
                var v = s.points[f];
                i = a.m_R, o = v.localAnchor1;
                var g = i.col1.x * o.x + i.col2.x * o.y,
                    M = i.col1.y * o.x + i.col2.y * o.y;
                i = r.m_R, o = v.localAnchor2;
                var S = i.col1.x * o.x + i.col2.x * o.y,
                    C = i.col1.y * o.x + i.col2.y * o.y,
                    V = l.x + g,
                    w = l.y + M,
                    A = (_.x + S - V) * p + (_.y + C - w) * d + v.separation;
                e = b2Math.b2Min(e, A);
                var I = t * b2Math.b2Clamp(A + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0),
                    P = -v.normalMass * I,
                    B = v.positionImpulse;
                v.positionImpulse = b2Math.b2Max(B + P, 0);
                var R = (P = v.positionImpulse - B) * p,
                    J = P * d;
                l.x -= c * R, l.y -= c * J, m -= u * (g * J - M * R), a.m_R.Set(m), _.x += y * R, _.y += y * J, h += b * (S * J - C * R), r.m_R.Set(h)
            }
            a.m_rotation = m, r.m_rotation = h
        }
        return e >= -b2Settings.b2_linearSlop
    },
    PostSolve: function() {
        for (var t = 0; t < this.m_constraintCount; ++t)
            for (var i = this.m_constraints[t], o = i.manifold, e = 0; e < i.pointCount; ++e) {
                var n = o.points[e],
                    s = i.points[e];
                n.normalImpulse = s.normalImpulse, n.tangentImpulse = s.tangentImpulse
            }
    },
    m_allocator: null,
    m_constraints: new Array,
    m_constraintCount: 0
};
var b2CircleContact = Class.create();
Object.extend(b2CircleContact.prototype, b2Contact.prototype), Object.extend(b2CircleContact.prototype, {
    initialize: function(t, i) {
        if (this.m_node1 = new b2ContactNode, this.m_node2 = new b2ContactNode, this.m_flags = 0, !t || !i) return this.m_shape1 = null, void(this.m_shape2 = null);
        this.m_shape1 = t, this.m_shape2 = i, this.m_manifoldCount = 0, this.m_friction = Math.sqrt(this.m_shape1.m_friction * this.m_shape2.m_friction), this.m_restitution = b2Math.b2Max(this.m_shape1.m_restitution, this.m_shape2.m_restitution), this.m_prev = null, this.m_next = null, this.m_node1.contact = null, this.m_node1.prev = null, this.m_node1.next = null, this.m_node1.other = null, this.m_node2.contact = null, this.m_node2.prev = null, this.m_node2.next = null, this.m_node2.other = null, this.m_manifold = [new b2Manifold], this.m_manifold[0].pointCount = 0, this.m_manifold[0].points[0].normalImpulse = 0, this.m_manifold[0].points[0].tangentImpulse = 0
    },
    Evaluate: function() {
        b2Collision.b2CollideCircle(this.m_manifold[0], this.m_shape1, this.m_shape2, !1), this.m_manifold[0].pointCount > 0 ? this.m_manifoldCount = 1 : this.m_manifoldCount = 0
    },
    GetManifolds: function() {
        return this.m_manifold
    },
    m_manifold: [new b2Manifold]
}), b2CircleContact.Create = function(t, i, o) {
    return new b2CircleContact(t, i)
}, b2CircleContact.Destroy = function(t, i) {};
var b2Conservative = Class.create();
b2Conservative.prototype = {
    initialize: function() {}
}, b2Conservative.R1 = new b2Mat22, b2Conservative.R2 = new b2Mat22, b2Conservative.x1 = new b2Vec2, b2Conservative.x2 = new b2Vec2, b2Conservative.Conservative = function(t, i) {
    var o = t.GetBody(),
        e = i.GetBody(),
        n = o.m_position.x - o.m_position0.x,
        s = o.m_position.y - o.m_position0.y,
        a = o.m_rotation - o.m_rotation0,
        r = e.m_position.x - e.m_position0.x,
        l = e.m_position.y - e.m_position0.y,
        m = e.m_rotation - e.m_rotation0,
        _ = t.GetMaxRadius(),
        h = i.GetMaxRadius(),
        c = o.m_position0.x,
        u = o.m_position0.y,
        y = o.m_rotation0,
        b = e.m_position0.x,
        p = e.m_position0.y,
        x = e.m_rotation0,
        f = c,
        v = u,
        g = y,
        M = b,
        S = p,
        C = x;
    b2Conservative.R1.Set(g), b2Conservative.R2.Set(C), t.QuickSync(p1, b2Conservative.R1), i.QuickSync(p2, b2Conservative.R2);
    for (var V, w, A = 0, I = 0, P = !0, B = 0; B < 10; ++B) {
        var R = b2Distance.Distance(b2Conservative.x1, b2Conservative.x2, t, i);
        if (R < b2Settings.b2_linearSlop) {
            P = 0 != B;
            break
        }
        if (0 == B) {
            V = b2Conservative.x2.x - b2Conservative.x1.x, w = b2Conservative.x2.y - b2Conservative.x1.y;
            Math.sqrt(V * V + w * w);
            var J = V * (n - r) + w * (s - l) + Math.abs(a) * _ + Math.abs(m) * h;
            if (Math.abs(J) < Number.MIN_VALUE) {
                P = !1;
                break
            }
            I = 1 / J
        }
        var L = A + R * I;
        if (L < 0 || 1 < L) {
            P = !1;
            break
        }
        if (L < (1 + 100 * Number.MIN_VALUE) * A) {
            P = !0;
            break
        }
        f = c + (A = L) * v1.x, v = u + A * v1.y, g = y + A * a, M = b + A * v2.x, S = p + A * v2.y, C = x + A * m, b2Conservative.R1.Set(g), b2Conservative.R2.Set(C), t.QuickSync(p1, b2Conservative.R1), i.QuickSync(p2, b2Conservative.R2)
    }
    if (P) {
        V = b2Conservative.x2.x - b2Conservative.x1.x, w = b2Conservative.x2.y - b2Conservative.x1.y;
        var D = Math.sqrt(V * V + w * w);
        return D > FLT_EPSILON && (d *= b2_linearSlop / D), o.IsStatic() ? (o.m_position.x = f, o.m_position.y = v) : (o.m_position.x = f - V, o.m_position.y = v - w), o.m_rotation = g, o.m_R.Set(g), o.QuickSyncShapes(), e.IsStatic() ? (e.m_position.x = M, e.m_position.y = S) : (e.m_position.x = M + V, e.m_position.y = S + w), e.m_position.x = M + V, e.m_position.y = S + w, e.m_rotation = C, e.m_R.Set(C), e.QuickSyncShapes(), !0
    }
    return t.QuickSync(o.m_position, o.m_R), i.QuickSync(e.m_position, e.m_R), !1
};
var b2NullContact = Class.create();
Object.extend(b2NullContact.prototype, b2Contact.prototype), Object.extend(b2NullContact.prototype, {
    initialize: function(t, i) {
        if (this.m_node1 = new b2ContactNode, this.m_node2 = new b2ContactNode, this.m_flags = 0, !t || !i) return this.m_shape1 = null, void(this.m_shape2 = null);
        this.m_shape1 = t, this.m_shape2 = i, this.m_manifoldCount = 0, this.m_friction = Math.sqrt(this.m_shape1.m_friction * this.m_shape2.m_friction), this.m_restitution = b2Math.b2Max(this.m_shape1.m_restitution, this.m_shape2.m_restitution), this.m_prev = null, this.m_next = null, this.m_node1.contact = null, this.m_node1.prev = null, this.m_node1.next = null, this.m_node1.other = null, this.m_node2.contact = null, this.m_node2.prev = null, this.m_node2.next = null, this.m_node2.other = null
    },
    Evaluate: function() {},
    GetManifolds: function() {
        return null
    }
});
var b2PolyAndCircleContact = Class.create();
Object.extend(b2PolyAndCircleContact.prototype, b2Contact.prototype), Object.extend(b2PolyAndCircleContact.prototype, {
    initialize: function(t, i) {
        if (this.m_node1 = new b2ContactNode, this.m_node2 = new b2ContactNode, this.m_flags = 0, !t || !i) return this.m_shape1 = null, void(this.m_shape2 = null);
        this.m_shape1 = t, this.m_shape2 = i, this.m_manifoldCount = 0, this.m_friction = Math.sqrt(this.m_shape1.m_friction * this.m_shape2.m_friction), this.m_restitution = b2Math.b2Max(this.m_shape1.m_restitution, this.m_shape2.m_restitution), this.m_prev = null, this.m_next = null, this.m_node1.contact = null, this.m_node1.prev = null, this.m_node1.next = null, this.m_node1.other = null, this.m_node2.contact = null, this.m_node2.prev = null, this.m_node2.next = null, this.m_node2.other = null, this.m_manifold = [new b2Manifold], b2Settings.b2Assert(this.m_shape1.m_type == b2Shape.e_polyShape), b2Settings.b2Assert(this.m_shape2.m_type == b2Shape.e_circleShape), this.m_manifold[0].pointCount = 0, this.m_manifold[0].points[0].normalImpulse = 0, this.m_manifold[0].points[0].tangentImpulse = 0
    },
    Evaluate: function() {
        b2Collision.b2CollidePolyAndCircle(this.m_manifold[0], this.m_shape1, this.m_shape2, !1), this.m_manifold[0].pointCount > 0 ? this.m_manifoldCount = 1 : this.m_manifoldCount = 0
    },
    GetManifolds: function() {
        return this.m_manifold
    },
    m_manifold: [new b2Manifold]
}), b2PolyAndCircleContact.Create = function(t, i, o) {
    return new b2PolyAndCircleContact(t, i)
}, b2PolyAndCircleContact.Destroy = function(t, i) {};
var b2PolyContact = Class.create();
Object.extend(b2PolyContact.prototype, b2Contact.prototype), Object.extend(b2PolyContact.prototype, {
    initialize: function(t, i) {
        if (this.m_node1 = new b2ContactNode, this.m_node2 = new b2ContactNode, this.m_flags = 0, !t || !i) return this.m_shape1 = null, void(this.m_shape2 = null);
        this.m_shape1 = t, this.m_shape2 = i, this.m_manifoldCount = 0, this.m_friction = Math.sqrt(this.m_shape1.m_friction * this.m_shape2.m_friction), this.m_restitution = b2Math.b2Max(this.m_shape1.m_restitution, this.m_shape2.m_restitution), this.m_prev = null, this.m_next = null, this.m_node1.contact = null, this.m_node1.prev = null, this.m_node1.next = null, this.m_node1.other = null, this.m_node2.contact = null, this.m_node2.prev = null, this.m_node2.next = null, this.m_node2.other = null, this.m0 = new b2Manifold, this.m_manifold = [new b2Manifold], this.m_manifold[0].pointCount = 0
    },
    m0: new b2Manifold,
    Evaluate: function() {
        for (var t = this.m_manifold[0], i = this.m0.points, o = 0; o < t.pointCount; o++) {
            var e = i[o],
                n = t.points[o];
            e.normalImpulse = n.normalImpulse, e.tangentImpulse = n.tangentImpulse, e.id = n.id.Copy()
        }
        if (this.m0.pointCount = t.pointCount, b2Collision.b2CollidePoly(t, this.m_shape1, this.m_shape2, !1), t.pointCount > 0) {
            for (var s = [!1, !1], a = 0; a < t.pointCount; ++a) {
                var r = t.points[a];
                r.normalImpulse = 0, r.tangentImpulse = 0;
                for (var l = r.id.key, m = 0; m < this.m0.pointCount; ++m)
                    if (1 != s[m]) {
                        var _ = this.m0.points[m];
                        if (_.id.key == l) {
                            s[m] = !0, r.normalImpulse = _.normalImpulse, r.tangentImpulse = _.tangentImpulse;
                            break
                        }
                    }
            }
            this.m_manifoldCount = 1
        } else this.m_manifoldCount = 0
    },
    GetManifolds: function() {
        return this.m_manifold
    },
    m_manifold: [new b2Manifold]
}), b2PolyContact.Create = function(t, i, o) {
    return new b2PolyContact(t, i)
}, b2PolyContact.Destroy = function(t, i) {};
var b2ContactManager = Class.create();
Object.extend(b2ContactManager.prototype, b2PairCallback.prototype), Object.extend(b2ContactManager.prototype, {
    initialize: function() {
        this.m_nullContact = new b2NullContact, this.m_world = null, this.m_destroyImmediate = !1
    },
    PairAdded: function(t, i) {
        var o = t,
            e = i,
            n = o.m_body,
            s = e.m_body;
        if (n.IsStatic() && s.IsStatic()) return this.m_nullContact;
        if (o.m_body == e.m_body) return this.m_nullContact;
        if (s.IsConnected(n)) return this.m_nullContact;
        if (null != this.m_world.m_filter && 0 == this.m_world.m_filter.ShouldCollide(o, e)) return this.m_nullContact;
        if (0 == s.m_invMass) {
            var a = o;
            o = e, e = a;
            var r = n;
            n = s, s = r
        }
        var l = b2Contact.Create(o, e, this.m_world.m_blockAllocator);
        return null == l ? this.m_nullContact : (l.m_prev = null, l.m_next = this.m_world.m_contactList, null != this.m_world.m_contactList && (this.m_world.m_contactList.m_prev = l), this.m_world.m_contactList = l, this.m_world.m_contactCount++, l)
    },
    PairRemoved: function(t, i, o) {
        if (null != o) {
            var e = o;
            e != this.m_nullContact && (1 == this.m_destroyImmediate ? (this.DestroyContact(e), e = null) : e.m_flags |= b2Contact.e_destroyFlag)
        }
    },
    DestroyContact: function(t) {
        if (t.m_prev && (t.m_prev.m_next = t.m_next), t.m_next && (t.m_next.m_prev = t.m_prev), t == this.m_world.m_contactList && (this.m_world.m_contactList = t.m_next), t.GetManifoldCount() > 0) {
            var i = t.m_shape1.m_body,
                o = t.m_shape2.m_body,
                e = t.m_node1,
                n = t.m_node2;
            i.WakeUp(), o.WakeUp(), e.prev && (e.prev.next = e.next), e.next && (e.next.prev = e.prev), e == i.m_contactList && (i.m_contactList = e.next), e.prev = null, e.next = null, n.prev && (n.prev.next = n.next), n.next && (n.next.prev = n.prev), n == o.m_contactList && (o.m_contactList = n.next), n.prev = null, n.next = null
        }
        b2Contact.Destroy(t, this.m_world.m_blockAllocator), --this.m_world.m_contactCount
    },
    CleanContactList: function() {
        for (var t = this.m_world.m_contactList; null != t;) {
            var i = t;
            t = t.m_next, i.m_flags & b2Contact.e_destroyFlag && (this.DestroyContact(i), i = null)
        }
    },
    Collide: function() {
        for (var t, i, o, e, n = this.m_world.m_contactList; null != n; n = n.m_next)
            if (!n.m_shape1.m_body.IsSleeping() || !n.m_shape2.m_body.IsSleeping()) {
                var s = n.GetManifoldCount();
                n.Evaluate();
                var a = n.GetManifoldCount();
                0 == s && a > 0 ? (t = n.m_shape1.m_body, i = n.m_shape2.m_body, o = n.m_node1, e = n.m_node2, o.contact = n, o.other = i, o.prev = null, o.next = t.m_contactList, null != o.next && (o.next.prev = n.m_node1), t.m_contactList = n.m_node1, e.contact = n, e.other = t, e.prev = null, e.next = i.m_contactList, null != e.next && (e.next.prev = e), i.m_contactList = e) : s > 0 && 0 == a && (t = n.m_shape1.m_body, i = n.m_shape2.m_body, o = n.m_node1, e = n.m_node2, o.prev && (o.prev.next = o.next), o.next && (o.next.prev = o.prev), o == t.m_contactList && (t.m_contactList = o.next), o.prev = null, o.next = null, e.prev && (e.prev.next = e.next), e.next && (e.next.prev = e.prev), e == i.m_contactList && (i.m_contactList = e.next), e.prev = null, e.next = null)
            }
    },
    m_world: null,
    m_nullContact: new b2NullContact,
    m_destroyImmediate: null
});
var b2World = Class.create();
b2World.prototype = {
    initialize: function(t, i, o) {
        this.step = new b2TimeStep, this.m_contactManager = new b2ContactManager, this.m_listener = null, this.m_filter = b2CollisionFilter.b2_defaultFilter, this.m_bodyList = null, this.m_contactList = null, this.m_jointList = null, this.m_bodyCount = 0, this.m_contactCount = 0, this.m_jointCount = 0, this.m_bodyDestroyList = null, this.m_allowSleep = o, this.m_gravity = i, this.m_contactManager.m_world = this, this.m_broadPhase = new b2BroadPhase(t, this.m_contactManager);
        var e = new b2BodyDef;
        this.m_groundBody = this.CreateBody(e)
    },
    SetListener: function(t) {
        this.m_listener = t
    },
    SetFilter: function(t) {
        this.m_filter = t
    },
    CreateBody: function(t) {
        var i = new b2Body(t, this);
        return i.m_prev = null, i.m_next = this.m_bodyList, this.m_bodyList && (this.m_bodyList.m_prev = i), this.m_bodyList = i, ++this.m_bodyCount, i
    },
    DestroyBody: function(t) {
        t.m_flags & b2Body.e_destroyFlag || (t.m_prev && (t.m_prev.m_next = t.m_next), t.m_next && (t.m_next.m_prev = t.m_prev), t == this.m_bodyList && (this.m_bodyList = t.m_next), t.m_flags |= b2Body.e_destroyFlag, --this.m_bodyCount, t.m_prev = null, t.m_next = this.m_bodyDestroyList, this.m_bodyDestroyList = t)
    },
    CleanBodyList: function() {
        this.m_contactManager.m_destroyImmediate = !0;
        for (var t = this.m_bodyDestroyList; t;) {
            var i = t;
            t = t.m_next;
            for (var o = i.m_jointList; o;) {
                var e = o;
                o = o.next, this.m_listener && this.m_listener.NotifyJointDestroyed(e.joint), this.DestroyJoint(e.joint)
            }
            i.Destroy()
        }
        this.m_bodyDestroyList = null, this.m_contactManager.m_destroyImmediate = !1
    },
    CreateJoint: function(t) {
        var i = b2Joint.Create(t, this.m_blockAllocator);
        if (i.m_prev = null, i.m_next = this.m_jointList, this.m_jointList && (this.m_jointList.m_prev = i), this.m_jointList = i, ++this.m_jointCount, i.m_node1.joint = i, i.m_node1.other = i.m_body2, i.m_node1.prev = null, i.m_node1.next = i.m_body1.m_jointList, i.m_body1.m_jointList && (i.m_body1.m_jointList.prev = i.m_node1), i.m_body1.m_jointList = i.m_node1, i.m_node2.joint = i, i.m_node2.other = i.m_body1, i.m_node2.prev = null, i.m_node2.next = i.m_body2.m_jointList, i.m_body2.m_jointList && (i.m_body2.m_jointList.prev = i.m_node2), i.m_body2.m_jointList = i.m_node2, 0 == t.collideConnected)
            for (var o = (t.body1.m_shapeCount < t.body2.m_shapeCount ? t.body1 : t.body2).m_shapeList; o; o = o.m_next) o.ResetProxy(this.m_broadPhase);
        return i
    },
    DestroyJoint: function(t) {
        var i = t.m_collideConnected;
        t.m_prev && (t.m_prev.m_next = t.m_next), t.m_next && (t.m_next.m_prev = t.m_prev), t == this.m_jointList && (this.m_jointList = t.m_next);
        var o = t.m_body1,
            e = t.m_body2;
        if (o.WakeUp(), e.WakeUp(), t.m_node1.prev && (t.m_node1.prev.next = t.m_node1.next), t.m_node1.next && (t.m_node1.next.prev = t.m_node1.prev), t.m_node1 == o.m_jointList && (o.m_jointList = t.m_node1.next), t.m_node1.prev = null, t.m_node1.next = null, t.m_node2.prev && (t.m_node2.prev.next = t.m_node2.next), t.m_node2.next && (t.m_node2.next.prev = t.m_node2.prev), t.m_node2 == e.m_jointList && (e.m_jointList = t.m_node2.next), t.m_node2.prev = null, t.m_node2.next = null, b2Joint.Destroy(t, this.m_blockAllocator), --this.m_jointCount, 0 == i)
            for (var n = (o.m_shapeCount < e.m_shapeCount ? o : e).m_shapeList; n; n = n.m_next) n.ResetProxy(this.m_broadPhase)
    },
    GetGroundBody: function() {
        return this.m_groundBody
    },
    step: new b2TimeStep,
    Step: function(t, i) {
        var o, e;
        this.step.dt = t, this.step.iterations = i, this.step.inv_dt = t > 0 ? 1 / t : 0, this.m_positionIterationCount = 0, this.m_contactManager.CleanContactList(), this.CleanBodyList(), this.m_contactManager.Collide();
        var n = new b2Island(this.m_bodyCount, this.m_contactCount, this.m_jointCount, this.m_stackAllocator);
        for (o = this.m_bodyList; null != o; o = o.m_next) o.m_flags &= ~b2Body.e_islandFlag;
        for (var s = this.m_contactList; null != s; s = s.m_next) s.m_flags &= ~b2Contact.e_islandFlag;
        for (var a = this.m_jointList; null != a; a = a.m_next) a.m_islandFlag = !1;
        this.m_bodyCount;
        for (var r = new Array(this.m_bodyCount), l = 0; l < this.m_bodyCount; l++) r[l] = null;
        for (var m = this.m_bodyList; null != m; m = m.m_next)
            if (!(m.m_flags & (b2Body.e_staticFlag | b2Body.e_islandFlag | b2Body.e_sleepFlag | b2Body.e_frozenFlag))) {
                n.Clear();
                var _ = 0;
                for (r[_++] = m, m.m_flags |= b2Body.e_islandFlag; _ > 0;)
                    if (o = r[--_], n.AddBody(o), o.m_flags &= ~b2Body.e_sleepFlag, !(o.m_flags & b2Body.e_staticFlag)) {
                        for (var h = o.m_contactList; null != h; h = h.next) h.contact.m_flags & b2Contact.e_islandFlag || (n.AddContact(h.contact), h.contact.m_flags |= b2Contact.e_islandFlag, (e = h.other).m_flags & b2Body.e_islandFlag || (r[_++] = e, e.m_flags |= b2Body.e_islandFlag));
                        for (var c = o.m_jointList; null != c; c = c.next) 1 != c.joint.m_islandFlag && (n.AddJoint(c.joint), c.joint.m_islandFlag = !0, (e = c.other).m_flags & b2Body.e_islandFlag || (r[_++] = e, e.m_flags |= b2Body.e_islandFlag))
                    }
                n.Solve(this.step, this.m_gravity), this.m_positionIterationCount = b2Math.b2Max(this.m_positionIterationCount, b2Island.m_positionIterationCount), this.m_allowSleep && n.UpdateSleep(t);
                for (var u = 0; u < n.m_bodyCount; ++u)(o = n.m_bodies[u]).m_flags & b2Body.e_staticFlag && (o.m_flags &= ~b2Body.e_islandFlag), o.IsFrozen() && this.m_listener && this.m_listener.NotifyBoundaryViolated(o) == b2WorldListener.b2_destroyBody && (this.DestroyBody(o), o = null, n.m_bodies[u] = null)
            }
        this.m_broadPhase.Commit()
    },
    Query: function(t, i, o) {
        for (var e = new Array, n = this.m_broadPhase.QueryAABB(t, e, o), s = 0; s < n; ++s) i[s] = e[s];
        return n
    },
    GetBodyList: function() {
        return this.m_bodyList
    },
    GetJointList: function() {
        return this.m_jointList
    },
    GetContactList: function() {
        return this.m_contactList
    },
    m_blockAllocator: null,
    m_stackAllocator: null,
    m_broadPhase: null,
    m_contactManager: new b2ContactManager,
    m_bodyList: null,
    m_contactList: null,
    m_jointList: null,
    m_bodyCount: 0,
    m_contactCount: 0,
    m_jointCount: 0,
    m_bodyDestroyList: null,
    m_gravity: null,
    m_allowSleep: null,
    m_groundBody: null,
    m_listener: null,
    m_filter: null,
    m_positionIterationCount: 0
}, b2World.s_enablePositionCorrection = 1, b2World.s_enableWarmStarting = 1;
var b2WorldListener = Class.create();
b2WorldListener.prototype = {
    NotifyJointDestroyed: function(t) {},
    NotifyBoundaryViolated: function(t) {
        return b2WorldListener.b2_freezeBody
    },
    initialize: function() {}
}, b2WorldListener.b2_freezeBody = 0, b2WorldListener.b2_destroyBody = 1;
var b2JointNode = Class.create();
b2JointNode.prototype = {
    other: null,
    joint: null,
    prev: null,
    next: null,
    initialize: function() {}
};
var b2Joint = Class.create();
b2Joint.prototype = {
    GetType: function() {
        return this.m_type
    },
    GetAnchor1: function() {
        return null
    },
    GetAnchor2: function() {
        return null
    },
    GetReactionForce: function(t) {
        return null
    },
    GetReactionTorque: function(t) {
        return 0
    },
    GetBody1: function() {
        return this.m_body1
    },
    GetBody2: function() {
        return this.m_body2
    },
    GetNext: function() {
        return this.m_next
    },
    GetUserData: function() {
        return this.m_userData
    },
    initialize: function(t) {
        this.m_node1 = new b2JointNode, this.m_node2 = new b2JointNode, this.m_type = t.type, this.m_prev = null, this.m_next = null, this.m_body1 = t.body1, this.m_body2 = t.body2, this.m_collideConnected = t.collideConnected, this.m_islandFlag = !1, this.m_userData = t.userData
    },
    PrepareVelocitySolver: function() {},
    SolveVelocityConstraints: function(t) {},
    PreparePositionSolver: function() {},
    SolvePositionConstraints: function() {
        return !1
    },
    m_type: 0,
    m_prev: null,
    m_next: null,
    m_node1: new b2JointNode,
    m_node2: new b2JointNode,
    m_body1: null,
    m_body2: null,
    m_islandFlag: null,
    m_collideConnected: null,
    m_userData: null
}, b2Joint.Create = function(t, i) {
    var o = null;
    switch (t.type) {
        case b2Joint.e_distanceJoint:
            o = new b2DistanceJoint(t);
            break;
        case b2Joint.e_mouseJoint:
            o = new b2MouseJoint(t);
            break;
        case b2Joint.e_prismaticJoint:
            o = new b2PrismaticJoint(t);
            break;
        case b2Joint.e_revoluteJoint:
            o = new b2RevoluteJoint(t);
            break;
        case b2Joint.e_pulleyJoint:
            o = new b2PulleyJoint(t);
            break;
        case b2Joint.e_gearJoint:
            o = new b2GearJoint(t)
    }
    return o
}, b2Joint.Destroy = function(t, i) {}, b2Joint.e_unknownJoint = 0, b2Joint.e_revoluteJoint = 1, b2Joint.e_prismaticJoint = 2, b2Joint.e_distanceJoint = 3, b2Joint.e_pulleyJoint = 4, b2Joint.e_mouseJoint = 5, b2Joint.e_gearJoint = 6, b2Joint.e_inactiveLimit = 0, b2Joint.e_atLowerLimit = 1, b2Joint.e_atUpperLimit = 2, b2Joint.e_equalLimits = 3;
var b2JointDef = Class.create();
b2JointDef.prototype = {
    initialize: function() {
        this.type = b2Joint.e_unknownJoint, this.userData = null, this.body1 = null, this.body2 = null, this.collideConnected = !1
    },
    type: 0,
    userData: null,
    body1: null,
    body2: null,
    collideConnected: null
};
var b2DistanceJoint = Class.create();
Object.extend(b2DistanceJoint.prototype, b2Joint.prototype), Object.extend(b2DistanceJoint.prototype, {
    initialize: function(t) {
        this.m_node1 = new b2JointNode, this.m_node2 = new b2JointNode, this.m_type = t.type, this.m_prev = null, this.m_next = null, this.m_body1 = t.body1, this.m_body2 = t.body2, this.m_collideConnected = t.collideConnected, this.m_islandFlag = !1, this.m_userData = t.userData, this.m_localAnchor1 = new b2Vec2, this.m_localAnchor2 = new b2Vec2, this.m_u = new b2Vec2;
        var i, o, e;
        i = this.m_body1.m_R, o = t.anchorPoint1.x - this.m_body1.m_position.x, e = t.anchorPoint1.y - this.m_body1.m_position.y, this.m_localAnchor1.x = o * i.col1.x + e * i.col1.y, this.m_localAnchor1.y = o * i.col2.x + e * i.col2.y, i = this.m_body2.m_R, o = t.anchorPoint2.x - this.m_body2.m_position.x, e = t.anchorPoint2.y - this.m_body2.m_position.y, this.m_localAnchor2.x = o * i.col1.x + e * i.col1.y, this.m_localAnchor2.y = o * i.col2.x + e * i.col2.y, o = t.anchorPoint2.x - t.anchorPoint1.x, e = t.anchorPoint2.y - t.anchorPoint1.y, this.m_length = Math.sqrt(o * o + e * e), this.m_impulse = 0
    },
    PrepareVelocitySolver: function() {
        var t, i = (t = this.m_body1.m_R).col1.x * this.m_localAnchor1.x + t.col2.x * this.m_localAnchor1.y,
            o = t.col1.y * this.m_localAnchor1.x + t.col2.y * this.m_localAnchor1.y,
            e = (t = this.m_body2.m_R).col1.x * this.m_localAnchor2.x + t.col2.x * this.m_localAnchor2.y,
            n = t.col1.y * this.m_localAnchor2.x + t.col2.y * this.m_localAnchor2.y;
        this.m_u.x = this.m_body2.m_position.x + e - this.m_body1.m_position.x - i, this.m_u.y = this.m_body2.m_position.y + n - this.m_body1.m_position.y - o;
        var s = Math.sqrt(this.m_u.x * this.m_u.x + this.m_u.y * this.m_u.y);
        s > b2Settings.b2_linearSlop ? this.m_u.Multiply(1 / s) : this.m_u.SetZero();
        var a = i * this.m_u.y - o * this.m_u.x,
            r = e * this.m_u.y - n * this.m_u.x;
        if (this.m_mass = this.m_body1.m_invMass + this.m_body1.m_invI * a * a + this.m_body2.m_invMass + this.m_body2.m_invI * r * r, this.m_mass = 1 / this.m_mass, b2World.s_enableWarmStarting) {
            var l = this.m_impulse * this.m_u.x,
                m = this.m_impulse * this.m_u.y;
            this.m_body1.m_linearVelocity.x -= this.m_body1.m_invMass * l, this.m_body1.m_linearVelocity.y -= this.m_body1.m_invMass * m, this.m_body1.m_angularVelocity -= this.m_body1.m_invI * (i * m - o * l), this.m_body2.m_linearVelocity.x += this.m_body2.m_invMass * l, this.m_body2.m_linearVelocity.y += this.m_body2.m_invMass * m, this.m_body2.m_angularVelocity += this.m_body2.m_invI * (e * m - n * l)
        } else this.m_impulse = 0
    },
    SolveVelocityConstraints: function(t) {
        var i, o = (i = this.m_body1.m_R).col1.x * this.m_localAnchor1.x + i.col2.x * this.m_localAnchor1.y,
            e = i.col1.y * this.m_localAnchor1.x + i.col2.y * this.m_localAnchor1.y,
            n = (i = this.m_body2.m_R).col1.x * this.m_localAnchor2.x + i.col2.x * this.m_localAnchor2.y,
            s = i.col1.y * this.m_localAnchor2.x + i.col2.y * this.m_localAnchor2.y,
            a = this.m_body1.m_linearVelocity.x + -this.m_body1.m_angularVelocity * e,
            r = this.m_body1.m_linearVelocity.y + this.m_body1.m_angularVelocity * o,
            l = this.m_body2.m_linearVelocity.x + -this.m_body2.m_angularVelocity * s,
            m = this.m_body2.m_linearVelocity.y + this.m_body2.m_angularVelocity * n,
            _ = this.m_u.x * (l - a) + this.m_u.y * (m - r),
            h = -this.m_mass * _;
        this.m_impulse += h;
        var c = h * this.m_u.x,
            u = h * this.m_u.y;
        this.m_body1.m_linearVelocity.x -= this.m_body1.m_invMass * c, this.m_body1.m_linearVelocity.y -= this.m_body1.m_invMass * u, this.m_body1.m_angularVelocity -= this.m_body1.m_invI * (o * u - e * c), this.m_body2.m_linearVelocity.x += this.m_body2.m_invMass * c, this.m_body2.m_linearVelocity.y += this.m_body2.m_invMass * u, this.m_body2.m_angularVelocity += this.m_body2.m_invI * (n * u - s * c)
    },
    SolvePositionConstraints: function() {
        var t, i = (t = this.m_body1.m_R).col1.x * this.m_localAnchor1.x + t.col2.x * this.m_localAnchor1.y,
            o = t.col1.y * this.m_localAnchor1.x + t.col2.y * this.m_localAnchor1.y,
            e = (t = this.m_body2.m_R).col1.x * this.m_localAnchor2.x + t.col2.x * this.m_localAnchor2.y,
            n = t.col1.y * this.m_localAnchor2.x + t.col2.y * this.m_localAnchor2.y,
            s = this.m_body2.m_position.x + e - this.m_body1.m_position.x - i,
            a = this.m_body2.m_position.y + n - this.m_body1.m_position.y - o,
            r = Math.sqrt(s * s + a * a);
        s /= r, a /= r;
        var l = r - this.m_length;
        l = b2Math.b2Clamp(l, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection);
        var m = -this.m_mass * l;
        this.m_u.Set(s, a);
        var _ = m * this.m_u.x,
            h = m * this.m_u.y;
        return this.m_body1.m_position.x -= this.m_body1.m_invMass * _, this.m_body1.m_position.y -= this.m_body1.m_invMass * h, this.m_body1.m_rotation -= this.m_body1.m_invI * (i * h - o * _), this.m_body2.m_position.x += this.m_body2.m_invMass * _, this.m_body2.m_position.y += this.m_body2.m_invMass * h, this.m_body2.m_rotation += this.m_body2.m_invI * (e * h - n * _), this.m_body1.m_R.Set(this.m_body1.m_rotation), this.m_body2.m_R.Set(this.m_body2.m_rotation), b2Math.b2Abs(l) < b2Settings.b2_linearSlop
    },
    GetAnchor1: function() {
        return b2Math.AddVV(this.m_body1.m_position, b2Math.b2MulMV(this.m_body1.m_R, this.m_localAnchor1))
    },
    GetAnchor2: function() {
        return b2Math.AddVV(this.m_body2.m_position, b2Math.b2MulMV(this.m_body2.m_R, this.m_localAnchor2))
    },
    GetReactionForce: function(t) {
        var i = new b2Vec2;
        return i.SetV(this.m_u), i.Multiply(this.m_impulse * t), i
    },
    GetReactionTorque: function(t) {
        return 0
    },
    m_localAnchor1: new b2Vec2,
    m_localAnchor2: new b2Vec2,
    m_u: new b2Vec2,
    m_impulse: null,
    m_mass: null,
    m_length: null
});
var b2DistanceJointDef = Class.create();
Object.extend(b2DistanceJointDef.prototype, b2JointDef.prototype), Object.extend(b2DistanceJointDef.prototype, {
    initialize: function() {
        this.type = b2Joint.e_unknownJoint, this.userData = null, this.body1 = null, this.body2 = null, this.collideConnected = !1, this.anchorPoint1 = new b2Vec2, this.anchorPoint2 = new b2Vec2, this.type = b2Joint.e_distanceJoint
    },
    anchorPoint1: new b2Vec2,
    anchorPoint2: new b2Vec2
});
var b2Jacobian = Class.create();
b2Jacobian.prototype = {
    linear1: new b2Vec2,
    angular1: null,
    linear2: new b2Vec2,
    angular2: null,
    SetZero: function() {
        this.linear1.SetZero(), this.angular1 = 0, this.linear2.SetZero(), this.angular2 = 0
    },
    Set: function(t, i, o, e) {
        this.linear1.SetV(t), this.angular1 = i, this.linear2.SetV(o), this.angular2 = e
    },
    Compute: function(t, i, o, e) {
        return this.linear1.x * t.x + this.linear1.y * t.y + this.angular1 * i + (this.linear2.x * o.x + this.linear2.y * o.y) + this.angular2 * e
    },
    initialize: function() {
        this.linear1 = new b2Vec2, this.linear2 = new b2Vec2
    }
};
var b2GearJoint = Class.create();
Object.extend(b2GearJoint.prototype, b2Joint.prototype), Object.extend(b2GearJoint.prototype, {
    GetAnchor1: function() {
        var t = this.m_body1.m_R;
        return new b2Vec2(this.m_body1.m_position.x + (t.col1.x * this.m_localAnchor1.x + t.col2.x * this.m_localAnchor1.y), this.m_body1.m_position.y + (t.col1.y * this.m_localAnchor1.x + t.col2.y * this.m_localAnchor1.y))
    },
    GetAnchor2: function() {
        var t = this.m_body2.m_R;
        return new b2Vec2(this.m_body2.m_position.x + (t.col1.x * this.m_localAnchor2.x + t.col2.x * this.m_localAnchor2.y), this.m_body2.m_position.y + (t.col1.y * this.m_localAnchor2.x + t.col2.y * this.m_localAnchor2.y))
    },
    GetReactionForce: function(t) {
        return new b2Vec2
    },
    GetReactionTorque: function(t) {
        return 0
    },
    GetRatio: function() {
        return this.m_ratio
    },
    initialize: function(t) {
        this.m_node1 = new b2JointNode, this.m_node2 = new b2JointNode, this.m_type = t.type, this.m_prev = null, this.m_next = null, this.m_body1 = t.body1, this.m_body2 = t.body2, this.m_collideConnected = t.collideConnected, this.m_islandFlag = !1, this.m_userData = t.userData, this.m_groundAnchor1 = new b2Vec2, this.m_groundAnchor2 = new b2Vec2, this.m_localAnchor1 = new b2Vec2, this.m_localAnchor2 = new b2Vec2, this.m_J = new b2Jacobian, this.m_revolute1 = null, this.m_prismatic1 = null, this.m_revolute2 = null, this.m_prismatic2 = null;
        var i, o;
        this.m_ground1 = t.joint1.m_body1, this.m_body1 = t.joint1.m_body2, t.joint1.m_type == b2Joint.e_revoluteJoint ? (this.m_revolute1 = t.joint1, this.m_groundAnchor1.SetV(this.m_revolute1.m_localAnchor1), this.m_localAnchor1.SetV(this.m_revolute1.m_localAnchor2), i = this.m_revolute1.GetJointAngle()) : (this.m_prismatic1 = t.joint1, this.m_groundAnchor1.SetV(this.m_prismatic1.m_localAnchor1), this.m_localAnchor1.SetV(this.m_prismatic1.m_localAnchor2), i = this.m_prismatic1.GetJointTranslation()), this.m_ground2 = t.joint2.m_body1, this.m_body2 = t.joint2.m_body2, t.joint2.m_type == b2Joint.e_revoluteJoint ? (this.m_revolute2 = t.joint2, this.m_groundAnchor2.SetV(this.m_revolute2.m_localAnchor1), this.m_localAnchor2.SetV(this.m_revolute2.m_localAnchor2), o = this.m_revolute2.GetJointAngle()) : (this.m_prismatic2 = t.joint2, this.m_groundAnchor2.SetV(this.m_prismatic2.m_localAnchor1), this.m_localAnchor2.SetV(this.m_prismatic2.m_localAnchor2), o = this.m_prismatic2.GetJointTranslation()), this.m_ratio = t.ratio, this.m_constant = i + this.m_ratio * o, this.m_impulse = 0
    },
    PrepareVelocitySolver: function() {
        var t, i, o, e, n, s = this.m_ground1,
            a = this.m_ground2,
            r = this.m_body1,
            l = this.m_body2,
            m = 0;
        this.m_J.SetZero(), this.m_revolute1 ? (this.m_J.angular1 = -1, m += r.m_invI) : (o = s.m_R, e = this.m_prismatic1.m_localXAxis1, t = o.col1.x * e.x + o.col2.x * e.y, i = o.col1.y * e.x + o.col2.y * e.y, n = ((o = r.m_R).col1.x * this.m_localAnchor1.x + o.col2.x * this.m_localAnchor1.y) * i - (o.col1.y * this.m_localAnchor1.x + o.col2.y * this.m_localAnchor1.y) * t, this.m_J.linear1.Set(-t, -i), this.m_J.angular1 = -n, m += r.m_invMass + r.m_invI * n * n), this.m_revolute2 ? (this.m_J.angular2 = -this.m_ratio, m += this.m_ratio * this.m_ratio * l.m_invI) : (o = a.m_R, e = this.m_prismatic2.m_localXAxis1, t = o.col1.x * e.x + o.col2.x * e.y, i = o.col1.y * e.x + o.col2.y * e.y, n = ((o = l.m_R).col1.x * this.m_localAnchor2.x + o.col2.x * this.m_localAnchor2.y) * i - (o.col1.y * this.m_localAnchor2.x + o.col2.y * this.m_localAnchor2.y) * t, this.m_J.linear2.Set(-this.m_ratio * t, -this.m_ratio * i), this.m_J.angular2 = -this.m_ratio * n, m += this.m_ratio * this.m_ratio * (l.m_invMass + l.m_invI * n * n)), this.m_mass = 1 / m, r.m_linearVelocity.x += r.m_invMass * this.m_impulse * this.m_J.linear1.x, r.m_linearVelocity.y += r.m_invMass * this.m_impulse * this.m_J.linear1.y, r.m_angularVelocity += r.m_invI * this.m_impulse * this.m_J.angular1, l.m_linearVelocity.x += l.m_invMass * this.m_impulse * this.m_J.linear2.x, l.m_linearVelocity.y += l.m_invMass * this.m_impulse * this.m_J.linear2.y, l.m_angularVelocity += l.m_invI * this.m_impulse * this.m_J.angular2
    },
    SolveVelocityConstraints: function(t) {
        var i = this.m_body1,
            o = this.m_body2,
            e = this.m_J.Compute(i.m_linearVelocity, i.m_angularVelocity, o.m_linearVelocity, o.m_angularVelocity),
            n = -this.m_mass * e;
        this.m_impulse += n, i.m_linearVelocity.x += i.m_invMass * n * this.m_J.linear1.x, i.m_linearVelocity.y += i.m_invMass * n * this.m_J.linear1.y, i.m_angularVelocity += i.m_invI * n * this.m_J.angular1, o.m_linearVelocity.x += o.m_invMass * n * this.m_J.linear2.x, o.m_linearVelocity.y += o.m_invMass * n * this.m_J.linear2.y, o.m_angularVelocity += o.m_invI * n * this.m_J.angular2
    },
    SolvePositionConstraints: function() {
        var t, i, o = this.m_body1,
            e = this.m_body2;
        t = this.m_revolute1 ? this.m_revolute1.GetJointAngle() : this.m_prismatic1.GetJointTranslation(), i = this.m_revolute2 ? this.m_revolute2.GetJointAngle() : this.m_prismatic2.GetJointTranslation();
        var n = this.m_constant - (t + this.m_ratio * i),
            s = -this.m_mass * n;
        return o.m_position.x += o.m_invMass * s * this.m_J.linear1.x, o.m_position.y += o.m_invMass * s * this.m_J.linear1.y, o.m_rotation += o.m_invI * s * this.m_J.angular1, e.m_position.x += e.m_invMass * s * this.m_J.linear2.x, e.m_position.y += e.m_invMass * s * this.m_J.linear2.y, e.m_rotation += e.m_invI * s * this.m_J.angular2, o.m_R.Set(o.m_rotation), e.m_R.Set(e.m_rotation), 0 < b2Settings.b2_linearSlop
    },
    m_ground1: null,
    m_ground2: null,
    m_revolute1: null,
    m_prismatic1: null,
    m_revolute2: null,
    m_prismatic2: null,
    m_groundAnchor1: new b2Vec2,
    m_groundAnchor2: new b2Vec2,
    m_localAnchor1: new b2Vec2,
    m_localAnchor2: new b2Vec2,
    m_J: new b2Jacobian,
    m_constant: null,
    m_ratio: null,
    m_mass: null,
    m_impulse: null
});
var b2GearJointDef = Class.create();
Object.extend(b2GearJointDef.prototype, b2JointDef.prototype), Object.extend(b2GearJointDef.prototype, {
    initialize: function() {
        this.type = b2Joint.e_gearJoint, this.joint1 = null, this.joint2 = null, this.ratio = 1
    },
    joint1: null,
    joint2: null,
    ratio: null
});
var b2MouseJoint = Class.create();
Object.extend(b2MouseJoint.prototype, b2Joint.prototype), Object.extend(b2MouseJoint.prototype, {
    GetAnchor1: function() {
        return this.m_target
    },
    GetAnchor2: function() {
        var t = b2Math.b2MulMV(this.m_body2.m_R, this.m_localAnchor);
        return t.Add(this.m_body2.m_position), t
    },
    GetReactionForce: function(t) {
        var i = new b2Vec2;
        return i.SetV(this.m_impulse), i.Multiply(t), i
    },
    GetReactionTorque: function(t) {
        return 0
    },
    SetTarget: function(t) {
        this.m_body2.WakeUp(), this.m_target = t
    },
    initialize: function(t) {
        this.m_node1 = new b2JointNode, this.m_node2 = new b2JointNode, this.m_type = t.type, this.m_prev = null, this.m_next = null, this.m_body1 = t.body1, this.m_body2 = t.body2, this.m_collideConnected = t.collideConnected, this.m_islandFlag = !1, this.m_userData = t.userData, this.K = new b2Mat22, this.K1 = new b2Mat22, this.K2 = new b2Mat22, this.m_localAnchor = new b2Vec2, this.m_target = new b2Vec2, this.m_impulse = new b2Vec2, this.m_ptpMass = new b2Mat22, this.m_C = new b2Vec2, this.m_target.SetV(t.target);
        var i = this.m_target.x - this.m_body2.m_position.x,
            o = this.m_target.y - this.m_body2.m_position.y;
        this.m_localAnchor.x = i * this.m_body2.m_R.col1.x + o * this.m_body2.m_R.col1.y, this.m_localAnchor.y = i * this.m_body2.m_R.col2.x + o * this.m_body2.m_R.col2.y, this.m_maxForce = t.maxForce, this.m_impulse.SetZero();
        var e = this.m_body2.m_mass,
            n = 2 * b2Settings.b2_pi * t.frequencyHz,
            s = 2 * e * t.dampingRatio * n,
            a = e * n * n;
        this.m_gamma = 1 / (s + t.timeStep * a), this.m_beta = t.timeStep * a / (s + t.timeStep * a)
    },
    K: new b2Mat22,
    K1: new b2Mat22,
    K2: new b2Mat22,
    PrepareVelocitySolver: function() {
        var t, i = this.m_body2,
            o = (t = i.m_R).col1.x * this.m_localAnchor.x + t.col2.x * this.m_localAnchor.y,
            e = t.col1.y * this.m_localAnchor.x + t.col2.y * this.m_localAnchor.y,
            n = i.m_invMass,
            s = i.m_invI;
        this.K1.col1.x = n, this.K1.col2.x = 0, this.K1.col1.y = 0, this.K1.col2.y = n, this.K2.col1.x = s * e * e, this.K2.col2.x = -s * o * e, this.K2.col1.y = -s * o * e, this.K2.col2.y = s * o * o, this.K.SetM(this.K1), this.K.AddM(this.K2), this.K.col1.x += this.m_gamma, this.K.col2.y += this.m_gamma, this.K.Invert(this.m_ptpMass), this.m_C.x = i.m_position.x + o - this.m_target.x, this.m_C.y = i.m_position.y + e - this.m_target.y, i.m_angularVelocity *= .98;
        var a = this.m_impulse.x,
            r = this.m_impulse.y;
        i.m_linearVelocity.x += n * a, i.m_linearVelocity.y += n * r, i.m_angularVelocity += s * (o * r - e * a)
    },
    SolveVelocityConstraints: function(t) {
        var i, o = this.m_body2,
            e = (i = o.m_R).col1.x * this.m_localAnchor.x + i.col2.x * this.m_localAnchor.y,
            n = i.col1.y * this.m_localAnchor.x + i.col2.y * this.m_localAnchor.y,
            s = o.m_linearVelocity.x + -o.m_angularVelocity * n,
            a = o.m_linearVelocity.y + o.m_angularVelocity * e;
        i = this.m_ptpMass;
        var r = s + this.m_beta * t.inv_dt * this.m_C.x + this.m_gamma * this.m_impulse.x,
            l = a + this.m_beta * t.inv_dt * this.m_C.y + this.m_gamma * this.m_impulse.y,
            m = -(i.col1.x * r + i.col2.x * l),
            _ = -(i.col1.y * r + i.col2.y * l),
            h = this.m_impulse.x,
            c = this.m_impulse.y;
        this.m_impulse.x += m, this.m_impulse.y += _;
        var u = this.m_impulse.Length();
        u > t.dt * this.m_maxForce && this.m_impulse.Multiply(t.dt * this.m_maxForce / u), m = this.m_impulse.x - h, _ = this.m_impulse.y - c, o.m_linearVelocity.x += o.m_invMass * m, o.m_linearVelocity.y += o.m_invMass * _, o.m_angularVelocity += o.m_invI * (e * _ - n * m)
    },
    SolvePositionConstraints: function() {
        return !0
    },
    m_localAnchor: new b2Vec2,
    m_target: new b2Vec2,
    m_impulse: new b2Vec2,
    m_ptpMass: new b2Mat22,
    m_C: new b2Vec2,
    m_maxForce: null,
    m_beta: null,
    m_gamma: null
});
var b2MouseJointDef = Class.create();
Object.extend(b2MouseJointDef.prototype, b2JointDef.prototype), Object.extend(b2MouseJointDef.prototype, {
    initialize: function() {
        this.type = b2Joint.e_unknownJoint, this.userData = null, this.body1 = null, this.body2 = null, this.collideConnected = !1, this.target = new b2Vec2, this.type = b2Joint.e_mouseJoint, this.maxForce = 0, this.frequencyHz = 5, this.dampingRatio = .7, this.timeStep = 1 / 60
    },
    target: new b2Vec2,
    maxForce: null,
    frequencyHz: null,
    dampingRatio: null,
    timeStep: null
});
var b2PrismaticJoint = Class.create();
Object.extend(b2PrismaticJoint.prototype, b2Joint.prototype), Object.extend(b2PrismaticJoint.prototype, {
    GetAnchor1: function() {
        var t = this.m_body1,
            i = new b2Vec2;
        return i.SetV(this.m_localAnchor1), i.MulM(t.m_R), i.Add(t.m_position), i
    },
    GetAnchor2: function() {
        var t = this.m_body2,
            i = new b2Vec2;
        return i.SetV(this.m_localAnchor2), i.MulM(t.m_R), i.Add(t.m_position), i
    },
    GetJointTranslation: function() {
        var t, i = this.m_body1,
            o = this.m_body2,
            e = (t = i.m_R).col1.x * this.m_localAnchor1.x + t.col2.x * this.m_localAnchor1.y,
            n = t.col1.y * this.m_localAnchor1.x + t.col2.y * this.m_localAnchor1.y,
            s = (t = o.m_R).col1.x * this.m_localAnchor2.x + t.col2.x * this.m_localAnchor2.y,
            a = t.col1.y * this.m_localAnchor2.x + t.col2.y * this.m_localAnchor2.y,
            r = i.m_position.x + e,
            l = i.m_position.y + n,
            m = o.m_position.x + s - r,
            _ = o.m_position.y + a - l;
        return ((t = i.m_R).col1.x * this.m_localXAxis1.x + t.col2.x * this.m_localXAxis1.y) * m + (t.col1.y * this.m_localXAxis1.x + t.col2.y * this.m_localXAxis1.y) * _
    },
    GetJointSpeed: function() {
        var t, i = this.m_body1,
            o = this.m_body2,
            e = (t = i.m_R).col1.x * this.m_localAnchor1.x + t.col2.x * this.m_localAnchor1.y,
            n = t.col1.y * this.m_localAnchor1.x + t.col2.y * this.m_localAnchor1.y,
            s = (t = o.m_R).col1.x * this.m_localAnchor2.x + t.col2.x * this.m_localAnchor2.y,
            a = t.col1.y * this.m_localAnchor2.x + t.col2.y * this.m_localAnchor2.y,
            r = i.m_position.x + e,
            l = i.m_position.y + n,
            m = o.m_position.x + s - r,
            _ = o.m_position.y + a - l,
            h = (t = i.m_R).col1.x * this.m_localXAxis1.x + t.col2.x * this.m_localXAxis1.y,
            c = t.col1.y * this.m_localXAxis1.x + t.col2.y * this.m_localXAxis1.y,
            u = i.m_linearVelocity,
            y = o.m_linearVelocity,
            b = i.m_angularVelocity,
            p = o.m_angularVelocity;
        return m * (-b * c) + _ * (b * h) + (h * (y.x + -p * a - u.x - -b * n) + c * (y.y + p * s - u.y - b * e))
    },
    GetMotorForce: function(t) {
        return t * this.m_motorImpulse
    },
    SetMotorSpeed: function(t) {
        this.m_motorSpeed = t
    },
    SetMotorForce: function(t) {
        this.m_maxMotorForce = t
    },
    GetReactionForce: function(t) {
        var i, o = t * this.m_limitImpulse,
            e = o * ((i = this.m_body1.m_R).col1.x * this.m_localXAxis1.x + i.col2.x * this.m_localXAxis1.y),
            n = o * (i.col1.y * this.m_localXAxis1.x + i.col2.y * this.m_localXAxis1.y),
            s = o * (i.col1.x * this.m_localYAxis1.x + i.col2.x * this.m_localYAxis1.y),
            a = o * (i.col1.y * this.m_localYAxis1.x + i.col2.y * this.m_localYAxis1.y);
        return new b2Vec2(e + s, n + a)
    },
    GetReactionTorque: function(t) {
        return t * this.m_angularImpulse
    },
    initialize: function(t) {
        this.m_node1 = new b2JointNode, this.m_node2 = new b2JointNode, this.m_type = t.type, this.m_prev = null, this.m_next = null, this.m_body1 = t.body1, this.m_body2 = t.body2, this.m_collideConnected = t.collideConnected, this.m_islandFlag = !1, this.m_userData = t.userData, this.m_localAnchor1 = new b2Vec2, this.m_localAnchor2 = new b2Vec2, this.m_localXAxis1 = new b2Vec2, this.m_localYAxis1 = new b2Vec2, this.m_linearJacobian = new b2Jacobian, this.m_motorJacobian = new b2Jacobian;
        var i, o, e;
        i = this.m_body1.m_R, o = t.anchorPoint.x - this.m_body1.m_position.x, e = t.anchorPoint.y - this.m_body1.m_position.y, this.m_localAnchor1.Set(o * i.col1.x + e * i.col1.y, o * i.col2.x + e * i.col2.y), i = this.m_body2.m_R, o = t.anchorPoint.x - this.m_body2.m_position.x, e = t.anchorPoint.y - this.m_body2.m_position.y, this.m_localAnchor2.Set(o * i.col1.x + e * i.col1.y, o * i.col2.x + e * i.col2.y), i = this.m_body1.m_R, o = t.axis.x, e = t.axis.y, this.m_localXAxis1.Set(o * i.col1.x + e * i.col1.y, o * i.col2.x + e * i.col2.y), this.m_localYAxis1.x = -this.m_localXAxis1.y, this.m_localYAxis1.y = this.m_localXAxis1.x, this.m_initialAngle = this.m_body2.m_rotation - this.m_body1.m_rotation, this.m_linearJacobian.SetZero(), this.m_linearMass = 0, this.m_linearImpulse = 0, this.m_angularMass = 0, this.m_angularImpulse = 0, this.m_motorJacobian.SetZero(), this.m_motorMass = 0, this.m_motorImpulse = 0, this.m_limitImpulse = 0, this.m_limitPositionImpulse = 0, this.m_lowerTranslation = t.lowerTranslation, this.m_upperTranslation = t.upperTranslation, this.m_maxMotorForce = t.motorForce, this.m_motorSpeed = t.motorSpeed, this.m_enableLimit = t.enableLimit, this.m_enableMotor = t.enableMotor
    },
    PrepareVelocitySolver: function() {
        var t, i = this.m_body1,
            o = this.m_body2,
            e = (t = i.m_R).col1.x * this.m_localAnchor1.x + t.col2.x * this.m_localAnchor1.y,
            n = t.col1.y * this.m_localAnchor1.x + t.col2.y * this.m_localAnchor1.y,
            s = (t = o.m_R).col1.x * this.m_localAnchor2.x + t.col2.x * this.m_localAnchor2.y,
            a = t.col1.y * this.m_localAnchor2.x + t.col2.y * this.m_localAnchor2.y,
            r = i.m_invMass,
            l = o.m_invMass,
            m = i.m_invI,
            _ = o.m_invI,
            h = (t = i.m_R).col1.x * this.m_localYAxis1.x + t.col2.x * this.m_localYAxis1.y,
            c = t.col1.y * this.m_localYAxis1.x + t.col2.y * this.m_localYAxis1.y,
            u = o.m_position.x + s - i.m_position.x,
            y = o.m_position.y + a - i.m_position.y;
        if (this.m_linearJacobian.linear1.x = -h, this.m_linearJacobian.linear1.y = -c, this.m_linearJacobian.linear2.x = h, this.m_linearJacobian.linear2.y = c, this.m_linearJacobian.angular1 = -(u * c - y * h), this.m_linearJacobian.angular2 = s * c - a * h, this.m_linearMass = r + m * this.m_linearJacobian.angular1 * this.m_linearJacobian.angular1 + l + _ * this.m_linearJacobian.angular2 * this.m_linearJacobian.angular2, this.m_linearMass = 1 / this.m_linearMass, this.m_angularMass = 1 / (m + _), this.m_enableLimit || this.m_enableMotor) {
            var b = (t = i.m_R).col1.x * this.m_localXAxis1.x + t.col2.x * this.m_localXAxis1.y,
                p = t.col1.y * this.m_localXAxis1.x + t.col2.y * this.m_localXAxis1.y;
            if (this.m_motorJacobian.linear1.x = -b, this.m_motorJacobian.linear1.y = -p, this.m_motorJacobian.linear2.x = b, this.m_motorJacobian.linear2.y = p, this.m_motorJacobian.angular1 = -(u * p - y * b), this.m_motorJacobian.angular2 = s * p - a * b, this.m_motorMass = r + m * this.m_motorJacobian.angular1 * this.m_motorJacobian.angular1 + l + _ * this.m_motorJacobian.angular2 * this.m_motorJacobian.angular2, this.m_motorMass = 1 / this.m_motorMass, this.m_enableLimit) {
                var d = b * (u - e) + p * (y - n);
                b2Math.b2Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2 * b2Settings.b2_linearSlop ? this.m_limitState = b2Joint.e_equalLimits : d <= this.m_lowerTranslation ? (this.m_limitState != b2Joint.e_atLowerLimit && (this.m_limitImpulse = 0), this.m_limitState = b2Joint.e_atLowerLimit) : d >= this.m_upperTranslation ? (this.m_limitState != b2Joint.e_atUpperLimit && (this.m_limitImpulse = 0), this.m_limitState = b2Joint.e_atUpperLimit) : (this.m_limitState = b2Joint.e_inactiveLimit, this.m_limitImpulse = 0)
            }
        }
        if (0 == this.m_enableMotor && (this.m_motorImpulse = 0), 0 == this.m_enableLimit && (this.m_limitImpulse = 0), b2World.s_enableWarmStarting) {
            var x = this.m_linearImpulse * this.m_linearJacobian.linear1.x + (this.m_motorImpulse + this.m_limitImpulse) * this.m_motorJacobian.linear1.x,
                f = this.m_linearImpulse * this.m_linearJacobian.linear1.y + (this.m_motorImpulse + this.m_limitImpulse) * this.m_motorJacobian.linear1.y,
                v = this.m_linearImpulse * this.m_linearJacobian.linear2.x + (this.m_motorImpulse + this.m_limitImpulse) * this.m_motorJacobian.linear2.x,
                g = this.m_linearImpulse * this.m_linearJacobian.linear2.y + (this.m_motorImpulse + this.m_limitImpulse) * this.m_motorJacobian.linear2.y,
                M = this.m_linearImpulse * this.m_linearJacobian.angular1 - this.m_angularImpulse + (this.m_motorImpulse + this.m_limitImpulse) * this.m_motorJacobian.angular1,
                S = this.m_linearImpulse * this.m_linearJacobian.angular2 + this.m_angularImpulse + (this.m_motorImpulse + this.m_limitImpulse) * this.m_motorJacobian.angular2;
            i.m_linearVelocity.x += r * x, i.m_linearVelocity.y += r * f, i.m_angularVelocity += m * M, o.m_linearVelocity.x += l * v, o.m_linearVelocity.y += l * g, o.m_angularVelocity += _ * S
        } else this.m_linearImpulse = 0, this.m_angularImpulse = 0, this.m_limitImpulse = 0, this.m_motorImpulse = 0;
        this.m_limitPositionImpulse = 0
    },
    SolveVelocityConstraints: function(t) {
        var i, o = this.m_body1,
            e = this.m_body2,
            n = o.m_invMass,
            s = e.m_invMass,
            a = o.m_invI,
            r = e.m_invI,
            l = this.m_linearJacobian.Compute(o.m_linearVelocity, o.m_angularVelocity, e.m_linearVelocity, e.m_angularVelocity),
            m = -this.m_linearMass * l;
        this.m_linearImpulse += m, o.m_linearVelocity.x += n * m * this.m_linearJacobian.linear1.x, o.m_linearVelocity.y += n * m * this.m_linearJacobian.linear1.y, o.m_angularVelocity += a * m * this.m_linearJacobian.angular1, e.m_linearVelocity.x += s * m * this.m_linearJacobian.linear2.x, e.m_linearVelocity.y += s * m * this.m_linearJacobian.linear2.y, e.m_angularVelocity += r * m * this.m_linearJacobian.angular2;
        var _ = e.m_angularVelocity - o.m_angularVelocity,
            h = -this.m_angularMass * _;
        if (this.m_angularImpulse += h, o.m_angularVelocity -= a * h, e.m_angularVelocity += r * h, this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits) {
            var c = this.m_motorJacobian.Compute(o.m_linearVelocity, o.m_angularVelocity, e.m_linearVelocity, e.m_angularVelocity) - this.m_motorSpeed,
                u = -this.m_motorMass * c,
                y = this.m_motorImpulse;
            this.m_motorImpulse = b2Math.b2Clamp(this.m_motorImpulse + u, -t.dt * this.m_maxMotorForce, t.dt * this.m_maxMotorForce), u = this.m_motorImpulse - y, o.m_linearVelocity.x += n * u * this.m_motorJacobian.linear1.x, o.m_linearVelocity.y += n * u * this.m_motorJacobian.linear1.y, o.m_angularVelocity += a * u * this.m_motorJacobian.angular1, e.m_linearVelocity.x += s * u * this.m_motorJacobian.linear2.x, e.m_linearVelocity.y += s * u * this.m_motorJacobian.linear2.y, e.m_angularVelocity += r * u * this.m_motorJacobian.angular2
        }
        if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
            var b = this.m_motorJacobian.Compute(o.m_linearVelocity, o.m_angularVelocity, e.m_linearVelocity, e.m_angularVelocity),
                p = -this.m_motorMass * b;
            this.m_limitState == b2Joint.e_equalLimits ? this.m_limitImpulse += p : this.m_limitState == b2Joint.e_atLowerLimit ? (i = this.m_limitImpulse, this.m_limitImpulse = b2Math.b2Max(this.m_limitImpulse + p, 0), p = this.m_limitImpulse - i) : this.m_limitState == b2Joint.e_atUpperLimit && (i = this.m_limitImpulse, this.m_limitImpulse = b2Math.b2Min(this.m_limitImpulse + p, 0), p = this.m_limitImpulse - i), o.m_linearVelocity.x += n * p * this.m_motorJacobian.linear1.x, o.m_linearVelocity.y += n * p * this.m_motorJacobian.linear1.y, o.m_angularVelocity += a * p * this.m_motorJacobian.angular1, e.m_linearVelocity.x += s * p * this.m_motorJacobian.linear2.x, e.m_linearVelocity.y += s * p * this.m_motorJacobian.linear2.y, e.m_angularVelocity += r * p * this.m_motorJacobian.angular2
        }
    },
    SolvePositionConstraints: function() {
        var t, i, o, e = this.m_body1,
            n = this.m_body2,
            s = e.m_invMass,
            a = n.m_invMass,
            r = e.m_invI,
            l = n.m_invI,
            m = (o = e.m_R).col1.x * this.m_localAnchor1.x + o.col2.x * this.m_localAnchor1.y,
            _ = o.col1.y * this.m_localAnchor1.x + o.col2.y * this.m_localAnchor1.y,
            h = (o = n.m_R).col1.x * this.m_localAnchor2.x + o.col2.x * this.m_localAnchor2.y,
            c = o.col1.y * this.m_localAnchor2.x + o.col2.y * this.m_localAnchor2.y,
            u = e.m_position.x + m,
            y = e.m_position.y + _,
            b = n.m_position.x + h,
            p = n.m_position.y + c,
            d = b - u,
            x = p - y,
            f = ((o = e.m_R).col1.x * this.m_localYAxis1.x + o.col2.x * this.m_localYAxis1.y) * d + (o.col1.y * this.m_localYAxis1.x + o.col2.y * this.m_localYAxis1.y) * x;
        f = b2Math.b2Clamp(f, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection);
        var v = -this.m_linearMass * f;
        e.m_position.x += s * v * this.m_linearJacobian.linear1.x, e.m_position.y += s * v * this.m_linearJacobian.linear1.y, e.m_rotation += r * v * this.m_linearJacobian.angular1, n.m_position.x += a * v * this.m_linearJacobian.linear2.x, n.m_position.y += a * v * this.m_linearJacobian.linear2.y, n.m_rotation += l * v * this.m_linearJacobian.angular2;
        var g = b2Math.b2Abs(f),
            M = n.m_rotation - e.m_rotation - this.m_initialAngle;
        M = b2Math.b2Clamp(M, -b2Settings.b2_maxAngularCorrection, b2Settings.b2_maxAngularCorrection);
        var S = -this.m_angularMass * M;
        e.m_rotation -= e.m_invI * S, e.m_R.Set(e.m_rotation), n.m_rotation += n.m_invI * S, n.m_R.Set(n.m_rotation);
        var C = b2Math.b2Abs(M);
        if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
            m = (o = e.m_R).col1.x * this.m_localAnchor1.x + o.col2.x * this.m_localAnchor1.y, _ = o.col1.y * this.m_localAnchor1.x + o.col2.y * this.m_localAnchor1.y, h = (o = n.m_R).col1.x * this.m_localAnchor2.x + o.col2.x * this.m_localAnchor2.y, c = o.col1.y * this.m_localAnchor2.x + o.col2.y * this.m_localAnchor2.y, u = e.m_position.x + m, y = e.m_position.y + _, d = (b = n.m_position.x + h) - u, x = (p = n.m_position.y + c) - y;
            var V = ((o = e.m_R).col1.x * this.m_localXAxis1.x + o.col2.x * this.m_localXAxis1.y) * d + (o.col1.y * this.m_localXAxis1.x + o.col2.y * this.m_localXAxis1.y) * x,
                w = 0;
            this.m_limitState == b2Joint.e_equalLimits ? (t = b2Math.b2Clamp(V, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection), w = -this.m_motorMass * t, g = b2Math.b2Max(g, b2Math.b2Abs(M))) : this.m_limitState == b2Joint.e_atLowerLimit ? (t = V - this.m_lowerTranslation, g = b2Math.b2Max(g, -t), t = b2Math.b2Clamp(t + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0), w = -this.m_motorMass * t, i = this.m_limitPositionImpulse, this.m_limitPositionImpulse = b2Math.b2Max(this.m_limitPositionImpulse + w, 0), w = this.m_limitPositionImpulse - i) : this.m_limitState == b2Joint.e_atUpperLimit && (t = V - this.m_upperTranslation, g = b2Math.b2Max(g, t), t = b2Math.b2Clamp(t - b2Settings.b2_linearSlop, 0, b2Settings.b2_maxLinearCorrection), w = -this.m_motorMass * t, i = this.m_limitPositionImpulse, this.m_limitPositionImpulse = b2Math.b2Min(this.m_limitPositionImpulse + w, 0), w = this.m_limitPositionImpulse - i), e.m_position.x += s * w * this.m_motorJacobian.linear1.x, e.m_position.y += s * w * this.m_motorJacobian.linear1.y, e.m_rotation += r * w * this.m_motorJacobian.angular1, e.m_R.Set(e.m_rotation), n.m_position.x += a * w * this.m_motorJacobian.linear2.x, n.m_position.y += a * w * this.m_motorJacobian.linear2.y, n.m_rotation += l * w * this.m_motorJacobian.angular2, n.m_R.Set(n.m_rotation)
        }
        return g <= b2Settings.b2_linearSlop && C <= b2Settings.b2_angularSlop
    },
    m_localAnchor1: new b2Vec2,
    m_localAnchor2: new b2Vec2,
    m_localXAxis1: new b2Vec2,
    m_localYAxis1: new b2Vec2,
    m_initialAngle: null,
    m_linearJacobian: new b2Jacobian,
    m_linearMass: null,
    m_linearImpulse: null,
    m_angularMass: null,
    m_angularImpulse: null,
    m_motorJacobian: new b2Jacobian,
    m_motorMass: null,
    m_motorImpulse: null,
    m_limitImpulse: null,
    m_limitPositionImpulse: null,
    m_lowerTranslation: null,
    m_upperTranslation: null,
    m_maxMotorForce: null,
    m_motorSpeed: null,
    m_enableLimit: null,
    m_enableMotor: null,
    m_limitState: 0
});
var b2PrismaticJointDef = Class.create();
Object.extend(b2PrismaticJointDef.prototype, b2JointDef.prototype), Object.extend(b2PrismaticJointDef.prototype, {
    initialize: function() {
        this.type = b2Joint.e_unknownJoint, this.userData = null, this.body1 = null, this.body2 = null, this.collideConnected = !1, this.type = b2Joint.e_prismaticJoint, this.anchorPoint = new b2Vec2(0, 0), this.axis = new b2Vec2(0, 0), this.lowerTranslation = 0, this.upperTranslation = 0, this.motorForce = 0, this.motorSpeed = 0, this.enableLimit = !1, this.enableMotor = !1
    },
    anchorPoint: null,
    axis: null,
    lowerTranslation: null,
    upperTranslation: null,
    motorForce: null,
    motorSpeed: null,
    enableLimit: null,
    enableMotor: null
});
var b2PulleyJoint = Class.create();
Object.extend(b2PulleyJoint.prototype, b2Joint.prototype), Object.extend(b2PulleyJoint.prototype, {
    GetAnchor1: function() {
        var t = this.m_body1.m_R;
        return new b2Vec2(this.m_body1.m_position.x + (t.col1.x * this.m_localAnchor1.x + t.col2.x * this.m_localAnchor1.y), this.m_body1.m_position.y + (t.col1.y * this.m_localAnchor1.x + t.col2.y * this.m_localAnchor1.y))
    },
    GetAnchor2: function() {
        var t = this.m_body2.m_R;
        return new b2Vec2(this.m_body2.m_position.x + (t.col1.x * this.m_localAnchor2.x + t.col2.x * this.m_localAnchor2.y), this.m_body2.m_position.y + (t.col1.y * this.m_localAnchor2.x + t.col2.y * this.m_localAnchor2.y))
    },
    GetGroundPoint1: function() {
        return new b2Vec2(this.m_ground.m_position.x + this.m_groundAnchor1.x, this.m_ground.m_position.y + this.m_groundAnchor1.y)
    },
    GetGroundPoint2: function() {
        return new b2Vec2(this.m_ground.m_position.x + this.m_groundAnchor2.x, this.m_ground.m_position.y + this.m_groundAnchor2.y)
    },
    GetReactionForce: function(t) {
        return new b2Vec2
    },
    GetReactionTorque: function(t) {
        return 0
    },
    GetLength1: function() {
        var t;
        t = this.m_body1.m_R;
        var i = this.m_body1.m_position.x + (t.col1.x * this.m_localAnchor1.x + t.col2.x * this.m_localAnchor1.y),
            o = this.m_body1.m_position.y + (t.col1.y * this.m_localAnchor1.x + t.col2.y * this.m_localAnchor1.y),
            e = i - (this.m_ground.m_position.x + this.m_groundAnchor1.x),
            n = o - (this.m_ground.m_position.y + this.m_groundAnchor1.y);
        return Math.sqrt(e * e + n * n)
    },
    GetLength2: function() {
        var t;
        t = this.m_body2.m_R;
        var i = this.m_body2.m_position.x + (t.col1.x * this.m_localAnchor2.x + t.col2.x * this.m_localAnchor2.y),
            o = this.m_body2.m_position.y + (t.col1.y * this.m_localAnchor2.x + t.col2.y * this.m_localAnchor2.y),
            e = i - (this.m_ground.m_position.x + this.m_groundAnchor2.x),
            n = o - (this.m_ground.m_position.y + this.m_groundAnchor2.y);
        return Math.sqrt(e * e + n * n)
    },
    GetRatio: function() {
        return this.m_ratio
    },
    initialize: function(t) {
        this.m_node1 = new b2JointNode, this.m_node2 = new b2JointNode, this.m_type = t.type, this.m_prev = null, this.m_next = null, this.m_body1 = t.body1, this.m_body2 = t.body2, this.m_collideConnected = t.collideConnected, this.m_islandFlag = !1, this.m_userData = t.userData, this.m_groundAnchor1 = new b2Vec2, this.m_groundAnchor2 = new b2Vec2, this.m_localAnchor1 = new b2Vec2, this.m_localAnchor2 = new b2Vec2, this.m_u1 = new b2Vec2, this.m_u2 = new b2Vec2;
        var i, o, e;
        this.m_ground = this.m_body1.m_world.m_groundBody, this.m_groundAnchor1.x = t.groundPoint1.x - this.m_ground.m_position.x, this.m_groundAnchor1.y = t.groundPoint1.y - this.m_ground.m_position.y, this.m_groundAnchor2.x = t.groundPoint2.x - this.m_ground.m_position.x, this.m_groundAnchor2.y = t.groundPoint2.y - this.m_ground.m_position.y, i = this.m_body1.m_R, o = t.anchorPoint1.x - this.m_body1.m_position.x, e = t.anchorPoint1.y - this.m_body1.m_position.y, this.m_localAnchor1.x = o * i.col1.x + e * i.col1.y, this.m_localAnchor1.y = o * i.col2.x + e * i.col2.y, i = this.m_body2.m_R, o = t.anchorPoint2.x - this.m_body2.m_position.x, e = t.anchorPoint2.y - this.m_body2.m_position.y, this.m_localAnchor2.x = o * i.col1.x + e * i.col1.y, this.m_localAnchor2.y = o * i.col2.x + e * i.col2.y, this.m_ratio = t.ratio, o = t.groundPoint1.x - t.anchorPoint1.x, e = t.groundPoint1.y - t.anchorPoint1.y;
        var n = Math.sqrt(o * o + e * e);
        o = t.groundPoint2.x - t.anchorPoint2.x, e = t.groundPoint2.y - t.anchorPoint2.y;
        var s = Math.sqrt(o * o + e * e),
            a = b2Math.b2Max(.5 * b2PulleyJoint.b2_minPulleyLength, n),
            r = b2Math.b2Max(.5 * b2PulleyJoint.b2_minPulleyLength, s);
        this.m_constant = a + this.m_ratio * r, this.m_maxLength1 = b2Math.b2Clamp(t.maxLength1, a, this.m_constant - this.m_ratio * b2PulleyJoint.b2_minPulleyLength), this.m_maxLength2 = b2Math.b2Clamp(t.maxLength2, r, (this.m_constant - b2PulleyJoint.b2_minPulleyLength) / this.m_ratio), this.m_pulleyImpulse = 0, this.m_limitImpulse1 = 0, this.m_limitImpulse2 = 0
    },
    PrepareVelocitySolver: function() {
        var t, i = this.m_body1,
            o = this.m_body2,
            e = (t = i.m_R).col1.x * this.m_localAnchor1.x + t.col2.x * this.m_localAnchor1.y,
            n = t.col1.y * this.m_localAnchor1.x + t.col2.y * this.m_localAnchor1.y,
            s = (t = o.m_R).col1.x * this.m_localAnchor2.x + t.col2.x * this.m_localAnchor2.y,
            a = t.col1.y * this.m_localAnchor2.x + t.col2.y * this.m_localAnchor2.y,
            r = i.m_position.x + e,
            l = i.m_position.y + n,
            m = o.m_position.x + s,
            _ = o.m_position.y + a,
            h = this.m_ground.m_position.x + this.m_groundAnchor1.x,
            c = this.m_ground.m_position.y + this.m_groundAnchor1.y,
            u = this.m_ground.m_position.x + this.m_groundAnchor2.x,
            y = this.m_ground.m_position.y + this.m_groundAnchor2.y;
        this.m_u1.Set(r - h, l - c), this.m_u2.Set(m - u, _ - y);
        var b = this.m_u1.Length(),
            p = this.m_u2.Length();
        b > b2Settings.b2_linearSlop ? this.m_u1.Multiply(1 / b) : this.m_u1.SetZero(), p > b2Settings.b2_linearSlop ? this.m_u2.Multiply(1 / p) : this.m_u2.SetZero(), b < this.m_maxLength1 ? (this.m_limitState1 = b2Joint.e_inactiveLimit, this.m_limitImpulse1 = 0) : (this.m_limitState1 = b2Joint.e_atUpperLimit, this.m_limitPositionImpulse1 = 0), p < this.m_maxLength2 ? (this.m_limitState2 = b2Joint.e_inactiveLimit, this.m_limitImpulse2 = 0) : (this.m_limitState2 = b2Joint.e_atUpperLimit, this.m_limitPositionImpulse2 = 0);
        var d = e * this.m_u1.y - n * this.m_u1.x,
            x = s * this.m_u2.y - a * this.m_u2.x;
        this.m_limitMass1 = i.m_invMass + i.m_invI * d * d, this.m_limitMass2 = o.m_invMass + o.m_invI * x * x, this.m_pulleyMass = this.m_limitMass1 + this.m_ratio * this.m_ratio * this.m_limitMass2, this.m_limitMass1 = 1 / this.m_limitMass1, this.m_limitMass2 = 1 / this.m_limitMass2, this.m_pulleyMass = 1 / this.m_pulleyMass;
        var f = (-this.m_pulleyImpulse - this.m_limitImpulse1) * this.m_u1.x,
            v = (-this.m_pulleyImpulse - this.m_limitImpulse1) * this.m_u1.y,
            g = (-this.m_ratio * this.m_pulleyImpulse - this.m_limitImpulse2) * this.m_u2.x,
            M = (-this.m_ratio * this.m_pulleyImpulse - this.m_limitImpulse2) * this.m_u2.y;
        i.m_linearVelocity.x += i.m_invMass * f, i.m_linearVelocity.y += i.m_invMass * v, i.m_angularVelocity += i.m_invI * (e * v - n * f), o.m_linearVelocity.x += o.m_invMass * g, o.m_linearVelocity.y += o.m_invMass * M, o.m_angularVelocity += o.m_invI * (s * M - a * g)
    },
    SolveVelocityConstraints: function(t) {
        var i, o, e, n, s, a, r, l, m, _, h, c, u = this.m_body1,
            y = this.m_body2,
            b = (i = u.m_R).col1.x * this.m_localAnchor1.x + i.col2.x * this.m_localAnchor1.y,
            p = i.col1.y * this.m_localAnchor1.x + i.col2.y * this.m_localAnchor1.y,
            d = (i = y.m_R).col1.x * this.m_localAnchor2.x + i.col2.x * this.m_localAnchor2.y,
            x = i.col1.y * this.m_localAnchor2.x + i.col2.y * this.m_localAnchor2.y;
        o = u.m_linearVelocity.x + -u.m_angularVelocity * p, e = u.m_linearVelocity.y + u.m_angularVelocity * b, n = y.m_linearVelocity.x + -y.m_angularVelocity * x, s = y.m_linearVelocity.y + y.m_angularVelocity * d, _ = -(this.m_u1.x * o + this.m_u1.y * e) - this.m_ratio * (this.m_u2.x * n + this.m_u2.y * s), h = -this.m_pulleyMass * _, this.m_pulleyImpulse += h, a = -h * this.m_u1.x, r = -h * this.m_u1.y, l = -this.m_ratio * h * this.m_u2.x, m = -this.m_ratio * h * this.m_u2.y, u.m_linearVelocity.x += u.m_invMass * a, u.m_linearVelocity.y += u.m_invMass * r, u.m_angularVelocity += u.m_invI * (b * r - p * a), y.m_linearVelocity.x += y.m_invMass * l, y.m_linearVelocity.y += y.m_invMass * m, y.m_angularVelocity += y.m_invI * (d * m - x * l), this.m_limitState1 == b2Joint.e_atUpperLimit && (o = u.m_linearVelocity.x + -u.m_angularVelocity * p, e = u.m_linearVelocity.y + u.m_angularVelocity * b, _ = -(this.m_u1.x * o + this.m_u1.y * e), h = -this.m_limitMass1 * _, c = this.m_limitImpulse1, this.m_limitImpulse1 = b2Math.b2Max(0, this.m_limitImpulse1 + h), a = -(h = this.m_limitImpulse1 - c) * this.m_u1.x, r = -h * this.m_u1.y, u.m_linearVelocity.x += u.m_invMass * a, u.m_linearVelocity.y += u.m_invMass * r, u.m_angularVelocity += u.m_invI * (b * r - p * a)), this.m_limitState2 == b2Joint.e_atUpperLimit && (n = y.m_linearVelocity.x + -y.m_angularVelocity * x, s = y.m_linearVelocity.y + y.m_angularVelocity * d, _ = -(this.m_u2.x * n + this.m_u2.y * s), h = -this.m_limitMass2 * _, c = this.m_limitImpulse2, this.m_limitImpulse2 = b2Math.b2Max(0, this.m_limitImpulse2 + h), l = -(h = this.m_limitImpulse2 - c) * this.m_u2.x, m = -h * this.m_u2.y, y.m_linearVelocity.x += y.m_invMass * l, y.m_linearVelocity.y += y.m_invMass * m, y.m_angularVelocity += y.m_invI * (d * m - x * l))
    },
    SolvePositionConstraints: function() {
        var t, i, o, e, n, s, a, r, l, m, _, h, c, u, y = this.m_body1,
            b = this.m_body2,
            p = this.m_ground.m_position.x + this.m_groundAnchor1.x,
            d = this.m_ground.m_position.y + this.m_groundAnchor1.y,
            x = this.m_ground.m_position.x + this.m_groundAnchor2.x,
            f = this.m_ground.m_position.y + this.m_groundAnchor2.y,
            v = 0;
        return i = (t = y.m_R).col1.x * this.m_localAnchor1.x + t.col2.x * this.m_localAnchor1.y, o = t.col1.y * this.m_localAnchor1.x + t.col2.y * this.m_localAnchor1.y, e = (t = b.m_R).col1.x * this.m_localAnchor2.x + t.col2.x * this.m_localAnchor2.y, n = t.col1.y * this.m_localAnchor2.x + t.col2.y * this.m_localAnchor2.y, s = y.m_position.x + i, a = y.m_position.y + o, r = b.m_position.x + e, l = b.m_position.y + n, this.m_u1.Set(s - p, a - d), this.m_u2.Set(r - x, l - f), m = this.m_u1.Length(), _ = this.m_u2.Length(), m > b2Settings.b2_linearSlop ? this.m_u1.Multiply(1 / m) : this.m_u1.SetZero(), _ > b2Settings.b2_linearSlop ? this.m_u2.Multiply(1 / _) : this.m_u2.SetZero(), h = this.m_constant - m - this.m_ratio * _, v = b2Math.b2Max(v, Math.abs(h)), h = b2Math.b2Clamp(h, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection), s = -(c = -this.m_pulleyMass * h) * this.m_u1.x, a = -c * this.m_u1.y, r = -this.m_ratio * c * this.m_u2.x, l = -this.m_ratio * c * this.m_u2.y, y.m_position.x += y.m_invMass * s, y.m_position.y += y.m_invMass * a, y.m_rotation += y.m_invI * (i * a - o * s), b.m_position.x += b.m_invMass * r, b.m_position.y += b.m_invMass * l, b.m_rotation += b.m_invI * (e * l - n * r), y.m_R.Set(y.m_rotation), b.m_R.Set(b.m_rotation), this.m_limitState1 == b2Joint.e_atUpperLimit && (i = (t = y.m_R).col1.x * this.m_localAnchor1.x + t.col2.x * this.m_localAnchor1.y, o = t.col1.y * this.m_localAnchor1.x + t.col2.y * this.m_localAnchor1.y, s = y.m_position.x + i, a = y.m_position.y + o, this.m_u1.Set(s - p, a - d), (m = this.m_u1.Length()) > b2Settings.b2_linearSlop ? (this.m_u1.x *= 1 / m, this.m_u1.y *= 1 / m) : this.m_u1.SetZero(), h = this.m_maxLength1 - m, v = b2Math.b2Max(v, -h), h = b2Math.b2Clamp(h + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0), c = -this.m_limitMass1 * h, u = this.m_limitPositionImpulse1, this.m_limitPositionImpulse1 = b2Math.b2Max(0, this.m_limitPositionImpulse1 + c), s = -(c = this.m_limitPositionImpulse1 - u) * this.m_u1.x, a = -c * this.m_u1.y, y.m_position.x += y.m_invMass * s, y.m_position.y += y.m_invMass * a, y.m_rotation += y.m_invI * (i * a - o * s), y.m_R.Set(y.m_rotation)), this.m_limitState2 == b2Joint.e_atUpperLimit && (e = (t = b.m_R).col1.x * this.m_localAnchor2.x + t.col2.x * this.m_localAnchor2.y, n = t.col1.y * this.m_localAnchor2.x + t.col2.y * this.m_localAnchor2.y, r = b.m_position.x + e, l = b.m_position.y + n, this.m_u2.Set(r - x, l - f), (_ = this.m_u2.Length()) > b2Settings.b2_linearSlop ? (this.m_u2.x *= 1 / _, this.m_u2.y *= 1 / _) : this.m_u2.SetZero(), h = this.m_maxLength2 - _, v = b2Math.b2Max(v, -h), h = b2Math.b2Clamp(h + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0), c = -this.m_limitMass2 * h, u = this.m_limitPositionImpulse2, this.m_limitPositionImpulse2 = b2Math.b2Max(0, this.m_limitPositionImpulse2 + c), r = -(c = this.m_limitPositionImpulse2 - u) * this.m_u2.x, l = -c * this.m_u2.y, b.m_position.x += b.m_invMass * r, b.m_position.y += b.m_invMass * l, b.m_rotation += b.m_invI * (e * l - n * r), b.m_R.Set(b.m_rotation)), v < b2Settings.b2_linearSlop
    },
    m_ground: null,
    m_groundAnchor1: new b2Vec2,
    m_groundAnchor2: new b2Vec2,
    m_localAnchor1: new b2Vec2,
    m_localAnchor2: new b2Vec2,
    m_u1: new b2Vec2,
    m_u2: new b2Vec2,
    m_constant: null,
    m_ratio: null,
    m_maxLength1: null,
    m_maxLength2: null,
    m_pulleyMass: null,
    m_limitMass1: null,
    m_limitMass2: null,
    m_pulleyImpulse: null,
    m_limitImpulse1: null,
    m_limitImpulse2: null,
    m_limitPositionImpulse1: null,
    m_limitPositionImpulse2: null,
    m_limitState1: 0,
    m_limitState2: 0
}), b2PulleyJoint.b2_minPulleyLength = b2Settings.b2_lengthUnitsPerMeter;
var b2PulleyJointDef = Class.create();
Object.extend(b2PulleyJointDef.prototype, b2JointDef.prototype), Object.extend(b2PulleyJointDef.prototype, {
    initialize: function() {
        this.type = b2Joint.e_unknownJoint, this.userData = null, this.body1 = null, this.body2 = null, this.collideConnected = !1, this.groundPoint1 = new b2Vec2, this.groundPoint2 = new b2Vec2, this.anchorPoint1 = new b2Vec2, this.anchorPoint2 = new b2Vec2, this.type = b2Joint.e_pulleyJoint, this.groundPoint1.Set(-1, 1), this.groundPoint2.Set(1, 1), this.anchorPoint1.Set(-1, 0), this.anchorPoint2.Set(1, 0), this.maxLength1 = .5 * b2PulleyJoint.b2_minPulleyLength, this.maxLength2 = .5 * b2PulleyJoint.b2_minPulleyLength, this.ratio = 1, this.collideConnected = !0
    },
    groundPoint1: new b2Vec2,
    groundPoint2: new b2Vec2,
    anchorPoint1: new b2Vec2,
    anchorPoint2: new b2Vec2,
    maxLength1: null,
    maxLength2: null,
    ratio: null
});
var b2RevoluteJoint = Class.create();
Object.extend(b2RevoluteJoint.prototype, b2Joint.prototype), Object.extend(b2RevoluteJoint.prototype, {
    GetAnchor1: function() {
        var t = this.m_body1.m_R;
        return new b2Vec2(this.m_body1.m_position.x + (t.col1.x * this.m_localAnchor1.x + t.col2.x * this.m_localAnchor1.y), this.m_body1.m_position.y + (t.col1.y * this.m_localAnchor1.x + t.col2.y * this.m_localAnchor1.y))
    },
    GetAnchor2: function() {
        var t = this.m_body2.m_R;
        return new b2Vec2(this.m_body2.m_position.x + (t.col1.x * this.m_localAnchor2.x + t.col2.x * this.m_localAnchor2.y), this.m_body2.m_position.y + (t.col1.y * this.m_localAnchor2.x + t.col2.y * this.m_localAnchor2.y))
    },
    GetJointAngle: function() {
        return this.m_body2.m_rotation - this.m_body1.m_rotation
    },
    GetJointSpeed: function() {
        return this.m_body2.m_angularVelocity - this.m_body1.m_angularVelocity
    },
    GetMotorTorque: function(t) {
        return t * this.m_motorImpulse
    },
    SetMotorSpeed: function(t) {
        this.m_motorSpeed = t
    },
    SetMotorTorque: function(t) {
        this.m_maxMotorTorque = t
    },
    GetReactionForce: function(t) {
        var i = this.m_ptpImpulse.Copy();
        return i.Multiply(t), i
    },
    GetReactionTorque: function(t) {
        return t * this.m_limitImpulse
    },
    initialize: function(t) {
        this.m_node1 = new b2JointNode, this.m_node2 = new b2JointNode, this.m_type = t.type, this.m_prev = null, this.m_next = null, this.m_body1 = t.body1, this.m_body2 = t.body2, this.m_collideConnected = t.collideConnected, this.m_islandFlag = !1, this.m_userData = t.userData, this.K = new b2Mat22, this.K1 = new b2Mat22, this.K2 = new b2Mat22, this.K3 = new b2Mat22, this.m_localAnchor1 = new b2Vec2, this.m_localAnchor2 = new b2Vec2, this.m_ptpImpulse = new b2Vec2, this.m_ptpMass = new b2Mat22;
        var i, o, e;
        i = this.m_body1.m_R, o = t.anchorPoint.x - this.m_body1.m_position.x, e = t.anchorPoint.y - this.m_body1.m_position.y, this.m_localAnchor1.x = o * i.col1.x + e * i.col1.y, this.m_localAnchor1.y = o * i.col2.x + e * i.col2.y, i = this.m_body2.m_R, o = t.anchorPoint.x - this.m_body2.m_position.x, e = t.anchorPoint.y - this.m_body2.m_position.y, this.m_localAnchor2.x = o * i.col1.x + e * i.col1.y, this.m_localAnchor2.y = o * i.col2.x + e * i.col2.y, this.m_intialAngle = this.m_body2.m_rotation - this.m_body1.m_rotation, this.m_ptpImpulse.Set(0, 0), this.m_motorImpulse = 0, this.m_limitImpulse = 0, this.m_limitPositionImpulse = 0, this.m_lowerAngle = t.lowerAngle, this.m_upperAngle = t.upperAngle, this.m_maxMotorTorque = t.motorTorque, this.m_motorSpeed = t.motorSpeed, this.m_enableLimit = t.enableLimit, this.m_enableMotor = t.enableMotor
    },
    K: new b2Mat22,
    K1: new b2Mat22,
    K2: new b2Mat22,
    K3: new b2Mat22,
    PrepareVelocitySolver: function() {
        var t, i = this.m_body1,
            o = this.m_body2,
            e = (t = i.m_R).col1.x * this.m_localAnchor1.x + t.col2.x * this.m_localAnchor1.y,
            n = t.col1.y * this.m_localAnchor1.x + t.col2.y * this.m_localAnchor1.y,
            s = (t = o.m_R).col1.x * this.m_localAnchor2.x + t.col2.x * this.m_localAnchor2.y,
            a = t.col1.y * this.m_localAnchor2.x + t.col2.y * this.m_localAnchor2.y,
            r = i.m_invMass,
            l = o.m_invMass,
            m = i.m_invI,
            _ = o.m_invI;
        if (this.K1.col1.x = r + l, this.K1.col2.x = 0, this.K1.col1.y = 0, this.K1.col2.y = r + l, this.K2.col1.x = m * n * n, this.K2.col2.x = -m * e * n, this.K2.col1.y = -m * e * n, this.K2.col2.y = m * e * e, this.K3.col1.x = _ * a * a, this.K3.col2.x = -_ * s * a, this.K3.col1.y = -_ * s * a, this.K3.col2.y = _ * s * s, this.K.SetM(this.K1), this.K.AddM(this.K2), this.K.AddM(this.K3), this.K.Invert(this.m_ptpMass), this.m_motorMass = 1 / (m + _), 0 == this.m_enableMotor && (this.m_motorImpulse = 0), this.m_enableLimit) {
            var h = o.m_rotation - i.m_rotation - this.m_intialAngle;
            b2Math.b2Abs(this.m_upperAngle - this.m_lowerAngle) < 2 * b2Settings.b2_angularSlop ? this.m_limitState = b2Joint.e_equalLimits : h <= this.m_lowerAngle ? (this.m_limitState != b2Joint.e_atLowerLimit && (this.m_limitImpulse = 0), this.m_limitState = b2Joint.e_atLowerLimit) : h >= this.m_upperAngle ? (this.m_limitState != b2Joint.e_atUpperLimit && (this.m_limitImpulse = 0), this.m_limitState = b2Joint.e_atUpperLimit) : (this.m_limitState = b2Joint.e_inactiveLimit, this.m_limitImpulse = 0)
        } else this.m_limitImpulse = 0;
        b2World.s_enableWarmStarting ? (i.m_linearVelocity.x -= r * this.m_ptpImpulse.x, i.m_linearVelocity.y -= r * this.m_ptpImpulse.y, i.m_angularVelocity -= m * (e * this.m_ptpImpulse.y - n * this.m_ptpImpulse.x + this.m_motorImpulse + this.m_limitImpulse), o.m_linearVelocity.x += l * this.m_ptpImpulse.x, o.m_linearVelocity.y += l * this.m_ptpImpulse.y, o.m_angularVelocity += _ * (s * this.m_ptpImpulse.y - a * this.m_ptpImpulse.x + this.m_motorImpulse + this.m_limitImpulse)) : (this.m_ptpImpulse.SetZero(), this.m_motorImpulse = 0, this.m_limitImpulse = 0), this.m_limitPositionImpulse = 0
    },
    SolveVelocityConstraints: function(t) {
        var i, o, e = this.m_body1,
            n = this.m_body2,
            s = (i = e.m_R).col1.x * this.m_localAnchor1.x + i.col2.x * this.m_localAnchor1.y,
            a = i.col1.y * this.m_localAnchor1.x + i.col2.y * this.m_localAnchor1.y,
            r = (i = n.m_R).col1.x * this.m_localAnchor2.x + i.col2.x * this.m_localAnchor2.y,
            l = i.col1.y * this.m_localAnchor2.x + i.col2.y * this.m_localAnchor2.y,
            m = n.m_linearVelocity.x + -n.m_angularVelocity * l - e.m_linearVelocity.x - -e.m_angularVelocity * a,
            _ = n.m_linearVelocity.y + n.m_angularVelocity * r - e.m_linearVelocity.y - e.m_angularVelocity * s,
            h = -(this.m_ptpMass.col1.x * m + this.m_ptpMass.col2.x * _),
            c = -(this.m_ptpMass.col1.y * m + this.m_ptpMass.col2.y * _);
        if (this.m_ptpImpulse.x += h, this.m_ptpImpulse.y += c, e.m_linearVelocity.x -= e.m_invMass * h, e.m_linearVelocity.y -= e.m_invMass * c, e.m_angularVelocity -= e.m_invI * (s * c - a * h), n.m_linearVelocity.x += n.m_invMass * h, n.m_linearVelocity.y += n.m_invMass * c, n.m_angularVelocity += n.m_invI * (r * c - l * h), this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits) {
            var u = n.m_angularVelocity - e.m_angularVelocity - this.m_motorSpeed,
                y = -this.m_motorMass * u,
                b = this.m_motorImpulse;
            this.m_motorImpulse = b2Math.b2Clamp(this.m_motorImpulse + y, -t.dt * this.m_maxMotorTorque, t.dt * this.m_maxMotorTorque), y = this.m_motorImpulse - b, e.m_angularVelocity -= e.m_invI * y, n.m_angularVelocity += n.m_invI * y
        }
        if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
            var p = n.m_angularVelocity - e.m_angularVelocity,
                d = -this.m_motorMass * p;
            this.m_limitState == b2Joint.e_equalLimits ? this.m_limitImpulse += d : this.m_limitState == b2Joint.e_atLowerLimit ? (o = this.m_limitImpulse, this.m_limitImpulse = b2Math.b2Max(this.m_limitImpulse + d, 0), d = this.m_limitImpulse - o) : this.m_limitState == b2Joint.e_atUpperLimit && (o = this.m_limitImpulse, this.m_limitImpulse = b2Math.b2Min(this.m_limitImpulse + d, 0), d = this.m_limitImpulse - o), e.m_angularVelocity -= e.m_invI * d, n.m_angularVelocity += n.m_invI * d
        }
    },
    SolvePositionConstraints: function() {
        var t, i, o, e = this.m_body1,
            n = this.m_body2,
            s = 0,
            a = (o = e.m_R).col1.x * this.m_localAnchor1.x + o.col2.x * this.m_localAnchor1.y,
            r = o.col1.y * this.m_localAnchor1.x + o.col2.y * this.m_localAnchor1.y,
            l = (o = n.m_R).col1.x * this.m_localAnchor2.x + o.col2.x * this.m_localAnchor2.y,
            m = o.col1.y * this.m_localAnchor2.x + o.col2.y * this.m_localAnchor2.y,
            _ = e.m_position.x + a,
            h = e.m_position.y + r,
            c = n.m_position.x + l - _,
            u = n.m_position.y + m - h;
        s = Math.sqrt(c * c + u * u);
        var y = e.m_invMass,
            b = n.m_invMass,
            p = e.m_invI,
            d = n.m_invI;
        this.K1.col1.x = y + b, this.K1.col2.x = 0, this.K1.col1.y = 0, this.K1.col2.y = y + b, this.K2.col1.x = p * r * r, this.K2.col2.x = -p * a * r, this.K2.col1.y = -p * a * r, this.K2.col2.y = p * a * a, this.K3.col1.x = d * m * m, this.K3.col2.x = -d * l * m, this.K3.col1.y = -d * l * m, this.K3.col2.y = d * l * l, this.K.SetM(this.K1), this.K.AddM(this.K2), this.K.AddM(this.K3), this.K.Solve(b2RevoluteJoint.tImpulse, -c, -u);
        var x = b2RevoluteJoint.tImpulse.x,
            f = b2RevoluteJoint.tImpulse.y;
        e.m_position.x -= e.m_invMass * x, e.m_position.y -= e.m_invMass * f, e.m_rotation -= e.m_invI * (a * f - r * x), e.m_R.Set(e.m_rotation), n.m_position.x += n.m_invMass * x, n.m_position.y += n.m_invMass * f, n.m_rotation += n.m_invI * (l * f - m * x), n.m_R.Set(n.m_rotation);
        var v = 0;
        if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
            var g = n.m_rotation - e.m_rotation - this.m_intialAngle,
                M = 0;
            this.m_limitState == b2Joint.e_equalLimits ? (i = b2Math.b2Clamp(g, -b2Settings.b2_maxAngularCorrection, b2Settings.b2_maxAngularCorrection), M = -this.m_motorMass * i, v = b2Math.b2Abs(i)) : this.m_limitState == b2Joint.e_atLowerLimit ? (i = g - this.m_lowerAngle, v = b2Math.b2Max(0, -i), i = b2Math.b2Clamp(i + b2Settings.b2_angularSlop, -b2Settings.b2_maxAngularCorrection, 0), M = -this.m_motorMass * i, t = this.m_limitPositionImpulse, this.m_limitPositionImpulse = b2Math.b2Max(this.m_limitPositionImpulse + M, 0), M = this.m_limitPositionImpulse - t) : this.m_limitState == b2Joint.e_atUpperLimit && (i = g - this.m_upperAngle, v = b2Math.b2Max(0, i), i = b2Math.b2Clamp(i - b2Settings.b2_angularSlop, 0, b2Settings.b2_maxAngularCorrection), M = -this.m_motorMass * i, t = this.m_limitPositionImpulse, this.m_limitPositionImpulse = b2Math.b2Min(this.m_limitPositionImpulse + M, 0), M = this.m_limitPositionImpulse - t), e.m_rotation -= e.m_invI * M, e.m_R.Set(e.m_rotation), n.m_rotation += n.m_invI * M, n.m_R.Set(n.m_rotation)
        }
        return s <= b2Settings.b2_linearSlop && v <= b2Settings.b2_angularSlop
    },
    m_localAnchor1: new b2Vec2,
    m_localAnchor2: new b2Vec2,
    m_ptpImpulse: new b2Vec2,
    m_motorImpulse: null,
    m_limitImpulse: null,
    m_limitPositionImpulse: null,
    m_ptpMass: new b2Mat22,
    m_motorMass: null,
    m_intialAngle: null,
    m_lowerAngle: null,
    m_upperAngle: null,
    m_maxMotorTorque: null,
    m_motorSpeed: null,
    m_enableLimit: null,
    m_enableMotor: null,
    m_limitState: 0
}), b2RevoluteJoint.tImpulse = new b2Vec2;
var b2RevoluteJointDef = Class.create();
Object.extend(b2RevoluteJointDef.prototype, b2JointDef.prototype), Object.extend(b2RevoluteJointDef.prototype, {
    initialize: function() {
        this.type = b2Joint.e_unknownJoint, this.userData = null, this.body1 = null, this.body2 = null, this.collideConnected = !1, this.type = b2Joint.e_revoluteJoint, this.anchorPoint = new b2Vec2(0, 0), this.lowerAngle = 0, this.upperAngle = 0, this.motorTorque = 0, this.motorSpeed = 0, this.enableLimit = !1, this.enableMotor = !1
    },
    anchorPoint: null,
    lowerAngle: null,
    upperAngle: null,
    motorTorque: null,
    motorSpeed: null,
    enableLimit: null,
    enableMotor: null
});
var delta = [0, 0],
    stage = [window.screenX, window.screenY, window.innerWidth, window.innerHeight];
getBrowserDimensions();
var isMouseDown = !1,
    worldAABB, world, iterations = 1,
    timeStep = .025,
    walls = [],
    wall_thickness = 200,
    wallsSetted = !1,
    mouseJoint, mouse = {
        x: 0,
        y: 0
    },
    mouseOnClick = [],
    elements = [],
    bodies = [],
    properties = [],
    query, page = 0,
    gWebSearch, gImageSearch, imFeelingLuckyMode = !1,
    resultBodies = [],
    gravity = {
        x: 0,
        y: 0
    };
init(), window.requestAnimationFrame(loop), $(document).ready(function() {
    $(document.body).vide({


    }, {
        posterType: "png"
    }), $(".m1").width($(window).width()).marquee({
        duration: 2e4,
        gap: 0,
        delayBeforeStart: 0,
        direction: "left",
        duplicated: !0
    }), $(".m2").width($(window).width()).marquee({
        duration: 2e4,
        gap: 0,
        delayBeforeStart: 0,
        direction: "right",
        duplicated: !0
    })
});
