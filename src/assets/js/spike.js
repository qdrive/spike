// spike.js
var spike = (function (document, window) {
  // Internal methods.
  var _internal = {
    // Routes array.
    routes: [],
    // Default route.
    // Can be configured in 'spike-config.js' using the 'setRoot' method.
    root: "/",
    // Container where the content will be injected.
    // Can be configured in 'spike-config.js' using the 'setContentContainer' method.
    contentContainer: "#content-container",
    // Loading template.
    loadingTemplate: "<p>Loading...</p>",
    // Url prefix.
    urlPrefix: "#",
    // Default not found template.
    // Can be configured in 'spike-config.js' using the 'setNotFound' method.
    notFound: "/not-found",
    // Functions
    // Get template.
    getTemplate: function (route) {
      // Fetch and compile the template.
      if (!!route.template) {
        _external.render(_internal.tp(route.template, route.options));
        if (typeof route.callback == "function") route.callback(route.options);
      }
      else if (!!route.templateUrl) {
        // Display the loading template.
        _external.render(_internal.loadingTemplate);
        // Fetch the template data.
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          if (xhttp.readyState == 4 && xhttp.status == 200) {
            route.template = xhttp.responseText;
            _external.render(_internal.tp(xhttp.responseText, route.options));
            if (typeof route.callback == "function") route.callback(route.options);
          }
          else if (xhttp.status == 404) {
            _external.render("<h1>Error " + xhttp.status + "</h1>");
          }
        };
        xhttp.open("GET", route.templateUrl, true);
        xhttp.send();
      }
    },
    // Get the hash part of the url.
    getFragment: function () {
      if (window.location.hash === "") window.location.hash = _internal.urlPrefix + _internal.root;
      var re = new RegExp(_internal.urlPrefix + "(.*)$"),
        match = window.location.href.match(re),
        fragment = match ? match[1] : '';
      return fragment.toString();
    },
    // Exposes the 'options' properties to the rendered view/template.
    tp: function (html, options) {
      var re = /<%([^%>]+)?%>/g,
        reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
        code = 'var r=[];\n',
        cursor = 0,
        match;
      var add = function (line, js) {
        js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
          (code += line !== '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
        return add;
      };
      while (match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
      }
      add(html.substr(cursor, html.length - cursor));
      code += 'return r.join("");';
      return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
    }
  };
  // External methods.
  var _external = {
    // Sets the default root route.
    setRoot: function (root) {
      _internal.root = root;
      return _external;
    },
    // Sets the container where the content is injected.
    setContentContainer: function (container) {
      _internal.contentContainer = container;
      return _external;
    },
    // Sets the not found template.
    setNotFound: function (page) {
      _internal.notFound = page;
      return _external;
    },
    // Sets the loading template.
    setLoadingTemplate: function (tpl) {
      _internal.loadingTemplate = tpl;
      return _external;
    },
    //  Adds a route.
    add: function (route) {
      if (typeof route == "object") {
        if (!!route.url && (!!route.template || !!route.templateUrl)) _internal.routes.push(route);
        else console.log("This route has a problem, it cant be added!", route);
      }
      else console.log("This route has a problem, it cant be added!", route);
      return _external;
    },
    // Gets the route based on the fragment and calls the the method that will get the template.
    check: function (f) {
      // Renders the fragment.
      var fragment = f || _internal.getFragment(),
        argsVal,
        argsNames,
        params = {};
      for (var x = 0; x < _internal.routes.length; x++) {
        var currRoute = _internal.routes[x];
        var routeMatcher = new RegExp("^" + currRoute.url.replace(/(:\w+)/g, '([\\w-]+)') + "$");
        argsVal = fragment.match(routeMatcher);
        if (argsVal) {
          argsVal.shift();
          argsNames = currRoute.url.match(/(:\w+)/g);
          if (argsNames) {
            for (var y = 0; y < argsNames.length; y++) {
              params[argsNames[y].slice(1)] = argsVal[y];
            }
          }
          if (!currRoute.options) currRoute.options = {};
          currRoute.options.params = params;
          _internal.getTemplate(currRoute);
          return _external;
        }
      }
      _external.navigate(_internal.notFound);
      return _external;
    },
    // Listens for the url changes and calls the 'check' function.
    listen: function () {
      // Calls the check method every 50ms and compares the current fragment with the one that has been stored at last route change.
      var currentFragment = null,
        interval;
      var fn = function () {
        if (currentFragment !== _internal.getFragment()) {
          currentFragment = _internal.getFragment();
          _external.check(currentFragment);
        }
      };
      clearInterval(interval);
      interval = setInterval(fn, 50);
      return _external;
    },
    // Renders the template on the view.
    render: function (data) {
      document.querySelector(_internal.contentContainer).innerHTML = data;
      return _external;
    },
    // Force the url to change programatically.
    navigate: function (path) {
      path = path ? path : '';
      window.location.href = window.location.href.replace(/#(.*)$/, _internal.urlPrefix + path);
      return _external;
    },
    // Sets the default url prefix.
    hashbang: function (bang) {
      _internal.urlPrefix = (bang === true) ? '#!' : '#';
      return _external;
    }
  };
  return _external;
})(document, window);