$(document).ready(function() {
    $('#transposeBtn').click(function() {
        transpose();
    });

    $('#copyBtn').click(function() {
        const outputArea = document.getElementById("outputArea");
        const range = document.createRange();
        range.selectNode(outputArea);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
    });

    function transpose() {
        fetch('data/scales.json')
            .then(response => response.json())
            .then(data => {
                let mode = document.getElementById("mode").value;
                let key = document.getElementById("key").value;
                let inputArea = document.getElementById("inputArea").value.split("\n");

                let modeData = mode === "major" ? data.majorMode : data.minorMode; // Cambio aquí

                let keyData = modeData.find(item => item.key === key); // Cambio aquí

                if (!keyData) {
                    return;
                }

                let outputArea = inputArea.map(line => {
                    let parts = line.split(/(\s+)/);

                    return parts.map(part => {
                        let match = part.match(/\b(I{1,3}|IV|V?I{0,3})(maj7|7|sus2|sus4|add9|add11|add13|\/\d+)?\b/);
                        if (match) {
                            let degree = match[1];
                            let tension = match[2] || "";
                            let chordData = keyData.chords.find(chord => chord.degree === degree); // Cambio aquí
                            if (chordData) {
                                return `<span class="transposed">${chordData.chord + tension}</span>`; // Cambio aquí
                            }
                        }
                        return part;
                    }).join("");
                }).join("\n");

                document.getElementById("outputArea").innerHTML = outputArea;
            });
    }
});