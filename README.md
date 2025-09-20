# Simulador de Planificación de Procesos

Este proyecto es un **simulador de planificación de procesos** desarrollado con **HTML, JavaScript y Tailwind CSS**. Permite simular la ejecución de procesos utilizando distintos algoritmos de planificación y visualizar en tiempo real:

- Cola de procesos listos
- Proceso en ejecución
- Historial de procesos finalizados

---

## Estructura del proyecto

## Algoritmos de planificación soportados

1. **FCFS (First-Come, First-Served)**  
   Planificación no preemptiva. Los procesos se ejecutan en orden de llegada.

2. **SJF (Shortest Job First)**  
   Planificación no preemptiva basada en el tiempo de CPU restante. Se selecciona el proceso más corto disponible.

3. **SRTF (Shortest Remaining Time First)**  
   Planificación preemptiva basada en el tiempo restante de CPU. Permite interrumpir procesos si llega uno más corto.

4. **RR (Round Robin)No funciona**  
   Planificación preemptiva basada en un quantum de tiempo. Cada proceso se ejecuta durante un quantum y vuelve a la cola si no ha terminado.

---

## Funcionalidades

- Agregar procesos mediante un formulario indicando:
  - Nombre del proceso
  - Tiempo de CPU (unidades)
  - Instante de llegada
  - Quantum (solo aplica para Round Robin)
- Seleccionar el algoritmo de planificación
- Iniciar la simulación
- Visualizar:
  - Cola de procesos listos
  - Proceso en ejecución
  - Historial de procesos finalizados
- Simulación automática hasta que todos los procesos finalicen

---

## Cómo usar

1. Abrir `index.html` en un navegador.
2. Agregar procesos usando el formulario.
3. Seleccionar el algoritmo de planificación.
4. Hacer clic en **Iniciar Simulación**.
5. Observar la ejecución de los procesos en tiempo real.

---

## Tecnologías usadas

- **HTML5**
- **JavaScript**
- **Tailwind CSS** (vía CDN)

---

**FCFS (First-Come, First-Served)** 

- En proceso
![image alt]([https://github.com/BenjaminSk09/Proyecto-1-Sistemas-operativos/blob/c29457c683a48a7f2e00f8df2f9e7efd15dea43c/Capturas%20de%20Funcionamiento/Memoria%20Ram%20normal.png](https://github.com/BenjaminSk09/Proyecto-2/blob/969608c192dadeb45cb7cb4058c1c78d2d6ec03d/Capturas%20de%20Funcionamiento/SRTF1.jpeg)) 

- Finalizado
![image alt]([https://github.com/BenjaminSk09/Proyecto-2/blob/969608c192dadeb45cb7cb4058c1c78d2d6ec03d/Capturas%20de%20Funcionamiento/SRTF2.jpeg)) 

- Ejercicio Utilizado

![image alt]([https://github.com/BenjaminSk09/Proyecto-2/blob/969608c192dadeb45cb7cb4058c1c78d2d6ec03d/Capturas%20de%20Funcionamiento/SRTFEJEMPLO.jpeg)) 

---

Integrantes del grupo:     

-Esdras Alexander Choc Ajú         Carné: 1990-23-12485  
-Henry Daniel Cabrera Estrada      Carné: 1990-23-3718  
-Benjamin Bonifacio Sincal Ajú     Carné: 1990-23-11281  
-Emerson Estudardo Guzmán Vielman  Carné: 1990-23-3484  
