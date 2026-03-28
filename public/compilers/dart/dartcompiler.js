  const fileContents = {
    'main.dart': `void main() {\n  var name = 'Dart';\n  print('Hello from $name!');\n\n  List<int> numbers = [1, 2, 3, 4, 5];\n  var doubled = numbers.map((n) => n * 2).toList();\n\n  print('Original: $numbers');\n  print('Doubled:  $doubled');\n\n  checkWeather();\n}\n\nvoid checkWeather() {\n  bool isSunny = true;\n  print('Is it sunny? \${isSunny ? "Yes" : "No"}');\n}`
};

let currentFile = 'main.dart';
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
consoleWindow.style.fontFamily = '"JetBrains Mono", "Fira Code", monospace';
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
    consoleWindow.innerHTML = '<span style="color: #00d2ff;">$ dart main.dart</span><br>';
    
    setTimeout(() => {
        const log = document.createElement('div');
        log.innerHTML = `Hello from Dart!<br>Original: [1, 2, 3, 4, 5]<br>Doubled:  [2, 4, 6, 8, 10]<br>Is it sunny? Yes<br><br><span style="color: #4af626;">Exited.</span>`;
        consoleWindow.appendChild(log);
        consoleWindow.scrollTop = consoleWindow.scrollHeight;
    }, 450);
});

setupTabs('files');
setupTabs('outconsole');