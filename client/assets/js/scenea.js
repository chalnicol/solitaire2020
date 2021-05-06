

class SceneA extends Phaser.Scene {

    constructor ()
    {
        super('SceneA');
    }

    create () 
    {

        this.mode = 0;

       // this.initMenuSound ();

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


            var btn = new MyButton (this, 960, 300+ (i*70), 200, 60, 'but'+i, '', '', 0, but[i] );

      
            btn.on ('pointerdown', function () {
                //..
                this.first.setFillStyle ( 0xffff00, 1);
                
            });
            btn.on ('pointerup', () => {

                btn.first.setFillStyle ( 0xffffff, 1);

                this.mode = i

                this.startGame ();

            });

           
        }

    }

    startGame () 
    {
        //this.bgmusic.stop();
        
        this.scene.start ('SceneB', { 'mode' : this.mode });
    }

}


