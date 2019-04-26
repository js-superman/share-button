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
                    },
                    email: {
                        shareUrl: 'mailto:' + this.getAttribute('to') || '',
                        params: {
                            subject: this.getAttribute('title'),
                            body: this.getAttribute('title') + '\n' + this.getAttribute('url')
                        }
                    },
                    qrsrc: {
                        shareUrl: 'http://www.qrsrc.com/qrcode.aspx',
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
        var elems_more = document.querySelectorAll('.share-more'),l_more = elems_more.length;
        for (i = 0; i < l_more; i++) {
            elems_more[i].addEventListener('click', function (elem) {
                document.querySelector('.share-menu').classList.toggle('show');
            });
        }
        document.querySelector('.share-menu').addEventListener('click', function (elem) {
            this.classList.toggle('show');
        });

        var share_mob_elem = document.querySelector('.share-mob');
        if(share_mob_elem){
            share_mob_elem.addEventListener('click', function (elem) {
                share_mob_elem.classList.toggle('open');
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
        if(typeof addthis_share === 'object' && addthis_share.url){
            url = addthis_share.url;
        }
        return url;
    }

    function getTitle() {
        return document.title
    }

    function init() {
        var share_fixed = document.querySelector('.share-fixed');
        var share_toolbox = document.querySelector('.share_button_toolbox');
        var share_hide = document.querySelectorAll('.share-hide'),l_hide = share_hide.length;
        for (var i = 0; i < l_hide; i++) {
            share_hide[i].classList.remove('share-hide')
        }
        if (share_fixed || share_toolbox) {
            document.querySelector('.share-title').innerText = getTitle();
            document.querySelector('.share-url').innerText = getUrl();
            addListener();
        }
    }

    if (document.readyState === 'complete' || document.readyState !== 'loading') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

    window.addEventListener('page:load', init);
})(window, document);