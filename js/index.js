document.addEventListener("DOMContentLoaded", () => {
    renderizarTareas();
});

function obtenerTareas() {
    return JSON.parse(localStorage.getItem("tareas")) || [];
}

function guardarTareas(tareas) {
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

function renderizarTareas() {
    const tareas = obtenerTareas();
    const contenedorPendientes = document.querySelector(".contenedorDeTareasPendientes");
    const contenedorRealizadas = document.querySelector(".contenedorDeTareasRealizadas");
    const mensajePendientes = document.querySelector(".noTienesTareasPendiente");
    const mensajeRealizadas = document.querySelector(".noTienesTareasRealizada");

    contenedorPendientes.innerHTML = "";
    contenedorRealizadas.innerHTML = "";

    // Filtrar tareas por estado
    const tareasPendientes = tareas.filter(tarea => !tarea.estado);
    const tareasRealizadas = tareas.filter(tarea => tarea.estado);

    // Si no hay tareas pendientes, mostrar el mensaje correspondiente
    if (tareasPendientes.length === 0) {
        mensajePendientes.style.display = "block";
    } else {
        mensajePendientes.style.display = "none";
        tareasPendientes.forEach(tarea => {
            const tareaHTML = crearTareaPendienteHTML(tarea);
            contenedorPendientes.appendChild(tareaHTML);
        });
    }

    // Si no hay tareas realizadas, mostrar el mensaje correspondiente
    if (tareasRealizadas.length === 0) {
        mensajeRealizadas.style.display = "block";
    } else {
        mensajeRealizadas.style.display = "none";
        tareasRealizadas.forEach(tarea => {
            const tareaHTML = crearTareaRealizadaHTML(tarea);
            contenedorRealizadas.appendChild(tareaHTML);
        });
    }
}

function crearTareaPendienteHTML(tarea) {
    const div = document.createElement("div");
    div.classList.add("tarea", "borderFondoLight");
    div.innerHTML = `
        <div class="contenedorRealizado">
            <button class="btn btn-success fw-bolder" onclick="marcarComoRealizada(${tarea.id})">
                <i class="fa-solid fa-check"></i> Realizada
            </button>
        </div>
        <div class="contenidoTarea">
            <h4 class="tituloTarea">${tarea.titulo}</h4>
            <p class="descripcionTarea">${tarea.descripcion}</p>
        </div>
        <div class="botonesDeAccion">
            <button id="botonEditarTarea${tarea.id}" class="btn btnPersonalized2" data-bs-toggle="modal" data-bs-target="#editarTareaModal${tarea.id}" onclick="editarTarea(${tarea.id})" aria-label="EditarTarea${tarea.id}" aria-hidden="true">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn btn-danger" onclick="eliminarTarea(${tarea.id})">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
        <section class="modal fade" id="editarTareaModal${tarea.id}" tabindex="-1" aria-labelledby="editarTareaModal${tarea.id}" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bgColorPrincipal">
                        <h5 class="modal-title text-white" id="editarTareaModal${tarea.id}">Editar Tarea</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body fondoLight">
                        <form id="formEditarTarea${tarea.id}">
                            <div class="mb-3">
                                <label for="tituloTareaEditar${tarea.id}" class="form-label fw-bolder">Nombre</label>
                                <input type="text" class="form-control bgInput" id="tituloTareaEditar${tarea.id}" placeholder="Ingrese el título de la tarea" minlength="3" maxlength="25" value="${tarea.titulo}" required />
                            </div>
                            <div class="mb-3">
                                <label for="descripcionEditar${tarea.id}" class="form-label fw-bolder">Descripción</label>
                                <div class="form-floating">
                                    <textarea class="form-control bgInput" id="descripcionEditar${tarea.id}" style="height: 100px" required>${tarea.descripcion}</textarea>
                                    <label for="descripcion">Descripción</label>
                                </div>
                            </div>
                            <div class="d-flex align-items-center justify-content-center">
                                <button type="submit" class="btn btnPersonalized3 mx-1 fw-bold">Guardar cambios</button>
                                <button type="button" class="btn btnPersonalized2 mx-1 fw-bold" data-bs-dismiss="modal" aria-label="Close">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    `;
    return div;
}

function crearTareaRealizadaHTML(tarea) {
    const div = document.createElement("div");
    div.classList.add("tareaRealizada", "borderFondoLight");
    div.innerHTML = `
        <div class="contenedorVolverAPendiente">
            <button class="btn btn-secondary fw-bolder" onclick="marcarComoPendiente(${tarea.id})">
                <i class="fa-solid fa-rotate-right"></i> Volver a pendiente
            </button>
        </div>
        <div class="contenidoTareaRealizada">
            <h4 class="tituloTareaRealizada">${tarea.titulo}</h4>
            <p class="descripcionTareaRealizada">${tarea.descripcion}</p>
        </div>
        <div class="botonEliminar">
            <button class="btn btn-danger" onclick="eliminarTarea(${tarea.id})"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;
    return div;
}

document.getElementById("formAgregarTarea").addEventListener("submit", (e) => {
    e.preventDefault();

    const titulo = document.getElementById("tituloTarea").value;
    const descripcion = document.getElementById("descripcion").value;

    if (titulo.trim() === "" || descripcion.trim() === "") return;

    const tareas = obtenerTareas();
    const nuevaTarea = new Tarea(titulo, descripcion);

    tareas.push(nuevaTarea);
    guardarTareas(tareas);
    renderizarTareas();

    e.target.reset();
    bootstrap.Modal.getInstance(document.getElementById("agregartareaModal")).hide();
});

function editarTarea(id) {
    const tareas = obtenerTareas();
    const tarea = tareas.find(t => t.id === id);

    if (tarea) {
        document.getElementById(`tituloTareaEditar${tarea.id}`).value = tarea.titulo;
        document.getElementById(`descripcionEditar${tarea.id}`).value = tarea.descripcion;

        const formEditar = document.getElementById(`formEditarTarea${tarea.id}`);
        formEditar.onsubmit = function (e) {
            e.preventDefault();

            const nuevoTitulo = document.getElementById(`tituloTareaEditar${tarea.id}`).value;
            const nuevaDescripcion = document.getElementById(`descripcionEditar${tarea.id}`).value;

            tarea.titulo = nuevoTitulo;
            tarea.descripcion = nuevaDescripcion;

            guardarTareas(tareas);
            renderizarTareas();
            const modalElement = document.getElementById(`editarTareaModal${tarea.id}`);
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.hide();
                modal.dispose();

                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) {
                    backdrop.remove();
                }
                document.body.classList.remove('modal-open');
            }
        };
    }
}

function eliminarTarea(id) {
    const tareas = obtenerTareas().filter(tarea => tarea.id !== id);
    guardarTareas(tareas);
    renderizarTareas();
}

function marcarComoRealizada(id) {
    const tareas = obtenerTareas();
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
        tarea.estado = true;
        guardarTareas(tareas);
        renderizarTareas();
    }
}

function marcarComoPendiente(id) {
    const tareas = obtenerTareas();
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
        tarea.estado = false;
        guardarTareas(tareas);
        renderizarTareas();
    }
}
