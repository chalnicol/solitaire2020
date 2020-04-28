
window.onload = function () {

    var game, config;

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

        if ( window.orientation == undefined ) return;

        var portrait = Math.abs ( window.orientation) == 90;

        var btn_enter =  document.getElementById('btnEnter');

        btn_enter.disabled = ( portrait ) ? true : false; 

        var message_div =  document.getElementById('messageDiv');

        message_div.innerHTML = ( !portrait ) ? '' : '<small>Please set device orientation to portrait.</small>';

    }

    function enterGame () {

        var maxW = 414;

        var container = document.getElementById('game_container');

        var contW = container.clientWidth,
            contH = container.clientHeight;

        var tmpWidth = contW > maxW ? maxW : contW,
            tmpHeight = Math.ceil(tmpWidth * 16/9);

        console.log ( 'init', tmpHeight, contH )

        var gameH = 0, gameW = 0;

        if ( tmpHeight >= contH ) {

            gameH = contH;
            gameW = Math.ceil(gameH * 9/16);

            console.log ( 'game dimensions adjusted by screen height' )

        }else {

            gameW = tmpWidth;
            gameH = tmpHeight;
            console.log ( 'game dimensions adjusted by screen width' )
        }

        var game_div = document.getElementById('game_div');
        game_div.style.width = gameW + 'px';
        game_div.style.height = gameH + 'px';
        //game_div.style.overflow = 'hidden'
        

        
        config = {

            type: Phaser.AUTO,
            width: gameW,
            height: gameH,
            backgroundColor: '#dedede',
            audio: {
                disableWebAudio: false
            },
            parent:'game_div',
            scene: [ SceneA, SceneB ]

        };

        game = new Phaser.Game(config);

        //socket = io();

        //socket.emit ('initUser', username.value );

    }

    var SceneA = new Phaser.Class({

        Extends: Phaser.Scene,

        initialize:

        function SceneA ()
        {
            Phaser.Scene.call(this, { key: 'sceneA' });
        },

        preload: function ()
        {

            this.loadtxt = this.add.text ( config.width/2, config.height/2, 'Loading Files..', { color : '#333', fontSize : config.height *0.018 }) .setOrigin(0.5);


            this.load.audioSprite('sfx', 'client/assets/sfx/fx_mixdown.json', [
                'client/assets/sfx/sfx.ogg',
                'client/assets/sfx/sfx.mp3'
            ]);
            this.load.audio ('bgsound', ['client/assets/sfx/puzzlebg.ogg', 'assets/sfx/puzzlebg.mp3'] );

            this.load.audio ('bgsound2', ['client/assets/sfx/puzzlebg2.ogg', 'assets/sfx/puzzlebg2.mp3'] );

            this.load.image('profile', 'client/assets/images/mock/noimage.jpg' );

            this.load.spritesheet('thumbs', 'client/assets/images/spritesheet1.png', { frameWidth: 70, frameHeight: 70 });

            this.load.on('progress', function (value) {
                var perc = Math.floor ( value * 100 );
                this.loadtxt.text = 'Loading Files.. ' + perc + '%';
            }, this );

            this.load.on('complete', function () {
                this.loadtxt.destroy();
            }, this );

        },

        create: function () {
            
            this.loadtxt.destroy();

            this.plyrBest = this.getAllScores ();

            this.initSound ();
            
            this.initBg ();

            this.showTitleHeader ();

            this.showBestScores();

            this.showUser();

        },
        initSound : function () {

            this.music = this.sound.addAudioSprite('sfx');

            this.bgmusic = this.sound.add('bgsound').setVolume(0.2).setLoop(true);
            this.bgmusic.play();

        },
        initBg : function () {
            
            var max = 5;
            var trW = config.width *0.08,
            trH = config.height * 0.01,
            trX = config.width *0.03,
            trXb = config.width *0.89,
            trS = trH *0.8,
            trY = 0;

            var maxT = 56;

            var graphics = this.add.graphics();

            graphics.fillStyle( 0x9a9a9a, 1 );

            for ( var j = 0; j < maxT; j++ ) {

                var ny = trY + j * ( trH + trS ) ;

                //graphics.fillRect ( trX, ny, trW, trH );

                graphics.fillRect ( trXb, ny, trW, trH );

            }

        },
        showTitleHeader : function ()
        {
            var bW = config.width * 0.83, 
                bH = config.height * 0.16, 
                bX = ( config.width - bW )/2, 
                bY = config.height*0.13;

            var graphics = this.add.graphics();

            graphics = this.add.graphics();

            graphics.fillStyle ( 0x3e3e3e, 0.2 )
            graphics.fillRoundedRect( bX + 3, bY + 3, bW, bH, bH * 0.05 );
            
            graphics.fillStyle ( 0xf5f5f5, 1)
            graphics.fillRoundedRect( bX, bY, bW, bH, bH * 0.05 );
            graphics.lineStyle(1, 0x6c6c6c );
            graphics.strokeRoundedRect( bX, bY, bW, bH, bH * 0.05 );

        
            var txtConfiga = { 
                color:'#3a3a3a', 
                fontSize: Math.floor ( bH * 0.28 ), 
                fontStyle:'bold', 
                fontFamily:'Trebuchet MS'
            };

            var texta = this.add.text ( bX + bW/2, bY + bH*0.2, 'Memory Game', txtConfiga ).setOrigin (0.5).setScale (1.5);
            texta.setStroke('#f4f4f4', 5);
            texta.setShadow( 1, 1, '#0a0a0a', 3, true, true );

            this.tweens.add ({
                targets : texta,
                y : bY + bH*0.4,
                scaleX : 1, scaleY : 1,
                duration : 300,
                ease : 'Elastic',
                easeParams : [ 1.2, 0.5 ]
            });

            this.music.play ('move', {volume : 0.8});

            var txtConfigb = { 
                color: '#660000', 
                fontSize: Math.floor ( bH * 0.14 ), 
                fontStyle:'bold', 
                fontFamily:'Trebuchet MS'
            };

            var text2 = this.add.text ( bX + bW/2, bY + bH * 0.72 , 'Click anywhere to start.', txtConfigb ).setOrigin (0.5);

            var rect = this.add.rectangle ( config.width/2, config.height/2, config.width, config.height ).setInteractive ();
            
            rect.on ('pointerdown', function () {
                
                this.music.play('clicka');

                this.bgmusic.stop();

                this.scene.start( 'sceneB', this.plyrBest );
            
            }, this );


        },
        showUser : function () {

            var imgSize = config.width*0.2,
                imgX = config.width/2,
                imgY = config.height * 0.45;

            //var rect = this.add.rectangle ( imgX, imgY, imgSize, imgSize, 0xc3c3c3, 1 );

            //var image1 = this.add.image ( imgX, imgY, 'profile').setScale ( imgSize*0.9/200 );
            
            var nameText = { 
                color:'#ff3300', 
                fontSize: Math.floor ( imgSize * 0.18 ), 
                fontFamily:'Trebuchet MS'
            };

            var tmpY = config.height * 0.32;

            var name1 = this.add.text ( imgX, tmpY, 'Finish all 3 levels.', nameText  ).setOrigin(0.5);

        }, 
        getScore : function ( vname ) { 

            var name = vname + "=";

            var ca = document.cookie.split(';');

            for(var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
            
            /*
            //facebook..
            //this.levelscores = facebookStuff.score;

            console.log ( 'scores : ', facebookStuff.score );

            if ( this.levelscores[level] == undefined || this.levelscores[level] == '' ) {
                return '';
            }
            return this.levelscores[level];
            */

        },
        getAllScores : function () {

            var arr = [];

            for ( var i = 0; i< 3; i++) {

                var mscore = this.getScore ( 'gLevel' + i );

                //fb..
                //var mscore = this.getScore ( 'glevel' + i );

                arr.push ( mscore );
            }

            return arr; 
            
        },
        showBestScores : function () {

            var graphics = this.add.graphics();

            var bgH = config.height *0.3,
                bgY = config.height * 0.53;

            //graphics.fillStyle( 0x9c9c9c, 1 );
            //graphics.fillRect ( 0, bgY, config.width, bgH);


            var bestTxtConfig = { 
                color:'#3a3a3a', 
                fontSize: Math.floor ( config.height * 0.03 ) + 'px', 
                //fontStyle : 'bold',
                fontFamily:'Trebuchet MS'
            };

            var best = this.add.text ( config.width/2, bgY + bgH *0.2, '···· Best Moves ····', bestTxtConfig  ).setOrigin(0.5);
            best.setStroke('#f3f3f3', 3 );
            best.setShadow( 0, 0, '#0a0a0a', 3, true, true );
            //add table...
        

            var cW = config.width * 0.22,
                cH = config.height * 0.05,
                cX = (config.width - (cW*3)) /2,
                cY = bgY + bgH *0.32;

            var levelTxtConfig = { 
                color:'#fff', 
                fontSize: Math.floor (cH * 0.43), 
                fontFamily:'Trebuchet MS'
            };

            for ( var i=0; i<3; i++ ) {

                graphics.fillStyle ( 0x3c3c3c, 1 );
                graphics.fillRect ( cX + i*cW, cY, cW, cH );
                graphics.strokeRect ( cX + i*cW, cY, cW, cH );

                var txt = this.add.text ( cX + i*cW + cW/2, cY + cH/2, 'Level ' + (i+1), levelTxtConfig ).setOrigin(0.5);
            }

            var cYb = cY + cH ;

            var scoreTxtConfig = { 
                color:'#3a3a3a', 
                fontSize: Math.floor (cH * 0.5), 
                fontFamily:'Trebuchet MS',
                fontStyle : 'bold'
            };

            for ( var i=0; i<3; i++ ) {

                //var tmpScore = Math.floor (Math.random() * 10) + 15;

                graphics.fillStyle ( 0xf5f5f5, 1 );
                graphics.fillRect ( cX + i*cW, cYb, cW, cH );
                graphics.strokeRect ( cX + i*cW, cYb, cW, cH );

                var tmpTxt = this.plyrBest [i] == "" ? "--" : this.plyrBest [i];

                var txt = this.add.text ( cX + i*cW + cW/2, cYb + cH/2, tmpTxt, scoreTxtConfig ).setOrigin(0.5);
            }


        }

    });

    var SceneB = new Phaser.Class({

        Extends: Phaser.Scene,

        initialize:

        function SceneB ()
        {
            Phaser.Scene.call(this, { key: 'sceneB' });
        },

        init : function ( data ) {

            this.blocks = {};

            this.clickFrames = [];

            this.levelscores = [];

            this.textValue = [];

            this.col = 4;
            this.row = 5;
            this.level = 0;
            this.moves = 0;
            this.score = 0;
            
            this.identicals = ( this.row * this.col )/2;
            this.checkFrames = false;
            this.isPrompted = false;

            this.plyrBest = data;

        },  
        preload: function ()
        {
            //..
        },
        create: function ()
        {
            var _this = this;

            this.initSound ();

            setTimeout ( function () {

                _this.createBlocks ();

                _this.createInterface ();

                //_this.showEndScreen ();

            }, 300 );
        },
        initSound : function () {

            this.music = this.sound.addAudioSprite('sfx');

            this.bgmusic = this.sound.add('bgsound2').setVolume(0.2).setLoop(true);
            this.bgmusic.play();

        },
        createBlocks : function () {

            var _this = this;

            var cT = config.width * 0.9;
                cTm = cT/this.col,
                cSp = cTm * 0.05,
                cSz = cTm - cSp,
                cTh = this.row * ( cSz + cSp ),
                cX = ( config.width - cT )/2 + cSz/2,
                cY = ( config.height - cTh )/2 + cSz/2;

            this.fieldY = cY - cSz/2;
            this.fieldH = cTh;
            
            var counter = 0;

            var frames = this.generateFrames();

            var r = this.row, c = this.col;
            
            for ( var i=0; i<(r*c); i++ ) {
                    
                    var ix = Math.floor ( i/c ), iy = i%c;

                    var block = new Block ( this, 'tile' + counter, cX + iy * ( cSz + cSp ), cY + ix * ( cSz + cSp ), cSz, cSz, frames[counter] ).setAlpha (0);

                    block.on ('pointerdown', function () {

                        if ( _this.checkFrames || _this.isPrompted ) return;

                        this.flipOpen();
                        _this.music.play('tick');

                        _this.clickFrames.push ({
                            'id' : this.id,
                            'frame' : this.frameId
                        });

                        if ( _this.clickFrames.length >= 2 ) {
                            _this.checkOpenBlocks ();
                            _this.checkFrames = true;
                        }
                        
                    });

                    this.tweens.add({
                        targets: block,
                        alpha: 1,
                        ease: 'Power3',
                        duration: 500,
                        //delay: counter * 10,
                        onComplete : function () {
                            this.targets[0].setInteractive();
                        }

                    }); 

                    this.blocks ['tile' + counter] = block;

                    counter ++;
                
            }

            this.music.play ('message');

        },
        createInterface : function () {
            
            var graphics = this.add.graphics();

            var th = config.height * 0.05
            
            graphics.fillStyle( 0xd5d5d5, 1 );
            graphics.fillRect ( 0, 0, config.width, th );

            var txtConfig2 = { 
                color:'#3a3a3a', 
                fontSize: Math.floor ( th * 0.43 ), 
                fontFamily:'Trebuchet MS',
            };

            var rectback = this.add.rectangle ( 0, 0, config.width * 0.18, th ).setOrigin (0).setInteractive();
            
            rectback.on ('pointerout', function () {
                this.setFillStyle ( 0x343434, 0  );
            });
            rectback.on ('pointerover', function () {
                this.setFillStyle ( 0x9c9c9c, 0.2  );
            });
            rectback.once ('pointerdown', function () {
                this.leaveScene();
            }, this );

            var back = this.add.text ( config.width*0.02, th/2, '⇽ Back', txtConfig2 ).setOrigin (0, 0.5);

            var cW = config.width * 0.9,
                cH = config.height * 0.06,
                cX = ( config.width - cW ) /2,
                cY = this.fieldY - ( cH * 1.3 );
                
            graphics.fillStyle( 0x3a3a3a, 1 );
            graphics.fillRoundedRect ( cX, cY, cW, cH, cH*0.12);
            //graphics.lineStyle ( 1, 0x3a3a3a );
            //graphics.strokeRoundedRect ( cX, cY, cW, cH, cH*0.12 );

            var txtConfig = { 
                color:'#f5f5f5', 
                fontSize: Math.floor ( cH * 0.45 ), 
                fontFamily:'Trebuchet MS',
                fontStyle : 'bold'
            };

            this.txtLevel = this.add.text ( cX + cW *0.1, cY + cH/2, 'Level : 1', txtConfig ).setOrigin (0, 0.5);

            this.txtMoves = this.add.text ( cX + cW *0.9, cY + cH/2, 'Moves : 0', txtConfig ).setOrigin (1, 0.5);
            
            var bW = config.width * 0.9,
                bH = config.height * 0.06,
                bX = ( config.width - bW ) /2,
                bY = this.fieldY + this.fieldH + ( bH * 0.2 );

            graphics.fillStyle( 0x3a3a3a, 1);
            graphics.fillRoundedRect ( bX, bY, bW, bH, bH*0.12);

            this.txtBtn = this.add.text ( bX + bW/2, bY + bH/2, 'Show Best Moves', txtConfig ).setOrigin (0.5);

            var rect = this.add.rectangle ( bX + bW/2, bY + bH/2, bW, bH ).setInteractive ();

            rect.on ('pointerover', function () {
                this.txtBtn.setFill ('#ff3333');
            }, this);
            rect.on ('pointerout', function () {
                this.txtBtn.setFill ('#f5f5f5');
            }, this);
            rect.on ('pointerdown', function () {
                this.showBestScores();
            }, this);

        },
        checkOpenBlocks : function () {

            this.moves += 1;
            this.txtMoves.text = 'Moves : ' + this.moves;

            if ( this.clickFrames[0].frame != this.clickFrames[1].frame ) {
                this.closeTiles ();
            }else {
                this.isMatched ();
            }

        },
        closeTiles:function () {
            
            var _this = this;

            var pt = [];

            for ( var i=0; i<this.clickFrames.length; i++ ) {
                pt.push ({
                    x : this.blocks[ this.clickFrames[i].id ].x,
                    y : this.blocks[ this.clickFrames[i].id ].y
                });
            };

            setTimeout (function () {

                for ( var i=0; i< _this.clickFrames.length ; i++ ) {

                    var block = _this.blocks[ _this.clickFrames[i].id ];

                    _this.tweens.add ({
                        targets : block,
                        x : pt [ i == 0 ? 1 : 0 ].x,
                        y : pt [ i == 0 ? 1 : 0 ].y,
                        duration : 200,
                        ease : 'Power3',
                        //delay : 500
                    });
                }

                _this.music.play('move', { volume : 0.5 });

            }, 300 );

            setTimeout ( function() {
                _this.music.play('warp', {volume : 0.6});
            },900);
            
            setTimeout (function () {

                for ( var i=0; i< _this.clickFrames.length ; i++ ) {

                    var block = _this.blocks[ _this.clickFrames[i].id ];
        
                    block.flipClose();
                
                }

                _this.checkFrames = false;
                _this.clickFrames = [];

            }, 1200 );

        },
        shakeTiles: function () {
            
            this.music.play('bleep', {volume : 0.5} );

            for ( var i=0; i< this.clickFrames.length ; i++ ) {

                var block = this.blocks[ this.clickFrames[i].id ];

                this.tweens.add({
                    targets: block,
                    scaleX : 1.2,
                    scaleY: 1.2,
                    //rotation : Math.PI/180 * 5,
                    yoyo : true,
                    ease: 'Quad.EaseIn',
                    duration: 50,
                    delay : 50
                });

            }

        },
        isMatched: function () {

            var _this = this;

            this.score += 1;

            var win = this.score >= this.identicals;

            setTimeout( function () {
                _this.shakeTiles ();
            }, 300);

            if ( !win ) {

                setTimeout( function () {    
                    _this.checkFrames = false;
                    _this.clickFrames = [];
                }, 600);   

            }else {

                //set best move..
                var tmpBest = _this.plyrBest [ _this.level ];

                if ( tmpBest == "" || _this.moves < parseInt (tmpBest) ) {

                    _this.plyrBest [ _this.level ] = _this.moves;

                    _this.setScore ( 'gLevel' + _this.level, _this.moves );
                }

                console.log ( tmpBest, _this.plyrBest );
                    
                setTimeout( function () {
                    _this.music.play('alternate');
                }, 600);

                setTimeout( function () {

                    if ( _this.level <  2 ) {
                        _this.upOneLevel();
                    }else {
                        _this.showEndScreen();
                    }
        
                }, 2500 );

                //...

            }
        

        },
        destroyBlocks : function () {
            //cleanUp
            for ( var i in this.blocks ) {
                this.blocks[i].destroy();
            }
            this.blocks = {};
        },
        upOneLevel: function () {

            if ( this.isPrompted ) this.removeScores();

            this.clickFrames = [];
            this.checkFrames = false;

            this.level += 1;
            this.row += 1;
            this.col += 1;
            this.score = 0;
            this.identicals = (this.row * this.col)/2;

            this.txtLevel.text =  'Level : ' + ( this.level + 1 );

            this.moves = 0;

            this.txtMoves.text =  'Moves : '+ this.moves;

            this.destroyBlocks();

            this.createBlocks();
            

        },
        generateFrames : function() {

            /* 
            
            var arr = [];
            for ( var i=0; i<(this.row * this.col); i++) {
                arr.push ( Math.floor ( i/2 ) );
            }

            var finArr = [];
            while ( arr.length > 0 ) {

                var randomIndex = Math.floor ( Math.random() * arr.length );

                finArr.push ( arr[randomIndex] );

                arr.splice ( randomIndex, 1);
            }

            */
            var total = this.row * this.col;

            var arr = [];
            for ( var i=0; i<23; i++) {
                arr.push ( i );
            }

            var tmp_arr = [];
            while (tmp_arr.length < (total/2) ) {

                var randomIndex = Math.floor ( Math.random() * arr.length );

                tmp_arr.push ( arr[randomIndex] );

                arr.splice ( randomIndex, 1);

            }

            arr = [];

            for ( var i=0; i<tmp_arr.length ; i++) {
                arr.push ( tmp_arr[i] );
                arr.push ( tmp_arr[i] );
            }

            //return arr;

            var finArr = [];
            while ( arr.length > 0 ) {

                var randomIndex = Math.floor ( Math.random() * arr.length );

                finArr.push ( arr[randomIndex] );

                arr.splice ( randomIndex, 1);
            }

            return finArr;
            
        },
        setScore : function ( vname, value ) {

            console.log ( vname );

            //local computer...
            var exdays = 30;

            var d = new Date();
            d.setTime(d.getTime() + ( exdays * 24 * 60 * 60 * 1000));
            
            var expires = "expires="+d.toUTCString();

            document.cookie =  vname + "=" + value + ";" + expires + ";path=/";

            /*
            //facebook...
            this.levelscores[this.level] = value;

            facebookStuff.score = this.levelscores;

            var _this = this;

            FBInstant.player
            .setDataAsync({
                scores : _this.levelscores,
            })
            .then(function() {
                console.log('score is set');
            });
            */
        },
        showBestScores : function () {

            this.isPrompted = true;

            this.bestScoreScreenElements = [];

            this.music.play('clicka');

            var graphics = this.add.graphics().setDepth(999);

            var bgH = config.height *0.3,
                bgY = config.height * 0.15;

            graphics.fillStyle( 0x3a3a3a, 0.9 );
            graphics.lineStyle ( 1, 0x0a0a0a );

            graphics.fillRect ( 0, 0, config.width, config.height);

            var bestTxtConfig = { 
                color:'#fefefe', 
                fontSize: Math.floor ( config.height * 0.03 ), 
                fontFamily:'Trebuchet MS'
            };

            var best = this.add.text ( config.width/2, bgY + bgH *0.2, '···· Best Moves ····', bestTxtConfig  ).setOrigin(0.5).setDepth(999);
            best.setShadow( 1, 1, '#0a0a0a', 3, true, true );

            this.bestScoreScreenElements.push ( graphics );
            this.bestScoreScreenElements.push ( best );
            
            //add table...
            var cW = config.width * 0.25,
                cH = config.height * 0.05,
                cX = (config.width - (cW*3)) /2,
                cY = bgY + bgH *0.39;

            var levelTxtConfig = { 
                color:'#fff', 
                fontSize: Math.floor (cH * 0.43), 
                fontFamily:'Trebuchet MS'
            };

            for ( var i=0; i<3; i++ ) {

                graphics.fillStyle ( 0x6a6a6a, 1 );
                graphics.fillRect ( cX + i*cW, cY, cW, cH );
                graphics.strokeRect ( cX + i*cW, cY, cW, cH );

                var txt = this.add.text ( cX + i*cW + cW/2, cY + cH/2, 'Level ' + (i+1), levelTxtConfig ).setOrigin(0.5).setDepth(999);

                this.bestScoreScreenElements.push ( txt );
            
            }

            var cYb = cY + cH ;

            var scoreTxtConfig = { 
                color:'#3a3a3a', 
                fontSize: Math.floor (cH * 0.5), 
                fontFamily:'Trebuchet MS',
                fontStyle : 'bold'
            };

            for ( var i=0; i<3; i++ ) {

                graphics.fillStyle ( 0xf5f5f5, 1 );
                graphics.fillRect ( cX + i*cW, cYb, cW, cH );
                graphics.strokeRect ( cX + i*cW, cYb, cW, cH );

                var tmpScore = this.plyrBest[i] == "" ? "--" : this.plyrBest[i];

                var txt2 = this.add.text ( cX + i*cW + cW/2, cYb + cH/2, tmpScore, scoreTxtConfig ).setOrigin(0.5).setDepth(999);

                this.bestScoreScreenElements.push ( txt2 );
            }

            var endTxtConfig = {
                color : '#f5f533',
                fontSize : config.height *0.018,
                fontFamily : 'Trebuchet MS'
            }

            var txtas = this.add.text ( config.width/2, config.height *0.4, 'Click anywhere to close best scores.', endTxtConfig ).setDepth(999).setOrigin (0.5);
            
            this.bestScoreScreenElements.push ( txtas );

            var recta = this.add.rectangle ( config.width/2, config.height/2,config.width, config.height).setInteractive().setDepth(999);

            recta.on('pointerdown', function () {
                this.removeScores();
            }, this );

            this.bestScoreScreenElements.push ( recta );
            
            
            
        },
        removeScores: function () {

            this.isPrompted = false;
            
            this.music.play('clicka');

            for ( var i in this.bestScoreScreenElements ) {
                this.bestScoreScreenElements[i].destroy();
            }

        },
        showEndScreen : function () {
            
            if ( this.isPrompted ) this.removeScores();

            this.music.play('clickc');
            
            var graphics = this.add.graphics();

            graphics.fillStyle( 0x0a0a0a, 0.8 );
            graphics.fillRect ( 0, 0, config.width, config.height );

            var bW = config.width * 0.83,
                bH = config.height * 0.2,
                bX = ( config.width - bW )/2,
                bY = this.fieldY + (( this.fieldH - bH )/2);

            graphics.fillStyle( 0xf5f5f5, 0.8 );
            graphics.lineStyle ( 2, 0xf3f3f3 );
            graphics.fillRoundedRect ( bX, bY, bW, bH, bH *0.05 );
            graphics.strokeRoundedRect ( bX, bY, bW, bH, bH *0.05 );

            var smH = bH * 0.4,
                smY = bY + ( bH - smH )/2;

            graphics.fillStyle( 0x3a3a3a, 1 );
            graphics.fillRect ( bX, smY, bW, smH );

            var configTxt = {
                color : '#f5f5f5',
                fontSize : bH * 0.12,
                fontFamily : 'Trebuchet MS'
            }

            var txt = this.add.text ( bX + bW/2, bY + bH/2, 'Congrats! You\'ve finished all 3 levels.', configTxt ).setOrigin (0.5);


            var endTxtConfig = {
                color : '#f5f500',
                fontSize : bH * 0.09,
                fontFamily : 'Trebuchet MS'
            }
            var txte = this.add.text ( config.width/2, config.height *0.65, 'Click anywhere to go back to home screen.', endTxtConfig ).setOrigin (0.5);

            var rect = this.add.rectangle (config.width/2, config.height/2, config.width, config.height ).setInteractive();

            rect.once ('pointerdown', function () {
                this.leaveScene();
            }, this );

        },
        leaveScene : function () {
            
            this.bgmusic.stop();

            this.scene.start ('sceneA');
            
        }

    });

    //..Blocks...
    var Block = new Phaser.Class({

        Extends: Phaser.GameObjects.Container,

        initialize:

        function Block (scene, id, x, y, width, height, frameId )
        {
            this.scene = scene,
            this.id = id;
            this.x = x,
            this.y = y,
            this.width = width,
            this.height = height,
            this.isOpen = false,
            this.frameId = frameId;

            Phaser.GameObjects.Container.call(this, scene)

            this.setPosition(x, y).setSize(width, height);

            scene.children.add ( this );

            //this.container = scene.add.container(x, y);
            //this.container.setSize ( width, height);

            this.graphics = scene.add.graphics({ fillStyle : { color : 0xf4f4f4, alpha:1 } });
            this.graphics.fillRoundedRect(-width/2, -height/2, width, height, 5);

            this.graphics.lineStyle(1, 0x3a3a3a);
            this.graphics.strokeRoundedRect(-width/2, -height/2, width, height,5);

            var top = -this.height/2,
                left = -this.width/2;

            var size = this.width * 0.85,
                xp = left + ( ( this.width - size )/2 ),
                yp = top + ( ( this.height - size )/2 );


            this.graphics2 = this.scene.add.graphics();
            this.graphics2.lineStyle (1, 0xcccccc );
            this.graphics2.strokeRoundedRect( xp, yp, size, size, 5);


            var scale = width * 0.85 / 70;

            this.image = scene.add.sprite (0,0,'thumbs').setFrame ( 0 ).setScale( scale );

            this.textss = scene.add.text (left +5, top +5, '', { color: '#333', fontSize: height * 0.2});

            this.add ([this.graphics, this.graphics2, this.image, this.textss ]);
            
        },
        flipOpen : function () {
            
            this.graphics2.clear();

            var top = -this.height/2,
                left = -this.width/2;

            var size = this.width * 0.65,
                xp = left + ( ( this.width - size )/2 ),
                yp = top + ( ( this.height - size )/2 );

            
            this.graphics2.fillStyle (0x9a9a9a, 0.6 );
            this.graphics2.lineStyle (0.5, 0x7c7c7c );
            
            this.graphics2.fillRoundedRect( xp, yp, size, size, 5);
            //this.graphics2.strokeRoundedRect( xp, yp, size, size, 5);


            this.add (this.graphics2);

            this.disableInteractive();
            this.image.setFrame ( this.frameId + 1 );

        }, 

        flipClose : function () {

            this.graphics2.clear();

            var top = -this.height/2,
                left = -this.width/2;

            var size = this.width * 0.85,
                xp = left + ( ( this.width - size )/2 ),
                yp = top + ( ( this.height - size )/2 );

            this.graphics2.lineStyle (1, 0xcccccc );
            this.graphics2.strokeRoundedRect( xp, yp, size, size, 5);

        
            this.image.setFrame (0);
            this.setInteractive();
        }
        


    });

} 
