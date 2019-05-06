(function (window, document) {
    'use strict';

    /**
     * @constructor
     */
    var SharerButton = function (elem) {
        this.elem = elem;
    };

    var template = {
        menu: '<div class="share-menu share-hide"><div class="share-shadow"></div><div class="share-closed"></div><div class="share-text"><div class="title">Share</div><p class="share-title"></p><p class="share-url"></p><div class="share-list"><a class="share-fb" data-sharer="facebook"><span class="icon"></span><span class="text">Facebook</span></a><a class="share-t" data-sharer="twitter"><span class="icon"></span><span class="text">Twitter</span></a><a class="share-reddit" data-sharer="reddit"><span class="icon"></span><span class="text">Reddit</span></a><a class="share-whatsapp" data-sharer="whatsapp"><span class="icon"></span><span class="text">WhatsApp</span></a><a class="share-vk" data-sharer="vk"><span class="icon"></span><span class="text">Vkontakte</span></a><a class="share-gmail" data-sharer="gmail"><span class="icon"></span><span class="text">Gmail</span></a><a class="share-googlebookmark" data-sharer="googlebookmark"><span class="icon"></span><span class="text">Google Bookmark</span></a><a class="share-e" data-sharer="email"><span class="icon"></span><span class="text">Email App</span></a><a class="share-adfty" data-sharer="adfty"><span class="icon"></span><span class="text">Adfty</span></a><a class="share-linkedin" data-sharer="linkedin"><span class="icon"></span><span class="text">LinkedIn</span></a><a class="share-print" data-sharer="print"><span class="icon"></span><span class="text">Print</span></a><a class="share-pinterest" data-sharer="pinterest"><span class="icon"></span><span class="text">Pinterest</span></a><a class="share-messenger" data-sharer="messenger"><span class="icon"></span><span class="text">Messenger</span></a><a class="share-sinaweibo" data-sharer="sinaweibo"><span class="icon"></span><span class="text">Sina Weibo</span></a><a class="share-blogger" data-sharer="blogger"><span class="icon"></span><span class="text">Blogger</span></a><a class="share-100zakladok" data-sharer="_100zakladok"><span class="icon"></span><span class="text">100zakladok</span></a><a class="share-amazon" data-sharer="amazon"><span class="icon"></span><span class="text">Amazon</span></a><a class="share-telegram" data-sharer="telegram"><span class="icon"></span><span class="text">Telegram</span></a><a class="share-myspace" data-sharer="myspace"><span class="icon"></span><span class="text">Myspace</span></a><a class="share-line" data-sharer="line"><span class="icon"></span><span class="text">LINE</span></a><a class="share-viber" data-sharer="viber"><span class="icon"></span><span class="text">Viber</span></a><a class="share-odnoklassniki" data-sharer="odnoklassniki"><span class="icon"></span><span class="text">Odnoklassniki</span></a><a class="share-qrsrc" data-sharer="qrsrc"><span class="icon"></span><span class="text">QRSrc.com</span></a></div></div></div>'
    };

    // instance methods
    SharerButton.prototype = {
        constructor: SharerButton,
        getAttribute: function (attr) {
            var val = this.elem.getAttribute('data-' + attr);
            if (!val) {
                switch (attr) {
                    case 'url':
                        val = getUrl();
                        break;
                    case 'title':
                        val = getTitle();
                        break;
                    case 'image':
                        val = getImage();
                        break;
                    case 'description':
                        val = getDescription();
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
                    whatsapp: {
                        shareUrl: 'https://api.whatsapp.com/send',
                        params: {
                            text: this.getAttribute('title') + ' ' + this.getAttribute('url')
                        }
                    },
                    vk: {
                        shareUrl: 'http://vk.com/share.php',
                        params: {
                            url: this.getAttribute('url'),
                            title: this.getAttribute('title')
                        }
                    },
                    gmail: {
                        shareUrl: 'https://mail.google.com/mail/',
                        params: {
                            view: 'cm',
                            su: this.getAttribute('title'),
                            body: this.getAttribute('title') + '\n' + this.getAttribute('url')
                        }
                    },
                    googlebookmark: {
                        shareUrl: 'https://www.google.com/bookmarks/mark',
                        params: {
                            op: 'add',
                            bkmk: this.getAttribute('url'),
                            title: this.getAttribute('title'),
                            annotation: this.getAttribute('description'),
                        }
                    },
                    email: {
                        shareUrl: 'mailto:' + (this.getAttribute('to') || ''),
                        params: {
                            subject: this.getAttribute('title'),
                            body: this.getAttribute('title') + '\n' + this.getAttribute('url')
                        },
                        isLink: true
                    },
                    adfty: {
                        shareUrl: 'https://www.adfty.com/submit.php',
                        params: {
                            url: this.getAttribute('url'),
                            title: this.getAttribute('title'),
                            description: this.getAttribute('description')
                        }
                    },
                    linkedin: {
                        shareUrl: 'https://www.linkedin.com/shareArticle',
                        params: {
                            mini: true,
                            url: this.getAttribute('url'),
                            title: this.getAttribute('title'),
                            ro: false,
                            summary: this.getAttribute('description')
                        }
                    },
                    print: {},
                    pinterest: {
                        shareUrl: 'http://pinterest.com/pin/create/link/',
                        params: {
                            url: this.getAttribute('url'),
                            media: this.getAttribute('image'),
                            description: this.getAttribute('description')
                        }
                    },
                    messenger: {
                        shareUrl: 'http://www.facebook.com/dialog/send',
                        params: {
                            link: this.getAttribute('url'),
                            app_id: 140586622674265,
                            redirect_uri: 'https://www.messenger.com/'
                        }
                    },
                    sinaweibo: {
                        shareUrl: 'https://service.weibo.com/share/share.php',
                        params: {
                            url: this.getAttribute('url'),
                            title: this.getAttribute('title'),
                            pic: this.getAttribute('image')
                        }
                    },
                    blogger: {
                        shareUrl: 'https://www.blogger.com/blog_this.pyra',
                        params: {
                            t: this.getAttribute('description'),
                            u: this.getAttribute('url'),
                            n: this.getAttribute('title')
                        }
                    },
                    _100zakladok: {
                        shareUrl: 'http://www.100zakladok.ru/save/',
                        params: {
                            bmurl: this.getAttribute('url'),
                            bmtitle: this.getAttribute('title')
                        }
                    },
                    amazon: {
                        shareUrl: 'https://www.amazon.com/gp/wishlist/static-add',
                        params: {
                            u: this.getAttribute('url'),
                            t: this.getAttribute('title')
                        }
                    },
                    telegram: {
                        shareUrl: 'https://telegram.me/share/url',
                        params: {
                            url: this.getAttribute('url'),
                            text: this.getAttribute('title')
                        }
                    },
                    myspace: {
                        shareUrl: 'https://myspace.com/post',
                        params: {
                            url: this.getAttribute('url'),
                            t: this.getAttribute('title'),
                            c: this.getAttribute('description')
                        }
                    },
                    line: {
                        shareUrl: 'https://lineit.line.me/share/ui',
                        params: {
                            url: this.getAttribute('url'),
                            text: this.getAttribute('title'),
                        }
                    },
                    viber: {
                        shareUrl: 'https://www.viber.com/',
                        params: {
                        }
                    },
                    odnoklassniki: {
                        shareUrl: 'https://connect.ok.ru/dk',
                        params: {
                            'st.cmd': 'WidgetSharePreview',
                            'st.shareUrl': this.getAttribute('url'),
                            title: this.getAttribute('title')
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
            if(!sharer.shareUrl){
                return window.focus(),window.print();
            }
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

            if (!sharer.isLink) {
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
            } else {
                window.location.href = sharer.shareUrl;
            }
        }
    };

    function toggleMenu() {
        document.querySelector('.share-menu').classList.toggle('show');
        document.getElementsByTagName('html')[0].classList.toggle('share-noscroll');
        document.getElementsByTagName('body')[0].classList.toggle('share-noscroll');
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
        var elems_more = document.querySelectorAll('.share-more'), l_more = elems_more.length;
        for (i = 0; i < l_more; i++) {
            elems_more[i].addEventListener('click', function (elem) {
                toggleMenu();
            });
        }
        document.querySelector('.share-menu').addEventListener('click', function (elem) {
            toggleMenu();
        });

        var share_mob_elem = document.querySelector('.share-mob');
        if (share_mob_elem) {
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
        if (typeof addthis_share === 'object' && addthis_share.url) {
            url = addthis_share.url;
        }
        return url;
    }

    function getTitle() {
        return document.title
    }

    function getDescription() {
        var description = document.querySelector("meta[name='description']");
        if (description) {
            return description.getAttribute('content');
        }
        return ''
    }

    function getImage() {
        var image = document.querySelector("meta[property='og:image']");
        if (image) {
            return image.getAttribute('content');
        }
        return ''
    }

    function init() {
        var share_fixed = document.querySelector('.share-fixed');
        var share_toolbox = document.querySelector('.share_button_toolbox');
        if (share_fixed || share_toolbox) {
            var c = document.createElement('div');
            c.innerHTML = template.menu;
            document.body.appendChild(c.firstChild);
            document.querySelector('.share-title').innerText = getTitle();
            document.querySelector('.share-url').innerText = getUrl();
            addListener();
        }
        var share_hide = document.querySelectorAll('.share-hide'), l_hide = share_hide.length;
        setTimeout(function () {
            for (var i = 0; i < l_hide; i++) {
                share_hide[i].classList.remove('share-hide')
            }
        }, 1000);
    }

    if (document.readyState === 'complete' || document.readyState !== 'loading') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

    window.addEventListener('page:load', init);
})(window, document);