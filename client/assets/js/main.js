
window.onload = function () {


    class SceneA extends Phaser.Scene {

        constructor ()
        {
            super('SceneA');
        }
        preload ()
        {

            this.load.audioSprite('sfx', 'client/assets/sfx/fx_mixdown.json', [
                'client/assets/sfx/sfx.ogg',
                'client/assets/sfx/sfx.mp3'
            ]);

            this.load.audio ('bgsound2', ['client/assets/sfx/bgsound.ogg', 'client/assets/sfx/bgsound.mp3'] );

            this.load.audio ('bgsound', ['client/assets/sfx/bgsound2.ogg', 'client/assets/sfx/bgsound2.mp3'] );

            this.load.image('bg', 'client/assets/images/bg.png');

            this.load.image('title', 'client/assets/images/title.png');

            this.load.spritesheet('kinds', 'client/assets/images/kinds.png', { frameWidth: 100, frameHeight: 100 });

            this.load.spritesheet('kinds_sm', 'client/assets/images/kinds_sm.png', { frameWidth: 25, frameHeight: 25 });

            this.load.spritesheet('card', 'client/assets/images/card.png', { frameWidth: 102, frameHeight: 137 });

            this.load.spritesheet('menu_btn', 'client/assets/images/menu_btn.png', { frameWidth: 255, frameHeight: 255 });

            this.load.spritesheet('people', 'client/assets/images/people.png', { frameWidth: 100, frameHeight: 135 });


            const txtConfig = {
                color : "#333",
                fontSize : 26,
                fontFamily : 'Oswald'
            }

            let loadtxt = this.add.text ( _gW/2, 330, 'Loading Files..', txtConfig ) .setOrigin(0.5);

            const rctW = 400, rctH = 30,
                  rctX = (_gW - rctW )/2,
                  rctY = _gH * 0.52;


            let loadrect = this.add.rectangle ( rctX, rctY, rctW * 0.02, rctH, 0xff6666, 1 ).setOrigin(0, 0.5 );

            let loadbrect = this.add.rectangle ( (_gW - (rctW+10) )/2, rctY, rctW + 10, rctH + 10 ).setStrokeStyle ( 3, 0x3a3a3a ).setOrigin (0, 0.5);

            let smtxt = this.add.text (_gW/2, _gH*0.9, 'Chalnicol Studio® 2020', { color:'gray', fontSize: 20 *_scale, fontFamily:'Oswald'} ).setOrigin(0.5);

            //...
            this.load.on('progress', function (value) {

                let perc = Math.floor ( value * 100 );

                loadtxt.text = 'Loading Files.. ' + perc + '%';

                loadrect.width = rctW * value;

            }, this );

            this.load.on('complete', function () {
                loadtxt.destroy();
                loadrect.destroy();
            }, this );

        }
        create ()
        {
            this.initMenuSound ();

            this.initMenuInterface ();
        }
        initMenuSound ()
        {
            this.bgmusic = this.sound.add('bgsound2').setVolume(0.1).setLoop(true);
            this.bgmusic.play();

            this.gameSound = this.sound.addAudioSprite('sfx');
        }
        initMenuInterface ()
        {

            this.add.image ( _gW/2, _gH/2,'bg' ).setScale(_scale );

            let title = this.add.image ( _gW/2, -_gH/2,'title' ).setScale(_scale );

            this.tweens.add ({
              targets : title,
              y : _gH/2,
              rotation : 0,
              duration : 300,
              ease : 'Power2',
              onStartScope: this,
              onStart: function () {
                this.gameSound.play ('move')
              }
            });

            let bz = 255, bs = bz * 0.2,
                bx = (_gW - ( ( 2 * bz ) + bs ))/2 + bz/2,
                by = 440;

            for ( let i = 0; i < 2; i++ ) {

                let xs = bx + i * ( bz + bs );

                let img = this.add.image ( xs + 950, by, 'menu_btn', i ).setData('id', i ).setInteractive();

                img.on ('pointerover', function () {
                    this.setTint (0xcecece);
                });
                img.on ('pointerout', function () {
                    this.clearTint ();
                });
                img.on ('pointerup', function () {
                    this.clearTint ();
                });
                img.on ('pointerdown', function () {

                    let mode = this.getData('id') == 0 ? 'easy' : 'hard';

                    this.scene.gameSound.play('clicka');

                    this.scene.startGame (mode);

                });

                this.tweens.add ({
                    targets : img,
                    x : xs,
                    duration : 500,
                    easeParams : [ 1, 0.9 ],
                    ease : 'Elastic',
                    delay : (i * 300) + 300,
                    onStartScope: this,
                    onStart: function () {
                        this.gameSound.play ('move');
                    }
                });


            }

        }
        startGame ( mode ) {

            

            this.bgmusic.stop();

            this.scene.start ('SceneB', mode );
        }

    }

    class SceneB extends Phaser.Scene {

        constructor ()
        {
            super('SceneB');
        }
        init ( data )
        {
            this.mode = data;
        }
        create ()
        {

            this.isGameOn = false;

            this.initGraphics ();

            this.initMenuSound ();

            this.initCardsHolder ();

            this.initControls ();

            this.time.delayedCall ( 500, this.initCards, [], this );

        }
        initMenuSound ()
        {

            this.bgmusic = this.sound.add('bgsound').setVolume(0.2).setLoop(true);
            this.bgmusic.play();

            this.gameSound = this.sound.addAudioSprite('sfx');

        }
        initGraphics ()
        {

            this.isPrompted = false;

            this.add.image ( _gW/2, _gH/2,'bg' );

        }
        initCardsHolder ()
        {

            this.card = {
                w : 100 * _scale,  h : 135 * _scale,
            };

            this.crdSpacing = this.card.w * 0.3;

            this.mainContainer = this.add.container ( 0, 0 );

            let padding = 30,
                strk = 15;

            var cardW = this.card.w,
                cardH = this.card.h;


            var initialBox = this.add.container ( padding + cardW/2, padding + cardH/2 ).setSize( cardW, cardH).setInteractive ().setName ('initBox');

            var recta = this.add.rectangle ( 0, 0, cardW, cardH, 0xffffff, 0.6 );

            var circlea = this.add.circle ( 0, 0, cardW * 0.3 ).setStrokeStyle ( strk, 0xff0000 );

            initialBox.add ([ recta, circlea ]);

            initialBox.on ('pointerdown', function () {
                this.initialBoxClick ();
            }, this);

            this.mainContainer.add ( initialBox );


            //homeContainers...
            var spcng = 10 * _scale;

            var stx = _gW - ( (4 * (cardW + spcng)) - spcng ) - padding + (cardW/2),
                sty = padding + (cardH/2);

            for ( var i = 0; i < 4; i++ ) {

                var xs = stx + i * ( cardW + spcng ),
                    ys = sty;

                var homeContainer = this.add.container ( xs, ys ).setData( { 'resided' : false, 'kind' : -1, topVal : -1 } ).setName ('home' + i );

                var rectb = this.add.rectangle ( 0, 0, cardW, cardH, 0xffffff, 0.6 )

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

                var fieldContainer = this.add.container ( xp, yp ).setName ('field' + i ).setData( {'col': i, 'spacing': 0 });

                var rectc = this.add.rectangle ( 0, 0, cardW, cardH, 0xffffff, 0.6 );

                var circlec = this.add.circle ( 0, 0, cardW * 0.3 ).setStrokeStyle ( strk, 0x6b6b6b);

                fieldContainer.add ([rectc, circlec]);

                this.mainContainer.add ( fieldContainer );

            }


        }
        initControls ()
        {

            var xs = 620 * _scale, ys = 30 * _scale + this.card.h/2;

            var rect = this.add.rectangle ( xs, ys, 300 *_scale, 135 * _scale, 0xffffff, 0.5 );

            var txt = this.add.text ( xs, 48*_scale, 'Controls', {color:'#333', fontFamily:'Oswald', fontSize : 16*_scale } ).setOrigin(0.5);

            var btnData = [{ 'id':'restart', val:"Play Another Game" }, { 'id':'leave', val:"Leave Game" } ];

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
                    this.getAt (0).setFillStyle ( 0xffffff, 1 );
                });
                rct.on ('pointerout', function () {
                    this.getAt (0).setFillStyle ( 0xcecece, 1 );
                });
                rct.on ('pointerup', function () {
                    this.getAt (0).setFillStyle ( 0xcecece, 1 );
                });
                rct.on ('pointerdown', function () {

                    if ( !this.scene.isGameOn ) return;

                    this.getAt (0).setFillStyle ( 0xffffff, 1 );

                    this.scene.playSound ('clicka');

                    if ( this.getData('id') == 'restart') {

                        this.scene.restartPrompt ();

                    }else {

                        this.scene.leavePrompt ();
                    }

                });


            }



        }
        initCards ()
        {

            let strVal = ['A', '2','3','4','5','6','7','8','9','10','J','Q', 'K' ];

            let rndOrd = this.generateRandomOrder ();

            this.cardContainer = this.add.container( 0, 0 );

            this.cardsMoving = false;

            this.isGameOn = true;

            this.topCardCount = 0;

            this.cardsOutCount = 0;

            this.vel = 150;

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
                    this.scene.cardClick ( this.id );
                });

                this.cardContainer.add ( crd );

                this.initialCards.push ( crd );

            }

            this.fieldedCards = [];

            var counter = 0;

            for ( var i = 0; i < 7; i++ ) {

                this.fieldedCards [i] = [];

                var fc = this.mainContainer.getByName ('field' + i );

                fc.setData ('spacing', 0 );

                for ( var j = 0; j < (i + 1); j++ ) {

                    var card = this.cardContainer.getByName ( 'card' + (51 - counter) );

                    this.cardContainer.bringToTop ( card );

                    card.setPost ( i, j );

                    if ( i == j ) card.enabled();

                    this.tweens.add ({
                        targets : card,
                        x : fc.x,
                        y : fc.y + j * ( this.crdSpacing ),
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

        }
        initialBoxClick ()
        {

            this.playSound ('clickb');

            let box = this.mainContainer.getByName ('initBox');

            box.disableInteractive ();

            var openX = 200 * _scale ;

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

                    this.tweens.add ({
                        targets: card,
                        x : openX + ( this.cardsOutCount * (card.width*0.3)),
                        duration : 200,
                        ease : 'Power3',
                    });

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
                                ease : 'Power3',
                                delay : 400
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
                    box.setInteractive ();
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
        }
        cardClick ( id )
        {

            if ( this.cardsMoving || !this.isGameOn ) return;

            var card = this.cardContainer.getByName ( id );

            var cardData = this.getCardDataForAction ( card );

            //get home position if available
            var homePost = this.getHomePosition ( cardData );

            //or get field position if available
            var newPost = this.getFieldPosition ( cardData );


            if ( homePost != null ) {

                this.playSound ('clickb');

                var home = this.mainContainer.getByName ('home' + homePost );

                home.setData ({'topVal' : card.val, 'knd': card.knd });

                this.cardContainer.bringToTop ( card );

                this.tweens.add ({
                    targets : card,
                    x : home.x,
                    y : home.y,
                    duration : 100,
                    ease : "Quad.easeIn"
                });

                card.setHome ( homePost );

                //..checking...

                this.resultAction ( cardData );

                this.sendHomers ();

            }
            else if ( newPost != null ) {

                this.playSound ('clickb');

                 //check if card is being overlapped if at field..
                var crdIsOverlapped = this.getCardIsAtBottom( cardData )

                if ( !crdIsOverlapped ) {

                    this.cardContainer.bringToTop ( card );

                    this.tweens.add ({
                        targets : card,
                        x : newPost.x,
                        y : newPost.y,
                        duration : 100,
                        ease : "Quad.easeIn"
                    });

                    card.setPost ( newPost.col, newPost.row );

                    this.fieldedCards [ newPost.col ].push ( card );


                }else {

                    var initRow = card.row, initCol = card.col;

                    var arr = this.fieldedCards[ initCol ].slice ( initRow );

                    for ( var i = 0; i < arr.length; i++ ) {

                        var crd = arr [i];

                        this.cardContainer.bringToTop ( crd );

                        this.tweens.add ({
                            targets : crd,
                            x : newPost.x,
                            y : newPost.y + (i * this.crdSpacing ),
                            duration : 100,
                            ease : "Quad.easeIn"
                        });

                        //crd.currentPost = 'field';
                        crd.setPost ( newPost.col, newPost.row + i );

                        this.fieldedCards [newPost.col].push ( crd );

                    }

                    this.fieldedCards[initCol].splice ( initRow );

                }

                this.resultAction ( cardData, crdIsOverlapped );

                if ( cardData.currentPost != 'home' ) this.sendHomers ();

            }
            else {

                this.playSound ('error');
            }

        }
        getCardDataForAction ( crd )
        {

           return {
               id : crd.id,
               knd : crd.knd,
               clr : crd.clr,
               row : crd.row,
               col : crd.col,
               val : crd.val,
               home : crd.home,
               currentPost : crd.currentPost
           }

        }
        resultAction ( data, isOverlapped = false )
        {


            switch ( data.currentPost ) {

                case "":

                    var index = this.getInitIndex ( data.id );

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

                break;

                case "field" :

                    if ( !isOverlapped ) this.fieldedCards [ data.col ].pop ();

                    if ( this.fieldedCards [data.col].length > 0 ) {

                        var newLast = this.fieldedCards [ data.col ].length - 1;

                        this.fieldedCards [ data.col ] [newLast].flip ().enabled();
                    }

                break;

                case "home" :

                    var home = this.mainContainer.getByName ('home' + data.home ) ;

                    home.setData ('topVal', data.val - 1);

                break;
            }


        }
        getCardIsAtBottom ( data )
        {

            if ( data.currentPost == 'field' ) {
                if ( this.fieldedCards [ data.col ].length - 1 != data.row ) return true;
            }
            return false;
        }
        getInitIndex ( id, origin='' )
        {

            if ( origin == '' ) {

                for ( var i in this.initialCards ) {

                    if ( this.initialCards [i].id == id ) {
                        return i;
                    }

                }

            }

            return null;

        }
        getFieldPosition ( data )
        {

            var clr = data.clr,
                val = data.val,
                col = data.col;

            if ( data.val !== 0 ) {

                if ( data.val == 12 ) {

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

                            if ( i != data.col ) {

                                if ( lastCard.clr != data.clr && lastCard.val == ( data.val + 1 ) ) {

                                    return {
                                        'x' : lastCard.x, 'y' : lastCard.y + this.crdSpacing,
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

        }
        getHomePosition ( data )
        {

            var isBottom = this.getCardIsAtBottom ( data );

            if ( !isBottom && data.currentPost != 'home') {

                for ( var i = 0; i < 4; i++ ) {

                    var home = this.mainContainer.getByName ('home' + i);

                    if ( data.val == 0 && data.currentPost != 'home' && !home.getData('resided') ) {

                        home.setData ('resided', true );

                        return i;
                    }

                    if ((data.val - 1) == home.getData('topVal') && data.knd == home.getData ('knd')  ) return i;

                }
            }
            return null;

        }
        generateRandomOrder ()
        {

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

        }
        sendHomers ()
        {

            var vel = this.vel;

            var homers = this.getHomers ();

            if ( homers.length > 0 ) {

                this.cardsMoving = true;

                for ( var i = 0; i < homers.length; i++ ) {


                    if ( homers[i].origin == '' ) {

                        //console.log ( 'this 1');

                        var cnt = this.initialCards.length - this.topCardCount ;

                        var crd = this.initialCards [ cnt ];

                    }else {

                        var col = homers [i].col;

                        var last = this.fieldedCards [col].length - 1;

                        var crd = this.fieldedCards [col][last];

                    }

                    var cardData = this.getCardDataForAction ( crd );

                    this.cardContainer.bringToTop ( crd );

                    var hme = this.mainContainer.getByName ('home' + homers[i].home );

                    hme.setData ({ 'resided' : true, 'topVal' : crd.val, 'knd': crd.knd });

                    this.tweens.add ({
                        targets : crd,
                        x : hme.x,
                        y : hme.y,
                        duration : vel,
                        ease : "Quad.easeIn",
                        delay : (i * vel)
                    });

                    crd.setHome ( homers[i].home );

                    this.resultAction ( cardData );

                }

                this.time.delayedCall ( ( homers.length * vel ), function () {
                    this.playSound ('flick');
                    this.sendHomers();
                }, [], this );

                this.vel *= 0.9;

            }else {

                this.vel = 150;

                this.time.delayedCall ( 300, function () {

                    this.checkColumnLength();

                    this.cardsMoving = false;

                    if ( this.isWinner() ) this.endGame();

                }, [], this );

            }

        }
        checkColumnLength ()
        {

            for ( var i in this.fieldedCards ) {

                var colLength = this.fieldedCards [i].length;

                var field = this.mainContainer.getByName ('field' + i );

                //if ( colLength > 10 ) console.log ( 'col', i );

                if ( colLength >= 13 ) {

                    var perc = colLength > 15 ? 0.16 : 0.2;

                    for ( var j in this.fieldedCards[i] ) {

                        var card = this.fieldedCards[i][j];

                        card.y = field.y + j * ( card.height * perc );
                    }

                    field.setData ('spacing', 1 );

                }else {

                    if ( field.getData('spacing') != 0 ) {

                        for ( var j in this.fieldedCards[i] ) {

                            var card = this.fieldedCards[i][j];

                            card.y = field.y + j * this.crdSpacing;
                        }

                        field.getData ('spacing', 0 );
                    }

                }

            }
        }
        getHomers ()
        {

            var tmp = [];

            for ( var i in this.fieldedCards ) {

                if ( this.fieldedCards[i].length > 0 ) {

                    var last = this.fieldedCards [i].length - 1;

                    var crd = this.fieldedCards [i][last];

                    var hme = this.getHomePosition ( crd );

                    if (  hme != null ) tmp.push ( { 'origin' :'field', 'col' : i, 'home' : hme } );

                }

            }

            if ( this.topCardCount > 0 ) {

                var cnt = this.initialCards.length - this.topCardCount ;

                var initBoxTopCard = this.initialCards [ cnt ];

                var inithme = this.getHomePosition ( initBoxTopCard );

                if (  inithme != null ) tmp.push ( { 'origin' :'', 'col' : 0, 'home' : inithme } );

            }


            return tmp;

        }
        isWinner ()
        {

            for ( var i = 0; i < 4; i++ ) {

                var home = this.mainContainer.getByName ('home' + i );

                if ( home.getData ('topVal') < 12 ) return false;
            }

            return true;

        }
        showPrompt ( txt, btnData )
        {

            this.isPrompted = true;

            this.bgRect = this.add.rectangle ( _gW/2, _gH/2, _gW, _gH, 0x0a0a0a, 0.4 ).setInteractive();

            this.promptContainer = this.add.container ( 0, _gH );

            var rect = this.add.rectangle ( _gW/2, _gH/2, 450*_scale, 200*_scale, 0x1c1c1c, 0.9 ).setInteractive();;

            var txtr = this.add.text ( _gW/2, _gH * 0.44, txt, { color:'#f4f4f4', fontSize:26*_scale, fontFamily:'Oswald'}).setOrigin(0.5);

            this.promptContainer.add ( [rect, txtr] );

            var bw = 130*_scale, bh = 45 * _scale, bs= bw * 0.15;

            var fx = (_gW - (2 * ( bw + bs ) - bs))/2 + bw/2,
                fy = _gH *0.56;

            var arr = [];

            for ( var i = 0; i < btnData.length; i++ ) {

                var miniContainer = this.add.container ( fx + i * ( bw+bs), fy ).setSize(bw, bh).setData('id', btnData[i].id ).setInteractive ();

                var rectbtn = this.add.rectangle ( 0, 0, bw, bh, 0xcecece, 1 );

                var txtbtn = this.add.text (0, 0, btnData[i].val, { color:'#333', fontSize:bh*0.5, fontFamily:'Oswald'}).setOrigin (0.5);

                miniContainer.add ( [rectbtn, txtbtn]);

                miniContainer.on ('pointerover', function () {
                    this.getAt (0).setFillStyle ( 0xffffcc, 1 );
                });
                miniContainer.on ('pointerout', function () {
                    this.getAt (0).setFillStyle ( 0xcecece, 1 );
                });
                miniContainer.on ('pointerup', function () {
                    this.getAt (0).setFillStyle ( 0xcecece, 1 );
                });
                miniContainer.on ('pointerdown', function () {
                    //...
                });

                this.promptContainer.add ( miniContainer );

                arr.push ( miniContainer );

            }

            this.tweens.add ({
                targets : this.promptContainer,
                y : 0,
                duration : 300,
                ease : 'Power3'
            });

            return arr;


        }
        restartPrompt ()
        {

            var btnData = [
                { 'id': 'restart', 'val': 'Yes' },
                { 'id': 'cancel', 'val': 'No' },
            ];

            var btns = this.showPrompt ('Are you sure you want to play again?', btnData );

            btns[0].on ('pointerdown', function () {
                this.scene.playSound ('clicka');
                this.scene.resetGame ();
            });
            btns[1].on ('pointerdown', function () {
                this.scene.playSound ('clicka');
                this.scene.removePrompt ();
            });



        }
        leavePrompt ()
        {

            var btnData = [
                { 'id': 'leave', 'val': 'Yes' },
                { 'id': 'cancel', 'val': 'No' },
            ];

            var btns = this.showPrompt ('Are you sure you want leave?', btnData );

            btns[0].on ('pointerdown', function () {
                this.scene.playSound ('clicka');
                this.scene.leaveGame ();
            });
            btns[1].on ('pointerdown', function () {
                this.scene.playSound ('clicka');
                this.scene.removePrompt ();
            });

            //..
        }
        winPrompt ()
        {

            var btnData = [
                { 'id': 'restart', 'val': 'Play Again' },
                { 'id': 'leave', 'val': 'Leave Game' },
            ];

            var btns = this.showPrompt ('Congratulations! You Win.', btnData );

            btns[0].on ('pointerdown', function () {
                this.scene.playSound ('clicka');
                this.scene.resetGame ();
            });
            btns[1].on ('pointerdown', function () {
                this.scene.playSound ('clicka');
                this.scene.leaveGame ();
            });

            //..
        }
        removePrompt ()
        {

            if ( !this.isPrompted ) return;

            this.isPrompted = false;

            this.promptContainer.destroy ();

            this.bgRect.destroy ();

        }
        endGame ()
        {

            this.isGameOn = false;

            this.playSound ('alternate');

            this.winPrompt ();



        }
        resetGame ()
        {

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
        }
        leaveGame ()
        {

            console.log ('todo exit');
            this.bgmusic.stop ();
            this.scene.start ('sceneA');

        }
        playSound ( snd, vol=0.5 )
        {
            this.gameSound.play ( snd, { volume : vol });
        }

    };

    class Card extends Phaser.GameObjects.Container {

        constructor ( scene, id, x, y, width, height, knd, val, strVal, isFlipped )
        {

            super ( scene, x, y );

            this.setSize ( width, height ).setName (id);

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

            let cardbg = scene.add.image ( 0, 0, 'card', isFlipped ? 0 : 1 ).setScale (_scale );

            let txtConfig = {
                fontSize: height*0.25,
                fontFamily:'Oswald',
                color : this.clr == 0 ? 'black' : 'red'
            };

            let frame = 0;

            if ( val >= 10 ) {
                frame = this.clr == 0 ? val - 9 : (val - 9) + 4;
            }

            let txt = scene.add.text ( -width *0.3, -height*0.32, strVal, txtConfig ).setOrigin (0.5).setVisible (isFlipped);

            let kind_sm = scene.add.sprite ( -width *0.3 , -height*0.07, 'kinds', knd ).setScale ( width*0.3/100 ).setVisible (isFlipped);

            let kind_lg = scene.add.sprite ( width* 0.13, height*0.2, 'kinds', knd ).setScale ( width*0.85/100 ).setVisible (isFlipped).setAlpha ( val > 9 ? 0.3 : 1 );

            let txte = scene.add.text ( width *0.3, -height*0.4, strVal, txtConfig ).setOrigin (1, 0.5).setFontSize ( height * 0.12 ).setVisible (isFlipped);

            let kind_xs = scene.add.image (width *0.45, -height*0.4 , 'kinds_sm', knd ).setOrigin (1, 0.5).setScale (width*0.18/25).setVisible (isFlipped);

            let img  = scene.add.sprite ( 0,0, 'people', frame ).setScale ( _scale ).setVisible (isFlipped);

            this.add ( [ cardbg, txt, kind_sm, kind_lg, txte, kind_xs, img ] );

            scene.add.existing(this);

        }
        flip ( state = 'up' )
        {

            var isUp = state == 'up';

            this.getAt ( 0 ).setFrame ( isUp ? 0 : 1 );

            for ( var i = 0; i < 6; i++) {
                this.getAt ( i + 1 ).setVisible ( isUp );
            }

            return this;

        }
        enabled ( state = true )
        {

            this.isEnabled = state;

            if ( state ) {
                this.setInteractive ();
            }else {
                this.disableInteractive ();
            }
            return this;

        }
        setPost ( col=0, row=0 )
        {

            this.currentPost = 'field';

            this.col = col;
            this.row = row;

            return this;
        }
        setHome ( nmbr )
        {

            this.col = 100;
            this.row = 100;

            this.currentPost = 'home';
            this.home = nmbr;
        }

    }

    const _gW = 1280, _gH = 720; _scale = 1;

    const config = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            parent: 'game-div',
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: _gW,
            height: _gH
        },
        backgroundColor: '#f5f5f5',
        scene: [ SceneA, SceneB ]
    };

    const game = new Phaser.Game(config);


}
