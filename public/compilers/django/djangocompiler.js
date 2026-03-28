const fileContents = {
    'views.py': 'from django.http import HttpResponse\n\ndef index(request):\n    return HttpResponse("<h1>Hello from Django</h1>")',
    'urls.py': 'from django.urls import path\nfrom . import views\n\nurlpatterns = [\n    path("", views.index),\n]',
    'settings.py': 'DEBUG = True\nINSTALLED_APPS = ["myapp"]',
    'models.py': 'from django.db import models\n\nclass Item(models.Model):\n    name = models.CharField(max_length=100)'
};

let currentFile = 'views.py';
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const lineNumbers = document.getElementById('line-numbers');
const outputContainer = document.querySelector('.output');

const consoleWindow = document.createElement('div');
consoleWindow.id = 'console-window';
consoleWindow.style.cssText = 'display:none; width:100%; height:100%; background:#092e20; color:#ffffff; padding:15px; box-sizing:border-box; font-family:monospace; overflow-y:auto;';
outputContainer.appendChild(consoleWindow);

const updateLineNumbers = () => {
    const lines = editor.value.split('\n').length;
    lineNumbers.innerHTML = Array.from({length: lines}, (_, i) => i + 1).join('<br>');
};

editor.addEventListener('input', updateLineNumbers);
editor.value = fileContents[currentFile];
updateLineNumbers();

const setupTabs = (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const tabs = container.querySelectorAll('.topper:not(#run)');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.textContent.trim();
            if (containerId === 'files') {
                fileContents[currentFile] = editor.value;
                currentFile = tabName;
                editor.value = fileContents[currentFile] || "";
                updateLineNumbers();
            } else if (containerId === 'outconsole') {
                if (tabName === 'Console') {
                    preview.style.display = 'none';
                    consoleWindow.style.display = 'block';
                } else {
                    preview.style.display = 'block';
                    consoleWindow.style.display = 'none';
                }
            }
            tabs.forEach(t => t.classList.remove('firstfile'));
            tab.classList.add('firstfile');
        });
    });
};

document.getElementById('run').addEventListener('click', () => {
    fileContents[currentFile] = editor.value;
    
    const viewsContent = fileContents['views.py'];
    let userText = "Hello from Django";
    
    if (viewsContent.includes('HttpResponse("')) {
        userText = viewsContent.split('HttpResponse("')[1].split('")')[0];
    } else if (viewsContent.includes("HttpResponse('")) {
        userText = viewsContent.split("HttpResponse('")[1].split("')")[0];
    }

    const mockOutput = `
        <html>
        <body style="font-family:sans-serif; padding:20px; background:#f4f4f4;">
            <div style="background:white; padding:20px; border-radius:5px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
                <h2 style="color:#092e20; margin-top:0;">Django Mock Server</h2>
                <div style="padding:10px; border:1px solid #ddd; background:#fff;">
                    ${userText}
                </div>
                <p style="font-size:12px; color:#666; margin-top:15px;">Route: /index/</p>
            </div>
        </body>
        </html>
    `;
    
    preview.srcdoc = mockOutput;
    
    const now = new Date().toLocaleTimeString();
    consoleWindow.innerHTML += `<span style="color:#44b78b;">[${now}] GET / 200 OK</span><br>`;
    consoleWindow.scrollTop = consoleWindow.scrollHeight;
});

setupTabs('files');
setupTabs('outconsole');