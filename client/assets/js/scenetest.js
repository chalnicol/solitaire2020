

class SceneB extends Phaser.Scene {

    constructor ()
    {
        super('SceneB');
    }

    init ( data ) {

        console.log ( data );

        this.mode = data.mode == 0 ? 'easy' : 'hard';

    }
    create () 
    {


        this.gameDim = {
            w : 1280, h : 720
        }

        this.cardData = { w : 100,  h : 135, sp : 33 };

        //this.crdSpacing = this.card.w * 0.3;

        //this.mode = data == 0 ? 'easy' : 'hard';

        this.isGameOn = false;

        this.initGraphics ();

        this.initMenuSound ();

        this.initCardsHolder ();
        
        // this.initControls ();

        this.time.delayedCall ( 500, this.initCards, [], this );

    }


    initMenuSound () {

        //this.bgmusic = this.sound.add('bgsound').setVolume(0.2).setLoop(true);
        //this.bgmusic.play();

        this.music = this.sound.addAudioSprite('sfx');

    }

    initGraphics () {

        this.isPrompted = false;

        this.add.image ( this.gameDim.w/2, this.gameDim.h/2,'bg' );
       
    }
    
    initCardsHolder () {

        this.mainContainer = this.add.container (0, 0);

        let card = this.cardData;

        let sx = (this.gameDim.w - ( this.gameDim.w * 0.9 ))/2, 
            sy = 90;

        //init box..
        let initBox = new CardBox ( this, sx + card.w/2, sy, [], card.w, card.h ).setInteractive().setName ('initBox');;

        initBox.on ('pointerdown', function () {
            this.scene.initialBoxClick ();
        });

        this.mainContainer.add ( initBox );

            
        //home boxes...
        let sp = 15, 
            stw = (4 * ( card.w + sp )) - sp, 
            shx = this.gameDim.w - stw - sx + (card.w/2);

        for ( var i = 0; i < 4; i++ ) {

            var xs = shx + i * ( card.w + sp ),
                ys = sy;

            let homeBox = new CardBox (this, xs, ys, [], card.w, card.h ).setName ('home' + i );

            this.mainContainer.add ( homeBox );
        
        }

        //fieldContainer...        
        let fw = this.gameDim.w*0.9,
            fsp = ( fw - ( card.w * 7 )) / 6,
            fsx =  ( this.gameDim.w - fw )/2 + (card.w/2), 
            fsy = 250;

        for ( var i = 0; i < 7; i++ ) {

            var xp = fsx + i * (card.w + fsp ),
                yp = fsy;

            let fieldBoxes = new CardBox ( this, xp, yp, [], card.w, card.h, i ).setName ('field' + i );

            this.mainContainer.add ( fieldBoxes );
        
            //var fieldContainer = this.add.container ( xp, yp ).setName ('field' + i ).setData( {'col':i, spacing:0 });

        }


    }

    initControls () { 

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
    initCards () {

        const strVal = ['A', '2','3','4','5','6','7','8','9','10','J','Q', 'K' ];

        this.cardContainer = this.add.container( 0, 0 );

        this.cardsMoving = false;
        
        this.isGameOn = true;

        this.vel = 150;
        
        this.initialCards = [];

        const rndOrd = this.generateRandomOrder ();

        const cardData = this.cardData;
        
        let initBox = this.mainContainer.getByName ('initBox');

        for ( var i = 0; i < rndOrd.length; i++ ) {

            let knd = Math.floor ( rndOrd[i] / 13 ),
                val = rndOrd [i] % 13,
                str = strVal [ val ];

            let crd = new Card ( this, initBox.x, initBox.y, [], cardData.w, cardData.h, i, knd, val, str, false );

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

        let counter = 0;

        for ( var i = 0; i < 7; i++ ) {

            this.fieldedCards [i] = [];

            let fieldBox = this.mainContainer.getByName ('field' + i );

            for ( var j = 0; j < (i + 1); j++ ) {

                let card = this.cardContainer.getByName ('card' + (51 - counter) );

                this.cardContainer.bringToTop ( card );

                card.setPost ( i, j );

                if ( i == j ) card.enabled();

                this.tweens.add ({
                    targets : card,
                    x : fieldBox.x,
                    y : fieldBox.y + j * this.cardData.sp,
                    duration : 100,
                    ease : 'Power2',
                    delay : counter * 10,
                    onComplete  () {
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
        

        this.flippedCardsCount = 0;

        this.shownCardsCount = 0;


    }
    initialBoxClick () {

        let initBox = this.mainContainer.getByName('initBox');

        let openX = 250 ;
        
        if ( this.flippedCardsCount < this.initialCards.length ) {

            if ( this.mode == 'easy') {

                if ( this.flippedCardsCount > 0 ) {

                    let prevCard = this.initialCards [ this.initialCards.length - this.flippedCardsCount ];

                    prevCard.enabled (false);

                }


                let topCard = this.initialCards [ this.initialCards.length  - (this.flippedCardsCount + 1) ];
        
                topCard.flip().enabled();

                this.cardContainer.bringToTop ( topCard );

                this.tweens.add ({
                    targets: topCard,
                    x : openX + ( this.shownCardsCount * ( topCard.width*0.3)),
                    duration : 200,
                    ease : 'Power3',
                });
                
                this.flippedCardsCount += 1;

                //shownCards..

                this.shownCardsCount += 1;
                
                if ( this.shownCardsCount > 3 ) {

                    //..
                    for ( var j = 0; j < 3; j++ ) {

                        let toMove = this.initialCards [ this.initialCards.length - this.flippedCardsCount + j  ];

                        this.tweens.add ({
                            targets: toMove,
                            x :    '-=' + ( toMove.width*0.3),
                            duration : 200,
                            ease : 'Power3',
                            delay : 200
                        });

                    }
                    
                    this.shownCardsCount = 3;

                }

            }else {

                //hard..

                for ( var j = 0; j < this.flippedCardsCount; j++ ) {

                    let last = this.initialCards.length - 1;

                    this.initialCards [ last - j ].enabled ( false ).setX ( openX );

                }


                var diff = this.initialCards.length - this.flippedCardsCount;

                var toDraw = diff >= 3 ? 3 : diff;

                for ( var i = 0; i < toDraw; i++ ) {

                    let cnt = ( this.initialCards.length - 1 ) - this.flippedCardsCount;

                    let card = this.initialCards [ cnt ];

                    this.cardContainer.bringToTop ( card );
    
                    this.tweens.add ({
                        targets: card,
                        x : openX + i * ( card.width * 0.3 ),
                        duration : 100,
                        ease : 'Power2'
                    });

                    card.flip();
                    
                    if ( i == (toDraw-1) ) card.enabled();

                    this.flippedCardsCount += 1;

                }

           
            }
            
        }else {

            if ( this.initialCards.length > 0 ) {

                //var initBox = this.mainContainer.getByName ('initBox');

                for ( var i in this.initialCards ) {

                    var card = this.initialCards [i];

                    this.mainContainer.bringToTop ( card );

                    card.setX ( initBox.x ).flip ('').enabled(false);
                }

                this.flippedCardsCount = 0;

                if ( this.mode == 'easy' ) this.shownCardsCount = 0;

            }else {

                this.playSound ('error');
            }
           
        }
        
        this.playSound ('clickb');
        
        initBox.disableInteractive();

        this.time.delayedCall ( 500 , function () {
            initBox.setInteractive ();
        }, [], this);


    }
    cardClick ( id ) {

        if ( this.cardsMoving || !this.isGameOn ) return;

        let card = this.cardContainer.getByName ( id );

        //var cardData = this.getCardDataForAction ( card );

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
    getCardDataForAction ( crd ) {

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
    resultAction ( data, isOverlapped = false ) {


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
    getCardIsAtBottom  ( data ) {

        if ( data.currentPost == 'field' ) {
            if ( this.fieldedCards [ data.col ].length - 1 != data.row ) return true;
        }
        return false;
    }
    getInitIndex  ( id, origin='' ) {

        if ( origin == '' ) {

            for ( var i in this.initialCards ) {

                if ( this.initialCards [i].id == id ) {
                    return i;
                }

            }

        }

        return null;

    }
    getFieldPosition  ( data ) {

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
    getHomePosition  ( data ) {

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
    generateRandomOrder  () {

        let tempArr = [];

        for ( var i = 0; i < 52; i++ ) {
            tempArr.push (i);
        }

        let finArr = [];

        while ( tempArr.length > 0 ) {

            var rnd = Math.floor ( Math.random() * tempArr.length );

            finArr.push ( tempArr [ rnd ] );

            tempArr.splice ( rnd, 1 );
        }

        return finArr;

    }
    sendHomers  () {

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
    checkColumnLength () {

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
    getHomers  () {

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
    isWinner  () {

        for ( var i = 0; i < 4; i++ ) {

            var home = this.mainContainer.getByName ('home' + i );

            if ( home.getData ('topVal') < 12 ) return false;
        }

        return true;

    }
    showPrompt  ( txt, btnData ) {

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
    restartPrompt  () {

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
    leavePrompt  () {

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
    winPrompt  () {

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
    removePrompt  () {

        if ( !this.isPrompted ) return;

        this.isPrompted = false;

        this.promptContainer.destroy ();

        this.bgRect.destroy ();

    }
    endGame  () {

        this.isGameOn = false;

        this.playSound ('alternate');

        this.winPrompt ();

        

    }
    resetGame  () {

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
    leaveGame  () {

        console.log ('todo exit');
        this.bgmusic.stop ();
        this.scene.start ('sceneA');

    }
    playSound  ( snd, vol=0.5) {
        this.music.play ( snd, { volume : vol });
    }


}
