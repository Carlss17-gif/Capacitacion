const empleado = JSON.parse(localStorage.getItem("empleado"));
document.getElementById("bienvenida").innerText =
  "Bienvenido " + (empleado?.nombre || "");

async function cargarMenu(){
  const menu = document.getElementById("menuLateral");
  menu.innerHTML = "";

  const index = await (await fetch("index.json")).json();

  for(const archivo of index.archivos){

    const res = await fetch(archivo);
    if(!res.ok) continue;

    const data = await res.json();

    Object.entries(data).forEach(([key, area]) => {

      const item = document.createElement("div");
      item.className = "menu-item";
      item.innerText = key.replaceAll("_"," ");

      const submenu = document.createElement("div");
      submenu.className = "submenu";

      Object.entries(area).forEach(([sub, cont]) => {

        if(["modulo","info","nota"].includes(sub)) return;

        // normalizar (array directo o dentro de objeto)
        const bloques = Array.isArray(cont)
          ? [[sub, cont]]
          : Object.entries(cont).filter(([_,v]) => Array.isArray(v));

        bloques.forEach(([titulo, contenido]) => {
          const btn = document.createElement("div");
          btn.innerText = titulo.replaceAll("_"," ");
          btn.onclick = () => mostrarContenido(key, titulo, contenido);
          submenu.appendChild(btn);
        });

      });

      item.onclick = () => {
        submenu.style.display =
          submenu.style.display === "block" ? "none" : "block";
      };

      menu.appendChild(item);
      menu.appendChild(submenu);
    });
  }

  agregarBotonesExamen(menu);
}

function mostrarContenido(area, subtitulo, contenido){

  const cont = document.getElementById("contenidoArea");

  let html = `
    <div class="card">
      <h1>${area.replaceAll("_"," ")}</h1>
      <h2>${subtitulo.replaceAll("_"," ")}</h2>
  `;

  contenido.forEach(item => {

    // TABLA
    if(item.tipo === "tabla"){
      html += `<h3>${item.titulo_tabla || item.nombre}</h3>`;
      html += `<table border="1" style="border-collapse:collapse;margin:auto;">`;

      html += "<tr>";
      item.columnas.forEach(c => html += `<th>${c}</th>`);
      html += "</tr>";

      item.datos.forEach(f => {
        html += "<tr>";
        item.columnas.forEach(c => html += `<td>${f[c] || ""}</td>`);
        html += "</tr>";
      });

      html += "</table>";
    }

    // LISTA
    else if(item.tipo === "lista"){
      html += `<h3>${item.nombre}</h3><ul>`;
      item.contenido.forEach(t => html += `<li>${t}</li>`);
      html += "</ul>";
    }

    // TEXTO
    else if(item.tipo === "texto"){
      html += `<p>${item.contenido}</p>`;
    }

    // IMAGENES 🔥
    else if(item.tipo === "imagenes"){
      html += `<h3>${item.nombre}</h3><div class="contenedor-imagenes">`;

      item.contenido.forEach(img => {
        html += `
          <div class="card-img">
            <img src="${img.img}" alt="${img.nombre}">
            <p>${img.nombre}</p>
          </div>
        `;
      });

      html += "</div>";
    }

  });

  html += "</div>";
  cont.innerHTML = html;
}

function agregarBotonesExamen(menu){

  const crear = (txt, fn) => {
    const d = document.createElement("div");
    d.className = "menu-item";
    d.innerText = txt;
    d.onclick = fn;
    menu.appendChild(d);
  };

  crear("Exámenes Nivel Básico", mostrarExamenesn1);
  crear("Exámenes Nivel Medio", mostrarExamenes);
}

function mostrarExamenes(){
  document.getElementById("contenidoArea").innerHTML = `
    <div class="card"><button onclick="irExamen('vegetales')">Vegetales</button></div>
    <div class="card"><button onclick="irExamen('quimicos')">Químicos</button></div>
    <div class="card"><button onclick="irExamen('malteadas')">Malteadas</button></div>
    <div class="card"><button onclick="irExamen('uber')">Uber Eats</button></div>
  `;
}

function mostrarExamenesn1(){
  document.getElementById("contenidoArea").innerHTML = `
    <div class="card"><button onclick="irExamen('SeguridadAlimentaria')">Seguridad Alimentaria</button></div>
    <div class="card"><button onclick="irExamen('Feeder')">Feeder</button></div>
    <div class="card"><button onclick="irExamen('Freír')">Freír</button></div>
    <div class="card"><button onclick="irExamen('Tenders')">Tenders</button></div>
    <div class="card"><button onclick="irExamen('Cocinero')">Cocinero</button></div>
    <div class="card"><button onclick="irExamen('Comedor')">Comedor</button></div>
    <div class="card"><button onclick="irExamen('Cajero')">Cajero</button></div>
    <div class="card"><button onclick="irExamen('AutoServicio')">AutoServicio</button></div>
  `;
}

function irExamen(id){
  window.location.href = `examen.html?id=${id}&nom=${empleado.nombre}`;
}

cargarMenu();
