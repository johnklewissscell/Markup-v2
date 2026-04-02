const fileContents = {
    'main.go': `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, Go World!")\n    \n    const name = "Gopher"\n    fmt.Printf("Welcome to the Go Console, %s!\\n", name)\n\n    sum := 15 + 27\n    fmt.Println("Result of 15 + 27 =", sum)\n}`
};

let currentFile = 'main.go';
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const lineNumbers = document.getElementById('line-numbers');

const consoleWindow = document.createElement('div');
consoleWindow.id = 'console-window';
consoleWindow.style.display = 'block'; 
consoleWindow.style.width = '100%';
consoleWindow.style.height = '100%';
consoleWindow.style.background = '#1e1e1e';
consoleWindow.style.color = '#dcdcdc';
consoleWindow.style.overflowY = 'auto';
consoleWindow.style.padding = '15px';
consoleWindow.style.boxSizing = 'border-box';
consoleWindow.style.fontFamily = '"JetBrains Mono", monospace';
consoleWindow.style.fontSize = '13px';
document.querySelector('.output').appendChild(consoleWindow);

if (preview) {
    preview.style.display = 'none';
}

const updateLineNumbers = () => {
    const lines = editor.value.split('\n').length;
    let numberString = '';
    for (let i = 1; i <= lines; i++) {
        numberString += i + '<br>';
    }
    lineNumbers.innerHTML = numberString;
};

editor.addEventListener('input', updateLineNumbers);
editor.value = fileContents[currentFile];
updateLineNumbers();

const setupTabs = (containerId) => {
    const container = document.getElementById(containerId);
    const tabs = container.querySelectorAll('.topper:not(#run)');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.textContent.trim();

            if (containerId === 'files') {
                fileContents[currentFile] = editor.value;
                currentFile = tabName;
                editor.value = fileContents[currentFile];
                updateLineNumbers();
            }

            if (containerId === 'outconsole') {
                preview.style.display = 'none';
                consoleWindow.style.display = 'block';
            }

            tabs.forEach(t => t.classList.remove('firstfile'));
            tab.classList.add('firstfile');
        });

        if (containerId === 'outconsole' && tab.textContent.trim() === 'Console') {
            tab.click();
        }
    });
};

function simulateGo(code) {
    let output = '';
    const vars = {};

    const lines = code.split('\n');

    lines.forEach(line => {
        line = line.trim();

        if (line.startsWith('const ')) {
            const match = line.match(/const (\w+) = "(.*)"/);
            if (match) vars[match[1]] = match[2];
        }

        if (line.includes(':=')) {
            const match = line.match(/(\w+)\s*:=\s*(\d+)\s*\+\s*(\d+)/);
            if (match) {
                vars[match[1]] = Number(match[2]) + Number(match[3]);
            }
        }

        if (line.startsWith('fmt.Println')) {
            const inside = line.match(/fmt\.Println\((.*)\)/)[1];
            const parts = inside.split(',').map(p => p.trim());

            let text = '';
            parts.forEach(p => {
                if (/^".*"$/.test(p)) {
                    text += p.slice(1, -1);
                } else if (vars[p] !== undefined) {
                    text += vars[p];
                }
                text += ' ';
            });

            output += text.trim() + '<br>';
        }

        if (line.startsWith('fmt.Printf')) {
            const match = line.match(/fmt\.Printf\("(.*)",\s*(\w+)\)/);
            if (match) {
                let text = match[1];
                const val = vars[match[2]] || '';
                text = text.replace('%s', val).replace(/\\n/g, '<br>');
                output += text;
            }
        }
    });

    return output;
}

document.getElementById('run').addEventListener('click', () => {
    fileContents[currentFile] = editor.value;
    consoleWindow.innerHTML = '<span style="color: #7ee787;">$ go run main.go</span><br>';
    
    setTimeout(() => {
        const log = document.createElement('div');
        log.innerHTML = simulateGo(editor.value) + '<br><span style="color: #8b949e;">[Done] exited with code=0</span>';
        consoleWindow.appendChild(log);
        consoleWindow.scrollTop = consoleWindow.scrollHeight;
    }, 300);
});

setupTabs('files');
setupTabs('outconsole');