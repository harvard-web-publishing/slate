function createCommonjsModule(fn, module) {
  return (module = { exports: {} }), fn(module, module.exports), module.exports;
}
function openModal(modalID, trigger) {
  var modal, useBk, body;
  if (window.siteHasOpenModal) return !1;
  window.siteHasOpenModal = !0;
  modal = document.getElementById(modalID);
  modal.classList.add(modalOpenClass);
  modal.setAttribute("aria-modal", !0);
  modal.setAttribute("aria-hidden", !1);
  closeOpenModal = closeModal.bind(null, modalID, undefined, 400);
  useBk = modal.getAttribute("data-modalbk");
  useBk &&
    (document.body.appendChild(modalBkEl),
    modalBkEl.addEventListener("click", closeOpenModal),
    setTimeout(function () {
      modalBkEl.classList.add("is-on");
    }, 50));
  setTimeout(function () {
    modal.classList.add(modalAnimateClass);
  }, 1);
  body = document.getElementsByTagName("body")[0];
  body.classList.add("is-locked");
  body.classList.add("".concat(modalID, "--open"));
  trigger.classList.add(modalReturnFocus);
  focusableEls = modal.querySelectorAll(
    'button, [href], input, select, textarea, iframe, [tabindex]:not([tabindex="-1"])'
  );
  firstFocusableEl = focusableEls[0];
  lastFocusableEl = focusableEls[focusableEls.length - 1];
  firstFocusableEl.focus();
}
function closeModal(modalID, btn) {
  var closeDelay =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0,
    modal = document.getElementById(modalID),
    delay =
      btn !== undefined && btn.getAttribute("data-modalclosedelay")
        ? btn.getAttribute("data-modalclosedelay")
        : closeDelay,
    returnFocus,
    body,
    useBk,
    timeout;
  modal.classList.remove(modalAnimateClass);
  modal.setAttribute("aria-modal", !1);
  modal.setAttribute("aria-hidden", !0);
  returnFocus = document.getElementsByClassName(modalReturnFocus)[0];
  returnFocus.focus();
  returnFocus.classList.remove(modalReturnFocus);
  window.siteHasOpenModal = !1;
  body = document.getElementsByTagName("body")[0];
  body.classList.remove("is-locked");
  body.classList.remove("".concat(modalID, "--open"));
  setTimeout(function () {
    modal.classList.remove(modalOpenClass);
  }, delay);
  useBk = modal.getAttribute("data-modalbk");
  useBk &&
    (modalBkEl.classList.remove("is-on"),
    (timeout = modal.classList.contains(modalNoAnimationClass)
      ? 0
      : bkTransitionTime),
    setTimeout(function () {
      modalBkEl.parentNode.removeChild(modalBkEl);
    }, timeout));
  closeOpenModal && modalBkEl.removeEventListener("click", closeOpenModal);
}
function keydownModal(e) {
  if (!window.siteHasOpenModal) return !1;
  var modal = document.getElementsByClassName(
    "".concat(modalClass, " ").concat(modalOpenClass)
  )[0];
  if (e.keyCode === 27) {
    if (closeOpenModal) {
      closeOpenModal();
      return;
    }
    closeModal(modal.getAttribute("id"));
  } else
    (e.key === "Tab" || e.keyCode === 9) &&
      (e.shiftKey
        ? document.activeElement === firstFocusableEl &&
          (lastFocusableEl.focus(), e.preventDefault())
        : document.activeElement === lastFocusableEl &&
          (firstFocusableEl.focus(), e.preventDefault()));
}
function getCookie(name) {
  var v = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
  return v ? v[2] : null;
}
function setCookie(name, value, days) {
  var d = new Date();
  d.setTime(d.getTime() + 864e5 * days);
  document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}
function initTestMarkup() {
  var activeControl = !1,
    emptyClass = "empty-item",
    newBtn,
    newPanel,
    statusUpdateModal,
    updateSection,
    updateSectionChild;
  if (
    (document
      .querySelectorAll("ul.panel-anchors__list")
      .forEach(function (nav) {
        var activeItems = 0;
        if (
          (nav.querySelectorAll("a").forEach(function (link) {
            var anchorString = link.getAttribute("href").replace("#", ""),
              section = document.getElementById(anchorString),
              childSection,
              txt;
            section
              ? ((childSection = section.querySelector(
                  ".status-panel__section"
                )),
                childSection.firstElementChild
                  ? activeItems++
                  : (link.classList.add(emptyClass),
                    section.classList.add(emptyClass)))
              : (link.closest("li").classList.add(emptyClass),
                (txt = link.textContent),
                console.log(
                  'The "'
                    .concat(
                      txt.trim(),
                      '" link requires a section with an id of '
                    )
                    .concat(anchorString)
                ));
          }),
          activeItems === 0)
        ) {
          var parentPanel = nav.closest(".status-tabs__panel"),
            controlID = parentPanel.getAttribute("aria-labelledby"),
            control = document.getElementById(controlID);
          parentPanel.classList.add(emptyClass);
          control.classList.add(emptyClass);
          parentPanel.classList.contains("is-active-panel") &&
            ((activeControl = control),
            parentPanel.classList.remove("is-active-panel"),
            control.classList.remove("is-active-tab"),
            control.setAttribute("aria-selected", "false"));
        }
      }),
    activeControl)
  ) {
    var newIndex = !1,
      btns = document.querySelectorAll(".status-tabs__button"),
      panels = document.querySelectorAll(".status-tabs__panel");
    btns.forEach(function (btn, idx) {
      btn === activeControl && (newIndex = idx + 1);
    });
    newBtn = btns[newIndex];
    newPanel = panels[newIndex];
    newBtn.classList.add("is-active-tab");
    newBtn.setAttribute("aria-selected", "true");
    newPanel.classList.add("is-active-panel");
  }
  statusUpdateModal = document.getElementById("modal-status-update-modal");
  statusUpdateModal &&
    ((updateSection = document.getElementById("view-status-update")),
    updateSection
      ? ((updateSectionChild = updateSection.querySelector(
          ".status-panel__section"
        )),
        updateSectionChild.firstElementChild
          ? getCookie("hvdStatusUpdateShown")
            ? statusUpdateModal.parentNode.removeChild(statusUpdateModal)
            : (setCookie("hvdStatusUpdateShown", "true", 365),
              statusUpdateModal.setAttribute("data-modalonload", "true"))
          : statusUpdateModal.parentNode.removeChild(statusUpdateModal))
      : statusUpdateModal.parentNode.removeChild(statusUpdateModal));
  document.body.classList.add("markup-ready");
}
function handleFirstTab(e) {
  e.keyCode === 9 &&
    (document.body.classList.add("u-keyboard-user"),
    window.removeEventListener("keydown", handleFirstTab));
}
function handleFormElement(formEl) {
  var addClass =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : !1,
    addEvents =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : !1,
    isSelect =
      arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : !1,
    wrapper = document.createElement("div"),
    wrapperInner = document.createElement("div");
  wrapper.classList.add(FORM_EL_BASECLASS);
  wrapperInner.classList.add(FORM_EL_BASECLASS + "__inner");
  addClass &&
    Array.isArray(addClass) &&
    addClass.forEach(function (name) {
      wrapper.classList.add(name);
    });
  formEl.parentNode.insertBefore(wrapper, formEl);
  wrapperInner.appendChild(formEl);
  wrapper.appendChild(wrapperInner);
  addEvents &&
    (formEl.addEventListener("focus", function () {
      wrapper.classList.add(FORM_EL_FOCUS_CLASS);
    }),
    formEl.addEventListener("blur", function () {
      wrapper.classList.remove(FORM_EL_FOCUS_CLASS);
      formEl.value
        ? wrapper.classList.add(FORM_EL_VAL_CLASS)
        : wrapper.classList.remove(FORM_EL_VAL_CLASS);
    }),
    formEl.addEventListener("change", function () {
      isSelect &&
        (formEl.value !== ""
          ? wrapper.classList.add(FORM_EL_VAL_CLASS)
          : wrapper.classList.remove(FORM_EL_VAL_CLASS));
    }));
}
function handleForm(form) {
  var inputs = form.querySelectorAll("input"),
    selects,
    buttons;
  inputs &&
    [].forEach.call(inputs, function (input) {
      var inputClass = ["".concat(FORM_EL_BASECLASS, "__input")];
      input.getAttribute("type") &&
        inputClass.push(
          ""
            .concat(FORM_EL_BASECLASS, "__input--")
            .concat(input.getAttribute("type"))
        );
      handleFormElement(input, inputClass, !0);
    });
  selects = form.querySelectorAll("select");
  selects &&
    [].forEach.call(selects, function (select) {
      handleFormElement(
        select,
        ["".concat(FORM_EL_BASECLASS, "__select")],
        !0,
        !0
      );
    });
  buttons = form.querySelectorAll("button");
  buttons &&
    [].forEach.call(buttons, function (button) {
      var buttonClass = ["".concat(FORM_EL_BASECLASS, "__button")];
      button.getAttribute("type") &&
        buttonClass.push(
          ""
            .concat(FORM_EL_BASECLASS, "__button--")
            .concat(button.getAttribute("type"))
        );
      handleFormElement(button, buttonClass);
    });
}
function initSiteDefaults() {
  window.addEventListener("keydown", handleFirstTab);
  var forms = document.querySelectorAll("form");
  forms &&
    [].forEach.call(forms, function (form) {
      handleForm(form);
    });
}
function sizeControlButtons() {
  document.querySelectorAll(".status-tabs__button").forEach(function (btn) {
    btn.style.width = "auto";
    btn.style.fontWeight = "600";
    btn.style.width = btn.offsetWidth + 3 + "px";
    btn.style.fontWeight = null;
  });
}
function focusFirstTab(tabGroup) {
  tabGroup.isAutoOpen
    ? activateTab(tabGroup.querySelector('[role="tab"]'), tabGroup, !0)
    : tabGroup.querySelector('[role="tab"]').focus();
}
function focusLastTab(tabGroup) {
  tabGroup.isAutoOpen
    ? activateTab(
        tabGroup.querySelector('[role="tab"]:last-child'),
        tabGroup,
        !0
      )
    : tabGroup.querySelector('[role="tab"]:last-child').focus();
}
function handleTabOnArrowPress(event, tabGroup) {
  var pressed = event.keyCode,
    target,
    tabs;
  DIRECTION[pressed] &&
    ((target = event.target),
    (tabs = tabGroup.querySelectorAll('[role="tab"]')),
    target.index !== undefined &&
      (tabs[target.index + DIRECTION[pressed]]
        ? tabGroup.isAutoOpen
          ? activateTab(tabs[target.index + DIRECTION[pressed]], tabGroup, !0)
          : tabs[target.index + DIRECTION[pressed]].focus()
        : pressed === KEYED.left || pressed === KEYED.up
        ? focusLastTab(tabGroup)
        : (pressed === KEYED.right || pressed == KEYED.down) &&
          focusFirstTab(tabGroup)));
}
function handleOrientation(event, tabGroup) {
  var key = event.keyCode,
    proceed = !1;
  tabGroup.isVertical
    ? (key === KEYED.up || key === KEYED.down) &&
      (event.preventDefault(), (proceed = !0))
    : (key === KEYED.left || key === KEYED.right) && (proceed = !0);
  proceed && handleTabOnArrowPress(event, tabGroup);
}
function activateTab(tab, tabGroup) {
  var setFocus =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : !0,
    tabID = tab.getAttribute("id"),
    controls = tab.getAttribute("aria-controls"),
    controlEl = document.getElementById(controls),
    fillerBar;
  deactivateTabGroup(tabGroup, tabID, controls);
  tab.removeAttribute("tabindex");
  tab.setAttribute("aria-selected", "true");
  tab.classList.add("is-active-tab");
  controlEl.removeAttribute("hidden");
  controlEl.classList.add("is-active-panel");
  setFocus && tab.focus();
  fillerBar = document.getElementById("js-status-bar--filler");
  fillerBar.getBoundingClientRect().top <= 0 &&
    window.scrollTo(0, fillerBar.offsetTop + 1);
}
function deactivateTabGroup(tabGroup) {
  var omitTabID =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : !1,
    omitPanelID =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : !1,
    allTabs,
    allPanels;
  allTabs = omitTabID
    ? tabGroup.querySelectorAll('[role="tab"]:not(#'.concat(omitTabID, ")"))
    : tabGroup.querySelectorAll('[role="tab"]');
  allPanels = omitPanelID
    ? tabGroup.querySelectorAll(
        '[role="tabpanel"]:not(#'.concat(omitPanelID, ")")
      )
    : tabGroup.querySelectorAll('[role="tabpanel"]');
  [].forEach.call(allTabs, function (tab) {
    tab.setAttribute("tabindex", "-1");
    tab.setAttribute("aria-selected", "false");
    tab.classList.remove("is-active-tab");
  });
  [].forEach.call(allPanels, function (panel) {
    panel.classList.remove("is-active-panel");
    panel.setAttribute("hidden", "hidden");
  });
}
function handleKeydown(event, tabGroup) {
  var key = event.keyCode;
  switch (key) {
    case KEYED.end:
      event.preventDefault();
      focusLastTab(tabGroup);
      break;
    case KEYED.home:
      event.preventDefault();
      focusFirstTab(tabGroup);
      break;
    case KEYED.up:
    case KEYED.down:
      handleOrientation(event, tabGroup);
  }
}
function handleKeyup(event, tabGroup) {
  var key = event.keyCode;
  switch (key) {
    case KEYED.left:
    case KEYED.right:
      handleOrientation(event, tabGroup);
      break;
    case KEYED.enter:
    case KEYED.space:
      activateTab(event.target, tabGroup);
  }
}
function handleFixedHeight(tabGroup) {
  var panels = tabGroup.querySelectorAll('[role="tabpanel"]'),
    wrapper,
    panelHeights;
  wrapper = tabGroup.isVertical
    ? tabGroup
    : tabGroup.querySelector(".js-tab-panels");
  wrapper.style.height = "auto";
  panelHeights = [];
  [].forEach.call(panels, function (panel) {
    var wasHidden = !1;
    panel.hidden && ((wasHidden = !0), (panel.hidden = !1));
    panelHeights.push(panel.offsetHeight);
    panel.hidden = wasHidden;
  });
  tabGroup.isVertical &&
    panelHeights.push(tabGroup.querySelector(".js-tab-controls").offsetHeight);
  wrapper.style.height = Math.max.apply(Math, panelHeights) + "px";
}
function handleTabGroup(tabGroup) {
  var tabs = tabGroup.querySelectorAll('[role="tab"]');
  [].forEach.call(tabs, function (tab, idx) {
    tab.index = idx;
    tab.addEventListener("click", function () {
      activateTab(tab, tabGroup, !1);
    });
    tab.addEventListener("keydown", function () {
      handleKeydown(event, tabGroup);
    });
    tab.addEventListener("keyup", function () {
      handleKeyup(event, tabGroup);
    });
  });
}
function initTabs() {
  var tabGroups = document.querySelectorAll(".js-tab-group");
  if (tabGroups.length === 0) return !1;
  sizeControlButtons();
  window.addEventListener("resize", function () {
    sizeControlButtons();
  });
  [].forEach.call(tabGroups, function (tabGroup) {
    var tablist = tabGroup.querySelector('[role="tablist"]');
    tabGroup.isVertical =
      tablist.getAttribute("aria-orientation") == "vertical";
    tabGroup.isAutoOpen = tabGroup.getAttribute("data-automatic") == "true";
    tabGroup.getAttribute("data-fixheight") == "true" &&
      (handleFixedHeight(tabGroup),
      window.addEventListener("resize", function () {
        handleFixedHeight(tabGroup);
      }));
    handleTabGroup(tabGroup);
  });
}
function fixTabBar() {
  var tabBarPos = TABS_BAR.getBoundingClientRect();
  TABS_BAR.classList.add(FIX_CLASS);
  TABS_BAR_FILLER.style.height = tabBarPos.height + "px";
  TABS_BAR_FILLER.classList.add(FILLER_READY_CLASS);
  document.body.classList.add(FIX_CLASS);
}
function unfixTabBar() {
  TABS_BAR.classList.remove(FIX_CLASS);
  TABS_BAR_FILLER.style.height = 0;
  TABS_BAR_FILLER.classList.remove(FILLER_READY_CLASS);
  document.body.classList.remove(FIX_CLASS);
}
function testTabsBar() {
  var tabBarFillerPos = TABS_BAR_FILLER.getBoundingClientRect().top;
  return tabBarFillerPos >= 0
    ? (unfixTabBar(), !1)
    : tabBarFillerPos < 0
    ? (fixTabBar(), !1)
    : !1;
}
function initStickyTabsBar() {
  testTabsBar();
  window.addEventListener(
    "scroll",
    function () {
      SCROLL_TIMEOUT && window.cancelAnimationFrame(SCROLL_TIMEOUT);
      SCROLL_TIMEOUT = window.requestAnimationFrame(function () {
        testTabsBar();
      });
    },
    !1
  );
}
function initNavWatcher() {
  if (document.querySelector(".js-nav-watch--section")) {
    var scroller = scrollama();
    scroller
      .setup({ step: ".js-nav-watch--section" })
      .onStepEnter(function (data) {
        window.smoothAnchorJumping ||
          $(".js-nav-watch--item")
            .removeClass("selected")
            .addClass("has-selected")
            .eq(data.index)
            .addClass("selected");
      });
    $(".js-nav-watch--anchor").on("jumped", function (e) {
      $(".js-nav-watch--item").removeClass("selected").addClass("has-selected");
      $(e.target).closest(".js-nav-watch--item").addClass("selected");
    });
  }
}
function initSmoothAnchors() {
  window.smoothAnchorJumping = !1;
  var anchors = document.querySelectorAll(".js-smooth-anchor");
  [].forEach.call(anchors, function (anchor) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      var url = anchor.getAttribute("href"),
        el = url.substring(url.indexOf("#") + 1),
        customOffset = anchor.getAttribute("data-jumpoffset")
          ? anchor.getAttribute("data-jumpoffset")
          : "-50";
      customOffset = parseInt(customOffset);
      window.smoothAnchorJumping = !0;
      jump("#".concat(el), {
        duration: 600,
        offset: customOffset,
        a11y: !0,
        easing: easeInOutQuad,
        callback: function () {
          window.smoothAnchorJumping = !1;
          anchor.dispatchEvent(new Event("jumped"));
        },
      });
    });
  });
}
function accordionOpen(btn, panel) {
  var label = btn.getAttribute("aria-label");
  btn.classList.add(config.openClass);
  panel.classList.add(config.openClass);
  setTimeout(function () {
    panel.classList.add(config.animateClass);
  }, 1);
  btn.setAttribute("aria-expanded", "true");
  panel.setAttribute("aria-hidden", "false");
  label === "Open navigation" &&
    btn.setAttribute("aria-label", "Close navigation");
}
function accordionClose(btn, panel) {
  var label = btn.getAttribute("aria-label");
  btn.classList.remove(config.openClass);
  panel.classList.remove(config.animateClass);
  btn !== undefined && btn.getAttribute("data-closedelay")
    ? setTimeout(function () {
        panel.classList.remove(config.openClass);
      }, btn.getAttribute("data-closedelay"))
    : setTimeout(function () {
        panel.classList.remove(config.openClass);
      }, config.defaultDelay);
  btn.setAttribute("aria-expanded", "false");
  panel.setAttribute("aria-hidden", "true");
  label === "Close navigation" &&
    btn.setAttribute("aria-label", "Open navigation");
}
function accordionInit() {
  var accordionButtons = document.getElementsByClassName(config.toggleClass);
  [].forEach.call(accordionButtons, function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("data-targetid"),
        panel =
          target === "next" || !target
            ? btn.nextElementSibling
            : document.getElementById(target),
        isOpen = panel.classList.contains(config.openClass);
      isOpen ? accordionClose(btn, panel) : accordionOpen(btn, panel);
    });
  });
}
var commonjsGlobal =
    typeof globalThis != "undefined"
      ? globalThis
      : typeof window != "undefined"
      ? window
      : typeof global != "undefined"
      ? global
      : typeof self != "undefined"
      ? self
      : {},
  O = "object",
  check = function (it) {
    return it && it.Math == Math && it;
  },
  global_1 =
    check(typeof globalThis == O && globalThis) ||
    check(typeof window == O && window) ||
    check(typeof self == O && self) ||
    check(typeof commonjsGlobal == O && commonjsGlobal) ||
    Function("return this")(),
  fails = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return !0;
    }
  },
  descriptors = !fails(function () {
    return (
      Object.defineProperty({}, "a", {
        get: function () {
          return 7;
        },
      }).a != 7
    );
  }),
  nativePropertyIsEnumerable = {}.propertyIsEnumerable,
  getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
  NASHORN_BUG =
    getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1),
  f = NASHORN_BUG
    ? function (V) {
        var descriptor = getOwnPropertyDescriptor(this, V);
        return !!descriptor && descriptor.enumerable;
      }
    : nativePropertyIsEnumerable,
  objectPropertyIsEnumerable = { f: f },
  createPropertyDescriptor = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value,
    };
  },
  toString = {}.toString,
  classofRaw = function (it) {
    return toString.call(it).slice(8, -1);
  },
  split = "".split,
  indexedObject = fails(function () {
    return !Object("z").propertyIsEnumerable(0);
  })
    ? function (it) {
        return classofRaw(it) == "String" ? split.call(it, "") : Object(it);
      }
    : Object,
  requireObjectCoercible = function (it) {
    if (it == undefined) throw TypeError("Can't call method on " + it);
    return it;
  },
  toIndexedObject = function (it) {
    return indexedObject(requireObjectCoercible(it));
  },
  isObject = function (it) {
    return typeof it == "object" ? it !== null : typeof it == "function";
  },
  toPrimitive = function (it, S) {
    if (!isObject(it)) return it;
    var fn, val;
    if (
      (S &&
        typeof (fn = it.toString) == "function" &&
        !isObject((val = fn.call(it)))) ||
      (typeof (fn = it.valueOf) == "function" &&
        !isObject((val = fn.call(it)))) ||
      (!S &&
        typeof (fn = it.toString) == "function" &&
        !isObject((val = fn.call(it))))
    )
      return val;
    throw TypeError("Can't convert object to primitive value");
  },
  hasOwnProperty = {}.hasOwnProperty,
  has = function (it, key) {
    return hasOwnProperty.call(it, key);
  },
  document$1 = global_1.document,
  exist = isObject(document$1) && isObject(document$1.createElement),
  documentCreateElement = function (it) {
    return exist ? document$1.createElement(it) : {};
  },
  ie8DomDefine =
    !descriptors &&
    !fails(function () {
      return (
        Object.defineProperty(documentCreateElement("div"), "a", {
          get: function () {
            return 7;
          },
        }).a != 7
      );
    }),
  nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
  f$1 = descriptors
    ? nativeGetOwnPropertyDescriptor
    : function (O, P) {
        if (((O = toIndexedObject(O)), (P = toPrimitive(P, !0)), ie8DomDefine))
          try {
            return nativeGetOwnPropertyDescriptor(O, P);
          } catch (error) {}
        if (has(O, P))
          return createPropertyDescriptor(
            !objectPropertyIsEnumerable.f.call(O, P),
            O[P]
          );
      },
  objectGetOwnPropertyDescriptor = { f: f$1 },
  anObject = function (it) {
    if (!isObject(it)) throw TypeError(String(it) + " is not an object");
    return it;
  },
  nativeDefineProperty = Object.defineProperty,
  f$2 = descriptors
    ? nativeDefineProperty
    : function (O, P, Attributes) {
        if (
          (anObject(O),
          (P = toPrimitive(P, !0)),
          anObject(Attributes),
          ie8DomDefine)
        )
          try {
            return nativeDefineProperty(O, P, Attributes);
          } catch (error) {}
        if ("get" in Attributes || "set" in Attributes)
          throw TypeError("Accessors not supported");
        return "value" in Attributes && (O[P] = Attributes.value), O;
      },
  objectDefineProperty = { f: f$2 },
  hide = descriptors
    ? function (object, key, value) {
        return objectDefineProperty.f(
          object,
          key,
          createPropertyDescriptor(1, value)
        );
      }
    : function (object, key, value) {
        return (object[key] = value), object;
      },
  setGlobal = function (key, value) {
    try {
      hide(global_1, key, value);
    } catch (error) {
      global_1[key] = value;
    }
    return value;
  },
  shared = createCommonjsModule(function (module) {
    var SHARED = "__core-js_shared__",
      store = global_1[SHARED] || setGlobal(SHARED, {});
    (module.exports = function (key, value) {
      return store[key] || (store[key] = value !== undefined ? value : {});
    })("versions", []).push({
      version: "3.1.3",
      mode: "global",
      copyright: "© 2019 Denis Pushkarev (zloirock.ru)",
    });
  }),
  functionToString = shared("native-function-to-string", Function.toString),
  WeakMap = global_1.WeakMap,
  nativeWeakMap =
    typeof WeakMap == "function" &&
    /native code/.test(functionToString.call(WeakMap)),
  id = 0,
  postfix = Math.random(),
  uid = function (key) {
    return "Symbol(".concat(
      key === undefined ? "" : key,
      ")_",
      (++id + postfix).toString(36)
    );
  },
  keys = shared("keys"),
  sharedKey = function (key) {
    return keys[key] || (keys[key] = uid(key));
  },
  hiddenKeys = {},
  WeakMap$1 = global_1.WeakMap,
  set,
  get,
  has$1,
  enforce = function (it) {
    return has$1(it) ? get(it) : set(it, {});
  },
  getterFor = function (TYPE) {
    return function (it) {
      var state;
      if (!isObject(it) || (state = get(it)).type !== TYPE)
        throw TypeError("Incompatible receiver, " + TYPE + " required");
      return state;
    };
  },
  STATE,
  regexpExec,
  domIterables,
  COLLECTION_NAME,
  Collection,
  CollectionPrototype,
  closeOpenModal,
  modalInit,
  KEYED,
  DIRECTION,
  scrollama,
  $,
  jump,
  easeInOutQuad,
  config;
if (nativeWeakMap) {
  var store = new WeakMap$1(),
    wmget = store.get,
    wmhas = store.has,
    wmset = store.set;
  set = function (it, metadata) {
    return wmset.call(store, it, metadata), metadata;
  };
  get = function (it) {
    return wmget.call(store, it) || {};
  };
  has$1 = function (it) {
    return wmhas.call(store, it);
  };
} else
  (STATE = sharedKey("state")),
    (hiddenKeys[STATE] = !0),
    (set = function (it, metadata) {
      return hide(it, STATE, metadata), metadata;
    }),
    (get = function (it) {
      return has(it, STATE) ? it[STATE] : {};
    }),
    (has$1 = function (it) {
      return has(it, STATE);
    });
var internalState = {
    set: set,
    get: get,
    has: has$1,
    enforce: enforce,
    getterFor: getterFor,
  },
  redefine = createCommonjsModule(function (module) {
    var getInternalState = internalState.get,
      enforceInternalState = internalState.enforce,
      TEMPLATE = String(functionToString).split("toString");
    shared("inspectSource", function (it) {
      return functionToString.call(it);
    });
    (module.exports = function (O, key, value, options) {
      var unsafe = options ? !!options.unsafe : !1,
        simple = options ? !!options.enumerable : !1,
        noTargetGet = options ? !!options.noTargetGet : !1;
      if (
        (typeof value == "function" &&
          (typeof key != "string" ||
            has(value, "name") ||
            hide(value, "name", key),
          (enforceInternalState(value).source = TEMPLATE.join(
            typeof key == "string" ? key : ""
          ))),
        O === global_1)
      ) {
        simple ? (O[key] = value) : setGlobal(key, value);
        return;
      }
      unsafe ? !noTargetGet && O[key] && (simple = !0) : delete O[key];
      simple ? (O[key] = value) : hide(O, key, value);
    })(Function.prototype, "toString", function () {
      return (
        (typeof this == "function" && getInternalState(this).source) ||
        functionToString.call(this)
      );
    });
  }),
  ceil = Math.ceil,
  floor = Math.floor,
  toInteger = function (argument) {
    return isNaN((argument = +argument))
      ? 0
      : (argument > 0 ? floor : ceil)(argument);
  },
  min = Math.min,
  toLength = function (argument) {
    return argument > 0 ? min(toInteger(argument), 9007199254740991) : 0;
  },
  max = Math.max,
  min$1 = Math.min,
  toAbsoluteIndex = function (index, length) {
    var integer = toInteger(index);
    return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
  },
  arrayIncludes = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIndexedObject($this),
        length = toLength(O.length),
        index = toAbsoluteIndex(fromIndex, length),
        value;
      if (IS_INCLUDES && el != el) {
        while (length > index)
          if (((value = O[index++]), value != value)) return !0;
      } else
        for (; length > index; index++)
          if ((IS_INCLUDES || index in O) && O[index] === el)
            return IS_INCLUDES || index || 0;
      return !IS_INCLUDES && -1;
    };
  },
  arrayIndexOf = arrayIncludes(!1),
  objectKeysInternal = function (object, names) {
    var O = toIndexedObject(object),
      i = 0,
      result = [];
    for (var key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
    while (names.length > i)
      has(O, (key = names[i++])) &&
        (~arrayIndexOf(result, key) || result.push(key));
    return result;
  },
  enumBugKeys = [
    "constructor",
    "hasOwnProperty",
    "isPrototypeOf",
    "propertyIsEnumerable",
    "toLocaleString",
    "toString",
    "valueOf",
  ],
  hiddenKeys$1 = enumBugKeys.concat("length", "prototype"),
  f$3 =
    Object.getOwnPropertyNames ||
    function (O) {
      return objectKeysInternal(O, hiddenKeys$1);
    },
  objectGetOwnPropertyNames = { f: f$3 },
  f$4 = Object.getOwnPropertySymbols,
  objectGetOwnPropertySymbols = { f: f$4 },
  Reflect = global_1.Reflect,
  ownKeys =
    (Reflect && Reflect.ownKeys) ||
    function (it) {
      var keys = objectGetOwnPropertyNames.f(anObject(it)),
        getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
      return getOwnPropertySymbols
        ? keys.concat(getOwnPropertySymbols(it))
        : keys;
    },
  copyConstructorProperties = function (target, source) {
    for (
      var key,
        keys = ownKeys(source),
        defineProperty = objectDefineProperty.f,
        getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f,
        i = 0;
      i < keys.length;
      i++
    )
      (key = keys[i]),
        has(target, key) ||
          defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  },
  replacement = /#|\.prototype\./,
  isForced = function (feature, detection) {
    var value = data[normalize(feature)];
    return value == POLYFILL
      ? !0
      : value == NATIVE
      ? !1
      : typeof detection == "function"
      ? fails(detection)
      : !!detection;
  },
  normalize = (isForced.normalize = function (string) {
    return String(string).replace(replacement, ".").toLowerCase();
  }),
  data = (isForced.data = {}),
  NATIVE = (isForced.NATIVE = "N"),
  POLYFILL = (isForced.POLYFILL = "P"),
  isForced_1 = isForced,
  getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f,
  _export = function (options, source) {
    var TARGET = options.target,
      GLOBAL = options.global,
      STATIC = options.stat,
      FORCED,
      target,
      key,
      targetProperty,
      sourceProperty,
      descriptor;
    if (
      ((target = GLOBAL
        ? global_1
        : STATIC
        ? global_1[TARGET] || setGlobal(TARGET, {})
        : (global_1[TARGET] || {}).prototype),
      target)
    )
      for (key in source) {
        if (
          ((sourceProperty = source[key]),
          options.noTargetGet
            ? ((descriptor = getOwnPropertyDescriptor$1(target, key)),
              (targetProperty = descriptor && descriptor.value))
            : (targetProperty = target[key]),
          (FORCED = isForced_1(
            GLOBAL ? key : TARGET + (STATIC ? "." : "#") + key,
            options.forced
          )),
          !FORCED && targetProperty !== undefined)
        ) {
          if (typeof sourceProperty == typeof targetProperty) continue;
          copyConstructorProperties(sourceProperty, targetProperty);
        }
        (options.sham || (targetProperty && targetProperty.sham)) &&
          hide(sourceProperty, "sham", !0);
        redefine(target, key, sourceProperty, options);
      }
  },
  isArray =
    Array.isArray ||
    function (arg) {
      return classofRaw(arg) == "Array";
    },
  toObject = function (argument) {
    return Object(requireObjectCoercible(argument));
  },
  createProperty = function (object, key, value) {
    var propertyKey = toPrimitive(key);
    propertyKey in object
      ? objectDefineProperty.f(
          object,
          propertyKey,
          createPropertyDescriptor(0, value)
        )
      : (object[propertyKey] = value);
  },
  nativeSymbol =
    !!Object.getOwnPropertySymbols &&
    !fails(function () {
      return !String(Symbol());
    }),
  Symbol$1 = global_1.Symbol,
  store$1 = shared("wks"),
  wellKnownSymbol = function (name) {
    return (
      store$1[name] ||
      (store$1[name] =
        (nativeSymbol && Symbol$1[name]) ||
        (nativeSymbol ? Symbol$1 : uid)("Symbol." + name))
    );
  },
  SPECIES = wellKnownSymbol("species"),
  arraySpeciesCreate = function (originalArray, length) {
    var C;
    return (
      isArray(originalArray) &&
        ((C = originalArray.constructor),
        typeof C == "function" && (C === Array || isArray(C.prototype))
          ? (C = undefined)
          : isObject(C) && ((C = C[SPECIES]), C === null && (C = undefined))),
      new (C === undefined ? Array : C)(length === 0 ? 0 : length)
    );
  },
  SPECIES$1 = wellKnownSymbol("species"),
  arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
    return !fails(function () {
      var array = [],
        constructor = (array.constructor = {});
      return (
        (constructor[SPECIES$1] = function () {
          return { foo: 1 };
        }),
        array[METHOD_NAME](Boolean).foo !== 1
      );
    });
  },
  IS_CONCAT_SPREADABLE = wellKnownSymbol("isConcatSpreadable"),
  MAX_SAFE_INTEGER = 9007199254740991,
  MAXIMUM_ALLOWED_INDEX_EXCEEDED = "Maximum allowed index exceeded",
  IS_CONCAT_SPREADABLE_SUPPORT = !fails(function () {
    var array = [];
    return (array[IS_CONCAT_SPREADABLE] = !1), array.concat()[0] !== array;
  }),
  SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("concat"),
  isConcatSpreadable = function (O) {
    if (!isObject(O)) return !1;
    var spreadable = O[IS_CONCAT_SPREADABLE];
    return spreadable !== undefined ? !!spreadable : isArray(O);
  },
  FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;
_export(
  { target: "Array", proto: !0, forced: FORCED },
  {
    concat: function () {
      for (
        var O = toObject(this),
          A = arraySpeciesCreate(O, 0),
          n = 0,
          k,
          len,
          E,
          i = -1,
          length = arguments.length;
        i < length;
        i++
      )
        if (((E = i === -1 ? O : arguments[i]), isConcatSpreadable(E))) {
          if (((len = toLength(E.length)), n + len > MAX_SAFE_INTEGER))
            throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
          for (k = 0; k < len; k++, n++) k in E && createProperty(A, n, E[k]);
        } else {
          if (n >= MAX_SAFE_INTEGER)
            throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
          createProperty(A, n++, E);
        }
      return (A.length = n), A;
    },
  }
);
var aFunction = function (it) {
    if (typeof it != "function")
      throw TypeError(String(it) + " is not a function");
    return it;
  },
  bindContext = function (fn, that, length) {
    if ((aFunction(fn), that === undefined)) return fn;
    switch (length) {
      case 0:
        return function () {
          return fn.call(that);
        };
      case 1:
        return function (a) {
          return fn.call(that, a);
        };
      case 2:
        return function (a, b) {
          return fn.call(that, a, b);
        };
      case 3:
        return function (a, b, c) {
          return fn.call(that, a, b, c);
        };
    }
    return function () {
      return fn.apply(that, arguments);
    };
  },
  arrayMethods = function (TYPE, specificCreate) {
    var IS_MAP = TYPE == 1,
      IS_FILTER = TYPE == 2,
      IS_SOME = TYPE == 3,
      IS_EVERY = TYPE == 4,
      IS_FIND_INDEX = TYPE == 6,
      NO_HOLES = TYPE == 5 || IS_FIND_INDEX,
      create = specificCreate || arraySpeciesCreate;
    return function ($this, callbackfn, that) {
      for (
        var O = toObject($this),
          self = indexedObject(O),
          boundFunction = bindContext(callbackfn, that, 3),
          length = toLength(self.length),
          index = 0,
          target = IS_MAP
            ? create($this, length)
            : IS_FILTER
            ? create($this, 0)
            : undefined,
          value,
          result;
        length > index;
        index++
      )
        if (
          (NO_HOLES || index in self) &&
          ((value = self[index]),
          (result = boundFunction(value, index, O)),
          TYPE)
        )
          if (IS_MAP) target[index] = result;
          else if (result)
            switch (TYPE) {
              case 3:
                return !0;
              case 5:
                return value;
              case 6:
                return index;
              case 2:
                target.push(value);
            }
          else if (IS_EVERY) return !1;
      return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
    };
  },
  sloppyArrayMethod = function (METHOD_NAME, argument) {
    var method = [][METHOD_NAME];
    return (
      !method ||
      !fails(function () {
        method.call(
          null,
          argument ||
            function () {
              throw 1;
            },
          1
        );
      })
    );
  },
  internalForEach = arrayMethods(0),
  SLOPPY_METHOD = sloppyArrayMethod("forEach"),
  arrayForEach = SLOPPY_METHOD
    ? function (callbackfn) {
        return internalForEach(this, callbackfn, arguments[1]);
      }
    : [].forEach;
_export(
  { target: "Array", proto: !0, forced: [].forEach != arrayForEach },
  { forEach: arrayForEach }
);
var DatePrototype = Date.prototype,
  INVALID_DATE = "Invalid Date",
  TO_STRING = "toString",
  nativeDateToString = DatePrototype[TO_STRING],
  getTime = DatePrototype.getTime;
new Date(NaN) + "" != INVALID_DATE &&
  redefine(DatePrototype, TO_STRING, function () {
    var value = getTime.call(this);
    return value === value ? nativeDateToString.call(this) : INVALID_DATE;
  });
var regexpFlags = function () {
    var that = anObject(this),
      result = "";
    return (
      that.global && (result += "g"),
      that.ignoreCase && (result += "i"),
      that.multiline && (result += "m"),
      that.unicode && (result += "u"),
      that.sticky && (result += "y"),
      result
    );
  },
  nativeExec = RegExp.prototype.exec,
  nativeReplace = String.prototype.replace,
  patchedExec = nativeExec,
  UPDATES_LAST_INDEX_WRONG = (function () {
    var re1 = /a/,
      re2 = /b*/g;
    return (
      nativeExec.call(re1, "a"),
      nativeExec.call(re2, "a"),
      re1.lastIndex !== 0 || re2.lastIndex !== 0
    );
  })(),
  NPCG_INCLUDED = /()??/.exec("")[1] !== undefined,
  PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;
PATCH &&
  (patchedExec = function (str) {
    var re = this,
      lastIndex,
      reCopy,
      match,
      i;
    return (
      NPCG_INCLUDED &&
        (reCopy = new RegExp(
          "^" + re.source + "$(?!\\s)",
          regexpFlags.call(re)
        )),
      UPDATES_LAST_INDEX_WRONG && (lastIndex = re.lastIndex),
      (match = nativeExec.call(re, str)),
      UPDATES_LAST_INDEX_WRONG &&
        match &&
        (re.lastIndex = re.global ? match.index + match[0].length : lastIndex),
      NPCG_INCLUDED &&
        match &&
        match.length > 1 &&
        nativeReplace.call(match[0], reCopy, function () {
          for (i = 1; i < arguments.length - 2; i++)
            arguments[i] === undefined && (match[i] = undefined);
        }),
      match
    );
  });
regexpExec = patchedExec;
_export(
  { target: "RegExp", proto: !0, forced: /./.exec !== regexpExec },
  { exec: regexpExec }
);
var SPECIES$2 = wellKnownSymbol("species"),
  REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
    var re = /./;
    return (
      (re.exec = function () {
        var result = [];
        return (result.groups = { a: "7" }), result;
      }),
      "".replace(re, "$<a>") !== "7"
    );
  }),
  SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
    var re = /(?:)/,
      originalExec = re.exec,
      result;
    return (
      (re.exec = function () {
        return originalExec.apply(this, arguments);
      }),
      (result = "ab".split(re)),
      result.length !== 2 || result[0] !== "a" || result[1] !== "b"
    );
  }),
  fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
    var SYMBOL = wellKnownSymbol(KEY),
      DELEGATES_TO_SYMBOL = !fails(function () {
        var O = {};
        return (
          (O[SYMBOL] = function () {
            return 7;
          }),
          ""[KEY](O) != 7
        );
      }),
      DELEGATES_TO_EXEC =
        DELEGATES_TO_SYMBOL &&
        !fails(function () {
          var execCalled = !1,
            re = /a/;
          return (
            (re.exec = function () {
              return (execCalled = !0), null;
            }),
            KEY === "split" &&
              ((re.constructor = {}),
              (re.constructor[SPECIES$2] = function () {
                return re;
              })),
            re[SYMBOL](""),
            !execCalled
          );
        });
    if (
      !DELEGATES_TO_SYMBOL ||
      !DELEGATES_TO_EXEC ||
      (KEY === "replace" && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
      (KEY === "split" && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
    ) {
      var nativeRegExpMethod = /./[SYMBOL],
        methods = exec(
          SYMBOL,
          ""[KEY],
          function (nativeMethod, regexp, str, arg2, forceStringMethod) {
            return regexp.exec === regexpExec
              ? DELEGATES_TO_SYMBOL && !forceStringMethod
                ? {
                    done: !0,
                    value: nativeRegExpMethod.call(regexp, str, arg2),
                  }
                : { done: !0, value: nativeMethod.call(str, regexp, arg2) }
              : { done: !1 };
          }
        ),
        stringMethod = methods[0],
        regexMethod = methods[1];
      redefine(String.prototype, KEY, stringMethod);
      redefine(
        RegExp.prototype,
        SYMBOL,
        length == 2
          ? function (string, arg) {
              return regexMethod.call(string, this, arg);
            }
          : function (string) {
              return regexMethod.call(string, this);
            }
      );
      sham && hide(RegExp.prototype[SYMBOL], "sham", !0);
    }
  },
  stringAt = function (that, pos, CONVERT_TO_STRING) {
    var S = String(requireObjectCoercible(that)),
      position = toInteger(pos),
      size = S.length,
      first,
      second;
    return position < 0 || position >= size
      ? CONVERT_TO_STRING
        ? ""
        : undefined
      : ((first = S.charCodeAt(position)),
        first < 55296 ||
        first > 56319 ||
        position + 1 === size ||
        (second = S.charCodeAt(position + 1)) < 56320 ||
        second > 57343
          ? CONVERT_TO_STRING
            ? S.charAt(position)
            : first
          : CONVERT_TO_STRING
          ? S.slice(position, position + 2)
          : ((first - 55296) << 10) + (second - 56320) + 65536);
  },
  advanceStringIndex = function (S, index, unicode) {
    return index + (unicode ? stringAt(S, index, !0).length : 1);
  },
  regexpExecAbstract = function (R, S) {
    var exec = R.exec,
      result;
    if (typeof exec == "function") {
      if (((result = exec.call(R, S)), typeof result != "object"))
        throw TypeError(
          "RegExp exec method returned something other than an Object or null"
        );
      return result;
    }
    if (classofRaw(R) !== "RegExp")
      throw TypeError("RegExp#exec called on incompatible receiver");
    return regexpExec.call(R, S);
  };
fixRegexpWellKnownSymbolLogic(
  "match",
  1,
  function (MATCH, nativeMatch, maybeCallNative) {
    return [
      function (regexp) {
        var O = requireObjectCoercible(this),
          matcher = regexp == undefined ? undefined : regexp[MATCH];
        return matcher !== undefined
          ? matcher.call(regexp, O)
          : new RegExp(regexp)[MATCH](String(O));
      },
      function (regexp) {
        var res = maybeCallNative(nativeMatch, regexp, this),
          rx,
          S,
          fullUnicode,
          A,
          n,
          result,
          matchStr;
        if (res.done) return res.value;
        if (((rx = anObject(regexp)), (S = String(this)), !rx.global))
          return regexpExecAbstract(rx, S);
        for (
          fullUnicode = rx.unicode, rx.lastIndex = 0, A = [], n = 0;
          (result = regexpExecAbstract(rx, S)) !== null;

        )
          (matchStr = String(result[0])),
            (A[n] = matchStr),
            matchStr === "" &&
              (rx.lastIndex = advanceStringIndex(
                S,
                toLength(rx.lastIndex),
                fullUnicode
              )),
            n++;
        return n === 0 ? null : A;
      },
    ];
  }
);
var max$1 = Math.max,
  min$2 = Math.min,
  floor$1 = Math.floor,
  SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g,
  SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g,
  maybeToString = function (it) {
    return it === undefined ? it : String(it);
  };
fixRegexpWellKnownSymbolLogic(
  "replace",
  2,
  function (REPLACE, nativeReplace, maybeCallNative) {
    function getSubstitution(
      matched,
      str,
      position,
      captures,
      namedCaptures,
      replacement
    ) {
      var tailPos = position + matched.length,
        m = captures.length,
        symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
      return (
        namedCaptures !== undefined &&
          ((namedCaptures = toObject(namedCaptures)),
          (symbols = SUBSTITUTION_SYMBOLS)),
        nativeReplace.call(replacement, symbols, function (match, ch) {
          var capture, n, f;
          switch (ch.charAt(0)) {
            case "$":
              return "$";
            case "&":
              return matched;
            case "`":
              return str.slice(0, position);
            case "'":
              return str.slice(tailPos);
            case "<":
              capture = namedCaptures[ch.slice(1, -1)];
              break;
            default:
              if (((n = +ch), n === 0)) return match;
              if (n > m)
                return ((f = floor$1(n / 10)), f === 0)
                  ? match
                  : f <= m
                  ? captures[f - 1] === undefined
                    ? ch.charAt(1)
                    : captures[f - 1] + ch.charAt(1)
                  : match;
              capture = captures[n - 1];
          }
          return capture === undefined ? "" : capture;
        })
      );
    }
    return [
      function (searchValue, replaceValue) {
        var O = requireObjectCoercible(this),
          replacer =
            searchValue == undefined ? undefined : searchValue[REPLACE];
        return replacer !== undefined
          ? replacer.call(searchValue, O, replaceValue)
          : nativeReplace.call(String(O), searchValue, replaceValue);
      },
      function (regexp, replaceValue) {
        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue),
          global,
          fullUnicode,
          results,
          result,
          matchStr,
          accumulatedResult,
          nextSourcePosition,
          i,
          j,
          namedCaptures,
          replacerArgs,
          replacement;
        if (res.done) return res.value;
        var rx = anObject(regexp),
          S = String(this),
          functionalReplace = typeof replaceValue == "function";
        for (
          functionalReplace || (replaceValue = String(replaceValue)),
            global = rx.global,
            global && ((fullUnicode = rx.unicode), (rx.lastIndex = 0)),
            results = [];
          ;

        ) {
          if (((result = regexpExecAbstract(rx, S)), result === null)) break;
          if ((results.push(result), !global)) break;
          matchStr = String(result[0]);
          matchStr === "" &&
            (rx.lastIndex = advanceStringIndex(
              S,
              toLength(rx.lastIndex),
              fullUnicode
            ));
        }
        for (
          accumulatedResult = "", nextSourcePosition = 0, i = 0;
          i < results.length;
          i++
        ) {
          result = results[i];
          var matched = String(result[0]),
            position = max$1(min$2(toInteger(result.index), S.length), 0),
            captures = [];
          for (j = 1; j < result.length; j++)
            captures.push(maybeToString(result[j]));
          namedCaptures = result.groups;
          functionalReplace
            ? ((replacerArgs = [matched].concat(captures, position, S)),
              namedCaptures !== undefined && replacerArgs.push(namedCaptures),
              (replacement = String(
                replaceValue.apply(undefined, replacerArgs)
              )))
            : (replacement = getSubstitution(
                matched,
                S,
                position,
                captures,
                namedCaptures,
                replaceValue
              ));
          position >= nextSourcePosition &&
            ((accumulatedResult +=
              S.slice(nextSourcePosition, position) + replacement),
            (nextSourcePosition = position + matched.length));
        }
        return accumulatedResult + S.slice(nextSourcePosition);
      },
    ];
  }
);
var whitespaces = "\t\n\x0b\f\r                　\u2028\u2029﻿",
  whitespace = "[" + whitespaces + "]",
  ltrim = RegExp("^" + whitespace + whitespace + "*"),
  rtrim = RegExp(whitespace + whitespace + "*$"),
  stringTrim = function (string, TYPE) {
    return (
      (string = String(requireObjectCoercible(string))),
      TYPE & 1 && (string = string.replace(ltrim, "")),
      TYPE & 2 && (string = string.replace(rtrim, "")),
      string
    );
  },
  non = "​᠎",
  forcedStringTrimMethod = function (METHOD_NAME) {
    return fails(function () {
      return (
        !!whitespaces[METHOD_NAME]() ||
        non[METHOD_NAME]() != non ||
        whitespaces[METHOD_NAME].name !== METHOD_NAME
      );
    });
  },
  FORCED$1 = forcedStringTrimMethod("trim");
_export(
  { target: "String", proto: !0, forced: FORCED$1 },
  {
    trim: function () {
      return stringTrim(this, 3);
    },
  }
);
domIterables = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0,
};
for (COLLECTION_NAME in domIterables)
  if (
    ((Collection = global_1[COLLECTION_NAME]),
    (CollectionPrototype = Collection && Collection.prototype),
    CollectionPrototype && CollectionPrototype.forEach !== arrayForEach)
  )
    try {
      hide(CollectionPrototype, "forEach", arrayForEach);
    } catch (error) {
      CollectionPrototype.forEach = arrayForEach;
    }
var modalClass = "modal",
  modalOpenClass = "modal--is-open",
  modalAnimateClass = "modal--is-ready",
  modalReturnFocus = "modal--will-focus",
  modalToggleClass = "js-modal-toggle",
  modalNoAnimationClass = "modal--no-animation",
  bkTransitionTime = 400,
  focusableEls = null,
  firstFocusableEl = null,
  lastFocusableEl = null,
  modalBkEl = document.createElement("div");
modalBkEl.classList.add("modal__bk-screen");
window.siteHasOpenModal = !1;
modalInit = function () {
  var modals = document.querySelectorAll(".".concat(modalClass)),
    modalButtons;
  [].forEach.call(modals, function (modalEl) {
    if (
      (document.body.appendChild(modalEl),
      modalEl.getAttribute("data-modalonload"))
    ) {
      var logo = document.querySelector(".c_m-site-header__logo");
      openModal(modalEl.getAttribute("id"), logo);
    }
  });
  modalButtons = document.getElementsByClassName(modalToggleClass);
  [].forEach.call(modalButtons, function (btn) {
    btn.addEventListener("click", function () {
      var modalID = btn.dataset.modalid,
        modal = document.getElementById(modalID);
      if (modal == null) return !1;
      modal.classList.contains(modalOpenClass)
        ? closeModal(modalID, btn)
        : openModal(modalID, btn);
    });
  });
  window.addEventListener("keydown", keydownModal, !0);
};
var FORM_EL_BASECLASS = "form-element",
  FORM_EL_VAL_CLASS = FORM_EL_BASECLASS + "--has-value",
  FORM_EL_FOCUS_CLASS = FORM_EL_BASECLASS + "--focused";
KEYED = {
  end: 35,
  home: 36,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  delete: 46,
  enter: 13,
  space: 32,
};
DIRECTION = { 37: -1, 38: -1, 39: 1, 40: 1 };
var TABS_BAR = document.getElementById("js-status-tabs-bar"),
  TABS_BAR_FILLER = document.getElementById("js-status-bar--filler"),
  FIX_CLASS = "status-tabs--fixed",
  FILLER_READY_CLASS = "status-filler--set",
  SCROLL_TIMEOUT;
scrollama = createCommonjsModule(function (module) {
  (function (global, factory) {
    module.exports = factory();
  })(commonjsGlobal, function () {
    function selectionToArray(selection) {
      for (var len = selection.length, result = [], i = 0; i < len; i += 1)
        result.push(selection[i]);
      return result;
    }
    function selectAll(selector, parent) {
      return (parent === void 0 && (parent = document),
      typeof selector == "string")
        ? selectionToArray(parent.querySelectorAll(selector))
        : selector instanceof Element
        ? selectionToArray([selector])
        : selector instanceof NodeList
        ? selectionToArray(selector)
        : selector instanceof Array
        ? selector
        : [];
    }
    function getStepId(ref) {
      var id = ref.id,
        i = ref.i;
      return "scrollama__debug-step--" + id + "-" + i;
    }
    function getOffsetId(ref) {
      var id = ref.id;
      return "scrollama__debug-offset--" + id;
    }
    function setupOffset(ref) {
      var id = ref.id,
        offsetVal = ref.offsetVal,
        stepClass = ref.stepClass,
        el = document.createElement("div"),
        text;
      el.setAttribute("id", getOffsetId({ id: id }));
      el.setAttribute("class", "scrollama__debug-offset");
      el.style.position = "fixed";
      el.style.left = "0";
      el.style.width = "100%";
      el.style.height = "0px";
      el.style.borderTop = "2px dashed black";
      el.style.zIndex = "9999";
      text = document.createElement("p");
      text.innerText = '".' + stepClass + '" trigger: ' + offsetVal;
      text.style.fontSize = "12px";
      text.style.fontFamily = "monospace";
      text.style.color = "black";
      text.style.margin = "0";
      text.style.padding = "6px";
      el.appendChild(text);
      document.body.appendChild(el);
    }
    function setup(ref) {
      var id = ref.id,
        offsetVal = ref.offsetVal,
        stepEl = ref.stepEl,
        stepClass = stepEl[0].getAttribute("class");
      setupOffset({ id: id, offsetVal: offsetVal, stepClass: stepClass });
    }
    function updateOffset(ref) {
      var id = ref.id,
        offsetMargin = ref.offsetMargin,
        offsetVal = ref.offsetVal,
        idVal = getOffsetId({ id: id }),
        el = document.querySelector("#" + idVal);
      el.style.top = offsetMargin + "px";
    }
    function update(ref) {
      var id = ref.id,
        stepOffsetHeight = ref.stepOffsetHeight,
        offsetMargin = ref.offsetMargin,
        offsetVal = ref.offsetVal;
      updateOffset({ id: id, offsetMargin: offsetMargin });
    }
    function notifyStep(ref) {
      var id = ref.id,
        index = ref.index,
        state = ref.state,
        idVal = getStepId({ id: id, i: index }),
        elA = document.querySelector("#" + idVal + "_above"),
        elB = document.querySelector("#" + idVal + "_below"),
        display = state === "enter" ? "block" : "none";
      elA && (elA.style.display = display);
      elB && (elB.style.display = display);
    }
    function scrollama() {
      function generateInstanceID() {
        var a = "abcdefghijklmnopqrstuv",
          l = a.length,
          t = Date.now(),
          r = [0, 0, 0]
            .map(function () {
              return a[Math.floor(Math.random() * l)];
            })
            .join("");
        return "" + r + t;
      }
      function getOffsetTop(el) {
        var distance = 0;
        if (el.offsetParent)
          do (distance += el.offsetTop), (el = el.offsetParent);
          while (el);
        return distance < 0 ? 0 : distance;
      }
      function getPageHeight() {
        var body = document.body,
          html = document.documentElement;
        return Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight,
          html.scrollHeight,
          html.offsetHeight
        );
      }
      function getIndex(element) {
        return +element.getAttribute("data-scrollama-index");
      }
      function updateDirection() {
        window.pageYOffset > previousYOffset
          ? (direction = "down")
          : window.pageYOffset < previousYOffset && (direction = "up");
        previousYOffset = window.pageYOffset;
      }
      function disconnectObserver(name) {
        io[name] &&
          io[name].forEach(function (d) {
            return d.disconnect();
          });
      }
      function handleResize() {
        viewH = window.innerHeight;
        pageH = getPageHeight();
        offsetMargin = offsetVal * viewH;
        isReady &&
          ((stepOffsetHeight = stepEl.map(function (el) {
            return el.offsetHeight;
          })),
          (stepOffsetTop = stepEl.map(getOffsetTop)),
          isEnabled && updateIO());
        isDebug &&
          update({
            id: id,
            stepOffsetHeight: stepOffsetHeight,
            offsetMargin: offsetMargin,
            offsetVal: offsetVal,
          });
      }
      function handleEnable(enable) {
        if (enable && !isEnabled)
          return isReady && updateIO(), (isEnabled = !0), !0;
        OBSERVER_NAMES.forEach(disconnectObserver);
        isEnabled = !1;
      }
      function createThreshold(height) {
        for (
          var count = Math.ceil(height / progressThreshold),
            t = [],
            ratio = 1 / count,
            i = 0;
          i < count;
          i++
        )
          t.push(i * ratio);
        return t;
      }
      function notifyStepProgress(element, progress) {
        var index = getIndex(element),
          resp;
        progress !== undefined && (stepStates[index].progress = progress);
        resp = {
          element: element,
          index: index,
          progress: stepStates[index].progress,
        };
        stepStates[index].state === "enter" && cb.stepProgress(resp);
      }
      function notifyOthers(index, location) {
        var i, ss, i$1, ss$1;
        if (location === "above")
          for (i = 0; i < index; i++)
            (ss = stepStates[i]),
              ss.state !== "enter" && ss.direction !== "down"
                ? (notifyStepEnter(stepEl[i], "down", !1),
                  notifyStepExit(stepEl[i], "down"))
                : ss.state === "enter" && notifyStepExit(stepEl[i], "down");
        else if (location === "below")
          for (i$1 = stepStates.length - 1; i$1 > index; i$1--)
            (ss$1 = stepStates[i$1]),
              ss$1.state === "enter" && notifyStepExit(stepEl[i$1], "up"),
              ss$1.direction === "down" &&
                (notifyStepEnter(stepEl[i$1], "up", !1),
                notifyStepExit(stepEl[i$1], "up"));
      }
      function notifyStepEnter(element, direction, check) {
        check === void 0 && (check = !0);
        var index = getIndex(element),
          resp = { element: element, index: index, direction: direction };
        stepStates[index].direction = direction;
        stepStates[index].state = "enter";
        preserveOrder &&
          check &&
          direction === "down" &&
          notifyOthers(index, "above");
        preserveOrder &&
          check &&
          direction === "up" &&
          notifyOthers(index, "below");
        cb.stepEnter &&
          !exclude[index] &&
          (cb.stepEnter(resp, stepStates),
          isDebug && notifyStep({ id: id, index: index, state: "enter" }),
          triggerOnce && (exclude[index] = !0));
        progressMode && notifyStepProgress(element);
      }
      function notifyStepExit(element, direction) {
        var index = getIndex(element),
          resp = { element: element, index: index, direction: direction };
        progressMode &&
          (direction === "down" && stepStates[index].progress < 1
            ? notifyStepProgress(element, 1)
            : direction === "up" &&
              stepStates[index].progress > 0 &&
              notifyStepProgress(element, 0));
        stepStates[index].direction = direction;
        stepStates[index].state = "exit";
        cb.stepExit(resp, stepStates);
        isDebug && notifyStep({ id: id, index: index, state: "exit" });
      }
      function intersectStepAbove(ref) {
        var entry = ref[0];
        updateDirection();
        var isIntersecting = entry.isIntersecting,
          boundingClientRect = entry.boundingClientRect,
          target = entry.target,
          top = boundingClientRect.top,
          bottom = boundingClientRect.bottom,
          topAdjusted = top - offsetMargin,
          bottomAdjusted = bottom - offsetMargin,
          index = getIndex(target),
          ss = stepStates[index];
        isIntersecting &&
          topAdjusted <= 0 &&
          bottomAdjusted >= 0 &&
          direction === "down" &&
          ss.state !== "enter" &&
          notifyStepEnter(target, direction);
        !isIntersecting &&
          topAdjusted > 0 &&
          direction === "up" &&
          ss.state === "enter" &&
          notifyStepExit(target, direction);
      }
      function intersectStepBelow(ref) {
        var entry = ref[0];
        updateDirection();
        var isIntersecting = entry.isIntersecting,
          boundingClientRect = entry.boundingClientRect,
          target = entry.target,
          top = boundingClientRect.top,
          bottom = boundingClientRect.bottom,
          topAdjusted = top - offsetMargin,
          bottomAdjusted = bottom - offsetMargin,
          index = getIndex(target),
          ss = stepStates[index];
        isIntersecting &&
          topAdjusted <= 0 &&
          bottomAdjusted >= 0 &&
          direction === "up" &&
          ss.state !== "enter" &&
          notifyStepEnter(target, direction);
        !isIntersecting &&
          bottomAdjusted < 0 &&
          direction === "down" &&
          ss.state === "enter" &&
          notifyStepExit(target, direction);
      }
      function intersectViewportAbove(ref) {
        var entry = ref[0];
        updateDirection();
        var isIntersecting = entry.isIntersecting,
          target = entry.target,
          index = getIndex(target),
          ss = stepStates[index];
        isIntersecting &&
          direction === "down" &&
          ss.direction !== "down" &&
          ss.state !== "enter" &&
          (notifyStepEnter(target, "down"), notifyStepExit(target, "down"));
      }
      function intersectViewportBelow(ref) {
        var entry = ref[0];
        updateDirection();
        var isIntersecting = entry.isIntersecting,
          target = entry.target,
          index = getIndex(target),
          ss = stepStates[index];
        isIntersecting &&
          direction === "up" &&
          ss.direction === "down" &&
          ss.state !== "enter" &&
          (notifyStepEnter(target, "up"), notifyStepExit(target, "up"));
      }
      function intersectStepProgress(ref) {
        var entry = ref[0];
        updateDirection();
        var isIntersecting = entry.isIntersecting,
          intersectionRatio = entry.intersectionRatio,
          boundingClientRect = entry.boundingClientRect,
          target = entry.target,
          bottom = boundingClientRect.bottom,
          bottomAdjusted = bottom - offsetMargin;
        isIntersecting &&
          bottomAdjusted >= 0 &&
          notifyStepProgress(target, +intersectionRatio.toFixed(3));
      }
      function updateViewportAboveIO() {
        io.viewportAbove = stepEl.map(function (el, i) {
          var marginTop = pageH - stepOffsetTop[i],
            marginBottom = offsetMargin - viewH - stepOffsetHeight[i],
            rootMargin = marginTop + "px 0px " + marginBottom + "px 0px",
            options = { rootMargin: rootMargin },
            obs = new IntersectionObserver(intersectViewportAbove, options);
          return obs.observe(el), obs;
        });
      }
      function updateViewportBelowIO() {
        io.viewportBelow = stepEl.map(function (el, i) {
          var marginTop = -offsetMargin - stepOffsetHeight[i],
            marginBottom = offsetMargin - viewH + stepOffsetHeight[i] + pageH,
            rootMargin = marginTop + "px 0px " + marginBottom + "px 0px",
            options = { rootMargin: rootMargin },
            obs = new IntersectionObserver(intersectViewportBelow, options);
          return obs.observe(el), obs;
        });
      }
      function updateStepAboveIO() {
        io.stepAbove = stepEl.map(function (el, i) {
          var marginTop = -offsetMargin + stepOffsetHeight[i],
            marginBottom = offsetMargin - viewH,
            rootMargin = marginTop + "px 0px " + marginBottom + "px 0px",
            options = { rootMargin: rootMargin },
            obs = new IntersectionObserver(intersectStepAbove, options);
          return obs.observe(el), obs;
        });
      }
      function updateStepBelowIO() {
        io.stepAbove = stepEl.map(function (el, i) {
          var marginTop = -offsetMargin,
            marginBottom = offsetMargin - viewH + stepOffsetHeight[i],
            rootMargin = marginTop + "px 0px " + marginBottom + "px 0px",
            options = { rootMargin: rootMargin },
            obs = new IntersectionObserver(intersectStepBelow, options);
          return obs.observe(el), obs;
        });
      }
      function updateStepProgressIO() {
        io.stepProgress = stepEl.map(function (el, i) {
          var marginTop = stepOffsetHeight[i] - offsetMargin,
            marginBottom = -viewH + offsetMargin,
            rootMargin = marginTop + "px 0px " + marginBottom + "px 0px",
            threshold = createThreshold(stepOffsetHeight[i]),
            options = { rootMargin: rootMargin, threshold: threshold },
            obs = new IntersectionObserver(intersectStepProgress, options);
          return obs.observe(el), obs;
        });
      }
      function updateIO() {
        OBSERVER_NAMES.forEach(disconnectObserver);
        updateViewportAboveIO();
        updateViewportBelowIO();
        updateStepAboveIO();
        updateStepBelowIO();
        progressMode && updateStepProgressIO();
      }
      function indexSteps() {
        stepEl.forEach(function (el, i) {
          return el.setAttribute("data-scrollama-index", i);
        });
      }
      function setupStates() {
        stepStates = stepEl.map(function () {
          return { direction: null, state: null, progress: 0 };
        });
      }
      function addDebug() {
        isDebug && setup({ id: id, stepEl: stepEl, offsetVal: offsetVal });
      }
      var OBSERVER_NAMES = [
          "stepAbove",
          "stepBelow",
          "stepProgress",
          "viewportAbove",
          "viewportBelow",
        ],
        cb = {
          stepEnter: function () {},
          stepExit: function () {},
          stepProgress: function () {},
        },
        io = {},
        id = null,
        stepEl = [],
        stepOffsetHeight = [],
        stepOffsetTop = [],
        stepStates = [],
        offsetVal = 0,
        offsetMargin = 0,
        viewH = 0,
        pageH = 0,
        previousYOffset = 0,
        progressThreshold = 0,
        isReady = !1,
        isEnabled = !1,
        isDebug = !1,
        progressMode = !1,
        preserveOrder = !1,
        triggerOnce = !1,
        direction = "down",
        exclude = [],
        S = {};
      return (
        (S.setup = function (ref) {
          var step = ref.step,
            offset = ref.offset,
            progress,
            threshold,
            debug,
            order,
            once;
          return (offset === void 0 && (offset = 0.5),
          (progress = ref.progress),
          progress === void 0 && (progress = !1),
          (threshold = ref.threshold),
          threshold === void 0 && (threshold = 4),
          (debug = ref.debug),
          debug === void 0 && (debug = !1),
          (order = ref.order),
          order === void 0 && (order = !0),
          (once = ref.once),
          once === void 0 && (once = !1),
          (id = generateInstanceID()),
          (stepEl = selectAll(step)),
          !stepEl.length)
            ? (console.error("scrollama error: no step elements"), S)
            : ((isDebug = debug),
              (progressMode = progress),
              (preserveOrder = order),
              (triggerOnce = once),
              S.offsetTrigger(offset),
              (progressThreshold = Math.max(1, +threshold)),
              (isReady = !0),
              addDebug(),
              indexSteps(),
              setupStates(),
              handleResize(),
              S.enable(),
              S);
        }),
        (S.resize = function () {
          return handleResize(), S;
        }),
        (S.enable = function () {
          return handleEnable(!0), S;
        }),
        (S.disable = function () {
          return handleEnable(!1), S;
        }),
        (S.destroy = function () {
          handleEnable(!1);
          Object.keys(cb).forEach(function (c) {
            return (cb[c] = null);
          });
          Object.keys(io).forEach(function (i) {
            return (io[i] = null);
          });
        }),
        (S.offsetTrigger = function (x) {
          return x && !isNaN(x)
            ? (x > 1 &&
                console.error(
                  "scrollama error: offset value is greater than 1. Fallbacks to 1."
                ),
              x < 0 &&
                console.error(
                  "scrollama error: offset value is lower than 0. Fallbacks to 0."
                ),
              (offsetVal = Math.min(Math.max(0, x), 1)),
              S)
            : (isNaN(x) &&
                console.error(
                  "scrollama error: offset value is not a number. Fallbacks to 0."
                ),
              offsetVal);
        }),
        (S.onStepEnter = function (f) {
          return (
            typeof f == "function"
              ? (cb.stepEnter = f)
              : console.error(
                  "scrollama error: onStepEnter requires a function"
                ),
            S
          );
        }),
        (S.onStepExit = function (f) {
          return (
            typeof f == "function"
              ? (cb.stepExit = f)
              : console.error(
                  "scrollama error: onStepExit requires a function"
                ),
            S
          );
        }),
        (S.onStepProgress = function (f) {
          return (
            typeof f == "function"
              ? (cb.stepProgress = f)
              : console.error(
                  "scrollama error: onStepProgress requires a function"
                ),
            S
          );
        }),
        S
      );
    }
    return scrollama;
  });
});
var internalIndexOf = arrayIncludes(!1),
  nativeIndexOf = [].indexOf,
  NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0,
  SLOPPY_METHOD$1 = sloppyArrayMethod("indexOf");
_export(
  { target: "Array", proto: !0, forced: NEGATIVE_ZERO || SLOPPY_METHOD$1 },
  {
    indexOf: function (searchElement) {
      return NEGATIVE_ZERO
        ? nativeIndexOf.apply(this, arguments) || 0
        : internalIndexOf(this, searchElement, arguments[1]);
    },
  }
);
var nativeParseInt = global_1.parseInt,
  hex = /^[+-]?0[Xx]/,
  FORCED$2 =
    nativeParseInt(whitespaces + "08") !== 8 ||
    nativeParseInt(whitespaces + "0x16") !== 22,
  _parseInt = FORCED$2
    ? function (str, radix) {
        var string = stringTrim(String(str), 3);
        return nativeParseInt(
          string,
          radix >>> 0 || (hex.test(string) ? 16 : 10)
        );
      }
    : nativeParseInt;
_export({ global: !0, forced: parseInt != _parseInt }, { parseInt: _parseInt });
jump = createCommonjsModule(function (module) {
  (function (global, factory) {
    module.exports = factory();
  })(commonjsGlobal, function () {
    var easeInOutQuad = function (t, b, c, d) {
        return ((t /= d / 2), t < 1)
          ? (c / 2) * t * t + b
          : (t--, (-c / 2) * (t * (t - 2) - 1) + b);
      },
      _typeof =
        typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
          ? function (obj) {
              return typeof obj;
            }
          : function (obj) {
              return obj &&
                typeof Symbol == "function" &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? "symbol"
                : typeof obj;
            },
      jumper = function () {
        function location() {
          return window.scrollY || window.pageYOffset;
        }
        function top(element) {
          return element.getBoundingClientRect().top + start;
        }
        function loop(timeCurrent) {
          timeStart || (timeStart = timeCurrent);
          timeElapsed = timeCurrent - timeStart;
          next = easing(timeElapsed, start, distance, duration);
          window.scrollTo(0, next);
          timeElapsed < duration ? window.requestAnimationFrame(loop) : done();
        }
        function done() {
          window.scrollTo(0, start + distance);
          element &&
            a11y &&
            (element.setAttribute("tabindex", "-1"), element.focus());
          typeof callback == "function" && callback();
          timeStart = !1;
        }
        function jump(target) {
          var options =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : {};
          duration = options.duration || 1e3;
          offset = options.offset || 0;
          callback = options.callback;
          easing = options.easing || easeInOutQuad;
          a11y = options.a11y || !1;
          start = location();
          switch (
            typeof target == "undefined" ? "undefined" : _typeof(target)
          ) {
            case "number":
              element = undefined;
              a11y = !1;
              stop = start + target;
              break;
            case "object":
              element = target;
              stop = top(element);
              break;
            case "string":
              element = document.querySelector(target);
              stop = top(element);
          }
          distance = stop - start + offset;
          switch (_typeof(options.duration)) {
            case "number":
              duration = options.duration;
              break;
            case "function":
              duration = options.duration(distance);
          }
          window.requestAnimationFrame(loop);
        }
        var element = void 0,
          start = void 0,
          stop = void 0,
          offset = void 0,
          easing = void 0,
          a11y = void 0,
          distance = void 0,
          duration = void 0,
          timeStart = void 0,
          timeElapsed = void 0,
          next = void 0,
          callback = void 0;
        return jump;
      };
    return jumper();
  });
});
easeInOutQuad = function (t, b, c, d) {
  return ((t /= d / 2), t < 1)
    ? (c / 2) * t * t + b
    : (t--, (-c / 2) * (t * (t - 2) - 1) + b);
};
(config = {
  toggleClass: "js-accordion-toggle",
  openClass: "is-open",
  animateClass: "can-animate",
  defaultDelay: 10,
}),
  (function () {
    initTestMarkup();
    initSiteDefaults();
    initTabs();
    modalInit();
    initSmoothAnchors();
    initStickyTabsBar();
    initNavWatcher();
    accordionInit();
  })();
