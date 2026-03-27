const fileContents = {
    'Main.java': `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java World!");\n        System.out.println("Input received: " + (args.length > 0 ? args[0] : "None"));\n    }\n}`,
    'Utils.java': `public class Utils {\n    public static void log(String msg) {\n        System.out.println("[LOG]: " + msg);\n    }\n}`
};

let currentFile = 'Main.java';
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const lineNumbers = document.getElementById('line-numbers');

const consoleWindow = document.createElement('div');
consoleWindow.id = 'console-window';
consoleWindow.style.display = 'block';
consoleWindow.style.width = '100%';
consoleWindow.style.height = '100%';
consoleWindow.style.background = '#1e1e1e';
consoleWindow.style.overflowY = 'auto';
consoleWindow.style.padding = '10px';
consoleWindow.style.boxSizing = 'border-box';
document.querySelector('.output').appendChild(consoleWindow);

const updateLineNumbers = () => {
    const lines = editor.value.split('\n').length;
    let numberString = '';
    for (let i = 1; i <= lines; i++) {
        numberString += i + '<br>';
    }
    lineNumbers.innerHTML = numberString;
};

editor.addEventListener('input', updateLineNumbers);
editor.addEventListener('scroll', () => {
    lineNumbers.scrollTop = editor.scrollTop;
});

editor.value = fileContents[currentFile];
updateLineNumbers();

const setupTabs = (containerId) => {
    const container = document.getElementById(containerId);
    const tabs = container.querySelectorAll('.topper:not(#run)');
    let selectedTab = container.querySelector('.firstfile');

    tabs.forEach(tab => {
        tab.addEventListener('mouseenter', () => {
            tab.classList.add('firstfile');
        });

        tab.addEventListener('mouseleave', () => {
            tabs.forEach(t => t.classList.remove('firstfile'));
            if (selectedTab) selectedTab.classList.add('firstfile');
        });

        tab.addEventListener('click', () => {
            const tabName = tab.textContent.trim();

            if (containerId === 'files') {
                fileContents[currentFile] = editor.value;
                currentFile = tabName;
                editor.value = fileContents[currentFile];
                updateLineNumbers();
                editor.scrollTop = 0;
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

document.getElementById('run').addEventListener('click', () => {
    fileContents[currentFile] = editor.value;
    consoleWindow.innerHTML = '';
    
    const logEntry = document.createElement('div');
    logEntry.style.fontFamily = 'monospace';
    logEntry.style.fontSize = '12px';
    logEntry.style.padding = '5px 10px';
    
    logEntry.innerHTML = `<span style="color: blue;">[Compiling Main.java...]</span><br>` +
                         `> Hello, Java World!<br>` +
                         `> Input received: None<br><br>` +
                         `<span style="color: green;">Program exited with code 0</span>`;
    
    consoleWindow.appendChild(logEntry);
});

setupTabs('files');
setupTabs('outconsole');