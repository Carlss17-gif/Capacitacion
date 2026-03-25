let datos = [];
let empleadoActual = null;

async function cargarEmpleados() {
  const { data, error } = await mysupabase
    .from("resultados_examen")
    .select("*");

  datos = data;

  const nombresUnicos = [...new Set(data.map(d => d.nombre))];

  const cont = document.getElementById("empleados");

  nombresUnicos.forEach(nombre => {
    const btn = document.createElement("button");
    btn.innerText = nombre;

    btn.onclick = () => seleccionarEmpleado(nombre);

    cont.appendChild(btn);
  });
}

function seleccionarEmpleado(nombre) {
  empleadoActual = datos.filter(d => d.nombre === nombre);

  document.getElementById("nombreEmpleado").innerText = nombre;

  generarGrafica();
  generarBotonesAreas();
}

function generarGrafica() {
  const areasMap = {};

  empleadoActual.forEach(r => {
    areasMap[r.area] = r.correctas;
  });

  // ordenar mayor a menor
  const ordenado = Object.entries(areasMap)
    .sort((a,b) => b[1] - a[1]);

  const labels = ordenado.map(e => e[0]);
  const valores = ordenado.map(e => e[1]);

  const ctx = document.getElementById("grafica");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Puntaje (0-10)",
        data: valores
      }]
    }
  });
}

function generarBotonesAreas() {
  const cont = document.getElementById("areas");
  cont.innerHTML = "";

  empleadoActual.forEach(r => {
    const btn = document.createElement("button");

    btn.innerText = r.area;

    btn.onclick = () => verExamen(r);

    cont.appendChild(btn);
  });
}

async function verExamen(registro) {

  document.getElementById("tituloExamen").innerText =
    "Área: " + registro.area;

  const res = await fetch("examenes.json");
  const examenes = await res.json();

  const examenBase = examenes[registro.examen];

  const cont = document.getElementById("detalleExamen");
  cont.innerHTML = "";

  examenBase.preguntas.forEach((p,i) => {

    const div = document.createElement("div");
    div.classList.add("card");

    let respuestaUsuario = registro.respuestas[i];

    let correcta = "";

    if(p.tipo === "opcion"){
      correcta = p.opciones[p.correcta];
      respuestaUsuario = p.opciones[respuestaUsuario] || "Sin responder";
    } else {
      correcta = "Respuesta abierta";
    }

    div.innerHTML = `
      <p><b>${i+1}. ${p.texto}</b></p>
      <p>Respuesta usuario: ${respuestaUsuario}</p>
      <p>Respuesta correcta: ${correcta}</p>
    `;

    cont.appendChild(div);
  });
}

// cargar chart.js dinámicamente
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/chart.js";
document.head.appendChild(script);

cargarEmpleados();
