// Tareas.js

class Tarea {
    static ultimoId = 0;

    constructor(titulo, descripcion, estado = false) {
        this.id = ++Tarea.ultimoId;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.estado = estado;
    }

    static cargarUltimoId() {
        const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
        if (tareas.length > 0) {
            Tarea.ultimoId = tareas[tareas.length - 1].id;
        }
    }
}

const cargarTareas = (url) => {
    if (localStorage.getItem('tareas') === null) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al cargar el archivo tareas.json");
                }
                return response.json();
            })
            .then(data => {
                Tarea.cargarUltimoId();
                const tareas = data.map(tareaData => new Tarea(
                    tareaData.titulo,
                    tareaData.descripcion,
                    tareaData.estado ?? false
                ));
                localStorage.setItem('tareas', JSON.stringify(tareas));
            })
            .catch(error => {
                console.error(error);
            });
    } else {
        Tarea.cargarUltimoId();
    }
}

cargarTareas("./js/modelos/tareas.json");
