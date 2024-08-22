// Función anonima auto invocada crean un nuevo scope que no tiene referencia por nombre por lo que no se puede llamar directamente
const miModulo = (() => {

    'use strict';

    let baraja            = [];
    let puntosJugadores   = [];
    const tipos           = ['C', 'D', 'H', 'S'],
          especiales      = ['A', 'J', 'Q', 'K'];

    // Referencias del HTML
    const d                 = document;
    const btnJugar          = d.querySelector('#btnJugar'),
          btnPedir          = d.querySelector('#btnPedir'),
          btnDetener        = d.querySelector('#btnDetener');
    const cartasJugadores   = d.querySelectorAll('.cartas'),
          smalls            = d.querySelectorAll('small');
    
    const inicioJuego = (cantidadJugadores = 2) => {
        baraja = crearBaraja();

        puntosJugadores = [];
        for(let i = 0; i < cantidadJugadores ;i++){
            puntosJugadores.push(0);
        }

        smalls.forEach(elemento => elemento.innerText = 0);
        cartasJugadores.forEach(elemento => elemento.innerText = '');

        btnPedir.disabled = false;
        btnDetener.disabled = false;
    }

    // Esta función crea un mazo de cartas
    const crearBaraja = () => {
    
        baraja = [];

        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                baraja.push( i + tipo);        
            }
        }
    
        for(let tipo of tipos){
            for(let especial of especiales) {
                baraja.push(especial + tipo)
            }
        }
    
        return shuffle(baraja);
    }
    
    // Está función me permite pedir una carta
    const perdirCarta = () => {
        if (baraja.length === 0) {
            throw 'No hay cartas en el baraja';
        }
    
        return baraja.pop();
    }
    
    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length - 1);
        return (isNaN(valor)) ? (valor === 'A') ? 11 : 10 : valor * 1;
    }

    // Turno: 0 = primer jugador y el ultimo será el crupier
    const contadorPuntos = (carta, turno) => {
        puntosJugadores[turno] += valorCarta(carta);
        smalls[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCartas = (carta, turno) => {
        const imgCarta = d.createElement('img');
              imgCarta.src = `assets/img/cartas/${carta}.png`;
              imgCarta.alt = 'cartas de blackjack';
              imgCarta.classList.add('carta');
        cartasJugadores[turno].append(imgCarta);
    }

    const quienGana = () => {
        const [puntosMinimos, puntosCrupier] = puntosJugadores;

        setTimeout(() => {
            if (puntosCrupier === puntosMinimos) {
                alert('empate!');
            } else if (puntosMinimos > 21) {
                alert('Crupier Gana!');
            } else if (puntosCrupier > 21){
                alert('Jugador Gana!')
            } else {
                alert('Crupier Gana!');
            }
        }, 100);
    }

    // turno de la crupier
    const turnoCrupier = (puntosMinimos) => {
        
        let puntosCrupier = 0;

        do {
            const carta = perdirCarta();

            puntosCrupier = contadorPuntos(carta, puntosJugadores.length - 1);
            crearCartas(carta, puntosJugadores.length - 1)

        } while ((puntosCrupier < puntosMinimos) && (puntosMinimos <= 21));

        quienGana(); 
    }
    
    // Eventos
    // Un callback es una función que se manda como argumento
    btnPedir.addEventListener('click', () => {
        const carta = perdirCarta();
        const puntosJugador = contadorPuntos(carta, 0);

        crearCartas(carta, 0);

        if (puntosJugador > 21) {
            console.warn('Lo siento, perdiste!');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoCrupier(puntosJugador);
        } else if (puntosJugador === 21){
            console.warn('Eres el ganador!');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoCrupier(puntosJugador);
        }
    });
    
    btnJugar.addEventListener('click', () => {
        inicioJuego();
    });
    
    btnDetener.addEventListener('click', () => {
        btnPedir.disabled   = true;
        btnDetener.disabled = true;

        turnoCrupier(puntosJugadores[0]);
    });

    // La función pasara a ser publica y visible
    return {
        nuevoJuego: inicioJuego
    };

})();