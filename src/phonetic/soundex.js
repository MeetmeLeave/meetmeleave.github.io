class AmericanSoundex {
    encodeText(value) {
        let result = [];

        if (value.length == 0) {
            return result;
        }

        // Peek first letter of the word
        let firstLetter = value[0];

        for (let i = 0; i < value.length; i++) {
            let code = this.getLetterCode(value[i]);

            if (code >= 0) {
                if (i == 0) {
                    result.push(code);
                } else {
                    let previousLetter = value[i - 1];
                    if (result[result.length - 1] != code) {
                        result.push(code);
                    } else if (previousLetter == 'a' || previousLetter == 'e' || previousLetter == 'i' || previousLetter == 'o' || previousLetter == 'u' || previousLetter == 'y') {
                        result.push(code);
                    }
                }
            }
        }

        result.unshift(firstLetter);

        // If the code is less then 4 characters push additional zeros
        if (result.length < 4) {
            while (result.length < 4) {
                result.push('0');
            }
            // If result is more then we need, slice the array to form 4 symbols code
        } else if (result.length > 4) {
            result = result.slice(0, 4);
        }

        return result.join('');
    }

    // get encoding of letters
    getLetterCode(letter) {
        switch (letter) {
            case 'b':
            case 'f':
            case 'p':
            case 'v':
                return 1;
            case 'c':
            case 'g':
            case 'j':
            case 'k':
            case 'q':
            case 's':
            case 'x':
            case 'z':
                return 2;
            case 'd':
            case 't':
                return 3;
            case 'l':
                return 4;
            case 'm':
            case 'n':
                return 5;
            case 'r':
                return 6;
            default:
                return -1;
        }
    }
}