// =======================
// Simulador de procesos
// =======================

// Variables globales
let procesos = [];
let readyQueue = [];
let history = [];
let currentProcess = null;
let pidCounter = 1;
let simulationInterval = null;
let currentTime = 0;
let quantum = 1;
let selectedAlgorithm = "FCFS";
const TIME_UNIT_MS = 1000; // 1 segundo por unidad de tiempo para pruebas

// Elementos del DOM
const form = document.getElementById('process-form');
const readyQueueDiv = document.getElementById('ready-queue');
const runningProcessDiv = document.getElementById('running-process');
const historyDiv = document.getElementById('history');
const algorithmSelect = document.getElementById('algorithm');
const startBtn = document.getElementById('start-simulation');

// Manejo de formulario para agregar procesos
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('process-name').value.trim();
    const cpu = parseInt(document.getElementById('process-cpu').value);
    const arrival = parseInt(document.getElementById('process-arrival').value);
    const quantumInput = parseInt(document.getElementById('process-quantum').value) || 1;

    procesos.push({
        pid: pidCounter++,
        name,
        cpu,
        remaining: cpu,
        arrival,
        quantum: quantumInput,
        start: null,
        finish: null
    });

    form.reset();
    renderReadyQueue();
});

// Selección de algoritmo
algorithmSelect.addEventListener('change', (e) => {
    selectedAlgorithm = e.target.value;
});

// Botón para iniciar simulación
startBtn.addEventListener('click', () => {
    if (procesos.length === 0) {
        alert("Agrega al menos un proceso antes de iniciar la simulación.");
        return;
    }
    quantum = parseInt(document.getElementById('process-quantum').value) || 1;
    startSimulation();
});

// Renderizar la cola de listos
function renderReadyQueue() {
    readyQueueDiv.innerHTML = '';
    if (readyQueue.length === 0) {
        readyQueueDiv.innerHTML = '<p class="text-gray-500">No hay procesos en la cola.</p>';
        return;
    }
    readyQueue.forEach(p => {
        readyQueueDiv.innerHTML += `<div class="p-2 bg-yellow-100 rounded flex justify-between">
            <span><b>${p.name}</b> (PID: ${p.pid})</span>
            <span>CPU: ${p.remaining} | Llegada: ${p.arrival}</span>
        </div>`;
    });
}

// Renderizar proceso en ejecución
function renderRunningProcess() {
    runningProcessDiv.innerHTML = '';
    if (!currentProcess) {
        runningProcessDiv.innerHTML = '<p class="text-gray-500">Ningún proceso en ejecución.</p>';
        return;
    }
    runningProcessDiv.innerHTML = `<div class="p-2 bg-blue-100 rounded">
        <b>${currentProcess.name}</b> (PID: ${currentProcess.pid})<br>
        Restante: ${currentProcess.remaining} | Llegada: ${currentProcess.arrival}
    </div>`;
}

// Renderizar historial
function renderHistory() {
    historyDiv.innerHTML = '';
    if (history.length === 0) {
        historyDiv.innerHTML = '<p class="text-gray-500">No hay procesos finalizados.</p>';
        return;
    }
    history.forEach(p => {
        historyDiv.innerHTML += `<div class="p-2 bg-green-100 rounded">
            <b>${p.name}</b> (PID: ${p.pid}) | Inicio: ${p.start} | Fin: ${p.finish}
        </div>`;
    });
