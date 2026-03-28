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

document.getElementById('run').addEventListener('click', () => {
    fileContents[currentFile] = editor.value;
    consoleWindow.innerHTML = '<span style="color: #7ee787;">$ go run main.go</span><br>';
    
    setTimeout(() => {
        const log = document.createElement('div');
        log.innerHTML = `Hello, Go World!<br>Welcome to the Go Console, Gopher!<br>Result of 15 + 27 = 42<br><br><span style="color: #8b949e;">[Done] exited with code=0</span>`;
        consoleWindow.appendChild(log);
        consoleWindow.scrollTop = consoleWindow.scrollHeight;
    }, 550);
});

setupTabs('files');
setupTabs('outconsole');