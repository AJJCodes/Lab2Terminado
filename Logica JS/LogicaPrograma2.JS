document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("GenerarTabProg2").addEventListener("click", function() {
                       // Obtener los valores ingresados por el usuario
                       const instrucciones = document.getElementById('instrucciones').value.split(',').map(item => item.trim());
                       const ciclos = document.getElementById('ciclos').value.split(',').map(item => item.trim());
                       const veces = document.getElementById('veces').value.split(',').map(item => item.trim());
                       let frecuencia = parseFloat(document.getElementById('frecuencia').value);
                       let tiempoEjecucion = parseFloat(document.getElementById('tiempo-ejecucion').value);
           
                       // Obtener la opción seleccionada
                       const opcionSeleccionada = document.getElementById('que-desea-calcular').value;
           
                       // Obtener las unidades seleccionadas
                       const frecuenciaUnidad = document.getElementById('frecuencia-unidad').value;
                       const tiempoEjecucionUnidad = document.getElementById('tiempo-ejecucion-unidad').value;
           
                       // Calcular los ciclos totales
                       let ciclosTotales = 0;
                       for (let i = 0; i < ciclos.length; i++) {
                           ciclosTotales += parseInt(ciclos[i]) * parseInt(veces[i]);
                       }
           
                       // Convertir la frecuencia a megahertz si es kilohertz
                       if (frecuenciaUnidad === 'kilohertz') {
                           frecuencia /= 1000;
                       }
                       
           
                       // Convertir el tiempo de ejecución a segundos si es nanosegundos
                       if (tiempoEjecucionUnidad === 'nanosegundos') {
                           tiempoEjecucion /= 1000000000;
                       }
           
                       // Convertir el tiempo de ejecución a segundos si es milisegundos
                       if (tiempoEjecucionUnidad === 'milisegundos') {
                           tiempoEjecucion = tiempoEjecucion / 1000;
                       }
           
           
                       // Calcular el tiempo de ejecución o la frecuencia según la opción seleccionada
                       //pasar de microsegundos a segundos y de segundos a nanosegundos
                       let resultado;
                       let tiempoejecucionnano=0;
                       let tiempoejecucionseg=0;
                       if (opcionSeleccionada === 'tiempoejecucion') {
                           resultado = ciclosTotales / frecuencia;
                           tiempoejecucionseg=resultado * 1e-6; //segundos
                           tiempoejecucionnano = tiempoejecucionseg * 1e+9; //nanosegundos
                       } else if (opcionSeleccionada === 'frecuencia') {
                           resultado = ciclosTotales / tiempoEjecucion;
                           tiempoejecucionnano = tiempoEjecucion * 1e+9; //nanosegundos
                       }
           
                       // Construir la tabla HTML
                       let tablaHTML = `
                       <div class="table-responsive">
                           <table class="table table-bordered" style="color: Blue;">
                               <thead style="background-color: white;">
                                   <tr>
                                       <th>Instrucciones</th>
                                       <th>Ciclos</th>
                                       <th>Veces que se repite</th>
                                   </tr>
                               </thead>
                               <tbody>
                   `;
                   
                   for (let i = 0; i < instrucciones.length; i++) {
                       tablaHTML += `
                           <tr>
                               <td style="color: white;">${instrucciones[i]}</td>
                               <td style="color: white;">${ciclos[i]}</td>
                               <td style="color: white;">${veces[i]}</td>
                           </tr>
                       `;
                   }
                   
                   tablaHTML += `
                               </tbody>
                           </table>
                       </div>
                   `;
                   
           
                       // Mostrar la tabla en el área de resultado
                       document.getElementById('tablaResultado').innerHTML = tablaHTML;
           
                       // Mostrar los ciclos totales
                       document.getElementById('tablaResultado').insertAdjacentHTML('beforeend', `<p>Ciclos Totales: ${ciclosTotales}</p>`);
                          // Mostrar el tiempo de ejecucion en nanosegundos 
                          document.getElementById('tablaResultado').insertAdjacentHTML('beforeend', `<p>Tiempo nanoSegundos: ${tiempoejecucionnano.toFixed(2)}</p>`);
                       // Mostrar el resultado (tiempo de ejecución o frecuencia)
                       const unidad = opcionSeleccionada === 'tiempoejecucion' ? 'microSegundos' : 'MHZ';
                       document.getElementById('tablaResultado').insertAdjacentHTML('beforeend', `<p>Resultado: ${resultado.toFixed(2)} ${unidad}</p>`);
    });


    document.getElementById("RegresarMenuPrincipal2").addEventListener("click", function() {
        window.location.href = "Index.html";
    });
});