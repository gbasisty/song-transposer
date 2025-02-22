$(document).ready(function() {
    // ... (resto del código)

    function transpose() {
        const direction = $('input[name="direction"]:checked').val();
        fetch('data/scales.json')
            .then(response => response.json())
            .then(data => {
                // ... (resto del código)

                let outputLines = inputArea.map(line => {
                    let parts = line.split(/(\s+)/);

                    if (direction === "degreesToChords") {
                        // ... (código para grados a acordes)
                    } else {
                        // Acordes a grados
                        return parts.map(part => {
                            let chordMatch = part.match(/\b([A-G][b#]?(m|maj7|7|sus2|sus4|add9|add11|add13|\/\d+)?)\b/);
                            if (chordMatch) {
                                let chordWithTension = chordMatch[1];
                                let degreeData = keyData.chords.find(item => {
                                    // Verificar si el acorde en el JSON coincide con el acorde con tensión
                                    return item.chord + (chordWithTension.match(/(m|maj7|7|sus2|sus4|add9|add11|add13|\/\d+)?/)[0] || '') === chordWithTension;
                                });
                                if (degreeData) {
                                    return `<span class="transposed">${degreeData.degree}</span>`;
                                }
                            }
                            return part;
                        }).join("");
                    }
                });

                document.getElementById("outputArea").innerHTML = outputLines.join("\n");
            });
    }
});