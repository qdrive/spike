# spike
Just a super simple JavaScript routing engine!

## About
This was developed as one of the projects I was working on needed a simple SPA. Using third party libraries was not an option. This is as barebones as it could be and I have no doubt that it can be improved. It served a purpose though.

## Getting Started

Add the basic HTML building blocks to ***index.html*** including the script references.
``` html
<html>
<body>
    ...
    <a href="#/">Default</a>
    <a href="#/some-page">Some Page</a>
    <div id ="injected-content"></div>
    <script src="spike.js"></script>
    <script src="spike-config.js"></script>
    ...
</body>
</html> 
```

Add some basic routes to ***spike-config.js***.
``` javascript
spike

  .setRoot('/')
  .setLoadingTemplate('<h2>Loading...</h2>')
  .setContentContainer('#injected-content')
  .setNotFound('/404')

  .add({
    url: '/',
    template: '<div><h2>Hey,</h2><p><b>I am a template that will be loaded as the defult route!</b></p></div>'
    options: {
      url: '/'
    },
    callback: function (options) {
      alert(url);
    }
  })

  .add({
    url: '/404',
    template: '<div><h2>Hey,</h2><p><b>I was triggered because a route wasnt found!</b></p></div>'
    options: {
      url: '/404'
    },
    callback: function (options) {
      alert(url);
    }
  })

  .add({
    url: '/some-page',
    templateUrl: 'path-to/some-page.html',
    options: {
      url: '/some-page'
    },
    callback: function (options) {
      alert(url);
    }
  })
  
  .listen();
```

Open up index.html in your favorite browser and start routing.
> While running from the filesystem, Chrome may complain when injecting HTML content.
```
Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, https  
```