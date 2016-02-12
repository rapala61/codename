(function( Codename, $ ) {
  var fields = {};

  Codename.options = {
    categories: {
      'address':  ['streetName', 'county'],
      'commerce': ['product', 'productName'],
      'hacker':  ['adjective', 'verb'],
      'finance': ['accountName', 'mask'],
      'internet': ['domainSuffix'],
      'name': ['jobArea']
    }
  }

  Codename.init = function() {
    fields = {
      generatorForm: $('form#codename-generator'),
      generateBtn: $('[name=generate]'),
      wdiPrefix: $('[name=wdi-prefix]'),
      newCodenameContainer: $('.new-codename-container'),
      newCodenameElement: $('#new-codename')
    }

    Codename.UI.init();
  }

  Codename.generateCodename = function() {
    var def = $.Deferred();

    $.when(ShakeItspeare.getWords(1, 1), ShakeItspeare.getWords(6, 1))
      .then(function(poem1, poem2){
        var prefix = $.trim(fields.wdiPrefix.val()) || "WDI ";
        var codenameString = prefix + ' ' + poem1 + ' ' + Codename.Util.getRandomString() + '    -     Codename: ' + poem2 + ' ' + Codename.Util.getRandomString();
        def.resolve(codenameString);
    })
    return def.promise();
  }

  Codename.Util = {
    getRandomString: function() {
      var cat = Codename.Util.getRandomCategory();
      var sub = Codename.Util.getRandomSubCategory( cat );
      return faker[cat][sub]();
    },
    getRandomCategory: function() {
      var keys = Object.keys(Codename.options.categories);
      var randIdx = Math.floor( Math.random() * keys.length );
      return keys[randIdx];
    },
    getRandomSubCategory: function( category ) {
      var subCatIdx = Math.floor(Math.random()*Codename.options.categories[category].length);
      return Codename.options.categories[category][subCatIdx];
    }
  }

  Codename.UI = {
    init: function() {
      this.bindGenerator();
    },
    bindGenerator: function() {
      fields.generatorForm.on('submit', function(e) {
        var codename = '';
        e.preventDefault();
        Codename.generateCodename().then(function( codename ) {
          Codename.UI.hideOldCodenames();
          Codename.UI.renderNewCodename( codename );
        });
      });
    },
    renderNewCodename: function( codename ) {
      var newCodename = $('<h3>').text( codename ).addClass('new-codename');
      fields.newCodenameContainer.prepend(newCodename)
    },
    hideOldCodenames: function() {
      $('.new-codename').removeClass('new-codename').addClass('old-codename');
    }
  }
}( window.Codename = window.Codename || {}, jQuery));


(function( ShakeItspeare, $ ) {

  ShakeItspeare.getWords = function( markov, words ) {

    var markov = markov || 9;
    var words = words || 1;
    var def = $.Deferred();

    $.getJSON('http://www.shakeitspeare.com/api/sentence?markov=' + markov).done(function( data ) {
      var sentence = data.sentence.replace('.', '').split(' ');
      var temp = [];

      for (var i = 0; i < words; i++) {
        temp.push(sentence[i]);
      }
      def.resolve(temp.join(' '));
    });
    return def.promise();
  }

}( window.ShakeItspeare = window.ShakeItspeare || {}, jQuery));
