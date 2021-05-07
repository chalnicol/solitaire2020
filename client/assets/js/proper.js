class Proper extends Phaser.Scene {

    constructor ()
    {
        super('Proper');
    }

    create ( data ) 
    {

        this.mode = data.mode == 0 ? 'easy' : 'hard';

        this.cardDimensions = { 'w' : 130, 'h' : 170 };

        this.homeDuration = 250;

        this.isGameOn = false;

        this.add.image ( 960, 540, 'bg');

        this.initMenuSound();

        this.initCardsHolder ();

        this.initControls();

        this.time.delayedCall ( 300, this.initCards, [], this );

    }

    initMenuSound () 
    {

        this.bgmusic = this.sound.add('properBg').setVolume(0.2).setLoop(true);

        this.bgmusic.play();

        this.soundFx = this.sound.addAudioSprite('sfx');

    }

    initCardsHolder () {

        this.mainContainer = this.add.container (0, 0);

        let card = this.cardDimensions;

        const sx = (1920 - ( 1920 * 0.9 ))/2 + (card.w/2), 

              sy = 115;

        //init box..

        let initBox = new CardBox ( this, sx, sy, card.w, card.h );
        
        initBox.setInteractive().setName ('initBox');

        initBox.on ('pointerdown', function (){
            this.scene.initialBoxClick ( this );
        });

        this.mainContainer.add ( initBox );

            
        //home boxes...

        //this.homeBoxes = [];

        const stw = (4 * ( card.w + 20 )) - 20, 

              shx = 1920 - sx - stw + card.w;

        for ( var i = 0; i < 4; i++ ) {

            const xs = shx + i * ( card.w + 20 ),
                
                  ys = sy;

            var homeBox = new HomeBox (this, xs, ys, card.w, card.h, i );

            this.mainContainer.add ( homeBox );

        }


        //field boxes...

        const fsp = ( ( 1920 * 0.9 ) - ( card.w * 7 )) / 6,

              fsx = sx,

              fsy = 300;

        for ( var i = 0; i < 7; i++ ) {

            var xp = fsx + i * ( card.w + fsp ),

                yp = fsy;

            var fieldBox = new FieldBox ( this, xp, yp, card.w, card.h, i );

            this.mainContainer.add ( fieldBox );

        }


    }

    initControls () { 

        var cont = this.add.container ( 960, 115 );

        var rect = this.add.rectangle ( 0, 0, 300, 170, 0xe3e3e3, 1 ).setStrokeStyle( 1, 0x6a6a6a );

        var txt = this.add.text ( 0, -60, 'Controls', {color:'#6e6e6e', fontFamily:'Oswald', fontSize : 20 } ).setOrigin(0.5);

        cont.add ( [rect, txt] );

        var btnData = [
            {
                'txt' : 'Restart',
                'func' : () => {
                    this.restartPrompt ();
                }
            },
            {
                'txt' : 'Leave Game',
                'func' : () => {
                    this.leavePrompt ();
                }
            },
            
        ];

        var bw = 270, bh = 50, bs = 10;

        for ( let i = 0; i < 2; i++ ){
            
            var btn = new MyButton ( this, 0,-15 + i*60, bw, bh, 'btn'+i, '', '', 0, btnData[i].txt );

            btn.on ('pointerdown', function () {
                this.scene.playSound ('clickc');

                this.getAt (0).setFillStyle ( 0xcecece, 1 );
            });
            btn.on ('pointerup', function () {
                
                if ( !this.scene.isGameOn ) return;

                this.getAt (0).setFillStyle ( 0xffffff, 1 );

                btnData [i].func();

            });

            cont.add ( btn );
            
        }

    }

    initCards () {


        this.isGameOn = true;

        this.cardsMoving = false;
        
        this.vel = 150;

        this.initialCards = [];

        this.fieldCards = [];

        
        this.flippedCardsCount = 0;

        this.shownCardsCount = 0;


        //create cards on initbox..

        this.cardContainer = this.add.container( 0, 0 );

        const rndOrd = this.generateRandomOrder ();

        const cardData = this.cardDimensions;
        
        let initBox = this.mainContainer.getByName ('initBox');

        const strVal = ['A', '2','3','4','5','6','7','8','9','10','J','Q', 'K' ];

        for ( var i = 0; i < rndOrd.length; i++ ) {

            let knd = Math.floor ( rndOrd[i] / 13 ),

                val = rndOrd [i] % 13,
            
                str = strVal [ val ];

            let crd = new MyCard ( this, initBox.x, initBox.y, cardData.w, cardData.h, i, knd, val, str, false );

            crd.on ('pointerdown', function () {

                this.scene.cardClick ( this );
            
            });

            this.cardContainer.add ( crd );

            this.initialCards.push ( crd );

        }

        //create cards on the field..


        let counter = 0;

        for ( var i = 0; i < 7; i++ ) {

            this.fieldCards [i] = [];

            var fieldBox = this.mainContainer.getByName ('field' + i );

            for ( var j = 0; j < (i + 1); j++ ) {

                var card = this.cardContainer.getByName ('card' + ( 51 - counter ));

                this.cardContainer.bringToTop ( card );

                card.setFieldPost ( i, j );

                if ( i == j ) card.flip().enabled();

                this.tweens.add ({
                    targets : card,
                    x : fieldBox.x,
                    y : fieldBox.y + (j * 33),
                    duration : 100,
                    ease : 'Power2',
                    delay : counter * 10,
                    
                });

                this.fieldCards [i].push ( card );

                this.initialCards.pop();

                counter += 1;
            }
        }

        this.playSound ('ending');

    }

    initialBoxClick ( ibox ) {

        let flipCardsSx = 320;

        if ( this.flippedCardsCount < this.initialCards.length ) {

            if ( this.mode == 'easy' ) {

                if ( this.flippedCardsCount > 0 ) {

                    var prevCard = this.initialCards [ this.initialCards.length - this.flippedCardsCount ];

                    prevCard.enabled (false);

                }

                var card = this.initialCards [ this.initialCards.length - this.flippedCardsCount - 1 ];

                card.flip().enabled();

                this.tweens.add ({
                    targets : card,
                    x : flipCardsSx + ( this.shownCardsCount * 35 ),
                    duration : 150,
                    ease : 'Power3',
                });
            
                this.cardContainer.bringToTop ( card );

                this.flippedCardsCount += 1;

                this.shownCardsCount += 1;

                if ( this.shownCardsCount > 3 )  {

                    for ( var j = 0; j < 3; j++ ) {

                        var cards = this.initialCards [ this.initialCards.length - this.flippedCardsCount + j  ];

                        this.tweens.add ({
                            targets: cards,
                            x : '-=35',
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

                    this.initialCards [ last - j ].enabled ( false ).setX ( flipCardsSx );

                }

                var diff = this.initialCards.length - this.flippedCardsCount;

                var toDraw = diff >= 3 ? 3 : diff;

                for ( var i = 0; i < toDraw; i++ ) {

                    let cnt = ( this.initialCards.length - 1 ) - this.flippedCardsCount;

                    let card = this.initialCards [ cnt ];

                    this.cardContainer.bringToTop ( card );
    
                    this.tweens.add ({
                        targets: card,
                        x : flipCardsSx + (i*33),
                        duration : 100,
                        ease : 'Power2'
                    });

                    card.flip();
                    
                    if ( i == (toDraw-1) ) card.enabled();

                    this.flippedCardsCount += 1;

                }
                

            }

            if ( this.flippedCardsCount >= this.initialCards.length ) {

                console.log ('tmp');

                ibox.disableInteractive ();

                this.time.delayedCall ( 500, () => {
                    ibox.setInteractive ();
                }, [], this );

            }

        }else {

            if ( this.initialCards.length > 0 ) {

                for ( var i in this.initialCards ) {

                    var card = this.initialCards [i];

                    this.mainContainer.bringToTop ( card );

                    card.setX ( ibox.x ).flip (false).enabled(false);
                }

                this.flippedCardsCount = 0;

                this.shownCardsCount = 0;

            }else {

                this.playSound ('error');

            }
        }
        
        this.playSound('clickb');
    }

    moveCard ( card, post, tduration = 100, tdelay = 0 ) {

        this.cardContainer.bringToTop ( card );

        this.tweens.add ({
            targets : card,
            x : post.x, 
            y : post.y, 
            duration : tduration,
            ease : "Quad.easeIn",
            delay: tdelay
        });


    }

    cardClick ( card ) {

        if ( this.cardsMoving || !this.isGameOn ) return;

        //..
        var prevPost = card.getPost();

        //get home position if available
        var homePost = this.getHomePosition ( card );

        //or get field position if available
        var fieldPost = this.getFieldPosition ( card ); 

        //console.log ( homePost, fieldPost, prevPost );
        if ( homePost != null ) {

            this.playSound('clickb');

            var home = this.mainContainer.getByName ('home' + homePost );

            home.setTopCardValue ( card.val, card.knd );

            //..
            card.setHome ( homePost );

            this.moveCard ( card, { 'x' : home.x, 'y' : home.y });

            this.resultAction ( prevPost, card );

            this.sendHomers();


        }else if ( fieldPost != null ) {

            this.playSound('clickb');

            //check if card is being overlapped if at field..
            var crdIsOverlapped = this.getCardIsAtBottom( card ) 

            if ( !crdIsOverlapped ) {

                card.setFieldPost ( fieldPost.col, fieldPost.row );

                this.moveCard ( card, { 'x' : fieldPost.x, 'y' : fieldPost.y });

                this.fieldCards [ fieldPost.col ].push ( card );

            }else {

                var initRow = card.fieldData.r, 
                    
                    initCol = card.fieldData.c;

                var arr = this.fieldCards[ initCol ].slice ( initRow );

                for ( var i = 0; i < arr.length; i++ ) {

                    var crd = arr [i];

                    crd.setFieldPost ( fieldPost.col, fieldPost.row + i );
                    
                    this.moveCard ( crd, { 'x' : fieldPost.x, 'y' : fieldPost.y + (i*33) });

                    this.fieldCards [fieldPost.col].push ( crd );
                    
                }

                this.fieldCards [ initCol ].splice ( initRow );

            }

            this.resultAction ( prevPost, card, crdIsOverlapped );

            if (prevPost.post != 'home' ) this.sendHomers ();


        }else {

            this.playSound ('error');

            console.log ('error..');

        }

    }

    resultAction ( prevPost, card, isOverlapped = false ) {


        switch ( prevPost.post ) {

            case '':

                var indx = this.getIndex ( card.id );

                this.initialCards.splice ( indx, 1 );

                if ( indx != this.initialCards.length ) {
           
                    this.initialCards [ indx ].enabled ();
           
                }
                
                this.flippedCardsCount += -1;
                
                if ( this.mode == 'easy' ) {

                    if ( this.flippedCardsCount <= 0 ) {

                        this.shownCardsCount = 0;

                    }else {

                        if ( this.shownCardsCount > 1 )  this.shownCardsCount += -1;

                    }

                }

                break;

            case 'field' :

                if ( !isOverlapped ) this.fieldCards [ prevPost.fieldData.c ].pop ();

                if ( this.fieldCards [ prevPost.fieldData.c ].length > 0 ) {

                    var newLast = this.fieldCards [ prevPost.fieldData.c ].length - 1;

                    var crd = this.fieldCards [ prevPost.fieldData.c ] [ newLast ];

                    crd.flip().enabled();

                }   

                break;

            case 'home' : 

                var home = this.mainContainer.getByName ('home' + prevPost.homePost ) ;

                home.topCardValue = card.val - 1;

                break;
        }
        
        
    }

    getCardIsAtBottom  ( card ) {

        return card.currentPost == 'field' && this.fieldCards [ card.fieldData.c ].length - 1 != card.fieldData.r;
    }

    getIndex  ( id, prevPost ) {

        for ( var i in this.initialCards ) {
            if ( this.initialCards [i].id == id ) {
                return i;
            }
        }

        return null;

    }

    getFieldPosition  ( card ) {

     
        if ( card.val !== 0 ) {

            if ( card.val == 12 ) {

                for ( var i in this.fieldCards ) {

                    if ( this.fieldCards [i].length == 0 ) {

                        return { 
                            'x' : this.mainContainer.getByName('field' + i ).x, 
                            'y' : this.mainContainer.getByName('field' + i ).y,
                            'col' : Number (i), 
                            'row' : 0
                        }

                    }

                }

            } else {

                for ( var i in this.fieldCards ) {

                    if ( this.fieldCards[i].length > 0 ) {

                        var last = this.fieldCards[i].length - 1;
    
                        var lastCard = this.fieldCards [i] [last];
        
                        if ( i != card.fieldData.col ) {
        
                            if ( lastCard.clr != card.clr && lastCard.val == ( card.val + 1 ) ) {
        
                                return { 
                                    'x' : lastCard.x, 
                                    'y' : lastCard.y + 33,
                                    'col' : Number(i),
                                    'row' : last + 1
                                }
    
                            }
                        }

                    }
                
                }

            }
        }

        return null;

    }

    getHomePosition  ( card ) {

        if ( card.currentPost != 'home' && !this.getCardIsAtBottom ( card ) ) {

            for ( var i = 0; i < 4; i++ ) {

                let home = this.mainContainer.getByName ('home' + i );

                if (!home.isTaken){

                    if ( card.val == 0 ) return i;

                }else {

                    if (home.topCardValue == (card.val - 1) && home.knd == card.knd ) return i;
                }
              
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

        var homers = this.getHomers ();

        if ( homers.length > 0 ) {

            this.cardsMoving = true;

            for ( var i = 0; i < homers.length; i++ ) {

                if ( homers[i].origin == '' ) {

                    var cnt = this.initialCards.length - this.flippedCardsCount ;

                    var crd = this.initialCards [ cnt ];
    
                }else {

                    var col = homers [i].col;

                    var last = this.fieldCards [col].length - 1;

                    var crd = this.fieldCards [col] [last];

                }
                
                //var cardData = this.getCardDataForAction ( crd );

                var prevPost = crd.getPost ();

                this.cardContainer.bringToTop ( crd );

                var hme = this.mainContainer.getByName ('home' + homers[i].home );

                hme.setTopCardValue ( crd.val, crd.knd );

                this.moveCard ( crd, { x:hme.x, y: hme.y }, this.homeDuration, i*this.homeDuration );

                crd.setHome ( homers[i].home );

                this.resultAction ( prevPost, crd );
               
            } 

            this.time.delayedCall ((homers.length * this.homeDuration), () => {

                this.playSound ('flick');

                this.sendHomers();

            }, [], this );

            if ( this.homeDuration > 20 ) this.homeDuration *= 0.9;
           
            

        }else {

            this.homeDuration = 150;

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

        for ( var i in this.fieldCards ) {

            if ( this.fieldCards [i].length > 0 ) {

                var last = this.fieldCards [i].length - 1;

                var crd = this.fieldCards [i] [last];
                    
                var hme = this.getHomePosition ( crd );

                if (  hme != null ) tmp.push ( { 'origin' :'field', 'col' : i, 'home' : hme } );

            }
            
        }

        if ( this.flippedCardsCount > 0 ) {

            var cnt = this.initialCards.length - this.flippedCardsCount ;

            var initBoxTopCard = this.initialCards [ cnt ];

            var inithme = this.getHomePosition ( initBoxTopCard );

            if (  inithme != null ) tmp.push ( { 'origin' :'', 'col' : 0, 'home' : inithme } );

        }

        return tmp;

    }

    isWinner  () {

        for ( var i = 0; i < 4; i++ ) {

            var home = this.mainContainer.getByName ('home' + i );

            if ( home.topCardValue < 12 ) return false;
        }

        return true;

    }

    showPrompt  ( txt, btnData = [] ) {

        this.isPrompted = true;

        this.promptContainer = this.add.container ( 0, 0 );

        var bgRect = this.add.rectangle ( 960, 540, 1920, 1080, 0x0a0a0a, 0.4 ).setInteractive();

       this.promptContainer.add ( bgRect );

        var cont = this.add.container ( 960, 540 );

        var rect = this.add.rectangle ( 0, 0, 450, 200, 0xffffff, 1 ).setInteractive();;

        var txtr = this.add.text ( 0, -40, txt, { color:'#3a3a3a', fontSize:26, fontFamily:'Oswald'}).setOrigin(0.5);

        cont.add ([ rect, txtr ]);

        const bw = 130, 
              bh = 50, 
              bs = 20;

        //var fx = 960 - ((2 * (bw+bs)-bs)/2) + (bw/2);

        var fx = -(( 2 * ( bw+bs )- bs )/2) + (bw/2),  fy = 40;

        for ( let i = 0; i < btnData.length; i++ ) {

            var xp = fx + i * ( bw+bs), yp = fy;

            var btn = new MyButton ( this, xp, yp, bw, bh, 'btn'+i, '', '', 0, btnData[i].txt );
            
            btn.on ('pointerup', function () {
                this.getAt (0).setFillStyle ( 0xf4f4f4, 1 );
                btnData [i].func();
            });
            btn.on ('pointerdown', function () {

                this.scene.playSound ('clicka');

                this.getAt (0).setFillStyle ( 0xffff00, 1 );
            });

            cont.add ( btn );

        }

        this.tweens.add ({
            targets : cont,
            y : 540,
            duration : 300,
            ease : 'Power3'
        });

        this.promptContainer.add (cont);

        

    }

    restartPrompt  () {

        const btnData = [
            {
                'txt' : 'Confirm',
                'func' : () => {
                    this.resetGame ();
                } 
            },
            {
                'txt' : 'Cancel',
                'func' : () => {
                    this.removePrompt ();
                } 
            },
    
        ];

        this.showPrompt ( 'Are you sure you want to reset?', btnData );

    

    }

    leavePrompt  () {


        const btnData = [
            {
                'txt' : 'Confirm',
                'func' : () => {
                    this.leaveGame ();
                } 
            },
            {
                'txt' : 'Cancel',
                'func' : () => {
                    this.removePrompt ();
                } 
            },
    
        ];

        this.showPrompt ( 'Are you sure you want to exit?', btnData );


        //..
    }

    winPrompt  () {

        const btnData = [
            {
                'txt' : 'Play Again',
                'func' : () => {
                    this.playSound ('clicka');
                    this.resetGame ();
                } 
            },
            {
                'txt' : 'Leave Game',
                'func' : () => {
                    this.playSound ('clicka');
                    this.leaveGame ();
                } 
            },
    
        ];

        this.showPrompt ( 'Congratulations!', btnData );

    }

    removePrompt  () {

        if ( !this.isPrompted ) return;

        this.isPrompted = false;

        this.promptContainer.destroy ();

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

            home.reset();
        
        }

        this.time.delayedCall ( 300, this.initCards, [], this );

        //this.initCards ();
    }

    leaveGame  () {

        this.bgmusic.stop ();

        this.scene.start ('SceneA');

    }

    playSound  ( snd, vol=0.5) {
        this.soundFx.play ( snd, { volume : vol });
    }


}
