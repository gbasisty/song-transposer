$(document).ready(function() {
    $('#transposeBtn').click(function() {
        transpose();
    });

    $('#copyBtn').click(function() {
        const outputArea = document.getElementById("outputArea");
        const htmlContent = outputArea.innerHTML;

        if (navigator.clipboard && navigator.clipboard.write) {
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const data = [new ClipboardItem({ 'text/html': blob })];

            navigator.clipboard.write(data).then(() => {
                console.log('Contenido HTML copiado al portapapeles.');
            }).catch(err => {
                console.error('Error al copiar el contenido HTML: ', err);
                // Fallback para navegadores que no soportan Clipboard.write()
                fallbackCopy(htmlContent);
            });
        } else {
            // Fallback para navegadores que no soportan Clipboard.write()
            fallbackCopy(htmlContent);
        }
    });

    function fallbackCopy(htmlContent) {
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = htmlContent;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        try {
            const successful = document.execCommand('copy');
            const msg = successful ? 'successful' : 'unsuccessful';
            console.log('Fallback: Copiar al portapapeles fue ' + msg);
        } catch (err) {
            console.error('Fallback: No se pudo copiar al portapapeles', err);
        }
        document.body.removeChild(tempTextArea);
    }

    function transpose() {
        fetch('data/scales.json')
            .then(response => response.json())
            .then(data => {
                let scale = document.getElementById("scale").value;
                let key = document.getElementById("key").value;
                let inputArea = document.getElementById("inputArea").value.split("\n");

                let modeData;
                if (scale === "major") {
                    modeData = data.major;
                } else if (scale === "minor") {
                    modeData = data.minor;
                    key += "m"; // Agregar "m" para menor natural
                } else if (scale === "harmonicMinor") {
                    modeData = data.harmonicMinor;
                    key += "m"; // Agregar "m" para menor armónica
                } else if (scale === "melodicMinor") {
                    modeData = data.melodicMinor;
                    key += "m"; // Agregar "m" para menor melódica
                }

                let keyData = modeData.find(item => item.key === key);

                if (!keyData) {
                    return;
                }

                let outputLines = inputArea.map(line => {
                    let parts = line.split(/(\s+)/);

                    return parts.map(part => {
                        let match = part.match(/\b(I{1,3}|IV|V?I{0,3})(maj7|7|sus2|sus4|add9|add11|add13|\/\d+)?\b/);
                        if (match) {
                            let degree = match[1];
                            let tension = match[2] || "";
                            let chordData = keyData.chords.find(chord => chord.degree === degree);
                            if (chordData) {
                                return `<span class="transposed">${chordData.chord + tension}</span>`;
                            }
                        }
                        return part;
                    }).join("");
                });

                document.getElementById("outputArea").innerHTML = outputLines.join("\n");
            });
    }
});