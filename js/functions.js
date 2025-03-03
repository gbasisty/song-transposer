$(document).ready(function() {
    $('#transposeBtn').click(function() {
        const direction = $('input[name="direction"]:checked').val();
        if (direction === "degreesToChords") {
            transpose();
        } else {
            detranspose();
        }
    });

    $('#clearBtn').click(function() {
        $('#inputArea').val('');
        $('#outputArea').empty();
    });

    $('#copyBtn').click(function() {
        const outputArea = document.getElementById("outputArea");
        const range = document.createRange();
        range.selectNodeContents(outputArea);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        selection.removeAllRanges();
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
                    key += "m";
                } else if (scale === "harmonicMinor") {
                    modeData = data.harmonicMinor;
                    key += "m";
                } else if (scale === "melodicMinor") {
                    modeData = data.melodicMinor;
                    key += "m";
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

    function detranspose() {
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
                    key += "m";
                } else if (scale === "harmonicMinor") {
                    modeData = data.harmonicMinor;
                    key += "m";
                } else if (scale === "melodicMinor") {
                    modeData = data.melodicMinor;
                    key += "m";
                }
    
                let keyData = modeData.find(item => item.key === key);
    
                if (!keyData) {
                    return;
                }
    
                let outputLines = inputArea.map(line => {
                    let parts = line.split(/(\s+)/);
    
                    return parts.map(part => {
                        let chordMatch = part.match(/\b([A-G][b#]?(m|maj7|7|sus2|sus4|add9|add11|add13|\/\d+)?)\b/);
                        if (chordMatch) {
                            let chordWithTension = chordMatch[1];
                            let tension = chordWithTension.match(/(m|maj7|7|sus2|sus4|add9|add11|add13|\/\d+)?/)[0] || '';
                            let chordWithoutTension = chordWithTension.replace(tension, '');
                            let degreeData = keyData.chords.find(item => {
                                return item.chord === chordWithoutTension;
                            });
                            if (degreeData) {
                                // Verificar si la tensión es "m" y el acorde base no es menor
                                if (tension === 'm' && !chordWithoutTension.includes('m')) {
                                    return `<span class="transposed">${degreeData.degree.toLowerCase()}</span>`;
                                } else {
                                    return `<span class="transposed">${degreeData.degree}${tension}</span>`;
                                }
                            }
                        }
                        return part;
                    }).join("");
                });
    
                document.getElementById("outputArea").innerHTML = outputLines.join("\n");
            });
    }
});