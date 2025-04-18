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
    
        this.result = resultBinary.split(''); // ✅ Esto evita el error
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


const tm = new TuringMachine("binario");
tm.setInput("0111#0011"); // 7 + 3 = 10 (1010)
tm.run();
console.log("Resultado binario:", tm.getResult());
console.log(tm.printTape());

// const tm = new TuringMachine("hexadecimal");
// tm.setInput("1f#2b"); // A (10) + 2 = C
// tm.run();
// console.log("Resultado hexadecimal:", tm.getResult());
// console.log(tm.printTape());