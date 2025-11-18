import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionProducto = ({
  mostrar,
  setMostrar,
  productoEditado,
  setProductoEditado,
  guardarEdicion,
  categorias = [], // Lista de categorías para el select
}) => {
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setProductoEditado((prev) => ({ ...prev, [name]: value }));
  };

  // Para manejar carga de imagen
  const manejarImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const lector = new FileReader();
    lector.onload = () => {
      setProductoEditado((prev) => ({
        ...prev,
        imagen: lector.result, // Base64
      }));
    };

    lector.readAsDataURL(file);
  };

  return (
    <Modal
      backdrop="static"
      show={mostrar}
      onHide={() => setMostrar(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {/* Nombre */}
          <Form.Group className="mb-3">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control
              type="text"
              name="nombre_producto"
              value={productoEditado?.nombre_producto || ""}
              onChange={manejarCambio}
              placeholder="Ej: Martillo"
              maxLength={20}
              required
              autoFocus
            />
          </Form.Group>

          {/* Descripción */}
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion_producto"
              value={productoEditado?.descripcion_producto || ""}
              onChange={manejarCambio}
              placeholder="Descripción (máx. 100 caracteres)"
              maxLength={100}
            />
          </Form.Group>

          {/* Categoría */}
          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              name="id_categoria"
              value={productoEditado?.id_categoria || ""}
              onChange={manejarCambio}
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((cate) => (
                <option key={cate.id_categoria} value={cate.id_categoria}>
                  {cate.nombre_categoria}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Precio */}
          <Form.Group className="mb-3">
            <Form.Label>Precio Unitario</Form.Label>
            <Form.Control
              type="number"
              name="precio_unitario"
              value={productoEditado?.precio_unitario || ""}
              onChange={manejarCambio}
              placeholder="Ej: 150.00"
              min="0"
              step="0.01"
            />
          </Form.Group>

          {/* Stock */}
          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={productoEditado?.stock || ""}
              onChange={manejarCambio}
              placeholder="Cantidad en inventario"
              min="0"
            />
          </Form.Group>

          {/* Imagen */}
          <Form.Group className="mb-3">
            <Form.Label>Imagen del Producto</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={manejarImagen} />

            {productoEditado?.imagen && (
              <img
                src={productoEditado.imagen}
                alt="Vista previa"
                className="mt-2"
                style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px" }}
              />
            )}
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>

        <Button
          variant="primary"
          onClick={guardarEdicion}
          disabled={!productoEditado?.nombre_producto?.trim()}
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProducto;
