(function (window, document) {
    'use strict';

    /**
     * @constructor
     */
    var SharerButton = function (elem) {
        this.elem = elem;
    };

    // instance methods
    SharerButton.prototype = {
        constructor: SharerButton,
        getAttribute: function (attr) {
            var val = this.elem.getAttribute('data-' + attr);
            if(!val){
                switch (attr) {
                    case 'url':
                        val = getUrl();
                        break;
                    case 'title':
                        val = getTitle();
                        break;
                }
            }
            return val;
        },
        share: function () {
            var sharer = this.getAttribute('sharer').toLowerCase(),
                sharers = {
                    facebook: {
                        shareUrl: 'https://www.facebook.com/sharer/sharer.php',
                        params: {
                            u: this.getAttribute('url')
                        }
                    },
                    twitter: {
                        shareUrl: 'https://twitter.com/intent/tweet/',
                        params: {
                            text: this.getAttribute('title'),
                            url: this.getAttribute('url')
                        }
                    },
                    reddit: {
                        shareUrl: 'https://www.reddit.com/submit',
                        params: {url: this.getAttribute('url')}
                    },
                    vk: {
                        shareUrl: 'http://vk.com/share.php',
                        params: {
                            url: this.getAttribute('url'),
                            title: this.getAttribute('title')
                        }
                    },
                    googleplus: {
                        shareUrl: 'https://plus.google.com/share',
                        params: {
                            url: this.getAttribute('url')
                        }
                    },
                    pinterest: {
                        shareUrl: 'http://pinterest.com/pin/create/link/',
                        params: {
                            url: this.getAttribute('url')
                        }
                    }
                },
                s = sharers[sharer];
            if (s) {
                s.width = this.getAttribute('width');
                s.height = this.getAttribute('height');
            }
            return s !== void(0) ? this.go(s) : false;
        },
        go: function (sharer) {
            var p = sharer.params || {},
                keys = Object.keys(p),
                i,
                str = keys.length > 0 ? '?' : '';
            for (i = 0; i < keys.length; i++) {
                if (str !== '?') {
                    str += '&';
                }
                if (p[keys[i]]) {
                    str += keys[i] + '=' + encodeURIComponent(p[keys[i]]);
                }
            }
            sharer.shareUrl += str;
            var popWidth = sharer.width || 600,
                popHeight = sharer.height || 480,
                left = window.innerWidth / 2 - popWidth / 2 + window.screenX,
                top = window.innerHeight / 2 - popHeight / 2 + window.screenY,
                popParams =
                    'scrollbars=no, width=' +
                    popWidth +
                    ', height=' +
                    popHeight +
                    ', top=' +
                    top +
                    ', left=' +
                    left,
                newWindow = window.open(sharer.shareUrl, '', popParams);

            if (window.focus) {
                newWindow.focus();
            }
        }
    };
    
    var template = {
      normal:`<div class="share-btn share-side{class}">
                {html}
                <ul>
                    <li>
                        <a class="share-fb" data-sharer="facebook">
                            <span class="icon"></span>
                            <span class="text">Facebook</span>
                        </a>
                    </li>
                    <li>
                        <a class="share-t" data-sharer="twitter">
                            <span class="icon"></span>
                            <span class="text">Twitter</span>
                        </a>
                    </li>
                    <li>
                        <a class="share-vk" data-sharer="vk">
                            <span class="icon"></span>
                            <span class="text">Vkontakte</span>
                        </a>
                    </li>
                    <li>
                        <a class="share-reddit" data-sharer="reddit">
                            <span class="icon"></span>
                            <span class="text">Reddit</span>
                        </a>
                    </li>
                    <li>
                        <a class="share-more">
                            <span class="icon"></span>
                            <span class="text">More</span>
                        </a>
                    </li>
                </ul>
            </div>`,
      shadow:`
        <div class="share-menu">
             <div class="share-shadow"></div>
             <div class="share-closed"></div>
             <div class="share-text">
                <div class="title">Share</div>
                <p class="share-title">{title}</p>
                <p class="share-url">{url}</p>
                <div class="share-list">
                    <a class="share-fb" data-sharer="facebook">
                        <span class="icon"></span>
                        <span class="text">Facebook</span>
                    </a>
                    <a class="share-t" data-sharer="twitter">
                        <span class="icon"></span>
                        <span class="text">Twitter</span>
                    </a>
                    <a class="share-vk" data-sharer="vk">
                        <span class="icon"></span>
                        <span class="text">Vkontakte</span>
                    </a>
                    <a class="share-reddit" data-sharer="reddit">
                        <span class="icon"></span>
                        <span class="text">Reddit</span>
                    </a>
                    <a class="share-g" data-sharer="googleplus">
                        <span class="icon"></span>
                        <span class="text">Google</span>
                    </a>
                    <a class="share-pinterest" data-sharer="pinterest">
                        <span class="icon"></span>
                        <span class="text">Pinterest</span>
                    </a>
                    <a class="share-whatsapp" data-sharer="whatsapp">
                        <span class="icon"></span>
                        <span class="text">WhatsApp</span>
                    </a>
                    <a class="share-e" data-sharer="email">
                        <span class="icon"></span>
                        <span class="text">Email</span>
                    </a>
                </div>
             </div>
        </div>
      `
    };

    function isMobile() {
        return /mobile|ip(hone|od|ad)|android|blackberry|iemobile|kindle|netfront|silk-accelerated|(hpw|web)os|fennec|minimo|opera m(obi|ini)|blazer|dolfin|dolphin|skyfire|zune/.test(navigator.userAgent.toLowerCase());
    }

    function addListener() {
        var elems = document.querySelectorAll('[data-sharer]'),
            i,
            l = elems.length;
        for (i = 0; i < l; i++) {
            elems[i].addEventListener('click', function (elem) {
                var target = elem.currentTarget || elem.srcElement;
                var sharer = new SharerButton(target);
                sharer.share();
            });
        }
        document.querySelector('.share-more').addEventListener('click', function (elem) {
            document.querySelector('.share-menu').classList.toggle('show');
        });
        document.querySelector('.share-menu').addEventListener('click', function (elem) {
            this.classList.toggle('show');
        });
        if(isMobile()){
            document.querySelector('.share-mob').addEventListener('click', function (elem) {
                document.querySelector('.share-mob').classList.toggle('open');
            });
        }
    }

    function getUrl() {
        var url;
        var canonical = document.querySelector("link[rel='canonical']");
        if (canonical) {
            url = canonical.getAttribute('href');
        } else {
            url = location.href;
        }
        return url;
    }

    function getTitle() {
        return document.title
    }

    function init(){
        var params = {
            class:' share-web',
            html:''
        };
        if (isMobile()) {
            params.class = ' share-mob';
            params.html = '<div class="share-open"></div><div class="share-open-bg"></div>'
        }
        var c = document.createElement('div');
        c.innerHTML = formatString(template.normal,params) + formatString(template.shadow,{url:getUrl(),title:getTitle()});
        document.body.appendChild(c);
        addListener();
    }

    function formatString(string) {
        var nargs = /\{([0-9a-zA-Z_]+)\}/g;
        var args;

        if (arguments.length === 2 && typeof arguments[1] === "object") {
            args = arguments[1]
        } else {
            args = new Array(arguments.length - 1)
            for (var i = 1; i < arguments.length; ++i) {
                args[i - 1] = arguments[i]
            }
        }

        if (!args || !args.hasOwnProperty) {
            args = {}
        }

        return string.replace(nargs, function replaceArg(match, i, index) {
            var result

            if (string[index - 1] === "{" &&
                string[index + match.length] === "}") {
                return i
            } else {
                result = args.hasOwnProperty(i) ? args[i] : null
                if (result === null || result === undefined) {
                    return ""
                }

                return result
            }
        })
    }

    init();
})(window, document);