

class SceneA extends Phaser.Scene {

    constructor ()
    {
        super('SceneA');
    }

    create () 
    {

        this.mode = 0;

        this.add.image (960, 540, 'bg');

        this.add.image (960, 540, 'title');

        this.initMenuSound ();

        this.initMenuInterface ();

    }

    playSound  ( snd, vol=0.5 ) 
    {
        this.soundFx.play ( snd, { volume : vol });
    }

    initMenuSound () 
    {

        this.bgmusic = this.sound.add('introBg').setVolume(0.2).setLoop(true);

        this.bgmusic.play();

        this.soundFx = this.sound.addAudioSprite('sfx');

    }

    initMenuInterface () 
    {

        const but = [ 'easy', 'hard' ];

    

        for ( let i = 0; i < 2; i++ ) {

            //var btn = new MyButton (this, 960, 600+ (i*70), 200, 60, 'but'+i, '', '', 0, but[i] );
            var btn = this.add.image ( 720 + i*450, 700, 'menu', i ).setInteractive();

            btn.on ('pointerover', function () {
                //..
                this.setTint(0xffffcc);
                
            });
            btn.on ('pointerout', function () {
                //..
                this.clearTint();
                
            });

            btn.on ('pointerdown', () => {
                this.playSound ('clicka');
            });

            btn.on ('pointerup', () => {

                btn.clearTint ();

                this.mode = i

                this.startGame ();

            });

        }

    }

    startGame () 
    {
        this.bgmusic.stop();
        
        this.scene.start ('Proper', { 'mode' : this.mode });
    }

}


