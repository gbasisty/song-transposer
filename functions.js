$(document).ready(function() {
    $('#transponer').click(function() {
        transponer();
    });

    $('#copiar').click(function() {
        const salida = document.getElementById("salida");
        const range = document.createRange();
        range.selectNode(salida);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
    });

    function transponer() {
        fetch('tonalidades.json')
            .then(response => response.json())
            .then(data => {
                let modo = document.getElementById("modo").value;
                let tonalidad = document.getElementById("tonalidad").value;
                let entrada = document.getElementById("entrada").innerText.split("\n");
    
                let modoData = modo === "mayor" ? data.modoMayor : data.modoMenor;
    
                let tonalidadData = modoData.find(item => item.tonalidad === tonalidad);
    
                if (!tonalidadData) {
                    // Manejar el error si no se encuentra la tonalidad
                    return;
                }
    
                let salida = entrada.map(linea => linea.replace(/\b(I{1,3}|IV|V?I{0,3})(maj7|7|sus2|sus4|add9|add11|add13)?\b/g,
                    (match, grado, tension = '') => {
                        let acordeData = tonalidadData.acordes.find(acorde => acorde.grado === grado);
                        if (acordeData) {
                            return `<span class="transpuesto">${acordeData.acorde + tension}</span>`;
                        }
                        return match;
                    }
                )).join("\n");
    
                document.getElementById("salida").innerHTML = salida;
            });
    }
});