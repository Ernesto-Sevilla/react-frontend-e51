import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

// Modales
import ModalRegistroProducto from "../components/productos/ModalRegistroProducto.jsx";
import ModalEdicionProducto from "../components/productos/ModalEditarProducto.jsx";
import ModalEliminacionProducto from "../components/productos/ModalEliminarProducto.jsx";

// Tabla
import TablaProductos from "../components/productos/TablaProductos.jsx";

// Buscador
import CuadroBusquedas from "../components/busquedas/CuadroBusqueda.jsx";

// Paginación
import Paginacion from "../components/ordenamiento/Paginacion.jsx";

const Productos = () => {

  // ---------------- PAGINACIÓN ----------------
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  // ---------------- LISTA PRINCIPAL ----------------
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // ---------------- FILTRO ----------------
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  // ---------------- MODAL REGISTRO ----------------
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: '',
    descripcion_producto: '',
    precio_unitario: '',
    stock: '',
    imagen: null
  });

  // ---------------- MODAL EDICIÓN ----------------
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [productoEditado, setProductoEditado] = useState(null);

  const abrirModalEdicion = (producto) => {
    setProductoEditado({ ...producto });
    setMostrarModalEdicion(true);
  };

  const guardarEdicion = async () => {
    try {
      const resp = await fetch(
        `http://localhost:3000/api/actualizarproducto/${productoEditado.id_producto}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productoEditado),
        }
      );

      if (!resp.ok) throw new Error("Error al actualizar");

      setMostrarModalEdicion(false);
      await obtenerProductos();
    } catch (error) {
      console.error("Error al editar producto:", error);
      alert("No se pudo actualizar el producto.");
    }
  };

  // ---------------- MODAL ELIMINACIÓN ----------------
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const abrirModalEliminacion = (producto) => {
    setProductoAEliminar(producto);
    setMostrarModalEliminar(true);
  };

  const confirmarEliminacion = async () => {
    try {
      const resp = await fetch(
        `http://localhost:3000/api/eliminarproducto/${productoAEliminar.id_producto}`,
        {
          method: "DELETE",
        }
      );

      if (!resp.ok) throw new Error("Error al eliminar");

      setMostrarModalEliminar(false);
      setProductoAEliminar(null);
      await obtenerProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("No se pudo eliminar el producto.");
    }
  };

  // ---------------- REGISTRO ----------------
  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({ ...prev, [name]: value }));
  };

  const agregarProducto = async () => {
    if (!nuevoProducto.nombre_producto.trim()) return;

    try {
      const resp = await fetch("http://localhost:3000/api/registrarproducto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto),
      });

      if (!resp.ok) throw new Error("Error al guardar");

      setNuevoProducto({
        nombre_producto: "",
        descripcion_producto: "",
        precio_unitario: "",
        stock: "",
        imagen: null,
      });

      setMostrarModalRegistro(false);
      await obtenerProductos();
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("No se pudo agregar el producto.");
    }
  };

  // ---------------- OBTENER PRODUCTOS ----------------
  const obtenerProductos = async () => {
    try {
      const resp = await fetch("http://localhost:3000/api/productos");
      if (!resp.ok) throw new Error("Error al obtener productos");

      const datos = await resp.json();
      setProductos(datos);
      setProductosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      console.error(error.message);
      setCargando(false);
    }
  };

  // ---------------- BUSCADOR ----------------
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);

    const filtradas = productos.filter(
      (p) =>
        p.nombre_producto.toLowerCase().includes(texto) ||
        p.descripcion_producto.toLowerCase().includes(texto)
    );

    setProductosFiltrados(filtradas);
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  // ---------------- RENDER ----------------
  return (
    <>
      <Container className="mt-4">
        <h4>Productos</h4>

        <Row>
          <Col lg={5} md={8} sm={8} xs={7}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
            />
          </Col>

          <Col className="text-end">
            <Button className="color-boton" onClick={() => setMostrarModalRegistro(true)}>
              + Nuevo Producto
            </Button>
          </Col>
        </Row>

        <TablaProductos
          productos={productosPaginados}
          cargando={cargando}
          abrirModalEdicion={abrirModalEdicion}
          abrirModalEliminacion={abrirModalEliminacion}
          totalElementos={productosFiltrados.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
        />

        {/* Modales */}
        <ModalRegistroProducto
          mostrarModal={mostrarModalRegistro}
          setMostrarModal={setMostrarModalRegistro}
          nuevoProducto={nuevoProducto}
          manejarCambioInput={manejarCambioInput}
          agregarProducto={agregarProducto}
        />

        <ModalEdicionProducto
          mostrar={mostrarModalEdicion}
          setMostrar={setMostrarModalEdicion}
          productoEditado={productoEditado}
          setProductoEditado={setProductoEditado}
          guardarEdicion={guardarEdicion}
        />

        <ModalEliminacionProducto
          mostrar={mostrarModalEliminar}
          setMostrar={setMostrarModalEliminar}
          producto={productoAEliminar}
          confirmarEliminacion={confirmarEliminacion}
        />
      </Container>
    </>
  );
};

export default Productos;
