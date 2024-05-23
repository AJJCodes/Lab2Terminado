cargarPrograma1();

function cargarPrograma1() {
    fetch('../Programa3.html')
        .then(response => response.text())
        .then(html => {
            // document.getElementById('section_2').innerHTML = html;
            // Agregar un listener de eventos para ejecutar la función mostrarInput cuando cambie la opción seleccionada
            document.getElementById("opcionesCPU").addEventListener("change", mostrarInput);
            // Agregar un listener de eventos para ejecutar la función agregarFilas cuando cambie la cantidad de instrucciones
            document.getElementById("cantidadN").addEventListener("change", agregarFilas);
            // Valores predeterminados de la tabla
            agregarFilas();    
            
            const btngc = document.getElementById('guardarConfiguraciones');

            btngc.addEventListener('click', () => {
                // Recoger los valores de los inputs
                const etapasK = Number(document.getElementById('etapasK').value); // Número de etapas K
                const opcionesCPU = Number(document.getElementById('opcionesCPU').value); // Opción seleccionada
                const cantidadN = Number(document.getElementById('cantidadN').value); // Cantidad de instrucciones
                const arregloInstrucciones = [];
                
                const tabla = document.getElementById('tablaContainer');
                const filas = tabla.getElementsByTagName('tr');
                
                let valorTau, tiempoEtapas, tiempoLatch = 0;
                switch (opcionesCPU) {
                    case 1:
                        valorTau = Number(document.getElementById('valorTau').value);
                        break;
                    case 2:
                        tiempoEtapas = Number(document.getElementById('tiempoEtapas').value);
                        break;
                    case 3:
                        tiempoEtapas = Number(document.getElementById('tiempoEtapas').value);
                        tiempoLatch = Number(document.getElementById('tiempoLatch').value);
                        break;
                }

                // Mostrar valores de la tabla                
                for (let i = 0; i < filas.length; i++) {
                    const celdas = filas[i].getElementsByTagName('td');
                    const instruccion = celdas[0].textContent;
                    arregloInstrucciones.push(instruccion);                    
                }                                           

                calcularAnchoPeriodo(opcionesCPU, tiempoEtapas, tiempoLatch, valorTau,etapasK,arregloInstrucciones, opcionesCPU);                            
            });            
        });     
}


// Mostrar input según opción seleccionada
function mostrarInput() {
    var select = document.getElementById("opcionesCPU");
    var opcionSeleccionada = select.value;
    var inputContainer = document.getElementById("inputContainer");
    inputContainer.innerHTML = ""; // Limpiar el contenedor antes de agregar un nuevo input

    switch (opcionSeleccionada) {
        case "1":
            inputContainer.innerHTML = `
                <label for="valorTau" class="white-text">Valor de &#964;:</label>
                <input type="text" class="form-control mt-2 white-text" id="valorTau" name="valorTau">
            `;
            break;
        case "2":
            inputContainer.innerHTML = `
                <label for="tiemposPropagacion" class="white-text">Tiempos de propagación de cada etapa (&#964;<i>i</i>):</label>
                <input type="text" class="form-control mt-2 white-text" id="tiempoEtapa" name="tiemposPropagacion">
            `;
            break;
        case "3":
            inputContainer.innerHTML = `
                <label for="tiemposPropagacion" class="white-text">Tiempos de propagación de cada etapa (&#964;<i>i</i>):</label>
                <input type="text" class="form-control mt-2 white-text" id="tiempoEtapas" name="tiemposPropagacion"><br>
                <label for="tiempoLatch" class="white-text">Tiempo de propagación de los latches (&#964;<i>r</i>):</label>
                <input type="text" class="form-control mt-2 white-text" id="tiempoLatch" name="tiempoLatch">
            `;
            break;
        default:
            inputContainer.innerHTML = `
                <label for="valorTau" class="white-text">Valor de &#964;:</label>
                <input type="text" class="form-control mt-2 white-text" id="valorTau" name="valorTau">
            `;
    }
}


function agregarFilas() {
    let cantidad = document.getElementById("cantidadN").value;
    var tablaContainer = document.getElementById("tablaContainer");

    // Limpiar el contenido anterior
    tablaContainer.innerHTML = "";

    // Agregar filas
    for (var i = 0; i < cantidad; i++) {
        var fila = document.createElement("tr");
        fila.innerHTML = '<th scope="row">' + (i + 1) + '</th>' +
                         '<td contenteditable="true" id="instruccion' + (i + 1) + '">' + obtenerValorPredeterminado(i + 1) + '</td>';
        tablaContainer.appendChild(fila);
    }
}

function obtenerValorPredeterminado(numeroInstruccion) {
    switch (numeroInstruccion) {
        case 1:
            return '1';
        case 2:
            return '5';
        case 3:
            return '1E+7';
        default:
            return '';
    }
}

// Primer cálculo [Cálculos del ancho del periodo] segmentado y lineal
function calcularAnchoPeriodo(opcionCPU, Ti, Tr, T, k, arregloInstrucciones, opcCPU) {
    let anchoPeriodoSeg = 0;
    let anchoPeriodoSec = 0;
    switch (opcionCPU) {
        case 1:
            // Ancho del periodo segmentado = T
            anchoPeriodoSeg = T;
            console.log('Ancho del periodo segmentado:', anchoPeriodoSeg);
        break;
        case 2:
            // Ancho del periodo segmentado = Ti + Tr
            anchoPeriodoSec = Ti * k;
            console.log('Ancho del periodo secuencial:', anchoPeriodoSec);
        break;
        case 3:
            // Ancho del periodo secuencial = Ti * k                            
            anchoPeriodoSeg = Ti + Tr;
            console.log('Ancho del periodo segmentado:', anchoPeriodoSeg);
            anchoPeriodoSec = Ti * k;
            console.log('Ancho del periodo secuencial:', anchoPeriodoSec);
        break;
    }                                
    tablas(arregloInstrucciones, anchoPeriodoSeg, k, anchoPeriodoSec, opcCPU, Ti, Tr);                                                  
} 


// Función para mostrar los resultados
function tablas(cantidadN, t, k, anchoPSec, opcCPU, Ti, Tr) {   
    aPSeg = parseFloat(t); 
    aPSec = parseFloat(anchoPSec);
    const calculoAnchoPeriodo = document.getElementById('imprimirAnchoPeriodo'); // Primer cálculo [Cálculos del ancho del periodo] segmentado y lineal
    const calculoFrecuencia = document.getElementById('imprimirFrecuencia'); // Segundo cálculo [Cálculos de la frecuencia de reloj] segmentado y lineal
    const tablaTiempo = document.getElementById('imprimirTiempoE');// Tercer cálculo [Cálculos del tiempo de ejecución] segmentado y lineal
    const tablaEficiencia = document.getElementById('imprimirEficiencia'); // Cuarto cálculo [Cálculos de la eficiencia] segmentado y lineal
    const tablaProductividad = document.getElementById('imprimirProductividad'); // Quinto cálculo [Cálculos de la productividad] segmentado y lineal
    const calculoProductividadMaxima = document.getElementById('imprimirProductividadMaxima'); // Sexto cálculo [Productividad Máxima]
    const calculoGanancia = document.getElementById('imprimirGanancia'); // Septimo cálculo [Ganancia] ganancia de rendimiento de un procesador segmentado sobre uno secuencial se define
    const grafico = document.getElementById('ImprimirGrafico'); // Septimo cálculo [Ganancia] ganancia de rendimiento de un procesador segmentado sobre uno secuencial se define

    calculoAnchoPeriodo.innerHTML = `
        <h5 class="mb-4 text-center">Ancho de Perido</h5>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Segmentado</th>
                    <th scope="col">Secuencial</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${aPSeg.toFixed(2)} ns</td>                
                    <td>${aPSec.toFixed(2)} ns</td>
                </tr>                                
            </tbody>
        </table>
    `;

    calculoFrecuencia.innerHTML = `
        <h5 class="mb-4 text-center">Frecuencia</h5>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Segmentado</th>
                    <th scope="col">Secuencial</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${calcularFrecuencia(opcCPU,aPSeg,aPSec).frecuenciaSegmentada} MHz</td>                
                    <td>${calcularFrecuencia(opcCPU,aPSeg,aPSec).frecuenciaSecuencial} MHz</td>
                </tr>                                
            </tbody>
        </table>   
    `;


    tablaTiempo.innerHTML = `
    <h5 class="mb-4 text-center">Tiempo de ejecución</h5>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Instrucción</th>
                    <th scope="col">Tiempo ejecución segmentado</th>
                    <th scope="col">Tiempo ejecución secuencial</th>
                </tr>
            </thead>
            <tbody id="cuerpoTabla"></tbody>
        </table>
    `;

    tablaEficiencia.innerHTML = `
    <h5 class="mb-4 text-center">Eficiencia</h5>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Instrucción</th>
                    <th scope="col">Eficiencia</th>
                </tr>
            </thead>
            <tbody id="cuerpoTablaEficiencia"></tbody>
        </table>
    `;

    tablaProductividad.innerHTML = `
        <h5 class="mb-4 text-center">Productividad</h5>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Instrucción</th>
                    <th scope="col">Productividad</th>
                </tr>
            </thead>
            <tbody id="cuerpoTablaProductividad"></tbody>
        </table>
    `;

    calculoProductividadMaxima.innerHTML = `
        <h5 class="mb-4 text-center">Productividad Máxima</h5>
        <table class="table">
            <tbody>
                <tr>
                    <td>${Math.round(calcularProductividadMaxima(t))} MIPS</td>                                
                </tr>                                
            </tbody>
        </table>
    `;

    calculoGanancia.innerHTML = `
        <h5 class="mb-4 text-center">Ganancia de rendimiento</h5>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Instrucción</th>
                    <th scope="col">Ganancia</th>
                </tr>
            </thead>
            <tbody id="cuerpoTablaGanancia"></tbody>
        </table>
    `;  

    // for (var i = 0; i < k; i++) {
    //     var copy = "<div style='height:20px; border:2px solid black;' class='m-5'>peinado</div>";
    //     grafico.innerHTML += copy;
    // }
  // Configuraciones de tamaño y posición
    const ctx = grafico.getContext('2d');
    grafico.width = 800;
    grafico.height = 100;

    const boxWidth = 50;
    const boxHeight = 50;
    const arrowWidth = 50;
    const spaceBetween = 10;

    let currentX = 10; // Inicio de dibujo

    // Dibujar el primer elemento (flecha)
    ctx.beginPath();
    ctx.moveTo(currentX, 50);
    ctx.lineTo(currentX + arrowWidth, 50);
    ctx.stroke();
    ctx.fillText(`${Tr}`, currentX + arrowWidth / 2 - 10, 40);
    currentX += arrowWidth + spaceBetween;

    for (let i = 0; i < k; i++) {
        // Dibuja cuadro
        ctx.strokeRect(currentX, 25, boxWidth, boxHeight);
        ctx.fillText(`${Ti}`, currentX + 10, 60);
        currentX += boxWidth + spaceBetween;

        // Dibuja flecha
        ctx.beginPath();
        ctx.moveTo(currentX, 50);
        ctx.lineTo(currentX + arrowWidth, 50);
        ctx.stroke();
        if (i < k - 1) {
        ctx.fillText(`${Tr}`, currentX + arrowWidth / 2 - 10, 40);
        } else {
        // Asegurarse de dibujar una última flecha apuntando a un siguiente no existente
        ctx.fillText(`${Tr}`, currentX + arrowWidth / 2 - 10, 40);
        }
        currentX += arrowWidth + spaceBetween;
    }
    

    

    const cuerpoTabla = document.getElementById('cuerpoTabla');
    const cuerpoTablaEficiencia = document.getElementById('cuerpoTablaEficiencia');
    const cuerpoTablaProductividad = document.getElementById('cuerpoTablaProductividad');
    const cuerpoTablaGanancia = document.getElementById('cuerpoTablaGanancia');

    for (let i = 0; i <= cantidadN.length-1; i++) {
        console.log('Instrucción', cantidadN[i]);
        const fila = document.createElement('tr');        
        fila.innerHTML = `
            <td>${cantidadN[i]}</td>            
            <td>${calcularTiempoSecuencial(cantidadN[i], t, k)} ns</td>
            <td>${calcularTiempoSegmentado(cantidadN[i], t, k)} ns</td>
        `;
        cuerpoTabla.appendChild(fila);
    }

    for (let i = 0; i <= cantidadN.length-1; i++) {
        console.log('Instrucción', cantidadN[i]);
        const fila = document.createElement('tr');        
        fila.innerHTML = `
            <td>${cantidadN[i]}</td>            
            <td>${calcularEficiencia(cantidadN[i], k)}%</td>            
        `;
        cuerpoTablaEficiencia.appendChild(fila);
    }

    for (let i = 0; i <= cantidadN.length-1; i++) {
        console.log('Instrucción', cantidadN[i]);
        const fila = document.createElement('tr');        
        fila.innerHTML = `
            <td>${cantidadN[i]}</td>            
            <td>${calcularProductividad(cantidadN[i], t, k)} MIPS</td>            
        `;
        cuerpoTablaProductividad.appendChild(fila);
    }

    for (let i = 0; i <= cantidadN.length-1; i++) {
        console.log('Instrucción', cantidadN[i]);
        const fila = document.createElement('tr');        
        fila.innerHTML = `
            <td>${cantidadN[i]}</td>            
            <td>${calcularGanancia(cantidadN[i], k)}</td>            
        `;
        cuerpoTablaGanancia.appendChild(fila);
    }
}  

function calcularFrecuencia(opcCPU,T1, T2) {
    let frecuenciaSeg = 0;
    let frecuenciaSec = 0;

    switch (opcCPU) {
         case 1:
            // Ancho del periodo segmentado = T
            frecuenciaSeg = (1 / T1) * 1E+3;
            break;
         case 2:
            // Ancho del periodo segmentado = Ti + Tr
            frecuenciaSec = (1 / T2) * 1E+3;            
            break;
         case 3:
            // Ancho del periodo secuencial = Ti * k
            frecuenciaSeg = (1 / T1) * 1E+3;
            frecuenciaSec = (1 / T2) * 1E+3;
            break;
    }

    // Retornar un objeto con ambas frecuencias
    return {
        frecuenciaSegmentada: frecuenciaSeg.toFixed(2),
        frecuenciaSecuencial: frecuenciaSec.toFixed(2)
    };
}


// Función para calcular el tiempo de ejecución segmentado
function calcularTiempoSegmentado(n, t, k) {
    return (k * t) + t * (n - 1);
}

// Función para calcular el tiempo de ejecución secuencial
function calcularTiempoSecuencial(n, t, k) {
    return n * k * t;
}

// Función para calcular la eficiencia
function calcularEficiencia(n, k) {
    // redondeo sin decimales
    return Math.round((n / (k + (n - 1))) * 100);
}

// Función para calcular la productividad
function calcularProductividad(n, t, k) {
    return Math.round((n * 1000) / ((k + (n - 1)) * t));
}

// Función para calcular la productividad máxima
function calcularProductividadMaxima(t) {
    return Math.round((1000 / t));
}

// Función para calcular la ganancia
function calcularGanancia(n, k) {
    return (n * k) / (k + (n - 1));
}
