(function (E) {
    E.fn.drag = function (L, K, J) {
        if (K) {
            this.bind("dragstart", L)
        }
        if (J) {
            this.bind("dragend", J)
        }
        return !L ? this.trigger("drag") : this.bind("drag", K ? K : L)
    };
    var A = E.event,
	B = A.special,
	F = B.drag = {
	    not: ":input",
	    distance: 0,
	    which: 1,
	    dragging: false,
	    setup: function (J) {
	        J = E.extend({
	            distance: F.distance,
	            which: F.which,
	            not: F.not
	        }, J || {});
	        J.distance = I(J.distance);
	        A.add(this, "mousedown", H, J);
	        if (this.attachEvent) {
	            this.attachEvent("ondragstart", D)
	        }
	    },
	    teardown: function () {
	        A.remove(this, "mousedown", H);
	        if (this === F.dragging) {
	            F.dragging = F.proxy = false
	        }
	        G(this, true);
	        if (this.detachEvent) {
	            this.detachEvent("ondragstart", D)
	        }
	    }
	};
    B.dragstart = B.dragend = {
        setup: function () { },
        teardown: function () { }

    };
    function H(L) {
        var K = this,
		J,
		M = L.data || {};
        if (M.elem) {
            K = L.dragTarget = M.elem;
            L.dragProxy = F.proxy || K;
            L.cursorOffsetX = M.pageX - M.left;
            L.cursorOffsetY = M.pageY - M.top;
            L.offsetX = L.pageX - L.cursorOffsetX;
            L.offsetY = L.pageY - L.cursorOffsetY
        } else {
            if (F.dragging || (M.which > 0 && L.which != M.which) || E(L.target).is(M.not)) {
                return
            }
        }
        switch (L.type) {
            case "mousedown":
                E.extend(M, E(K).offset(), {
                    elem: K,
                    target: L.target,
                    pageX: L.pageX,
                    pageY: L.pageY
                });
                A.add(document, "mousemove mouseup", H, M);
                G(K, false);
                F.dragging = null;
                return false;
            case !F.dragging && "mousemove":
                if (I(L.pageX - M.pageX) + I(L.pageY - M.pageY) < M.distance) {
                    break
                }
                L.target = M.target;
                J = C(L, "dragstart", K);
                if (J !== false) {
                    F.dragging = K;
                    F.proxy = L.dragProxy = E(J || K)[0]
                }
            case "mousemove":
                if (F.dragging) {
                    J = C(L, "drag", K);
                    if (B.drop) {
                        B.drop.allowed = (J !== false);
                        B.drop.handler(L)
                    }
                    if (J !== false) {
                        break
                    }
                    L.type = "mouseup"
                }
            case "mouseup":
                A.remove(document, "mousemove mouseup", H);
                if (F.dragging) {
                    if (B.drop) {
                        B.drop.handler(L)
                    }
                    C(L, "dragend", K)
                }
                G(K, true);
                F.dragging = F.proxy = M.elem = false;
                break
        }
        return true
    }
    function C(M, K, L) {
        M.type = K;
        var J = E.event.handle.call(L, M);
        return J === false ? false : J || M.result
    }
    function I(J) {
        return Math.pow(J, 2)
    }
    function D() {
        return (F.dragging === false)
    }
    function G(K, J) {
        if (!K) {
            return
        }
        K.unselectable = J ? "off" : "on";
        K.onselectstart = function () {
            return J
        };
        if (K.style) {
            K.style.MozUserSelect = J ? "" : "none"
        }
    }
})(jQuery);