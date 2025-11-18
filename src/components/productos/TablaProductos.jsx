import React, { useState } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import BotonOrden from "../ordenamiento/BotonOrden.jsx";
import Paginacion from "../ordenamiento/Paginacion";
import PropTypes from "prop-types";

const TablaProductos = ({
  productos,
  cargando,
  abrirModalEdicion,
  abrirModalEliminacion,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual
}) => {

  // -------------------------------------------------------------------------
  // Estado de ordenamiento
  const [orden, setOrden] = useState({ campo: "id_producto", direccion: "asc" });

  const manejarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion:
        prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
  };

  // Ordenamiento de productos
  const productosOrdenados = [...productos].sort((a, b) => {
    const valorA = a[orden.campo];
    const valorB = b[orden.campo];

    if (typeof valorA === "number" && typeof valorB === "number") {
      return orden.direccion === "asc" ? valorA - valorB : valorB - valorA;
    }

    const comparacion = String(valorA).localeCompare(String(valorB));
    return orden.direccion === "asc" ? comparacion : -comparacion;
  });

  // -------------------------------------------------------------------------
  // Spinner de carga
  if (cargando) {
    return (
      <>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </>
    );
  }

  // -------------------------------------------------------------------------
  // Renderización de tabla
  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <BotonOrden campo="id_producto" orden={orden} manejarOrden={manejarOrden}>
                ID
              </BotonOrden>
            </th>
            <th>
              <BotonOrden campo="nombre_producto" orden={orden} manejarOrden={manejarOrden}>
                Nombre
              </BotonOrden>
            </th>
            <th>
              <BotonOrden campo="descripcion_producto" orden={orden} manejarOrden={manejarOrden}>
                Descripción
              </BotonOrden>
            </th>
            <th>
              <BotonOrden campo="precio_unitario" orden={orden} manejarOrden={manejarOrden}>
                Precio Unitario
              </BotonOrden>
            </th>
            <th>
              <BotonOrden campo="stock" orden={orden} manejarOrden={manejarOrden}>
                Stock
              </BotonOrden>
            </th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {productosOrdenados.map((producto) => (
            <tr key={producto.id_producto}>
              <td>{producto.id_producto}</td>
              <td>{producto.nombre_producto}</td>
              <td>{producto.descripcion_producto}</td>
              <td>{producto.precio_unitario}</td>
              <td>{producto.stock}</td>
              <td>
                {producto.imagen ? (
                  <img
                    src={
                      producto.imagen.startsWith("data:")
                        ? producto.imagen
                        : `data:image/png;base64,${producto.imagen}`
                    }
                    alt={producto.nombre_producto}
                    width={50}
                    height={50}
                    style={{ objectFit: "cover", borderRadius: "5px" }}
                  />
                ) : (
                  "Sin imagen"
                )}
              </td>

              <td>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(producto)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>

                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(producto)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Paginación */}
      <Paginacion
        elementosPorPagina={elementosPorPagina}
        totalElementos={totalElementos}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />
    </>
  );
};

// -----------------------------------------------------------------------------
// Validación de props
TablaProductos.propTypes = {
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      id_producto: PropTypes.number.isRequired,
      nombre_producto: PropTypes.string.isRequired,
      descripcion_producto: PropTypes.string,
      precio_unitario: PropTypes.number.isRequired,
      stock: PropTypes.number.isRequired,
      imagen: PropTypes.string
    })
  ).isRequired,
  cargando: PropTypes.bool.isRequired,
  abrirModalEdicion: PropTypes.func,
  abrirModalEliminacion: PropTypes.func,
  totalElementos: PropTypes.number,
  elementosPorPagina: PropTypes.number,
  paginaActual: PropTypes.number,
  establecerPaginaActual: PropTypes.func
};

export default TablaProductos;
