const fileContents = {
    'index.xml': `<?xml version="1.0" encoding="utf-8"?>\n<LinearLayout>\n    <TextView \n        text="Hello Kotlin!" \n        color="#7F52FF" />\n    <Button \n        id="btnClick" \n        text="Click Me" />\n</LinearLayout>`,
    'Main.kt': `fun main() {\n    val message: String = "Kotlin Compiler Active"\n    println(message)\n    \n    val button = findViewById(R.id.btnClick)\n    button.setOnClickListener {\n        println("Button clicked in Kotlin!")\n    }\n}`
};

let currentFile = 'index.xml';
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const lineNumbers = document.getElementById('line-numbers');

const consoleWindow = document.createElement('div');
consoleWindow.id = 'console-window';
consoleWindow.style.display = 'none';
consoleWindow.style.width = '100%';
consoleWindow.style.height = '100%';
consoleWindow.style.background = '#1e1e1e';
consoleWindow.style.color = '#dcdcdc';
consoleWindow.style.overflowY = 'auto';
consoleWindow.style.padding = '10px';
consoleWindow.style.boxSizing = 'border-box';
consoleWindow.style.fontFamily = 'monospace';
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
        tab.addEventListener('mouseenter', () => tab.classList.add('firstfile'));
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
            }

            if (containerId === 'outconsole') {
                if (tabName === 'Console') {
                    preview.style.display = 'none';
                    consoleWindow.style.display = 'block';
                } else {
                    preview.style.display = 'block';
                    consoleWindow.style.display = 'none';
                }
            }

            selectedTab = tab;
            tabs.forEach(t => t.classList.remove('firstfile'));
            tab.classList.add('firstfile');
        });
    });
};

document.getElementById('run').addEventListener('click', () => {
    fileContents[currentFile] = editor.value;
    consoleWindow.innerHTML = '<div style="color: #7F52FF;">[Compiling Kotlin...]</div>';
    
    const xmlContent = fileContents['index.xml'];
    const simulatedHtml = xmlContent
        .replace(/<LinearLayout>/g, '<div style="display:flex; flex-direction:column; align-items:center; padding:20px; font-family:sans-serif;">')
        .replace(/<\/LinearLayout>/g, '</div>')
        .replace(/<TextView/g, '<h2')
        .replace(/text="([^"]*)"/g, '>$1')
        .replace(/color="([^"]*)"/g, 'style="color:$1"')
        .replace(/\/>/g, '</h2>')
        .replace(/<Button/g, '<button style="padding:10px 20px; cursor:pointer; background:#7F52FF; color:white; border:none; border-radius:4px;"')
        .replace(/<\/Button>/g, '</button>');

    const project = preview.contentWindow.document;
    project.open();
    project.write(simulatedHtml);
    project.close();

    setTimeout(() => {
        const log = document.createElement('div');
        log.innerHTML = `> Hello Kotlin!<br>> Kotlin Compiler Active<br><span style="color: green;">✔ Build Successful</span>`;
        consoleWindow.appendChild(log);
    }, 600);
});

setupTabs('files');
setupTabs('outconsole');