const fileContents = {
    'main.swift': `import Foundation\n\nlet name = "Swift Developer"\nprint("Hello, \\(name)!")\n\nlet numbers = [1, 2, 3, 4, 5]\nlet squared = numbers.map { $0 * $0 }\n\nprint("Numbers: \\(numbers)")\nprint("Squared: \\(squared)")\n\nstruct Robot {\n    var model: String\n    func activate() {\n        print("Robot \\(model) is now online.")\n    }\n}\n\nlet bot = Robot(model: "RX-9")\nbot.activate()`
};

let currentFile = 'main.swift';
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
consoleWindow.style.fontFamily = '"SF Mono", "Menlo", monospace';
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
    consoleWindow.innerHTML = '<span style="color: #ff8b3d;">$ swift main.swift</span><br>';
    
    setTimeout(() => {
        const log = document.createElement('div');
        log.innerHTML = `Hello, Swift Developer!<br>Numbers: [1, 2, 3, 4, 5]<br>Squared: [1, 4, 9, 16, 25]<br>Robot RX-9 is now online.<br><br><span style="color: #00d9ff;">Program ended with exit code: 0</span>`;
        consoleWindow.appendChild(log);
        consoleWindow.scrollTop = consoleWindow.scrollHeight;
    }, 500);
});

setupTabs('files');
setupTabs('outconsole');