!(function() {
  "use strict";
  function e(e, t, s) {
    var n = "",
      i = t || "Error caught in DIL module/submodule: ";
    return (
      e === Object(e)
        ? (n = i + (e.message || "err has no message"))
        : ((n = i + "err is not a valid object"), (e = {})),
      (e.message = n),
      s instanceof DIL && (e.partner = s.api.getPartner()),
      DIL.errorModule.handleError(e),
      (this.errorMessage = n)
    );
  }
  var r,
    a,
    o,
    t = {
      submitUniversalAnalytics: function(e, t, s) {
        try {
          var n,
            i,
            r,
            a,
            o = e.getAll()[0],
            d = o[s || "b"].data.keys,
            u = {};
          for (n = 0, i = d.length; n < i; n++)
            (r = d[n]),
              void 0 === (a = o.get(r)) ||
                "function" == typeof a ||
                a === Object(a) ||
                /^_/.test(r) ||
                /^&/.test(r) ||
                (u[r] = a);
          return t.api.signals(u, "c_").submit(), u;
        } catch (e) {
          return "Caught error with message: " + e.message;
        }
      },
      dil: null,
      arr: null,
      tv: null,
      errorMessage: "",
      defaultTrackVars: [
        "_setAccount",
        "_setCustomVar",
        "_addItem",
        "_addTrans",
        "_trackSocial"
      ],
      defaultTrackVarsObj: null,
      signals: {},
      hasSignals: !1,
      handle: e,
      init: function(e, t, s) {
        try {
          (this.dil = null),
            (this.arr = null),
            (this.tv = null),
            (this.errorMessage = ""),
            (this.signals = {}),
            (this.hasSignals = !1);
          var n = { name: "DIL GA Module Error" },
            i = "";
          t instanceof DIL
            ? ((this.dil = t), (n.partner = this.dil.api.getPartner()))
            : ((i = "dilInstance is not a valid instance of DIL"),
              (n.message = i),
              DIL.errorModule.handleError(n)),
            e instanceof Array && e.length
              ? (this.arr = e)
              : ((i = "gaArray is not an array or is empty"),
                (n.message = i),
                DIL.errorModule.handleError(n)),
            (this.tv = this.constructTrackVars(s)),
            (this.errorMessage = i);
        } catch (e) {
          this.handle(
            e,
            "DIL.modules.GA.init() caught error with message ",
            this.dil
          );
        } finally {
          return this;
        }
      },
      constructTrackVars: function(e) {
        var t,
          s,
          n,
          i,
          r,
          a,
          o = [];
        if (this.defaultTrackVarsObj !== Object(this.defaultTrackVarsObj)) {
          for (
            a = {}, s = 0, n = (r = this.defaultTrackVars).length;
            s < n;
            s++
          )
            a[r[s]] = !0;
          this.defaultTrackVarsObj = a;
        } else a = this.defaultTrackVarsObj;
        if (e === Object(e)) {
          if ((t = e.names) instanceof Array && (n = t.length))
            for (s = 0; s < n; s++)
              "string" == typeof (i = t[s]) && i.length && i in a && o.push(i);
          if (o.length) return o;
        }
        return this.defaultTrackVars;
      },
      constructGAObj: function(e) {
        var t,
          s,
          n,
          i,
          r,
          a,
          o = {},
          d = e instanceof Array ? e : this.arr;
        for (t = 0, s = d.length; t < s; t++)
          (n = d[t]) instanceof Array &&
            n.length &&
            ((r = n = []),
            (a = d[t]),
            r instanceof Array &&
              a instanceof Array &&
              Array.prototype.push.apply(r, a),
            "string" == typeof (i = n.shift()) &&
              i.length &&
              (o[i] instanceof Array || (o[i] = []), o[i].push(n)));
        return o;
      },
      addToSignals: function(e, t) {
        return (
          "string" == typeof e &&
          "" !== e &&
          null != t &&
          "" !== t &&
          (this.signals[e] instanceof Array || (this.signals[e] = []),
          this.signals[e].push(t),
          (this.hasSignals = !0))
        );
      },
      constructSignals: function() {
        var e,
          t,
          s,
          n,
          i,
          r,
          a = this.constructGAObj(),
          o = {
            _setAccount: function(e) {
              this.addToSignals("c_accountId", e);
            },
            _setCustomVar: function(e, t, s) {
              "string" == typeof t &&
                t.length &&
                this.addToSignals("c_" + t, s);
            },
            _addItem: function(e, t, s, n, i, r) {
              this.addToSignals("c_itemOrderId", e),
                this.addToSignals("c_itemSku", t),
                this.addToSignals("c_itemName", s),
                this.addToSignals("c_itemCategory", n),
                this.addToSignals("c_itemPrice", i),
                this.addToSignals("c_itemQuantity", r);
            },
            _addTrans: function(e, t, s, n, i, r, a, o) {
              this.addToSignals("c_transOrderId", e),
                this.addToSignals("c_transAffiliation", t),
                this.addToSignals("c_transTotal", s),
                this.addToSignals("c_transTax", n),
                this.addToSignals("c_transShipping", i),
                this.addToSignals("c_transCity", r),
                this.addToSignals("c_transState", a),
                this.addToSignals("c_transCountry", o);
            },
            _trackSocial: function(e, t, s, n) {
              this.addToSignals("c_socialNetwork", e),
                this.addToSignals("c_socialAction", t),
                this.addToSignals("c_socialTarget", s),
                this.addToSignals("c_socialPagePath", n);
            }
          },
          d = this.tv;
        for (e = 0, t = d.length; e < t; e++)
          if (
            ((s = d[e]),
            a.hasOwnProperty(s) &&
              o.hasOwnProperty(s) &&
              (r = a[s]) instanceof Array)
          )
            for (n = 0, i = r.length; n < i; n++) o[s].apply(this, r[n]);
      },
      submit: function() {
        try {
          return "" !== this.errorMessage
            ? this.errorMessage
            : (this.constructSignals(),
              this.hasSignals
                ? (this.dil.api.signals(this.signals).submit(),
                  "Signals sent: " +
                    this.dil.helpers.convertObjectToKeyValuePairs(
                      this.signals,
                      "=",
                      !0
                    ))
                : "No signals present");
        } catch (e) {
          return this.handle(
            e,
            "DIL.modules.GA.submit() caught error with message ",
            this.dil
          );
        }
      },
      Stuffer: {
        LIMIT: 5,
        dil: null,
        cookieName: null,
        delimiter: null,
        errorMessage: "",
        handle: e,
        callback: null,
        v: function() {
          return !1;
        },
        init: function(e, t, s) {
          try {
            (this.dil = null),
              (this.callback = null),
              (this.errorMessage = ""),
              e instanceof DIL
                ? ((this.dil = e),
                  (this.v = this.dil.validators.isPopulatedString),
                  (this.cookieName = this.v(t) ? t : "aam_ga"),
                  (this.delimiter = this.v(s) ? s : "|"))
                : this.handle(
                    { message: "dilInstance is not a valid instance of DIL" },
                    "DIL.modules.GA.Stuffer.init() error: "
                  );
          } catch (e) {
            this.handle(
              e,
              "DIL.modules.GA.Stuffer.init() caught error with message ",
              this.dil
            );
          } finally {
            return this;
          }
        },
        process: function(e) {
          var t,
            s,
            n,
            i,
            r,
            a,
            o,
            d,
            u,
            c,
            l,
            h = !1,
            f = 1;
          if (
            e === Object(e) &&
            (t = e.stuff) &&
            t instanceof Array &&
            (s = t.length)
          )
            for (n = 0; n < s; n++)
              if (
                (i = t[n]) &&
                i === Object(i) &&
                ((r = i.cn), (a = i.cv), r === this.cookieName && this.v(a))
              ) {
                h = !0;
                break;
              }
          if (h) {
            for (
              o = a.split(this.delimiter),
                void 0 === window._gaq && (window._gaq = []),
                d = window._gaq,
                n = 0,
                s = o.length;
              n < s &&
              ((c = (u = o[n].split("="))[0]),
              (l = u[1]),
              this.v(c) && this.v(l) && d.push(["_setCustomVar", f++, c, l, 1]),
              !(f > this.LIMIT));
              n++
            );
            this.errorMessage =
              1 < f
                ? "No errors - stuffing successful"
                : "No valid values to stuff";
          } else this.errorMessage = "Cookie name and value not found in json";
          if ("function" == typeof this.callback) return this.callback();
        },
        submit: function() {
          try {
            var t = this;
            return "" !== this.errorMessage
              ? this.errorMessage
              : (this.dil.api
                  .afterResult(function(e) {
                    t.process(e);
                  })
                  .submit(),
                "DIL.modules.GA.Stuffer.submit() successful");
          } catch (e) {
            return this.handle(
              e,
              "DIL.modules.GA.Stuffer.submit() caught error with message ",
              this.dil
            );
          }
        }
      }
    },
    s = {
      dil: null,
      handle: e,
      init: function(e, t, s, n) {
        try {
          var f = this,
            i = { name: "DIL Site Catalyst Module Error" },
            p = function(e) {
              return (i.message = e), DIL.errorModule.handleError(i), e;
            };
          if (
            ((this.options = n === Object(n) ? n : {}),
            (this.dil = null),
            !(t instanceof DIL))
          )
            return p("dilInstance is not a valid instance of DIL");
          if (
            ((this.dil = t), (i.partner = t.api.getPartner()), e !== Object(e))
          )
            return p("siteCatalystReportingSuite is not an object");
          var r = e;
          return (
            (window.AppMeasurement_Module_DIL = r.m_DIL = function(e) {
              var t = "function" == typeof e.m_i ? e.m_i("DIL") : this;
              if (t !== Object(t)) return p("m is not an object");
              (t.trackVars = f.constructTrackVars(s)),
                (t.d = 0),
                (t.s = e),
                (t._t = function() {
                  var e,
                    t,
                    s,
                    n,
                    i,
                    r,
                    a = this,
                    o = "," + a.trackVars + ",",
                    d = a.s,
                    u = [],
                    c = [],
                    l = {},
                    h = !1;
                  if (d !== Object(d))
                    return p("Error in m._t function: s is not an object");
                  if (a.d) {
                    if ("function" == typeof d.foreachVar)
                      d.foreachVar(function(e, t) {
                        void 0 !== t && ((l[e] = t), (h = !0));
                      }, a.trackVars);
                    else {
                      if (!(d.va_t instanceof Array))
                        return p(
                          "Error in m._t function: s.va_t is not an array"
                        );
                      if (
                        (d.lightProfileID
                          ? (e = d.lightTrackVars) &&
                            (e = "," + e + "," + d.vl_mr + ",")
                          : (d.pe || d.linkType) &&
                            ((e = d.linkTrackVars),
                            d.pe &&
                              ((t =
                                d.pe.substring(0, 1).toUpperCase() +
                                d.pe.substring(1)),
                              d[t] && (e = d[t].trackVars)),
                            e &&
                              (e =
                                "," + e + "," + d.vl_l + "," + d.vl_l2 + ",")),
                        e)
                      ) {
                        for (r = 0, u = e.split(","); r < u.length; r++)
                          0 <= o.indexOf("," + u[r] + ",") && c.push(u[r]);
                        c.length && (o = "," + c.join(",") + ",");
                      }
                      for (n = 0, i = d.va_t.length; n < i; n++)
                        (s = d.va_t[n]),
                          0 <= o.indexOf("," + s + ",") &&
                            void 0 !== d[s] &&
                            null !== d[s] &&
                            "" !== d[s] &&
                            ((l[s] = d[s]), (h = !0));
                    }
                    f.includeContextData(d, l).store_populated && (h = !0),
                      h && a.d.api.signals(l, "c_").submit();
                  }
                });
            }),
            r.loadModule("DIL"),
            (r.DIL.d = t),
            i.message
              ? i.message
              : "DIL.modules.siteCatalyst.init() completed with no errors"
          );
        } catch (e) {
          return this.handle(
            e,
            "DIL.modules.siteCatalyst.init() caught error with message ",
            this.dil
          );
        }
      },
      constructTrackVars: function(e) {
        var t,
          s,
          n,
          i,
          r,
          a,
          o,
          d,
          u = [];
        if (e === Object(e)) {
          if ((t = e.names) instanceof Array && (i = t.length))
            for (n = 0; n < i; n++)
              "string" == typeof (r = t[n]) && r.length && u.push(r);
          if ((s = e.iteratedNames) instanceof Array && (i = s.length))
            for (n = 0; n < i; n++)
              if (
                (a = s[n]) === Object(a) &&
                ((r = a.name),
                (d = parseInt(a.maxIndex, 10)),
                "string" == typeof r && r.length && !isNaN(d) && 0 <= d)
              )
                for (o = 0; o <= d; o++) u.push(r + o);
          if (u.length) return u.join(",");
        }
        return this.constructTrackVars({
          names: [
            "pageName",
            "channel",
            "campaign",
            "products",
            "events",
            "pe",
            "pev1",
            "pev2",
            "pev3"
          ],
          iteratedNames: [
            { name: "prop", maxIndex: 75 },
            { name: "eVar", maxIndex: 250 }
          ]
        });
      },
      includeContextData: function(e, t) {
        var s = {},
          n = !1;
        if (e.contextData === Object(e.contextData)) {
          var i,
            r,
            a,
            o,
            d,
            u = e.contextData,
            c = this.options.replaceContextDataPeriodsWith,
            l = this.options.filterFromContextVariables,
            h = {};
          if (
            (("string" == typeof c && c.length) || (c = "_"),
            l instanceof Array)
          )
            for (i = 0, r = l.length; i < r; i++)
              (a = l[i]),
                this.dil.validators.isPopulatedString(a) && (h[a] = !0);
          for (o in u)
            u.hasOwnProperty(o) &&
              !h[o] &&
              ((d = u[o]) || "number" == typeof d) &&
              ((t[(o = ("contextData." + o).replace(/\./g, c))] = d), (n = !0));
        }
        return (s.store_populated = n), s;
      }
    };
  "function" != typeof window.DIL &&
    ((window.DIL = function(s) {
      var c,
        e,
        I,
        r,
        u,
        p,
        t,
        a,
        n,
        i,
        o,
        d,
        l,
        h,
        f,
        g,
        m,
        y = [],
        b = {};
      s !== Object(s) && (s = {}),
        (I = s.partner),
        (r = s.containerNSID),
        (u = s.mappings),
        (p = s.uuidCookie),
        (t = !0 === s.enableErrorReporting),
        (a = s.visitorService),
        (n = s.declaredId),
        (i = !0 === s.delayAllUntilWindowLoad),
        (o =
          void 0 === s.secureDataCollection || !0 === s.secureDataCollection),
        (d = "boolean" == typeof s.isCoopSafe ? s.isCoopSafe : null),
        (l = !0 === s.disableDefaultRequest),
        (h = s.afterResultForDefaultRequest),
        (f = s.visitorConstructor),
        (g = !0 === s.disableCORS),
        (m = !0 === s.ignoreHardDependencyOnVisitorAPI),
        t && DIL.errorModule.activate(),
        m &&
          y.push(
            "Warning: this instance is configured to ignore the hard dependency on the VisitorAPI service. This means that no URL destinations will be fired if the instance has no connection to VisitorAPI. If the VisitorAPI service is not instantiated, ID syncs will not be fired either."
          );
      var v = !0 === window._dil_unit_tests;
      if (((c = arguments[1]) && y.push(c + ""), !I || "string" != typeof I)) {
        var D = {
          name: "error",
          message: (c =
            "DIL partner is invalid or not specified in initConfig"),
          filename: "dil.js"
        };
        return DIL.errorModule.handleError(D), new Error(c);
      }
      if (
        ((c =
          "DIL containerNSID is invalid or not specified in initConfig, setting to default of 0"),
        (r || "number" == typeof r) &&
          ((r = parseInt(r, 10)), !isNaN(r) && 0 <= r && (c = "")),
        c && ((r = 0), y.push(c), (c = "")),
        (e = DIL.getDil(I, r)) instanceof DIL &&
          e.api.getPartner() === I &&
          e.api.getContainerNSID() === r)
      )
        return e;
      if (!(this instanceof DIL))
        return new DIL(
          s,
          "DIL was not instantiated with the 'new' operator, returning a valid instance with partner = " +
            I +
            " and containerNSID = " +
            r
        );
      DIL.registerDil(this, I, r);
      var S = {
        IS_HTTPS: o || "https:" === document.location.protocol,
        SIX_MONTHS_IN_MINUTES: 259200,
        IE_VERSION: (function() {
          if (document.documentMode) return document.documentMode;
          for (var e = 7; 4 < e; e--) {
            var t = document.createElement("div");
            if (
              ((t.innerHTML =
                "\x3c!--[if IE " + e + "]><span></span><![endif]--\x3e"),
              t.getElementsByTagName("span").length)
            )
              return (t = null), e;
          }
          return null;
        })()
      };
      S.IS_IE_LESS_THAN_10 =
        "number" == typeof S.IE_VERSION && S.IE_VERSION < 10;
      var _ = { stuffed: {} },
        O = {},
        C = {
          firingQueue: [],
          fired: [],
          firing: !1,
          sent: [],
          errored: [],
          reservedKeys: {
            sids: !0,
            pdata: !0,
            logdata: !0,
            callback: !0,
            postCallbackFn: !0,
            useImageRequest: !0
          },
          firstRequestHasFired: !1,
          abortRequests: !1,
          num_of_cors_responses: 0,
          num_of_cors_errors: 0,
          corsErrorSources: [],
          num_of_img_responses: 0,
          num_of_img_errors: 0,
          platformParams: {
            d_nsid: r + "",
            d_rtbd: "json",
            d_jsonv: DIL.jsonVersion + "",
            d_dst: "1"
          },
          nonModStatsParams: { d_rtbd: !0, d_dst: !0, d_cts: !0, d_rs: !0 },
          modStatsParams: null,
          adms: {
            TIME_TO_CATCH_ALL_REQUESTS_RELEASE: 3e4,
            calledBack: !1,
            mid: null,
            noVisitorAPI: null,
            VisitorAPI: null,
            instance: null,
            releaseType: "no VisitorAPI",
            isOptedOut: !0,
            isOptedOutCallbackCalled: !1,
            admsProcessingStarted: !1,
            process: function(e) {
              try {
                if (this.admsProcessingStarted) return;
                this.admsProcessingStarted = !0;
                var t,
                  s,
                  n,
                  i = a;
                if (
                  "function" != typeof e ||
                  "function" != typeof e.getInstance
                )
                  throw ((this.noVisitorAPI = !0),
                  new Error("Visitor does not exist."));
                if (
                  i !== Object(i) ||
                  !(t = i.namespace) ||
                  "string" != typeof t
                )
                  throw ((this.releaseType = "no namespace"),
                  new Error(
                    "DIL.create() needs the initConfig property `visitorService`:{namespace:'<Experience Cloud Org ID>'}"
                  ));
                if (
                  !(
                    (s = e.getInstance(t, { idSyncContainerID: r })) ===
                      Object(s) &&
                    s instanceof e &&
                    "function" == typeof s.isAllowed &&
                    "function" == typeof s.getMarketingCloudVisitorID &&
                    "function" == typeof s.getCustomerIDs &&
                    "function" == typeof s.isOptedOut &&
                    "function" == typeof s.publishDestinations
                  )
                )
                  throw ((this.releaseType = "invalid instance"),
                  (n = "Invalid Visitor instance."),
                  s === Object(s) &&
                    "function" != typeof s.publishDestinations &&
                    (n +=
                      " In particular, visitorInstance.publishDestinations is not a function. This is needed to fire URL destinations in DIL v8.0+ and should be present in Visitor v3.3+ ."),
                  new Error(n));
                if (((this.VisitorAPI = e), !s.isAllowed()))
                  return (
                    (this.releaseType =
                      "VisitorAPI is not allowed to write cookies"),
                    void this.releaseRequests()
                  );
                (this.instance = s), this.waitForMidToReleaseRequests();
              } catch (e) {
                if (!m)
                  throw new Error(
                    "Error in processing Visitor API, which is a hard dependency for DIL v8.0+: " +
                      e.message
                  );
                this.releaseRequests();
              }
            },
            waitForMidToReleaseRequests: function() {
              var t = this;
              this.instance &&
                (this.instance.getMarketingCloudVisitorID(function(e) {
                  (t.mid = e),
                    (t.releaseType = "VisitorAPI"),
                    t.releaseRequests();
                }, !0),
                (!j.exists ||
                  (!j.isIabContext && j.isApproved()) ||
                  (j.isIabContext && x.hasGoSignal())) &&
                  setTimeout(function() {
                    "VisitorAPI" !== t.releaseType &&
                      ((t.releaseType = "timeout"), t.releaseRequests());
                  }, this.getLoadTimeout()));
            },
            releaseRequests: function() {
              (this.calledBack = !0), C.registerRequest();
            },
            getMarketingCloudVisitorID: function() {
              return this.instance
                ? this.instance.getMarketingCloudVisitorID()
                : null;
            },
            getMIDQueryString: function() {
              var e = T.isPopulatedString,
                t = this.getMarketingCloudVisitorID();
              return (
                (e(this.mid) && this.mid === t) || (this.mid = t),
                e(this.mid) ? "d_mid=" + this.mid + "&" : ""
              );
            },
            getCustomerIDs: function() {
              return this.instance ? this.instance.getCustomerIDs() : null;
            },
            getCustomerIDsQueryString: function(e) {
              if (e !== Object(e)) return "";
              var t,
                s,
                n,
                i,
                r = "",
                a = [],
                o = [];
              for (t in e)
                e.hasOwnProperty(t) &&
                  (s = e[(o[0] = t)]) === Object(s) &&
                  ((o[1] = s.id || ""),
                  (o[2] = s.authState || 0),
                  a.push(o),
                  (o = []));
              if ((i = a.length))
                for (n = 0; n < i; n++)
                  r += "&d_cid_ic=" + E.encodeAndBuildRequest(a[n], "%01");
              return r;
            },
            getIsOptedOut: function() {
              this.instance
                ? this.instance.isOptedOut(
                    [this, this.isOptedOutCallback],
                    this.VisitorAPI.OptOut.GLOBAL,
                    !0
                  )
                : ((this.isOptedOut = !1),
                  (this.isOptedOutCallbackCalled = !0));
            },
            isOptedOutCallback: function(e) {
              (this.isOptedOut = e),
                (this.isOptedOutCallbackCalled = !0),
                C.registerRequest(),
                j.isIabContext() && x.checkQueryStringObject();
            },
            getLoadTimeout: function() {
              var e = this.instance;
              if (e) {
                if ("function" == typeof e.getLoadTimeout)
                  return e.getLoadTimeout();
                if (void 0 !== e.loadTimeout) return e.loadTimeout;
              }
              return this.TIME_TO_CATCH_ALL_REQUESTS_RELEASE;
            }
          },
          declaredId: {
            declaredId: { init: null, request: null },
            declaredIdCombos: {},
            setDeclaredId: function(e, t) {
              var s = T.isPopulatedString,
                n = encodeURIComponent;
              if (e === Object(e) && s(t)) {
                var i = e.dpid,
                  r = e.dpuuid,
                  a = null;
                if (s(i) && s(r))
                  return (
                    (a = n(i) + "$" + n(r)),
                    !0 === this.declaredIdCombos[a]
                      ? "setDeclaredId: combo exists for type '" + t + "'"
                      : ((this.declaredIdCombos[a] = !0),
                        (this.declaredId[t] = { dpid: i, dpuuid: r }),
                        "setDeclaredId: succeeded for type '" + t + "'")
                  );
              }
              return "setDeclaredId: failed for type '" + t + "'";
            },
            getDeclaredIdQueryString: function() {
              var e = this.declaredId.request,
                t = this.declaredId.init,
                s = encodeURIComponent,
                n = "";
              return (
                null !== e
                  ? (n = "&d_dpid=" + s(e.dpid) + "&d_dpuuid=" + s(e.dpuuid))
                  : null !== t &&
                    (n = "&d_dpid=" + s(t.dpid) + "&d_dpuuid=" + s(t.dpuuid)),
                n
              );
            }
          },
          registerRequest: function(e) {
            var t,
              s = this.firingQueue;
            e === Object(e) && (s.push(e), e.isDefaultRequest || (l = !0)),
              this.firing ||
                !s.length ||
                (i && !DIL.windowLoaded) ||
                (this.adms.isOptedOutCallbackCalled ||
                  this.adms.getIsOptedOut(),
                this.adms.calledBack &&
                  !this.adms.isOptedOut &&
                  this.adms.isOptedOutCallbackCalled &&
                  (j.isApproved() || x.hasGoSignal()) &&
                  ((this.adms.isOptedOutCallbackCalled = !1),
                  ((t = s.shift()).src = t.src.replace(
                    /&d_nsid=/,
                    "&" +
                      this.adms.getMIDQueryString() +
                      x.getQueryString() +
                      "d_nsid="
                  )),
                  T.isPopulatedString(t.corsPostData) &&
                    (t.corsPostData = t.corsPostData.replace(
                      /^d_nsid=/,
                      this.adms.getMIDQueryString() +
                        x.getQueryString() +
                        "d_nsid="
                    )),
                  P.fireRequest(t),
                  this.firstRequestHasFired ||
                    ("script" !== t.tag && "cors" !== t.tag) ||
                    (this.firstRequestHasFired = !0)));
          },
          processVisitorAPI: function() {
            this.adms.process(f || window.Visitor);
          },
          getCoopQueryString: function() {
            var e = "";
            return (
              !0 === d
                ? (e = "&d_coop_safe=1")
                : !1 === d && (e = "&d_coop_unsafe=1"),
              e
            );
          }
        };
      b.requestController = C;
      var w,
        L,
        A = {
          sendingMessages: !1,
          messages: [],
          messagesPosted: [],
          destinations: [],
          destinationsPosted: [],
          jsonForComparison: [],
          jsonDuplicates: [],
          jsonWaiting: [],
          jsonProcessed: [],
          publishDestinationsVersion: null,
          requestToProcess: function(e, t) {
            var s,
              n = this;
            function i() {
              n.jsonForComparison.push(e), n.jsonWaiting.push([e, t]);
            }
            if (e && !T.isEmptyObject(e))
              if (
                ((s = JSON.stringify(e.dests || [])),
                this.jsonForComparison.length)
              ) {
                var r,
                  a,
                  o,
                  d = !1;
                for (r = 0, a = this.jsonForComparison.length; r < a; r++)
                  if (
                    ((o = this.jsonForComparison[r]),
                    s === JSON.stringify(o.dests || []))
                  ) {
                    d = !0;
                    break;
                  }
                d ? this.jsonDuplicates.push(e) : i();
              } else i();
            if (this.jsonWaiting.length) {
              var u = this.jsonWaiting.shift();
              this.process(u[0], u[1]), this.requestToProcess();
            }
            this.messages.length &&
              !this.sendingMessages &&
              this.sendMessages();
          },
          process: function(e) {
            var t,
              s,
              n,
              i,
              r,
              a,
              o = encodeURIComponent,
              d = this.getPublishDestinationsVersion(),
              u = !1;
            if (-1 !== d) {
              if ((t = e.dests) && t instanceof Array && (s = t.length)) {
                for (n = 0; n < s; n++)
                  (i = t[n]),
                    (a = [
                      o("dests"),
                      o(i.id || ""),
                      o(i.y || ""),
                      o(i.c || "")
                    ].join("|")),
                    this.addMessage(a),
                    (r = {
                      url: i.c,
                      hideReferrer: void 0 === i.hr || !!i.hr,
                      message: a
                    }),
                    this.addDestination(r),
                    void 0 !== i.hr && (u = !0);
                1 === d &&
                  u &&
                  E.consoleWarnOnce(
                    "Warning: visitorInstance.publishDestinations version is old (Visitor v3.3). URL destinations will not have the option of being fired on page, only in the iframe."
                  );
              }
              this.jsonProcessed.push(e);
            } else
              E.consoleWarnOnce(
                "Warning: Invalid visitorInstance.publishDestinations version. URL destinations will not be fired"
              );
          },
          addMessage: function(e) {
            this.messages.push(e);
          },
          addDestination: function(e) {
            this.destinations.push(e);
          },
          sendMessages: function() {
            this.sendingMessages ||
              ((this.sendingMessages = !0),
              this.messages.length && this.publishDestinations());
          },
          publishDestinations: function() {
            var t = this,
              e = C.adms.instance,
              s = [],
              n = [],
              i = function(e) {
                y.push(
                  "visitor.publishDestinations() result: " +
                    (e.error || e.message)
                ),
                  (t.sendingMessages = !1),
                  t.requestToProcess();
              },
              r = function() {
                (t.messages = []), (t.destinations = []);
              };
            return 1 === this.publishDestinationsVersion
              ? (E.extendArray(s, this.messages),
                E.extendArray(this.messagesPosted, this.messages),
                r(),
                e.publishDestinations(I, s, i),
                "Called visitor.publishDestinations() version 1")
              : 1 < this.publishDestinationsVersion
              ? (E.extendArray(n, this.destinations),
                E.extendArray(this.destinationsPosted, this.destinations),
                r(),
                e.publishDestinations({
                  subdomain: I,
                  callback: i,
                  urlDestinations: n
                }),
                "Called visitor.publishDestinations() version > 1")
              : void 0;
          },
          getPublishDestinationsVersion: function() {
            if (null !== this.publishDestinationsVersion)
              return this.publishDestinationsVersion;
            var e = C.adms.instance,
              t = -1;
            return (
              e &&
                "function" == typeof e.publishDestinations &&
                (3 === e.publishDestinations.length
                  ? (t = 1)
                  : 1 === e.publishDestinations.length && (t = 2)),
              (this.publishDestinationsVersion = t)
            );
          }
        },
        R = {
          traits: function(e) {
            return (
              T.isValidPdata(e) &&
                (O.sids instanceof Array || (O.sids = []),
                E.extendArray(O.sids, e)),
              this
            );
          },
          pixels: function(e) {
            return (
              T.isValidPdata(e) &&
                (O.pdata instanceof Array || (O.pdata = []),
                E.extendArray(O.pdata, e)),
              this
            );
          },
          logs: function(e) {
            return (
              T.isValidLogdata(e) &&
                (O.logdata !== Object(O.logdata) && (O.logdata = {}),
                E.extendObject(O.logdata, e)),
              this
            );
          },
          customQueryParams: function(e) {
            return (
              T.isEmptyObject(e) || E.extendObject(O, e, C.reservedKeys), this
            );
          },
          signals: function(e, t) {
            var s,
              n = e;
            if (!T.isEmptyObject(n)) {
              if (t && "string" == typeof t)
                for (s in ((n = {}), e))
                  e.hasOwnProperty(s) && (n[t + s] = e[s]);
              E.extendObject(O, n, C.reservedKeys);
            }
            return this;
          },
          declaredId: function(e) {
            return C.declaredId.setDeclaredId(e, "request"), this;
          },
          result: function(e) {
            return "function" == typeof e && (O.callback = e), this;
          },
          afterResult: function(e) {
            return "function" == typeof e && (O.postCallbackFn = e), this;
          },
          useImageRequest: function() {
            return (O.useImageRequest = !0), this;
          },
          clearData: function() {
            return (O = {}), this;
          },
          submit: function(e) {
            return (
              (O.isDefaultRequest = !!e), P.submitRequest(O), (O = {}), this
            );
          },
          getPartner: function() {
            return I;
          },
          getContainerNSID: function() {
            return r;
          },
          getEventLog: function() {
            return y;
          },
          getState: function() {
            var e = {},
              t = {};
            return (
              E.extendObject(e, C, { registerRequest: !0 }),
              E.extendObject(t, A, {
                requestToProcess: !0,
                process: !0,
                sendMessages: !0
              }),
              {
                initConfig: s,
                pendingRequest: O,
                otherRequestInfo: e,
                destinationPublishingInfo: t,
                log: y
              }
            );
          },
          idSync: function() {
            throw new Error(
              "Please use the `idSyncByURL` method of the Experience Cloud ID Service (Visitor) instance"
            );
          },
          aamIdSync: function() {
            throw new Error(
              "Please use the `idSyncByDataSource` method of the Experience Cloud ID Service (Visitor) instance"
            );
          },
          passData: function(e) {
            return T.isEmptyObject(e)
              ? "Error: json is empty or not an object"
              : (P.defaultCallback(e), e);
          },
          getPlatformParams: function() {
            return C.platformParams;
          },
          getEventCallConfigParams: function() {
            var e,
              t = C,
              s = t.modStatsParams,
              n = t.platformParams;
            if (!s) {
              for (e in ((s = {}), n))
                n.hasOwnProperty(e) &&
                  !t.nonModStatsParams[e] &&
                  (s[e.replace(/^d_/, "")] = n[e]);
              !0 === d ? (s.coop_safe = 1) : !1 === d && (s.coop_unsafe = 1),
                (t.modStatsParams = s);
            }
            return s;
          },
          setAsCoopSafe: function() {
            return (d = !0), this;
          },
          setAsCoopUnsafe: function() {
            return (d = !1), this;
          },
          getEventCallIabSignals: function(e) {
            var t;
            return e !== Object(e)
              ? "Error: config is not an object"
              : "function" != typeof e.callback
              ? "Error: config.callback is not a function"
              : ((t = parseInt(e.timeout, 10)),
                isNaN(t) && (t = null),
                void x.getQueryStringObject(e.callback, t));
          }
        },
        P = {
          corsMetadata:
            ((w = "none"),
            "undefined" != typeof XMLHttpRequest &&
              XMLHttpRequest === Object(XMLHttpRequest) &&
              "withCredentials" in new XMLHttpRequest() &&
              (w = "XMLHttpRequest"),
            { corsType: w }),
          getCORSInstance: function() {
            return "none" === this.corsMetadata.corsType
              ? null
              : new window[this.corsMetadata.corsType]();
          },
          submitRequest: function(e) {
            return C.registerRequest(P.createQueuedRequest(e)), !0;
          },
          createQueuedRequest: function(e) {
            var t,
              s,
              n,
              i,
              r,
              a = e.callback,
              o = "img",
              d = e.isDefaultRequest;
            if ((delete e.isDefaultRequest, !T.isEmptyObject(u)))
              for (n in u)
                if (u.hasOwnProperty(n)) {
                  if (null == (i = u[n]) || "" === i) continue;
                  if (n in e && !(i in e) && !(i in C.reservedKeys)) {
                    if (null == (r = e[n]) || "" === r) continue;
                    e[i] = r;
                  }
                }
            return (
              T.isValidPdata(e.sids) || (e.sids = []),
              T.isValidPdata(e.pdata) || (e.pdata = []),
              T.isValidLogdata(e.logdata) || (e.logdata = {}),
              (e.logdataArray = E.convertObjectToKeyValuePairs(
                e.logdata,
                "=",
                !0
              )),
              e.logdataArray.push("_ts=" + new Date().getTime()),
              "function" != typeof a && (a = this.defaultCallback),
              (t = this.makeRequestSrcData(e)),
              (s = this.getCORSInstance()) &&
                !0 !== e.useImageRequest &&
                (o = "cors"),
              {
                tag: o,
                src: t.src,
                corsSrc: t.corsSrc,
                callbackFn: a,
                postCallbackFn: e.postCallbackFn,
                useImageRequest: !!e.useImageRequest,
                requestData: e,
                corsInstance: s,
                corsPostData: t.corsPostData,
                isDefaultRequest: d
              }
            );
          },
          defaultCallback: function(e, t) {
            var s, n, i, r, a, o, d, u, c;
            if ((s = e.stuff) && s instanceof Array && (n = s.length))
              for (i = 0; i < n; i++)
                (r = s[i]) &&
                  r === Object(r) &&
                  ((a = r.cn),
                  (o = r.cv),
                  (void 0 !== (d = r.ttl) && "" !== d) ||
                    (d = Math.floor(
                      E.getMaxCookieExpiresInMinutes() / 60 / 24
                    )),
                  (u = r.dmn || "." + document.domain.replace(/^www\./, "")),
                  (c = r.type),
                  a &&
                    (o || "number" == typeof o) &&
                    ("var" !== c &&
                      (d = parseInt(d, 10)) &&
                      !isNaN(d) &&
                      E.setCookie(a, o, 24 * d * 60, "/", u, !1),
                    (_.stuffed[a] = o)));
            var l,
              h,
              f = e.uuid;
            T.isPopulatedString(f) &&
              (T.isEmptyObject(p) ||
                (("string" == typeof (l = p.path) && l.length) || (l = "/"),
                (h = parseInt(p.days, 10)),
                isNaN(h) && (h = 100),
                E.setCookie(
                  p.name || "aam_did",
                  f,
                  24 * h * 60,
                  l,
                  p.domain || "." + document.domain.replace(/^www\./, ""),
                  !0 === p.secure
                ))),
              C.abortRequests || A.requestToProcess(e, t);
          },
          makeRequestSrcData: function(r) {
            (r.sids = T.removeEmptyArrayValues(r.sids || [])),
              (r.pdata = T.removeEmptyArrayValues(r.pdata || []));
            var a = C,
              e = a.platformParams,
              t = E.encodeAndBuildRequest(r.sids, ","),
              s = E.encodeAndBuildRequest(r.pdata, ","),
              n = (r.logdataArray || []).join("&");
            delete r.logdataArray;
            var i,
              o,
              d = encodeURIComponent,
              u = S.IS_HTTPS ? "https://" : "http://",
              c = a.declaredId.getDeclaredIdQueryString(),
              l = a.adms.instance
                ? a.adms.getCustomerIDsQueryString(a.adms.getCustomerIDs())
                : "",
              h = (function() {
                var e,
                  t,
                  s,
                  n,
                  i = [];
                for (e in r)
                  if (!(e in a.reservedKeys) && r.hasOwnProperty(e))
                    if (((t = r[e]), (e = d(e)), t instanceof Array))
                      for (s = 0, n = t.length; s < n; s++)
                        i.push(e + "=" + d(t[s]));
                    else i.push(e + "=" + d(t));
                return i.length ? "&" + i.join("&") : "";
              })(),
              f = "d_dil_ver=" + d(DIL.version),
              p =
                "d_nsid=" +
                e.d_nsid +
                a.getCoopQueryString() +
                c +
                l +
                (t.length ? "&d_sid=" + t : "") +
                (s.length ? "&d_px=" + s : "") +
                (n.length ? "&d_ld=" + d(n) : ""),
              g =
                "&d_rtbd=" +
                e.d_rtbd +
                "&d_jsonv=" +
                e.d_jsonv +
                "&d_dst=" +
                e.d_dst,
              m = "&h_referer=" + d(location.href);
            return (
              (o =
                (i = u + I + ".demdex.net/event") +
                "?" +
                f +
                "&" +
                p +
                g +
                h +
                m),
              {
                corsSrc: i + "?" + f + "&_ts=" + new Date().getTime(),
                src: o,
                corsPostData: p + g + h + m,
                isDeclaredIdCall: "" !== c
              }
            );
          },
          fireRequest: function(e) {
            if ("img" === e.tag) this.fireImage(e);
            else {
              var t = C.declaredId,
                s = t.declaredId.request || t.declaredId.init || {},
                n = { dpid: s.dpid || "", dpuuid: s.dpuuid || "" };
              this.fireCORS(e, n);
            }
          },
          fireImage: function(t) {
            var e,
              s,
              n = C;
            n.abortRequests ||
              ((n.firing = !0),
              (e = new Image(0, 0)),
              n.sent.push(t),
              (e.onload = function() {
                (n.firing = !1),
                  n.fired.push(t),
                  n.num_of_img_responses++,
                  n.registerRequest();
              }),
              (s = function(e) {
                (c =
                  "imgAbortOrErrorHandler received the event of type " +
                  e.type),
                  y.push(c),
                  (n.abortRequests = !0),
                  (n.firing = !1),
                  n.errored.push(t),
                  n.num_of_img_errors++,
                  n.registerRequest();
              }),
              e.addEventListener("error", s),
              e.addEventListener("abort", s),
              (e.src = t.src));
          },
          fireCORS: function(n, i) {
            var r = this,
              a = C,
              e = this.corsMetadata.corsType,
              t = n.corsSrc,
              s = n.corsInstance,
              o = n.corsPostData,
              d = n.postCallbackFn,
              u = "function" == typeof d;
            if (!a.abortRequests && !g) {
              a.firing = !0;
              try {
                s.open("post", t, !0),
                  "XMLHttpRequest" === e &&
                    ((s.withCredentials = !0),
                    s.setRequestHeader(
                      "Content-Type",
                      "application/x-www-form-urlencoded"
                    ),
                    (s.onreadystatechange = function() {
                      4 === this.readyState &&
                        200 === this.status &&
                        (function(e) {
                          var t;
                          try {
                            if ((t = JSON.parse(e)) !== Object(t))
                              return r.handleCORSError(
                                n,
                                i,
                                "Response is not JSON"
                              );
                          } catch (e) {
                            return r.handleCORSError(
                              n,
                              i,
                              "Error parsing response as JSON"
                            );
                          }
                          try {
                            var s = n.callbackFn;
                            (a.firing = !1),
                              a.fired.push(n),
                              a.num_of_cors_responses++,
                              s(t, i),
                              u && d(t, i);
                          } catch (e) {
                            (e.message =
                              "DIL handleCORSResponse caught error with message " +
                              e.message),
                              (c = e.message),
                              y.push(c),
                              (e.filename = e.filename || "dil.js"),
                              (e.partner = I),
                              DIL.errorModule.handleError(e);
                            try {
                              s({ error: e.name + "|" + e.message }, i),
                                u && d({ error: e.name + "|" + e.message }, i);
                            } catch (e) {}
                          } finally {
                            a.registerRequest();
                          }
                        })(this.responseText);
                    })),
                  (s.onerror = function() {
                    r.handleCORSError(n, i, "onerror");
                  }),
                  (s.ontimeout = function() {
                    r.handleCORSError(n, i, "ontimeout");
                  }),
                  s.send(o);
              } catch (e) {
                this.handleCORSError(n, i, "try-catch");
              }
              a.sent.push(n), (a.declaredId.declaredId.request = null);
            }
          },
          handleCORSError: function(e, t, s) {
            C.num_of_cors_errors++, C.corsErrorSources.push(s);
          },
          handleRequestError: function(e, t) {
            var s = C;
            y.push(e),
              (s.abortRequests = !0),
              (s.firing = !1),
              s.errored.push(t),
              s.registerRequest();
          }
        },
        T = {
          isValidPdata: function(e) {
            return !!(
              e instanceof Array && this.removeEmptyArrayValues(e).length
            );
          },
          isValidLogdata: function(e) {
            return !this.isEmptyObject(e);
          },
          isEmptyObject: function(e) {
            if (e !== Object(e)) return !0;
            var t;
            for (t in e) if (e.hasOwnProperty(t)) return !1;
            return !0;
          },
          removeEmptyArrayValues: function(e) {
            var t,
              s = 0,
              n = e.length,
              i = [];
            for (s = 0; s < n; s++) null != (t = e[s]) && "" !== t && i.push(t);
            return i;
          },
          isPopulatedString: function(e) {
            return "string" == typeof e && e.length;
          }
        },
        E = {
          convertObjectToKeyValuePairs: function(e, t, s) {
            var n,
              i,
              r = [];
            for (n in (t || (t = "="), e))
              e.hasOwnProperty(n) &&
                null != (i = e[n]) &&
                "" !== i &&
                r.push(n + t + (s ? encodeURIComponent(i) : i));
            return r;
          },
          encodeAndBuildRequest: function(e, t) {
            return e
              .map(function(e) {
                return encodeURIComponent(e);
              })
              .join(t);
          },
          getCookie: function(e) {
            var t,
              s,
              n,
              i = e + "=",
              r = document.cookie.split(";");
            for (t = 0, s = r.length; t < s; t++) {
              for (n = r[t]; " " === n.charAt(0); )
                n = n.substring(1, n.length);
              if (0 === n.indexOf(i))
                return decodeURIComponent(n.substring(i.length, n.length));
            }
            return null;
          },
          setCookie: function(e, t, s, n, i, r) {
            var a = new Date();
            s && (s = 1e3 * s * 60),
              (document.cookie =
                e +
                "=" +
                encodeURIComponent(t) +
                (s
                  ? ";expires=" + new Date(a.getTime() + s).toUTCString()
                  : "") +
                (n ? ";path=" + n : "") +
                (i ? ";domain=" + i : "") +
                (r ? ";secure" : ""));
          },
          extendArray: function(e, t) {
            return (
              e instanceof Array &&
              t instanceof Array &&
              (Array.prototype.push.apply(e, t), !0)
            );
          },
          extendObject: function(e, t, s) {
            var n;
            if (e !== Object(e) || t !== Object(t)) return !1;
            for (n in t)
              if (t.hasOwnProperty(n)) {
                if (!T.isEmptyObject(s) && n in s) continue;
                e[n] = t[n];
              }
            return !0;
          },
          getMaxCookieExpiresInMinutes: function() {
            return S.SIX_MONTHS_IN_MINUTES;
          },
          replaceMethodsWithFunction: function(e, t) {
            var s;
            if (e === Object(e) && "function" == typeof t)
              for (s in e)
                e.hasOwnProperty(s) && "function" == typeof e[s] && (e[s] = t);
          },
          doesConsoleWarnExist: null,
          consoleWarnMemo: {},
          consoleWarnOnce: function(e) {
            null === this.doesConsoleWarnExist &&
              (this.doesConsoleWarnExist =
                window.console === Object(window.console) &&
                "function" == typeof window.console.warn),
              this.consoleWarnMemo[e] ||
                ((this.consoleWarnMemo[e] = !0),
                this.doesConsoleWarnExist && window.console.warn(e),
                y.push(e));
          }
        },
        j =
          ((L = b.requestController),
          {
            exists: null,
            instance: null,
            aamIsApproved: null,
            init: function() {
              var e = this;
              this.checkIfExists()
                ? ((this.exists = !0),
                  (this.instance = window.adobe.optIn),
                  this.instance.fetchPermissions(function() {
                    e.callback();
                  }, !0))
                : (this.exists = !1);
            },
            checkIfExists: function() {
              return (
                window.adobe === Object(window.adobe) &&
                window.adobe.optIn === Object(window.adobe.optIn)
              );
            },
            callback: function() {
              (this.aamIsApproved = this.instance.isApproved([
                this.instance.Categories.AAM
              ])),
                L.adms.waitForMidToReleaseRequests(),
                L.adms.getIsOptedOut();
            },
            isApproved: function() {
              return (
                !this.isIabContext() &&
                !L.adms.isOptedOut &&
                (!this.exists || this.aamIsApproved)
              );
            },
            isIabContext: function() {
              return this.instance && this.instance.isIabContext;
            }
          });
      b.optIn = j;
      var k,
        q,
        M,
        V,
        x =
          ((q = (k = b).requestController),
          (M = k.optIn),
          (V = {
            isVendorConsented: null,
            doesGdprApply: null,
            consentString: null,
            queryStringObjectCallbacks: [],
            init: function() {
              this.fetchConsentData();
            },
            hasGoSignal: function() {
              return !(
                !(
                  M.isIabContext() &&
                  this.isVendorConsented &&
                  this.doesGdprApply &&
                  "string" == typeof this.consentString &&
                  this.consentString.length
                ) || q.adms.isOptedOut
              );
            },
            fetchConsentData: function(s, e) {
              var n = this,
                t = {};
              "function" != typeof s && (s = function() {}),
                M.instance && M.isIabContext()
                  ? (e && (t.timeout = e),
                    M.instance.execute({
                      command: "iabPlugin.fetchConsentData",
                      params: t,
                      callback: function(e, t) {
                        t === Object(t)
                          ? ((n.doesGdprApply = !!t.gdprApplies),
                            (n.consentString = t.consentString || ""))
                          : ((n.doesGdprApply = !1), (n.consentString = "")),
                          (n.isVendorConsented = M.instance.isApproved(
                            M.instance.Categories.AAM
                          )),
                          e ? s({}) : n.checkQueryStringObject(s),
                          q.adms.waitForMidToReleaseRequests();
                      }
                    }))
                  : s({});
            },
            getQueryString: function() {
              return M.isIabContext()
                ? "gdpr=" +
                    (this.doesGdprApply ? 1 : 0) +
                    "&gdpr_consent=" +
                    this.consentString +
                    "&"
                : "";
            },
            getQueryStringObject: function(e, t) {
              this.fetchConsentData(e, t);
            },
            checkQueryStringObject: function(e) {
              V.hasGoSignal() &&
                "function" == typeof e &&
                e({
                  gdpr: this.doesGdprApply ? 1 : 0,
                  gdpr_consent: this.consentString
                });
            }
          }));
      (b.iab = x),
        "error" === I &&
          0 === r &&
          window.addEventListener("load", function() {
            DIL.windowLoaded = !0;
          });
      var N = !1,
        U = function() {
          N || ((N = !0), C.registerRequest(), F());
        },
        F = function() {
          setTimeout(function() {
            l ||
              C.firstRequestHasFired ||
              ("function" == typeof h
                ? R.afterResult(h).submit(!0)
                : R.submit(!0));
          }, DIL.constants.TIME_TO_DEFAULT_REQUEST);
        },
        Q = document;
      "error" !== I &&
        (DIL.windowLoaded
          ? U()
          : "complete" !== Q.readyState && "loaded" !== Q.readyState
          ? window.addEventListener("load", function() {
              (DIL.windowLoaded = !0), U();
            })
          : ((DIL.windowLoaded = !0), U())),
        C.declaredId.setDeclaredId(n, "init"),
        j.init(),
        x.init(),
        C.processVisitorAPI();
      S.IS_IE_LESS_THAN_10 &&
        E.replaceMethodsWithFunction(R, function() {
          return this;
        }),
        (this.api = R),
        (this.getStuffedVariable = function(e) {
          var t = _.stuffed[e];
          return (
            t ||
              "number" == typeof t ||
              (t = E.getCookie(e)) ||
              "number" == typeof t ||
              (t = ""),
            t
          );
        }),
        (this.validators = T),
        (this.helpers = E),
        (this.constants = S),
        (this.log = y),
        (this.pendingRequest = O),
        (this.requestController = C),
        (this.destinationPublishing = A),
        (this.requestProcs = P),
        (this.units = b),
        v && ((this.variables = _), (this.callWindowLoadFunctions = U));
    }),
    (DIL.extendStaticPropertiesAndMethods = function(e) {
      var t;
      if (e === Object(e)) for (t in e) e.hasOwnProperty(t) && (this[t] = e[t]);
    }),
    DIL.extendStaticPropertiesAndMethods({
      version: "9.1",
      jsonVersion: 1,
      constants: { TIME_TO_DEFAULT_REQUEST: 500 },
      variables: { scriptNodeList: document.getElementsByTagName("script") },
      windowLoaded: !1,
      dils: {},
      isAddedPostWindowLoad: function() {
        var e = arguments[0];
        this.windowLoaded =
          "function" == typeof e ? !!e() : "boolean" != typeof e || e;
      },
      create: function(e) {
        try {
          return new DIL(e);
        } catch (e) {
          throw new Error(
            "Error in attempt to create DIL instance with DIL.create(): " +
              e.message
          );
        }
      },
      registerDil: function(e, t, s) {
        var n = t + "$" + s;
        n in this.dils || (this.dils[n] = e);
      },
      getDil: function(e, t) {
        var s;
        return (
          "string" != typeof e && (e = ""),
          t || (t = 0),
          (s = e + "$" + t) in this.dils
            ? this.dils[s]
            : new Error(
                "The DIL instance with partner = " +
                  e +
                  " and containerNSID = " +
                  t +
                  " was not found"
              )
        );
      },
      dexGetQSVars: function(e, t, s) {
        var n = this.getDil(t, s);
        return n instanceof this ? n.getStuffedVariable(e) : "";
      }
    }),
    (DIL.errorModule =
      ((r = DIL.create({
        partner: "error",
        containerNSID: 0,
        ignoreHardDependencyOnVisitorAPI: !0
      })),
      (o = !(a = {
        harvestererror: 14138,
        destpuberror: 14139,
        dpmerror: 14140,
        generalerror: 14137,
        error: 14137,
        noerrortypedefined: 15021,
        evalerror: 15016,
        rangeerror: 15017,
        referenceerror: 15018,
        typeerror: 15019,
        urierror: 15020
      })),
      {
        activate: function() {
          o = !0;
        },
        handleError: function(e) {
          if (!o) return "DIL error module has not been activated";
          e !== Object(e) && (e = {});
          var t = e.name ? (e.name + "").toLowerCase() : "",
            s = t in a ? a[t] : a.noerrortypedefined,
            n = [],
            i = {
              name: t,
              filename: e.filename ? e.filename + "" : "",
              partner: e.partner ? e.partner + "" : "no_partner",
              site: e.site ? e.site + "" : document.location.href,
              message: e.message ? e.message + "" : ""
            };
          return (
            n.push(s),
            r.api
              .pixels(n)
              .logs(i)
              .useImageRequest()
              .submit(),
            "DIL error report sent"
          );
        },
        pixelMap: a
      })),
    (DIL.tools = {}),
    (DIL.modules = { helpers: {} })),
    window.DIL &&
      DIL.tools &&
      DIL.modules &&
      ((DIL.tools.getMetaTags = function() {
        var e,
          t,
          s,
          n,
          i,
          r = {},
          a = document.getElementsByTagName("meta");
        for (e = 0, s = arguments.length; e < s; e++)
          if (null !== (n = arguments[e]))
            for (t = 0; t < a.length; t++)
              if ((i = a[t]).name === n) {
                r[n] = i.content;
                break;
              }
        return r;
      }),
      (DIL.tools.decomposeURI = function(e) {
        var s,
          t = document.createElement("a");
        return (
          (t.href = e || document.referrer),
          {
            hash: t.hash,
            host: t.host.split(":").shift(),
            hostname: t.hostname,
            href: t.href,
            pathname: t.pathname.replace(/^\//, ""),
            protocol: t.protocol,
            search: t.search,
            uriParams:
              ((s = {}),
              t.search
                .replace(/^(\/|\?)?|\/$/g, "")
                .split("&")
                .map(function(e) {
                  var t = e.split("=");
                  s[t.shift()] = t.shift();
                }),
              s)
          }
        );
      }),
      (DIL.tools.getSearchReferrer = function(e, t) {
        var s = DIL.getDil("error"),
          n = DIL.tools.decomposeURI(e || document.referrer),
          i = "",
          r = "",
          a = {
            DEFAULT: { queryParam: "q" },
            SEARCH_ENGINES: [
              t === Object(t) ? t : {},
              { hostPattern: /aol\./ },
              { hostPattern: /ask\./ },
              { hostPattern: /bing\./ },
              { hostPattern: /google\./ },
              { hostPattern: /yahoo\./, queryParam: "p" }
            ]
          },
          o = a.DEFAULT;
        return (i = a.SEARCH_ENGINES.filter(function(e) {
          return !(
            !e.hasOwnProperty("hostPattern") || !n.hostname.match(e.hostPattern)
          );
        }).shift())
          ? {
              valid: !0,
              name: n.hostname,
              keywords:
                (s.helpers.extendObject(o, i),
                (i = ("" + n.search).match(o.queryPattern)),
                (r = o.queryPattern
                  ? i
                    ? i[1]
                    : ""
                  : n.uriParams[o.queryParam]),
                decodeURIComponent(r || "").replace(/\+|%20/g, " "))
            }
          : { valid: !1, name: "", keywords: "" };
      }),
      (DIL.modules.GA = t),
      (DIL.modules.siteCatalyst = s),
      (DIL.modules.helpers.handleModuleError = e));
})();
