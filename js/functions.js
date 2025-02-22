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
                let scale = document.getElementById("scale").value;
                let key = document.getElementById("key").value;
                let inputArea = document.getElementById("inputArea").value.split("\n");

                let modeData = scale === "major" ? data.major : data.minor;

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