var app = {
    inicio: function() {
        DIAMETRO_BOLA = 50;
        dificultad = 0;
        velocidadX = 0;
        velocidadY = 0;
        puntuacion = 0;
        xoc = false;
        xocParet = 0;
        colorfons = '#f27d0c';

        colorBase = 'f27d0c';
        r = 0;
        g = 0;
        b = 0;
        temp1 = 'f27d0c';
        temp = 0;
        esBlanc = 100;

        alto = document.documentElement.clientHeight;
        ancho = document.documentElement.clientWidth;

        app.vigilaSensores();
        app.iniciaJuego();
    },

    iniciaJuego: function() {

        function preload() {
            game.physics.startSystem(Phaser.Physics.ARCADE);

            game.stage.backgroundColor = colorfons;
            game.load.image('bola', 'assets/bola.png');
            game.load.image('objetivo', 'assets/objetivo.png');
            game.load.image('objetivo2', 'assets/objetivo2.png');
            game.load.image('objetivo21', 'assets/objetivo21.png');
        }

        function create() {
            scoreText = game.add.text(16, 16, puntuacion, {
                fontSize: '25px',
                fill: '#757676'
            });
            scoreTextNivell = game.add.text(16, 50, dificultad, {
                fontSize: '25px',
                fill: '#757676'
            });
            scoreColorFons = game.add.text(16, 80, colorfons, {
                fontSize: '25px',
                fill: '#757676'
            });

            objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo');
            objetivo2 = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo2');
            objetivo21 = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo21');
            bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');

            game.physics.arcade.enable(bola);
            game.physics.arcade.enable(objetivo);
            game.physics.arcade.enable(objetivo2);
            game.physics.arcade.enable(objetivo21);

            bola.body.collideWorldBounds = true; // toca a les bandes
            bola.body.onWorldBounds = new Phaser.Signal();
            bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);

            //    bola.body.velocity.x = 400; // Velocidad fija em x
            //    bola.body.velocity.y = 400; // Velocidad fija em y
            //    bola.body.bounce.set(1); // Para que rebote
        }

        function update() {

            if (xoc) {
                game.stage.backgroundColor = '#f20c0c';
                xoc = false;
            } else {
                game.stage.backgroundColor = app.updateBackgroundColor(dificultad);
            };
            scoreTextNivell.text = 'Nivell --> ' + dificultad;
            scoreText.text = 'Punts --> ' + puntuacion;
            scoreColorFons.text = 'Color fons --> ' + app.updateBackgroundColor(dificultad);

            var factorDificultad = (300 + (dificultad * 100));
            bola.body.velocity.y = (velocidadY * factorDificultad);
            bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));

            game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this); // es suma 1 punt
            game.physics.arcade.overlap(bola, objetivo2, app.incrementaPuntuacion2, null, this); // es sumen 10 punts
            game.physics.arcade.overlap(bola, objetivo21, app.decrementaPuntuacion2, null, this); // es resten 10 punts


        }

        var estados = {
            preload: preload,
            create: create,
            update: update
        };
        var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser', estados);
    },

    decrementaPuntuacion: function() {
        xoc = true;
        xocParet = xocParet + 1;
        if (xocParet >= 8) { // nomes baixa puntuacio si toca 8 vegades als costats
            puntuacion = puntuacion - 1;
            if (dificultad > 10 && puntuacion > 20) {
                dificultad = dificultad - 1;
            }
            xocParet = 0;
        }

        if (puntuacion < 1) dificultad = 0;
    },
    decrementaPuntuacion2: function() {
        xoc = true;
        puntuacion = puntuacion - 10;

        objetivo21.body.x = app.inicioX();
        objetivo21.body.y = app.inicioY();

        if (dificultad > 10 && puntuacion > 20) {
            dificultad = dificultad - 1;
        }
        if (puntuacion < 1) dificultad = 0;
    },

    incrementaPuntuacion: function() {
        puntuacion = puntuacion + 1;

        objetivo.body.x = app.inicioX();
        objetivo.body.y = app.inicioY();
        objetivo21.body.x = app.inicioX();
        objetivo21.body.y = app.inicioY();

        if (puntuacion > 0) {
            dificultad = dificultad + 1;
        }
    },

    incrementaPuntuacion2: function() {
        puntuacion = puntuacion + 10;

        objetivo2.body.x = app.inicioX();
        objetivo2.body.y = app.inicioY();
        objetivo21.body.x = app.inicioX();
        objetivo21.body.y = app.inicioY();

        if (puntuacion > 0) {
            dificultad = dificultad + 1;
        }
    },

    updateBackgroundColor: function(valor) {
        if (valor <= 1) {
            return '#' + colorBase;
        }

        if (valor < esBlanc) { // si ja es blanc , ja no cambia de color.

            r = parseInt(colorBase.substr(0, 2), 16);
            g = parseInt(colorBase.substr(2, 2), 16);
            b = parseInt(colorBase.substr(4, 2), 16);

            temp1 = ((0 | (1 << 8) + r + (256 - r) * valor / 40).toString(16)).substr(1) +
                ((0 | (1 << 8) + g + (256 - g) * valor / 40).toString(16)).substr(1) +
                ((0 | (1 << 8) + b + (256 - b) * valor / 40).toString(16)).substr(1);
            if (temp1.substr(0, 2) == 'ff')
                esBlanc = valor;

            return '#' + temp1;
        } else
            return '#ffffff'; // blanc

    },


    inicioX: function() {
        return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA);
    },

    inicioY: function() {
        temp = app.numeroAleatorioHasta(alto - DIAMETRO_BOLA);
        if (temp < 120) // perque no tapi els comptadors
            return 120;
        else
            return temp;
    },

    numeroAleatorioHasta: function(limite) {
        return Math.floor(Math.random() * limite);
    },

    vigilaSensores: function() {

        function onError() {
            console.log('onError!');
        }

        function onSuccess(datosAceleracion) {
            app.detectaAgitacion(datosAceleracion);
            app.registraDireccion(datosAceleracion);
        }

        navigator.accelerometer.watchAcceleration(onSuccess, onError, {
            frequency: 10
        });
    },

    detectaAgitacion: function(datosAceleracion) {
        var agitacionX = datosAceleracion.x > 10;
        var agitacionY = datosAceleracion.y > 10;

        if (agitacionX || agitacionY) {
            setTimeout(app.recomienza, 1000);
        }
    },

    recomienza: function() {
        document.location.reload(true);
    },

    registraDireccion: function(datosAceleracion) {
        velocidadX = datosAceleracion.x;
        velocidadY = datosAceleracion.y;
    }

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}