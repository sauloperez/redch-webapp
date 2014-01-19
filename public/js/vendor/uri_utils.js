/*jslint regexp: true, white: true, maxerr: 50, indent: 2 */
var URIUtils = {

  isRelativeURI: function(uri) {
    return /^\//.test(uri);
  },

  parseURI: function(url) {
    var m = String(url).replace(/^\s+|\s+$/g, '').match(/^([^:\/?#]+:)?(\/\/(?:[^:@]*(?::[^:@]*)?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
    // authority = '//' + user + ':' + pass '@' + hostname + ':' port
    return (m ? {
      href     : m[0] || '',
      protocol : m[1] || '',
      authority: m[2] || '',
      host     : m[3] || '',
      hostname : m[4] || '',
      port     : m[5] || '',
      pathname : m[6] || '',
      search   : m[7] || '',
      hash     : m[8] || ''
    } : null);
  },

  absolutizeURI: function(base, href) {// RFC 3986
    function removeDotSegments(input) {
      var output = [];
      input.replace(/^(\.\.?(\/|$))+/, '')
           .replace(/\/(\.(\/|$))+/g, '/')
           .replace(/\/\.\.$/, '/../')
           .replace(/\/?[^\/]*/g, function (p) {
        if (p === '/..') {
          output.pop();
        } else {
          output.push(p);
        }
      });
      return output.join('').replace(/^\//, input.charAt(0) === '/' ? '/' : '');
    };

    href = this.parseURI(href || '');
    base = this.parseURI(base || '');

    console.log(href);
    console.log(base);

    return !href || !base ? null : (href.protocol || base.protocol) +
           (href.protocol || href.authority ? href.authority : base.authority) +
           removeDotSegments(href.protocol || href.authority || href.pathname.charAt(0) === '/' ? href.pathname : (href.pathname ? ((base.authority && !base.pathname ? '/' : '') + base.pathname.slice(0, base.pathname.lastIndexOf('/') + 1) + href.pathname) : base.pathname)) +
           (href.protocol || href.authority || href.pathname ? href.search : (href.search || base.search)) +
           href.hash;
  }
};

