const fileContents = {
    'Program.cs': `using System;\n\nclass Program {\n    static void Main(string[] args) {\n        Console.WriteLine("Hello from C#!");\n        int result = Add(10, 25);\n        Console.WriteLine($"Result: {result}");\n    }\n\n    static int Add(int x, int y) => x + y;\n}`
};

let currentFile = 'Program.cs';
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const lineNumbers = document.getElementById('line-numbers');

const consoleWindow = document.createElement('div');
consoleWindow.id = 'console-window';
consoleWindow.style.display = 'block'; 
consoleWindow.style.width = '100%';
consoleWindow.style.height = '100%';
consoleWindow.style.background = '#1e1e1e';
consoleWindow.style.color = '#d4d4d4';
consoleWindow.style.overflowY = 'auto';
consoleWindow.style.padding = '15px';
consoleWindow.style.boxSizing = 'border-box';
consoleWindow.style.fontFamily = 'Consolas, monospace';
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
    let selectedTab = container.querySelector('.firstfile');

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

            selectedTab = tab;
            tabs.forEach(t => t.classList.remove('firstfile'));
            tab.classList.add('firstfile');
        });

        if (containerId === 'outconsole' && tab.textContent.trim() === 'Console') {
            tab.click();
        }
    });
};

function simulateCSharp(code) {
    let output = '';
    const vars = {};

    const lines = code.split('\n');

    lines.forEach(line => {
        line = line.trim();

        if (line.startsWith('int ')) {
            const match = line.match(/int (\w+) = (\w+)\((\d+),\s*(\d+)\)/);
            if (match) {
                const name = match[1];
                const a = Number(match[3]);
                const b = Number(match[4]);
                vars[name] = a + b;
            }
        }

        if (line.includes('Console.WriteLine')) {
            const content = line.match(/Console\.WriteLine\((.*)\)/)[1].trim();

            if (/^".*"$/.test(content)) {
                output += content.slice(1, -1) + '<br>';
            } else if (content.startsWith('$"')) {
                let text = content.slice(2, -1);
                text = text.replace(/{(\w+)}/g, (_, v) => vars[v] ?? '');
                output += text + '<br>';
            }
        }
    });

    return output;
}

document.getElementById('run').addEventListener('click', () => {
    fileContents[currentFile] = editor.value;
    consoleWindow.innerHTML = '<span style="color: #569cd6;">dotnet build...</span><br><span style="color: #569cd6;">dotnet run</span><br><br>';
    
    setTimeout(() => {
        const log = document.createElement('div');
        log.innerHTML = simulateCSharp(editor.value) + '<br><span style="color: #6a9955;">Build succeeded. 0 Warning(s). 0 Error(s).</span>';
        consoleWindow.appendChild(log);
        consoleWindow.scrollTop = consoleWindow.scrollHeight;
    }, 400);
});

setupTabs('files');
setupTabs('outconsole');