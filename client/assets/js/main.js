
window.onload = function () {

    var game, config;

    var _gW = 0, _gH = 0;

    var form = document.getElementById ('myForm');
    form.onsubmit = function ( e ) {

        e.preventDefault();

        document.getElementById('game_login').style.display = 'none';
        document.getElementById('game_div').style.display = 'block';
        
        enterGame ();
        
    }

    readDeviceOrientation();

    this.addEventListener("orientationchange", function() {
        readDeviceOrientation()
    });

    function readDeviceOrientation () {


        if ( window.orientation == undefined  ) return;

        var landscape = Math.abs ( window.orientation) == 0;

        var btn_enter =  document.getElementById('btnEnter');

        btn_enter.disabled = ( landscape ) ? true : false; 

        var message_div =  document.getElementById('messageDiv');

        message_div.innerHTML = ( !landscape ) ? '' : '<small>Please set device orientation to landscape.</small>';

    }

    function enterGame () {

        var maxW = 1280;

        var container = document.getElementById('game_container');

        var contW = container.clientWidth,
            contH = container.clientHeight;

        var tmpWidth = contW > maxW ? maxW : contW,
            tmpHeight = Math.ceil(tmpWidth * 9/16);

        if ( tmpHeight >= contH ) {

            _gH = contH;
            _gW = Math.ceil(_gH * 16/9);
            console.log ( 'game dimensions adjusted by screen height' )

        }else {

            _gW = tmpWidth;
            _gH = tmpHeight;
            console.log ( 'game dimensions adjusted by screen width' )
        }

        console.log ( _gW, _gH );

        _scale = _gW / maxW;

        
        var game_div = document.getElementById('game_div');
        game_div.style.width = _gW + 'px';
        game_div.style.height = _gH + 'px';
     

        config = {

            type: Phaser.AUTO,
            width: _gW,
            height: _gH,
            backgroundColor: '#dedede',
            audio: {
                disableWebAudio: false
            },
            parent:'game_div',
            scene: [ Intro ]

        };

        game = new Phaser.Game(config);

        //socket = io();
        
        //socket.emit ('initUser', username.value );

    }

    var Intro = new Phaser.Class({

        Extends: Phaser.Scene,

        initialize:

        function Intro ()
        {
            Phaser.Scene.call(this, { key: 'sceneA' });
        },

        preload: function ()
        {

          
            this.load.audioSprite('sfx', 'client/assets/sfx/fx_mixdown.json', [
                'client/assets/sfx/sfx.ogg',
                'client/assets/sfx/sfx.mp3'
            ]);
            
            this.load.audio ('bgsound2', ['client/assets/sfx/bgsound.ogg', 'client/assets/sfx/bgsound.mp3'] );

            this.load.audio ('bgsound', ['client/assets/sfx/bgsound2.ogg', 'client/assets/sfx/bgsound2.mp3'] );
            
            this.load.spritesheet('kinds', 'client/assets/images/kinds.png', { frameWidth: 100, frameHeight: 100 });

            this.load.spritesheet('kinds_sm', 'client/assets/images/kinds_sm.png', { frameWidth: 25, frameHeight: 25 });

            this.load.spritesheet('card', 'client/assets/images/card.png', { frameWidth: 102, frameHeight: 137 });

            this.load.spritesheet('people', 'client/assets/images/people.png', { frameWidth: 100, frameHeight: 135 });

          
            var rctW = _gW * 0.25, 
                rctH = 20 * _scale,
                rctX = (_gW - rctW )/2,
                rctY = _gH * 0.52;
        
            var txtConfig = {
                color : "#333",
                fontSize : 30 * _scale,
                fontFamily : 'Oswald'
            }

            this.loadtxt = this.add.text ( _gW/2, _gH * 0.48, 'Loading Files..', txtConfig ) .setOrigin(0.5);
            
            this.loadrect = this.add.rectangle ( rctX, rctY, rctW * 0.02, rctH, 0xff6666, 1 ).setOrigin(0);

            var smtxt = this.add.text (_gW/2, _gH*0.9, '@chalnicol', { color:'gray', fontSize: 15 *_scale, fontFamily:'Oswald'} ).setOrigin(0.5);

            //...
            this.load.on('progress', function (value) {

                var perc = Math.floor ( value * 100 );
                
                this.loadtxt.text = 'Loading Files.. ' + perc + '%';
                
                this.loadrect.width = rctW * value;

            }, this );

            this.load.on('complete', function () {
                this.loadtxt.destroy();
                this.loadrect.destroy();
            }, this );

        },
        create: function () {

            this.card = {
                w : 100 * _scale,  h : 135 * _scale,
            };

            this.mode = 'easy';

            this.initMenuInterface ();

            this.initMenuSound ();

            this.initCardsHolder ();
            
            this.initControls ();

            this.time.delayedCall ( 500, this.initCards, [], this );

            //this.time.delayedCall ( 1000, this.initControls, [], this );


        },
        initMenuSound : function () {


            this.bgmusic = this.sound.add('bgsound').setVolume(0.2).setLoop(true);
            this.bgmusic.play();

            this.music = this.sound.addAudioSprite('sfx');

        },
        initMenuInterface : function () {

            var _this = this;

            var bg = this.add.rectangle (0, 0, _gW, _gH, 0x009933, 1 ).setOrigin(0);

           
        },
        initCardsHolder : function () {


            this.mainContainer = this.add.container ( 0, 0 );

            var padding = 30 * _scale,
                strk = Math.floor ( 15 * _scale);

            var cardW = this.card.w, 
                cardH = this.card.h;


            var initialBox = this.add.container ( padding + cardW/2, padding + cardH/2 ).setSize( cardW, cardH).setInteractive ().setName ('initBox');
        
            var recta = this.add.rectangle ( 0, 0, cardW, cardH, 0xffffff, 0.5 );

            var circlea = this.add.circle ( 0, 0, cardW * 0.3 ).setStrokeStyle ( strk, 0xff0000 );

            initialBox.add ([ recta, circlea ]);

            initialBox.on ('pointerdown', function () {
                this.disableInteractive ();
                this.scene.initialBoxClick ();
            });

            this.mainContainer.add ( initialBox );

                
            //homeContainers...
            var spcng = 10 * _scale;

            var stx = _gW - ( (4 * (cardW + spcng)) - spcng ) - padding + (cardW/2), 
                sty = padding + (cardH/2);

            for ( var i = 0; i < 4; i++ ) {

                var xs = stx + i * ( cardW + spcng ),
                    ys = sty;

                var homeContainer = this.add.container ( xs, ys ).setData( { 'resided' : false, 'kind' : -1, topVal : -1 } ).setName ('home' + i );
                
                var rectb = this.add.rectangle ( 0, 0, cardW, cardH, 0xffffff, 0.5 )

                var circleb = this.add.circle ( 0, 0, cardW * 0.3 ).setStrokeStyle ( strk, 0x33ffff );

                homeContainer.add ( [ rectb, circleb ]);

                this.mainContainer.add ( homeContainer );

            }

            //fieldContainer...

            var fw = _gW - ( 2 * padding ),
                fs = ( fw - (7 * cardW ) ) / 6,
                fx = padding + (cardW/2), 
                fy = (200 * _scale) + cardH/2;

            for ( var i = 0; i < 7; i++ ) {

                var xp = fx + i * (cardW + fs),
                    yp = fy;

                var fieldContainer = this.add.container ( xp, yp ).setName ('field' + i ).setData('col', i );

                var rectc = this.add.rectangle ( 0, 0, cardW, cardH, 0xffffff, 0.5 );

                var circlec = this.add.circle ( 0, 0, cardW * 0.3 ).setStrokeStyle ( strk, 0x6b6b6b);

                fieldContainer.add ([rectc, circlec]);

                this.mainContainer.add ( fieldContainer );

            }


        },
        initControls : function () {

            var xs = 620 * _scale, ys = 30 * _scale + this.card.h/2;

            var rect = this.add.rectangle ( xs, ys, 300 *_scale, 135 * _scale, 0xffffff, 0.5 );

            var txt = this.add.text ( xs, 48*_scale, 'Controls', {color:'#333', fontFamily:'Oswald', fontSize : 16*_scale } ).setOrigin(0.5);

            var btnData = [{ 'id':'restart', val:"Restart Game" }, { 'id':'leave', val:"Leave Game" } ];

            var bw = 270*_scale, 
                bh = 40 * _scale,
                bs = bh * 0.2,
                by =  85 *_scale;

            for ( var i = 0; i < btnData.length; i++ ){

                var rct = this.add.container ( xs, by + i * (bh+bs) ).setSize ( bw, bh).setInteractive().setData ('id', btnData[i].id );

                var rcta = this.add.rectangle ( 0,0, bw, bh, 0xcecece, 1);

                var txet = this.add.text ( 0,0, btnData[i].val, { color:'#333', fontSize:bh*0.5, fontFamily:'Oswald'}).setOrigin(0.5);

                rct.add ([ rcta, txet]);

                rct.on ('pointerover', function () {
                    this.getAt (0).setFillStyle ( 0xdedede, 1 );
                });
                rct.on ('pointerout', function () {
                    this.getAt (0).setFillStyle ( 0xcecece, 1 );
                });
                rct.on ('pointerup', function () {
                    this.getAt (0).setFillStyle ( 0xcecece, 1 );
                });
                rct.on ('pointerdown', function () {
                    
                    this.scene.playSound ('clicka');

                    if ( this.getData('id') == 'restart') {
                        
                        if ( this.scene.isPrompted ) return;
                        
                        this.scene.restartPrompt ();

                    }else {

                        this.scene.leaveGame ();
                    }
                   
                });


            }



        },
        initCards : function () {

            var _this = this;
            
            var strVal = ['A', '2','3','4','5','6','7','8','9','10','J','Q', 'K' ];

            var rndOrd = this.generateRandomOrder ();

            
            this.cardContainer = this.add.container( 0, 0 );

            this.topCardCount = 0; 
            
            this.cardsOutCount = 0;

            this.initialCards = [];

            var cw = this.card.w,
                ch = this.card.h;

            var cx = this.mainContainer.getByName ('initBox').x,
                cy = this.mainContainer.getByName ('initBox').y;

            for ( var i = 0; i < rndOrd.length; i++ ) {

                var knd = Math.floor ( rndOrd[i] / 13 ),
                    val = rndOrd [i] % 13,
                    str = strVal [ val ];

                var crd = new Card ( this, 'card'+ i, cx, cy, cw, ch, knd, val, str, false );

                crd.on ('pointerover', function () {
                    this.getAt (0).setTint ( 0xdedede );
                });
                crd.on ('pointerup', function () {
                    this.getAt (0).clearTint ();
                });
                crd.on ('pointerout', function () {
                    this.getAt (0).clearTint ();
                });
                crd.on ('pointerdown', function () {
                    _this.cardClick ( this.id );
                });

                this.cardContainer.add ( crd );

                this.initialCards.push ( crd );

            }



            this.fieldedCards = [];

            var counter = 0;

            for ( var i = 0; i < 7; i++ ) {

                this.fieldedCards [i] = [];

                var fc = this.mainContainer.getByName ('field' + i );

                for ( var j = 0; j < (i + 1); j++ ) {

                    var card = this.cardContainer.getByName ( 'card' + (51 - counter) );

                    this.cardContainer.bringToTop ( card );

                    card.setPost ( 'field', i, j );

                    if ( i == j ) card.enabled();

                    this.tweens.add ({
                        targets : card,
                        x : fc.x,
                        y : fc.y + j * ( ch * 0.2 ),
                        duration : 100,
                        ease : 'Power2',
                        delay : counter * 10,
                        onComplete : function () {
                            if ( this.targets [0].isEnabled ) this.targets[0].flip();
                        }
                    });

                    this.initialCards.pop();

                    this.fieldedCards[i].push ( card );

                    counter += 1;
                }
            }

            this.time.delayedCall ( 50, function () {
                this.playSound ('ending');
            }, [], this);
            //...

        },
        initialBoxClick : function () {

            this.playSound ('clickb');

            var openX = 200 * _scale 
            if ( this.topCardCount < this.initialCards.length ) {

                if ( this.mode == 'easy') {

                    if ( this.topCardCount > 0 ) {

                        var prevCard = this.initialCards [ this.initialCards.length - this.topCardCount ];

                        prevCard.enabled (false);

                    }

                    var cnt = this.initialCards.length - this.topCardCount - 1 ;

                    var card = this.initialCards [ cnt ];

                    this.cardContainer.bringToTop ( card );
        
                    card.flip().enabled();
                    
                    
                    if ( this.cardsOutCount > 3 ) {

                        card.x = openX + ( this.cardsOutCount * (card.width*0.3));

                    } else {

                        this.tweens.add ({
                            targets: card,
                            x : openX + ( this.cardsOutCount * (card.width*0.3)),
                            duration : 100,
                            ease : 'Power2',
                        });

                    }
                    
                    this.topCardCount += 1;

                    if ( this.cardsOutCount < 4 ) this.cardsOutCount += 1;

                    if ( this.cardsOutCount >= 4 ) {
                        
                        //console.log ( 'move' );
                        this.cardsOutCount = 3;

                        var len = this.initialCards.length;

                        var latest = this.topCardCount - 2;

                        for ( var j = 0; j < 3; j++ ) {

                            var tc = this.initialCards [ len - (j + latest) ];

                            this.tweens.add ({
                                targets: tc,
                                x : openX + j * ( tc.width*0.3),
                                duration : 200,
                                ease : 'Power2',
                                delay : 100
                            });

                        }

                    }

                    

                }else {

                    
                    for ( var j = 0; j < this.topCardCount; j++ ) {

                        var last = this.initialCards.length - 1;

                        this.initialCards [ last - j ].enabled ( false ).setX ( openX );

                    }


                    var diff = this.initialCards.length - this.topCardCount;

                    var toDraw = diff >= 3 ? 3 : diff;

                    for ( var i = 0; i < toDraw; i++ ) {

                        var cnt = ( this.initialCards.length - 1 ) - this.topCardCount;

                        var card = this.initialCards [ cnt ];

                        this.cardContainer.bringToTop ( card );
        
                        this.tweens.add ({
                            targets: card,
                            x : openX + i * ( card.width * 0.3 ),
                            duration : 100,
                            ease : 'Power2'
                        });

                        card.flip();
             
                        this.topCardCount += 1;

                    }

                    card.enabled ();

                }
                
                this.time.delayedCall ( 400 , function () {
                    this.mainContainer.getByName ('initBox').setInteractive ();
                }, [], this);

            }else {

                
                var initBox = this.mainContainer.getByName ('initBox');

                for ( var i in this.initialCards ) {

                    var card = this.initialCards [i];

                    this.mainContainer.bringToTop ( card );

                    card.setX ( initBox.x ).flip ('').enabled(false);
                }

                this.topCardCount = 0;

                if ( this.mode == 'easy' ) this.cardsOutCount = 0;

                this.time.delayedCall ( 100 , function () {
                    this.mainContainer.getByName ('initBox').setInteractive ();
                }, [], this);

            }
        },
        cardClick : function ( id ) {

            var card = this.cardContainer.getByName ( id );

            var newPost = this.getFieldPosition ( card );

            var homePost = this.getHomePosition ( card );

            var cardIsAtBottom = this.getCardIsAtBottom( card );

            if ( homePost != null ) {

                this.cardContainer.bringToTop ( card );

                var home = this.mainContainer.getByName ('home' + homePost );

                home.setData ({ 'resided' : true, 'topVal' : card.val, 'knd': card.knd });

                this.resultAction ( card );

                this.tweens.add ({
                    targets : card,
                    x : home.x,
                    y : home.y, 
                    duration : 100,
                    ease : "Quad.easeIn"
                });

                card.setHome ( homePost );

                this.playSound ('clickb');
                    
            }
            else if ( newPost != null ) {

                if ( !cardIsAtBottom ) {

                    this.cardContainer.bringToTop ( card );

                    if ( newPost.col >= 0 ) this.fieldedCards [ newPost.col ].push ( card );

                    this.resultAction ( card );
                
                    this.tweens.add ({
                        targets : card,
                        x : newPost.x,
                        y : newPost.y, 
                        duration : 100,
                        ease : "Quad.easeIn"
                    });

                    card.setPost ( 'field', newPost.col, newPost.row );

                }else {

                    var initRow = card.row, initCol = card.col;

                    var arr = this.fieldedCards[ initCol ].slice ( initRow );

                    //console.log ('is at bottom', arr.length );

                    for ( var i = 0; i < arr.length; i++ ) {

                        var crd = arr [i];

                        this.cardContainer.bringToTop ( crd );

                        this.tweens.add ({
                            targets : crd,
                            x : newPost.x,
                            y : newPost.y + (i * crd.height*0.2 ), 
                            duration : 100,
                            ease : "Quad.easeIn"
                        });

                        crd.currentPost = 'field';
                        crd.setPost ( 'field', newPost.col, newPost.row + i );

                        this.fieldedCards [newPost.col].push ( crd );
                        
                    }

                    this.fieldedCards[initCol].splice ( initRow );

                    if ( this.fieldedCards[initCol].length > 0 ) {

                        var backCard = this.fieldedCards[initCol][ this.fieldedCards[initCol].length - 1];
                    
                        backCard.flip().enabled();
                    }
                    

                    //..
                
                }

                this.playSound ('clickb');

            }
            else {
                
                this.playSound ('error');
            }
            
        },
        resultAction : function ( card ) {


            if ( card.currentPost == '' ) {

                var index = this.getCurrentIndex ( card.id );

                this.initialCards.splice ( index, 1 );

                if ( index != this.initialCards.length ) {
                    this.initialCards [index].enabled ();
                }
                
                this.topCardCount += -1;
                
                if ( this.mode == 'easy' ) {

                    if ( this.topCardCount <= 0 ) {

                        this.cardsOutCount = 0;

                    }else {

                        if ( this.cardsOutCount > 1 )  this.cardsOutCount += -1;
                    }

                }


            }else if ( card.currentPost == 'field' ) {

                this.fieldedCards [ card.col ].pop ();

                if ( this.fieldedCards [card.col].length > 0 ) {

                    var newLast = this.fieldedCards [ card.col ].length - 1;

                    this.fieldedCards [ card.col ] [newLast].flip ().enabled();
                }


            }else {

                var home = this.mainContainer.getByName ('home' + card.home ) ;

                home.setData ('topVal', card.val - 1 );


            }
            
        },
        getCardIsAtBottom : function ( card ) {

            //console.log ( card.currentPost );

            if ( card.currentPost == 'field' ) {
                if ( this.fieldedCards [ card.col ].length - 1 != card.row ) return true;
            }
            return false;
        },
        getCurrentIndex : function ( id, cp='' ) {

            if ( cp == '' ) {

                for ( var i in this.initialCards ) {
                    if ( this.initialCards [i].id == id ) {
                        return i;
                    }
                }

            }

            return null;

        },
        getFieldPosition : function ( data ) {

            var clr = data.clr,
                val = data.val,
                col = data.col;

            if ( val !== 0 ) {

                if ( val == 12 ) {

                    for ( var i in this.fieldedCards ) {

                        if ( this.fieldedCards [i].length == 0 ) {

                            return { 
                                'x' : this.mainContainer.getByName('field' + i ).x, 
                                'y' : this.mainContainer.getByName('field' + i ).y,
                                'col' : i, 'row' : 0
                            }
                        }
                    }

                } else {

                    for ( var i in this.fieldedCards ) {

                        if ( this.fieldedCards[i].length > 0 ) {

                            var last = this.fieldedCards[i].length - 1;
        
                            var lastCard = this.fieldedCards [i] [last];
            
                            if ( i != col ) {
            
                                if ( lastCard.clr != clr && lastCard.val == ( val + 1) ) {
            
                                    return { 
                                        'x' : lastCard.x, 'y' : lastCard.y + (lastCard.height * 0.2),
                                        'col' : lastCard.col,
                                        'row' : lastCard.row + 1
                                    }
        
                                }
                            }

                        }
                    
                    }

                }
            }
            return null;

        },
        getHomePosition : function ( data ) {


            var isBottom = this.getCardIsAtBottom ( data );

            if ( !isBottom && data.currentPost != 'home') {

                for ( var i = 0; i < 4; i++ ) {

                    var home = this.mainContainer.getByName ('home' + i);
    
                    if ( data.val == 0 && data.currentPost != 'home' && !home.getData('resided') ) return i;
    
                    if ((data.val - 1) == home.getData('topVal') && data.knd == home.getData ('knd')  ) return i;
    
                    /* if ( data.val >= 2 ) {
    
                        var fpos = this.getFieldPosition ( data );
    
                        if ( fpos == null && (data.val - 1) == home.getData('topVal') && data.knd == home.getData ('knd')  ) return i;
    
                    } */
                    
                }
            }
            return null;

        },
        generateRandomOrder : function () {

            var tempArr = [];

            for ( var i = 0; i < 52; i++ ) {
                tempArr.push (i);
            }

            var finArr = [];

            while ( tempArr.length > 0 ) {

                var rnd = Math.floor ( Math.random() * tempArr.length );

                finArr.push ( tempArr [ rnd ] );

                tempArr.splice ( rnd, 1 );
            }

            return finArr;

        },
        restartPrompt : function () {

            this.isPrompted = true;

            this.promptContainer = this.add.container ( 0, 0 );

            var rect = this.add.rectangle ( _gW/2, _gH/2, 450*_scale, 200*_scale, 0x0a0a0a, 0.96 );

            var txtr = this.add.text ( _gW/2, _gH * 0.44, 'Are you sure you want to restart?', { color:'#f4f4f4', fontSize:26*_scale, fontFamily:'Oswald'}).setOrigin(0.5);

            this.promptContainer.add ( [rect, txtr] );

            var bw = 130*_scale, bh = 45 * _scale, bs= bw * 0.15;

            var fx = (_gW - (2 * ( bw + bs ) - bs))/2 + bw/2,
                fy = _gH *0.56;

            for ( var i = 0; i < 2; i++ ) {

                var miniContainer = this.add.container ( fx + i * ( bw+bs), fy ).setSize(bw, bh).setData('id', i).setInteractive ();

                var rectbtn = this.add.rectangle ( 0, 0, bw, bh, 0x9a9a9a, 1 );

                var txtbtn = this.add.text (0, 0, i == 0? 'Yes' : 'No', { color:'#333', fontSize:bh*0.5, fontFamily:'Oswald'}).setOrigin (0.5);

                miniContainer.add ( [rectbtn, txtbtn]);

                miniContainer.on ('pointerover', function () {
                    this.getAt (0).setFillStyle ( 0xa3a3a3, 1 );
                });
                miniContainer.on ('pointerout', function () {
                    this.getAt (0).setFillStyle ( 0xcecece, 1 );
                });
                miniContainer.on ('pointerup', function () {
                    this.getAt (0).setFillStyle ( 0xcecece, 1 );
                });
                miniContainer.on ('pointerdown', function () {
                    
                    this.scene.playSound ('clicka');

                    if ( this.getData ('id') == 0 ) {
                        this.scene.resetGame ();
                    }else {
                        this.scene.removePrompt();
                    }
                });

                this.promptContainer.add ( miniContainer );

            }

            //..
        },
        removePrompt : function () {

            if ( !this.isPrompted ) return;

            this.isPrompted = false;

            this.promptContainer.destroy ();

        },
        resetGame : function () {

            this.removePrompt ();

            this.cardContainer.destroy();

            for ( var i = 0; i < 4; i++ ) {
                var home = this.mainContainer.getByName ('home' + i );
                home.setData ({
                    resided : false,
                    topVal : -1, kind : -1
                });
            }

            this.time.delayedCall ( 300, this.initCards, [], this );

            //this.initCards ();
        },
        leaveGame : function () {

            console.log ('todo exit');
        },
        playSound : function ( snd, vol=0.5) {
            this.music.play ( snd, { volume : vol });
        }

    });


    // Container Class..
    var Card =  new Phaser.Class({

        Extends: Phaser.GameObjects.Container,

        initialize:

        function Card ( scene, id, x, y, width, height, knd, val, strVal, isFlipped )
        {

            Phaser.GameObjects.Container.call( this, scene )

            this.setPosition(x, y).setSize( width, height).setName ( id );

            this.id = id;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.clr = knd < 2 ? 0 : 1,
            this.knd = knd;
            this.val = val;
            this.strVal = strVal;
            this.currentPost = '';
            this.isFlipped = isFlipped;
            this.isEnabled = false;
            this.row = -1;
            this.col = -1;
            this.home = 0;


            var cardbg = scene.add.image ( 0, 0, 'card', isFlipped ? 0 : 1 ).setScale (_scale );

            var txtConfig = { 
                fontSize: height*0.25, 
                fontFamily:'Oswald', 
                color : this.clr == 0 ? 'black' : 'red' 
            };


            var frame = 0;

            if ( val >= 10 ) {
                frame = this.clr == 0 ? val - 9 : (val - 9) + 4; 
            }

           

            var txt = scene.add.text ( -width *0.3, -height*0.32, strVal, txtConfig ).setOrigin (0.5).setVisible (isFlipped);

            var kind_sm = scene.add.sprite ( -width *0.3 , -height*0.07, 'kinds', knd ).setScale ( width*0.3/100 ).setVisible (isFlipped);

            var kind_lg = scene.add.sprite ( width* 0.13, height*0.2, 'kinds', knd ).setScale ( width*0.85/100 ).setVisible (isFlipped).setAlpha ( val > 9 ? 0.3 : 1 );

            var txte = scene.add.text ( width *0.3, -height*0.4, strVal, txtConfig ).setOrigin (1, 0.5).setFontSize ( height * 0.12 ).setVisible (isFlipped);

            var kind_xs = scene.add.image (width *0.45, -height*0.4 , 'kinds_sm', knd ).setOrigin (1, 0.5).setScale (width*0.18/25).setVisible (isFlipped);

            var img  = scene.add.sprite ( 0,0, 'people', frame ).setScale ( _scale ).setVisible (isFlipped);

            this.add ( [ cardbg, txt, kind_sm, kind_lg, txte, kind_xs, img ] );

            scene.children.add ( this );

        },

        flip: function ( state = 'up' ) {

            var isUp = state == 'up';

            this.getAt ( 0 ).setFrame ( isUp ? 0 : 1 );
            
            for ( var i = 0; i < 6; i++) {
                this.getAt ( i + 1 ).setVisible ( isUp );
            }   
            
            return this;

        },
        enabled : function ( state = true ) {

            this.isEnabled = state;

            if ( state ) {
                this.setInteractive ();
            }else {
                this.disableInteractive ();
            }
            return this;

        },
        setPost : function ( cp, col=0, row=0 ) {

            this.currentPost = cp; 

            this.col = col;
            this.row = row;
            
            return this;
        },
        setHome : function ( nmbr ) {

            this.col = 100;
            this.row = 100;

            this.currentPost = 'home';
            this.home = nmbr;
        }
   
    });

} 
