// spike-config.js
spike
  // Set the default root route.
  .setRoot('/')
  // Set the loading template.
  .setLoadingTemplate('<h2>Loading...</h2>')
  // Set the container where the content will be injected.
  .setContentContainer('#injected-content')
  // Set the page not 4ound route.
  .setNotFound('/404')
  // Add a route.
  .add({
    url: '/',
    template: '<div class="gz-container"><h2>Hey,</h2>' +
    '<p><b>I am a template that will be loaded as the defult route!</b></p>',
    options: {
      url: '/'
    },
    callback: function (options) {
      showRoute();
    }
  })
  // Add a route.
  .add({
    url: '/404',
    template: '<div class="gz-container"><h2>Aye Up,</h2>' +
    '<p><b>I was triggered because a route wasnt found!</b></p>',
    options: {
      url: '/404'
    },
    callback: function (options) {
      showRoute();
    }
  })
  // Add a route.
  .add({
    url: '/items',
    template: '<div class="gz-container"><h2>Ola,</h2>' +
    '<p><b>I am a plain and simple template!</b></p>',
    options: {
      url: '/items'
    },
    callback: function (options) {
      showRoute();
    }
  })
  // Add a route.
  .add({
    url: '/item/:id',
    template: '<div class="gz-container"><h2>Howdy,</h2>' +
    '<p><b>I am a template using a parameter!</b></p>',
    options: {
      url: '/item/:id'
    },
    callback: function (options) {
      showRoute();
    }
  })
  // Add a route.
  .add({
    url: '/html',
    templateUrl: 'some-page.html',
    options: {
      url: '/html'
    },
    callback: function (options) {
      showRoute();
    }
  })
  // Listen out for hash changes.
  .listen();

// Functions
function showRoute() {
  var url = window.location.hash;
  document.querySelector('.address-bar').innerHTML = url;
}