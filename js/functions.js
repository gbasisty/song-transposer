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
        fetch('data/tonalidades.json') // Ruta modificada
            .then(response => response.json())
            .then(data => {
                let modo = document.getElementById("modo").value;
                let tonalidad = document.getElementById("tonalidad").value;
                let entrada = document.getElementById("entrada").value.split("\n");

                let modoData = modo === "mayor" ? data.modoMayor : data.modoMenor;

                let tonalidadData = modoData.find(item => item.tonalidad === tonalidad);

                if (!tonalidadData) {
                    return;
                }

                let salida = entrada.map(linea => {
                    let partes = linea.split(/(\s+)/);

                    return partes.map(parte => {
                        let match = parte.match(/\b(I{1,3}|IV|V?I{0,3})(maj7|7|sus2|sus4|add9|add11|add13|\/\d+)?\b/);
                        if (match) {
                            let grado = match[1];
                            let tension = match[2] || "";
                            let acordeData = tonalidadData.acordes.find(acorde => acorde.grado === grado);
                            if (acordeData) {
                                return `<span class="transpuesto">${acordeData.acorde + tension}</span>`;
                            }
                        }
                        return parte;
                    }).join("");
                }).join("\n");

                document.getElementById("salida").innerHTML = salida;
            });
    }
});