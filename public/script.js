const API_URL = "http://localhost:3000/api/alumnos";
const form = document.getElementById("alumnoForm");
const tabla = document.querySelector("#tablaAlumnos tbody");
let idEditando = null;
// Cargar alumnos al iniciar la página
document.addEventListener("DOMContentLoaded", obtenerAlumnos);

// Manejar envío del formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const edad = document.getElementById("edad").value.trim();
  const curso = document.getElementById("curso").value.trim();

  if (!nombre || !edad) {
    alert("Por favor ingresa nombre y edad.");
    return;
  }

  // Enviar datos al backend
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, edad, curso })
    });

    const data = await res.json();
    if (res.ok) {
      alert("Alumno agregado correctamente");
      form.reset();
      obtenerAlumnos(); // recarga la tabla
    } else {
      alert("Error: " + data.error);
    }
  } catch (err) {
    console.error(err);
    alert("Error de conexión con el servidor");
  }
});

//  Función para obtener lista de alumnos (GET)
async function obtenerAlumnos() {
  try {
    const res = await fetch(API_URL);
    const alumnos = await res.json();
    tabla.innerHTML = "";

    alumnos.forEach(a => {
      const fila = `
        <tr>
          <td>${a.id}</td>
          <td>${a.nombre}</td>
          <td>${a.edad}</td>
          <td>${a.curso ?? ""}</td>
          <td><button class = "editar">Editar</button></td>
          <td><button class = "borrar">Borrar</button></td>
        </tr>`;
      tabla.insertAdjacentHTML("beforeend", fila);
    });
  } catch (err) {
    console.error(err);
    tabla.innerHTML = "<tr><td colspan='4'>Error al cargar los alumnos.</td></tr>";
  }
}
//  Funcion para manejar los botones de borrar y editar
tabla.addEventListener('click', e=>{
    const fila = e.target.closest('tr')
    if (!fila) return;
    if (e.target.matches('.editar')){
        idEditando = fila.children[0].textContent;
        document.getElementById('newNombre').value = fila.children[1].textContent;
        document.getElementById('newEdad').value = fila.children[2].textContent;
        document.getElementById('newCurso').value = fila.children[3].textContent;
        const modal = new bootstrap.Modal(document.getElementById('modalEditar'))
        modal.show();
    }
    if(e.target.matches('.borrar')){
        idEditando = fila.children[0].textContent;
        let confirmacion = confirm("¿Estas seguro de que lo quieres borrar?");
        if(confirmacion) borrar();
        obtenerAlumnos();
    }
})
//  Funcion para borrar
async function borrar() {
    try{
        const res = await fetch(API_URL,{
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: idEditando
            })
        });
        const info = await res.json();
        if (res.ok) {
            alert("Alumno eliminado correctamente");
            obtenerAlumnos();
        } else {
            alert("Error: " + info.error);
        }
    } catch (err) {
        console.error(err);
        alert("Error de conexión con el servidor");
    }
}
//  Funcion para editar
document.getElementById('guardarEditar').addEventListener('click', async () => {
    const newNombre = document.getElementById('newNombre').value.trim();
    const newEdad = document.getElementById('newEdad').value.trim();
    const newCurso = document.getElementById('newCurso').value.trim();
    const modalElement = document.getElementById('modalEditar');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (!newCurso || !newEdad || !newNombre) {
        alert("Algún campo está vacío");
        return;
    }
    try {
        const res = await fetch(API_URL, { 
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: idEditando,
                nombre: newNombre,
                edad: newEdad,
                curso: newCurso
            })
        });
        const info = await res.json();
        if (res.ok) {
            alert("Alumno modificado correctamente");
            modal.hide();
            obtenerAlumnos();
            
        } else {
            alert("Error: " + info.error);
        }
    } catch (err) {
        console.error(err);
        alert("Error de conexión con el servidor");
    }
});
