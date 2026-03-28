const fileContents = {
    'Main.scala': `object Main {\n  def main(args: Array[String]): Unit = {\n    println("Hello from Scala!")\n    \n    val numbers = List(1, 2, 3, 4, 5)\n    val doubled = numbers.map(_ * 2)\n    \n    println(s"Original: $numbers")\n    println(s"Doubled: $doubled")\n    \n    val sum = numbers.sum\n    println(s"The sum is: $sum")\n  }\n}`
};

let currentFile = 'Main.scala';
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
consoleWindow.style.fontFamily = '"Source Code Pro", monospace';
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
    consoleWindow.innerHTML = '<span style="color: #4eb0ff;">[info] compiling 1 Scala source...</span><br><span style="color: #4eb0ff;">[info] running Main</span><br><br>';
    
    setTimeout(() => {
        const log = document.createElement('div');
        log.innerHTML = `Hello from Scala!<br>Original: List(1, 2, 3, 4, 5)<br>Doubled: List(2, 4, 6, 8, 10)<br>The sum is: 15<br><br><span style="color: #a6e22e;">[success] Total time: 1 s</span>`;
        consoleWindow.appendChild(log);
        consoleWindow.scrollTop = consoleWindow.scrollHeight;
    }, 800);
});

setupTabs('files');
setupTabs('outconsole');