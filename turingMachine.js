class TuringMachine {
    constructor(mode = "binario") {
        this.tape = Array(1000).fill('_');
        this.pointer = 500;
        this.result = [];
        this.mode = mode.toLowerCase(); // "binario" o "hexadecimal"
    }

    setInput(input) {
        if (this.mode === "hexadecimal") {
            const [hexA, hexB] = input.toUpperCase().split('#');
            if (!/^[0-9A-F]+$/.test(hexA) || !/^[0-9A-F]+$/.test(hexB)) {
                throw new Error("Entrada hexadecimal inválida.");
            }
            const binA = parseInt(hexA, 16).toString(2).padStart(4 * hexA.length, '0');
            const binB = parseInt(hexB, 16).toString(2).padStart(4 * hexB.length, '0');
            input = `${binA}#${binB}`;
        } else {
            if (!/^[01]+#[01]+$/.test(input)) {
                throw new Error("Entrada binaria inválida.");
            }
        }

        for (let i = 0; i < input.length; i++) {
            this.tape[this.pointer + i] = input[i];
        }
    }

    run() {
        const input = this.tape.join('').replace(/_/g, '');
        const [a, b] = input.split('#');

        const sum = parseInt(a, 2) + parseInt(b, 2);
        const resultBinary = sum.toString(2);

        const writePos = this.pointer + input.length + 5;
        for (let i = 0; i < resultBinary.length; i++) {
            this.tape[writePos + i] = resultBinary[i];
        }

        this.result = resultBinary.split('');
    }

    getResult() {
        if (this.mode === "hexadecimal") {
            return parseInt(this.result.join(''), 2).toString(16).toUpperCase();
        }
        return this.result.join('');
    }

    printTape() {
        return this.tape.slice(this.pointer - 20, this.pointer + 60).join('');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('executeButton').addEventListener('click', function () {
        const mode = document.getElementById('mode').value;
        const input = document.getElementById('inputContent').value.trim();
        const outputDiv = document.getElementById('output');
        const translatorDiv = document.getElementById('translator');

        // Limpiar resultados anteriores
        outputDiv.innerHTML = '';
        translatorDiv.innerHTML = '';

        try {
            const tm = new TuringMachine(mode);
            tm.setInput(input);
            tm.run();

            const result = tm.getResult();
            const tape = tm.printTape();

            // Mostrar resultado
            outputDiv.innerHTML = `
                <strong>Resultado (${mode}):</strong> ${result}
                <br><br>
                <strong>Cinta:</strong>
                <div>${tape}</div>
            `;

            // Mostrar explicación de la suma
            const translatedInput = translateInput(input, mode);
            translatorDiv.innerHTML = `
                <strong>Explicación de la suma:</strong>
                <div>${translatedInput}</div>
            `;
        } catch (error) {
            outputDiv.innerHTML = `<span class="error">${error.message}</span>`;
        }
    });

    function translateInput(input, mode) {
        if (mode === "binario") {
            const [binA, binB] = input.split('#');
            const decA = parseInt(binA, 2);
            const decB = parseInt(binB, 2);
            const sumDecimal = decA + decB;
            const sumBinary = sumDecimal.toString(2);

            return `
                <div>Entrada en binario: ${binA} + ${binB}</div>
                <div>Conversión a decimal: ${decA} + ${decB} = ${sumDecimal}</div>
                <div>Resultado en binario: ${sumBinary}</div>
            `;
        } else if (mode === "hexadecimal") {
            const [hexA, hexB] = input.toUpperCase().split('#');
            const decA = parseInt(hexA, 16);
            const decB = parseInt(hexB, 16);
            const sumDecimal = decA + decB;
            const sumHex = sumDecimal.toString(16).toUpperCase();

            return `
                <div>Entrada en hexadecimal: ${hexA} + ${hexB}</div>
                <div>Conversión a decimal: ${decA} + ${decB} = ${sumDecimal}</div>
                <div>Resultado en hexadecimal: ${sumHex}</div>
            `;
        }
    }
});