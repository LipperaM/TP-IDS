function crearPostBox() {
    const modal = document.getElementById("modal");
    const openModal = document.getElementById("openModal");
    const closeModal = document.getElementById("closeModal");
    const postBtn = document.getElementById("postBtn");
    const postText = document.getElementById("postText");
    const postsContainer = document.getElementById("post-container");
    const categoriaBtn = document.getElementById("categoria-btn");

    // funcionalidad del modal
    openModal.onclick = () => {
        const idUsuario = localStorage.getItem("idUsuario");

        if (!idUsuario) {
            alert("⚠️ Tenés que iniciar sesión para crear un post");
            return;
        }
        
        modal.style.display = "flex";
    };

    closeModal.onclick = () => {
        modal.style.display = "none";
        postText.value = "";
        categoriaBtn.textContent = "Categoria";
        categoriaBtn.classList.remove("btn-warning");
        categoriaBtn.classList.add("btn-secondary");
        
        // resetear modo edición al cerrar
        postBtn.textContent = "Postear";
        delete postBtn.dataset.editMode;
        delete postBtn.dataset.postId;
    };

    // mapea el texto mostrado en el dropdown a un id de categoría
    const normalizar = (txt) => (txt || "").trim().toLowerCase();
    function categoriaIdDesdeTexto(texto) {
        const mapa = {
            "champions": 1,
            "libertadores": 2,
            "liga profesional": 3,
            "liga profesional de futbol": 3
        };
        return mapa[normalizar(texto)] ?? NaN;
    }

    //boton de postear
    postBtn.onclick = async () => {
        const text = postText.value.trim();
        const idUsuarioStr = localStorage.getItem("idUsuario");
        const categoriaTexto = categoriaBtn.textContent.trim();

        //chequear si el usuario escribio algo en el campo de texto
        if (text === "") {
            alert("Por favor escribe algo en tu post");
            postText.focus();
            return;
        }
        //chequeo si selecciono una categoria
        if (categoriaTexto === "Categoria") {
            alert("⚠️ Debes seleccionar una categoría antes de postear");
            categoriaBtn.classList.remove("btn-secondary");
            categoriaBtn.classList.add("btn-warning");
            return;
        }

        const categoriaIdStr = categoriaBtn.getAttribute("data-categoria-id");
        let categoriaId = Number(categoriaIdStr);
        if (!categoriaIdStr || Number.isNaN(categoriaId)) {
            categoriaId = categoriaIdDesdeTexto(categoriaTexto);
        }
        if (Number.isNaN(categoriaId)) {
            alert("⚠️ Debes seleccionar una categoría válida");
            return;
        }

        try {
            // detectar si estamos en modo edición
            const esEdicion = postBtn.dataset.editMode === "true";
            const postId = postBtn.dataset.postId;

            let response;
            if (esEdicion) {
                // PUT para editar
                response = await fetch("http://localhost:3000/posts", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: postId,
                        texto: text,
                        id_usuario: Number(idUsuarioStr),
                        id_categoria: categoriaId
                    })
                });
            } else {
                // POST para crear
                response = await fetch("http://localhost:3000/posts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_usuario: Number(idUsuarioStr),
                        texto: text,
                        id_categoria: categoriaId
                    })
                });
            }

            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                alert(data?.error || `Error al ${esEdicion ? 'actualizar' : 'crear'} el post`);
                console.error("Detalles backend:", data);
                return;
            }

            // reset UI
            postText.value = "";
            categoriaBtn.textContent = "Categoria";
            categoriaBtn.classList.remove("btn-warning");
            categoriaBtn.classList.add("btn-secondary");
            categoriaBtn.removeAttribute("data-categoria-id");
            modal.style.display = "none";

            // resetear modo edición
            postBtn.textContent = "Postear";
            delete postBtn.dataset.editMode;
            delete postBtn.dataset.postId;

            if (typeof cargarPosts === "function") {
                cargarPosts();
            } else {
                location.reload();
            }
        } catch (error) {
            console.error("Error de red al guardar el post:", error);
            alert("Error de red. Verifica que el backend esté corriendo en :3000.");
        }
    };
    
    //modal de categorias
    const opciones = document.querySelectorAll(".categoria-opcion");
    opciones.forEach((option) => {
        option.addEventListener("click", function (e) {
            e.preventDefault();
            categoriaBtn.textContent = this.textContent;
            const catId = this.getAttribute("data-categoria-id");
            if (catId) categoriaBtn.setAttribute("data-categoria-id", catId);
            else categoriaBtn.removeAttribute("data-categoria-id");
            categoriaBtn.classList.remove("btn-warning");
            categoriaBtn.classList.add("btn-secondary");
        });
    });
}
