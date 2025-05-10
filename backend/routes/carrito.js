const express = require("express");
const db = require("../database");

const router = express.Router();

// Obtener los productos de un carrito
router.get("/:id_carrito", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
        SELECT items_carrito.cantidad, Productos.id_producto, Productos.nombre, Productos.precio, Imagenes.mime, Imagenes.contenido 
        FROM items_carrito 
        JOIN Productos ON items_carrito.id_producto = Productos.id_producto 
        LEFT JOIN Imagenes ON Productos.id_imagen = Imagenes.id
        WHERE items_carrito.id_carrito = ?
    `,
      [req.params.id_carrito]
    );

    const itemsConImagen = rows.map((row) => {
      return {
        ...row,
        imagen: row.contenido
          ? `data:${row.mime};base64,${Buffer.from(row.contenido).toString(
              "base64"
            )}`
          : null,
      };
    });

    res.json(itemsConImagen);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los items del carrito");
  }
});

// Agregar producto al carrito o actualizar cantidad si ya existe
router.post("/:id_carrito", async (req, res) => {
  try {
    const { id_producto, cantidad } = req.body;
    if (!id_producto || cantidad <= 0) {
      return res.status(400).send("Datos inválidos");
    }

    // Intenta agregar o actualizar el producto en el carrito
    await agregarOActualizarProducto(
      req.params.id_carrito,
      id_producto,
      cantidad
    );
    res.status(201).send("Producto agregado o actualizado en el carrito");
  } catch (error) {
    console.error(error);

    // Manejo específico del error de clave foránea
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      try {
        await crearCarrito(req.params.id_carrito);
        await agregarOActualizarProducto(
          req.params.id_carrito,
          id_producto,
          cantidad
        );
        res
          .status(201)
          .send(
            "Producto agregado o actualizado en el carrito después de crear el carrito"
          );
      } catch (errorCreacion) {
        console.error(errorCreacion);
        res.status(500).send("Error al crear el carrito y agregar el producto");
      }
    } else {
      res
        .status(500)
        .send("Error al agregar o actualizar el producto en el carrito");
    }
  }
});

async function agregarOActualizarProducto(id_carrito, id_producto, cantidad) {
  const [existingItems] = await db.query(
    "SELECT * FROM items_carrito WHERE id_carrito = ? AND id_producto = ?",
    [id_carrito, id_producto]
  );

  if (existingItems.length > 0) {
    // Producto ya existe, actualiza la cantidad
    const newCantidad = existingItems[0].cantidad + cantidad;
    await db.query(
      "UPDATE items_carrito SET cantidad = ? WHERE id_carrito = ? AND id_producto = ?",
      [newCantidad, id_carrito, id_producto]
    );
  } else {
    // Nuevo producto
    await db.query(
      "INSERT INTO items_carrito (id_carrito, id_producto, cantidad) VALUES (?, ?, ?)",
      [id_carrito, id_producto, cantidad]
    );
  }
}

async function crearCarrito(id_carrito) {
  // Lógica para insertar un nuevo carrito en la base de datos
  await db.query("INSERT INTO carrito (id_carrito) VALUES (?)", [id_carrito]);
}

// Actualizar cantidad de producto en el carrito
router.put("/:id_carrito/:id_producto", async (req, res) => {
  try {
    const { cantidad } = req.body;

    if (cantidad <= 0) {
      return res.status(400).send("Cantidad inválida");
    }

    await db.query(
      "UPDATE items_carrito SET cantidad = ? WHERE id_carrito = ? AND id_producto = ?",
      [cantidad, req.params.id_carrito, req.params.id_producto]
    );
    res.send("Producto actualizado en el carrito");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar el producto en el carrito");
  }
});

// Eliminar producto del carrito
router.delete("/:id_carrito/:id_producto", async (req, res) => {
  try {
    await db.query(
      "DELETE FROM items_carrito WHERE id_carrito = ? AND id_producto = ?",
      [req.params.id_carrito, req.params.id_producto]
    );
    res.send("Producto eliminado del carrito");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar el producto del carrito");
  }
});

// Obtener los productos de un carrito basado en UUID de usuario
router.get("/:user_uuid", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
        SELECT items_carrito.cantidad, Productos.nombre, Productos.precio, Imagenes.contenido AS imagen 
        FROM items_carrito 
        JOIN Productos ON items_carrito.id_producto = Productos.id_producto 
        LEFT JOIN Imagenes ON Productos.id_imagen = Imagenes.id
        WHERE items_carrito.id_carrito = ?
      `,
      [req.params.user_uuid]
    );
    res.json(
      rows.map((row) => {
        return {
          ...row,
          imagen: row.imagen
            ? `data:image/jpeg;base64,${Buffer.from(row.imagen).toString(
                "base64"
              )}`
            : null,
        };
      })
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los items del carrito");
  }
});

module.exports = router;
