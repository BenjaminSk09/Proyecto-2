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
}

// Iniciar simulación
function startSimulation() {
    // Inicializar variables
    readyQueue = [];
    history = [];
    currentProcess = null;
    currentTime = 0;

    // Clonar procesos y ordenarlos por llegada
    let procesosPendientes = procesos.map(p => ({ ...p, remaining: p.cpu, start: null, finish: null }));
    procesosPendientes.sort((a, b) => a.arrival - b.arrival);

    // Para fragmentos
    let fragment = null;

    simulationInterval = setInterval(() => {
        // Agregar procesos que llegan en este instante
        procesosPendientes
            .filter(p => p.arrival === currentTime)
            .forEach(p => readyQueue.push(p));
        procesosPendientes = procesosPendientes.filter(p => p.arrival > currentTime);

        // Seleccionar proceso según algoritmo
        if (!currentProcess) {
            if (readyQueue.length > 0) {
                switch (selectedAlgorithm) {
                    case "FCFS":
                        currentProcess = readyQueue.shift();
                        break;
                    case "SJF": // no-preemptivo
                        readyQueue.sort((a, b) => a.remaining - b.remaining);
                        currentProcess = readyQueue.shift();
                        break;
                    case "SRTF":
                        readyQueue.sort((a, b) => a.remaining - b.remaining);
                        currentProcess = readyQueue.shift();
                        if (currentProcess.start === null) currentProcess.start = currentTime;
                        fragment = { pid: currentProcess.pid, name: currentProcess.name, start: currentTime, finish: null };
                        break;
                    case "RR":
                        currentProcess = readyQueue.shift();
                        currentProcess.quantumCounter = 0;
                        // Abrir fragmento RR
                        fragment = { pid: currentProcess.pid, name: currentProcess.name, start: currentTime, finish: null };
                        break;
                }
            }
        } else if (selectedAlgorithm === "SRTF") {
            // Preempción para SRTF
            if (readyQueue.length > 0) {
                readyQueue.sort((a, b) => a.remaining - b.remaining);
                if (readyQueue[0].remaining < currentProcess.remaining) {
                    fragment.finish = currentTime;
                    history.push({ ...fragment });
                    readyQueue.push(currentProcess);
                    currentProcess = readyQueue.shift();
                    fragment = { pid: currentProcess.pid, name: currentProcess.name, start: currentTime, finish: null };
                }
            }
        }

        // Ejecutar proceso actual
        if (currentProcess) {
            currentProcess.remaining--;
            if (selectedAlgorithm === "RR") {
                currentProcess.quantumCounter++;
            }

            // Si termina el proceso
            if (currentProcess.remaining === 0) {
                if (selectedAlgorithm === "SRTF" || selectedAlgorithm === "RR") {
                    fragment.finish = currentTime + 1;
                    history.push({ ...fragment });
                    fragment = null;
                } else {
                    currentProcess.finish = currentTime + 1;
                    history.push(currentProcess);
                }
                currentProcess = null;
            } else if (selectedAlgorithm === "RR" && currentProcess.quantumCounter >= quantum) {
                // Termina quantum en RR
                fragment.finish = currentTime; // termina fragmento actual
                history.push({ ...fragment });
                currentProcess.quantumCounter = 0;
                readyQueue.push(currentProcess);
                currentProcess = null;
            }
        }

        renderReadyQueue();
        renderRunningProcess();
        renderHistory();

        // Verificar fin de simulación
        if (
            procesosPendientes.length === 0 &&
            readyQueue.length === 0 &&
            !currentProcess
        ) {
            clearInterval(simulationInterval);
            alert("Simulación finalizada.");
        }

        currentTime++;
    }, TIME_UNIT_MS);

    renderReadyQueue();
    renderRunningProcess();
    renderHistory();
}
