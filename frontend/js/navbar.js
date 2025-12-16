const currentPage = window.location.pathname;
const navbarContainer = document.querySelector('.navbar');

const esAdministrador = !!localStorage.getItem("admin");

if (currentPage.includes('index.html') || currentPage.endsWith('/')) {
    navbarContainer.innerHTML = `
      <a class="navbar-brand" href="./index.html">Home</a>
      <a class="navbar-brand" href="./leaderboard.html">Tabla</a>
      <a class="navbar-brand" href="./profile.html">Perfil</a>

      <form class="d-flex" role="search">
        <input class="form-control" type="search" placeholder="Buscar" aria-label="Search"/>
        <button class="boton" type="submit">Buscar</button>
      </form>
  `
} else if (currentPage.includes('leaderboard.html')) {
  navbarContainer.innerHTML = `
      <a class="navbar-brand" href="./index.html">Home</a>
      <a class="navbar-brand" href="./leaderboard.html">Tabla</a>
      ${esAdministrador ? `<a class="navbar-brand" href="./admin.html">ADMIN</a>` : ``}
      <a class="navbar-brand" href="./profile.html">Perfil</a>

      <form class="d-flex" role="search">
        <input class="form-control" type="search" placeholder="Buscar equipos" aria-label="Search"/>
        <button class="boton" type="submit">Buscar</button>
      </form>
  `
} else if (currentPage.includes('profile.html')) {
  navbarContainer.innerHTML = `
      <a class="navbar-brand" href="./index.html">Home</a>
      <a class="navbar-brand" href="./leaderboard.html">Tabla</a>
      <a class="navbar-brand" href="./profile.html">Perfil</a>

      <form class="d-flex" role="search">
        <input class="form-control" type="search" placeholder="Buscar en tus post" aria-label="Search"/>
        <button class="boton" type="submit">Buscar</button>
      </form>
      
      <div class="nav-buttons">
      <button class="boton" id="openModalRegistro">Registrarse</button>
      <button class="boton" id="openModalEliminar">Eliminar Perfil</button>
      <button class="boton" onclick="logOut()" id="logout">Cerrar Sesion</button>
      <button class="boton" id="openModalLogin">Iniciar Sesion</button>
      </div>
  `
}
