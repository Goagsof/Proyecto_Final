const mongoose = require('mongoose');

const {Schema} = mongoose;

const connect = 'mongodb://localhost/ProyectoF';

mongoose.connect(connect, {useNewUrlParser: true, useUnifiedTopology: true});

const productoSchema = new Schema ({
    nombre: String,
    descripcion : String,
    cantidad : Number,
    precio : Number,
    imagenUrl: {
      type: String,
      required: false,
    },
});

const Producto = mongoose.model('productos',productoSchema);

const agregarProducto = (req, res)=>{
    const producto = new Producto({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        cantidad: Number(req.body.cantidad),
        precio: Number(req.body.precio),
        imagenUrl: req.body.imagenUrl
    });
    producto.save()
    .then(re => {
        res.redirect('/vender');
    });
};

const obtenerProductos = async (modelo) => {
    try {
        const productos = await modelo.find({});
        return productos;
    } catch (error) {
        throw error;
    }
};

const comprarProducto = async (nombreProducto, cantidadComprada) => {
    try {
      const productoEncontrado = await Producto.findOne({ nombre: nombreProducto });
  
      if (!productoEncontrado) {
        return { success: false, message: 'Producto no encontrado.' };
      }
  
      if (cantidadComprada <= 0) {
        return { success: false, message: 'La cantidad debe ser mayor a cero.' };
      }
  
      if (cantidadComprada > productoEncontrado.cantidad) {
        return { success: false, message: 'No hay suficiente cantidad disponible.' };
      }
  
      productoEncontrado.cantidad -= cantidadComprada;
  
      await productoEncontrado.save();
      return { success: true, message: 'Compra exitosa.' };
    } catch (error) {
      throw error;
    }
  };

  const abastecerDespensa = async (nombreProducto, cantidadAbastecida) => {
    try {
      const productoEncontrado = await Producto.findOne({ nombre: nombreProducto });
  
      if (!productoEncontrado) {
        return { success: false, message: 'Producto no encontrado.' };
      }
  
      if (cantidadAbastecida <= 0) {
        return { success: false, message: 'La cantidad debe ser mayor a cero.' };
      }
  
      // Asegurarnos de que la cantidad abastecida sea un número entero positivo
      cantidadAbastecida = Math.max(0, Math.floor(cantidadAbastecida));
  
      // Sumar la cantidad abastecida a la cantidad existente en la despensa
      productoEncontrado.cantidad += cantidadAbastecida;
  
      await productoEncontrado.save();
  
      return { success: true, message: 'Abastecimiento exitoso.' };
    } catch (error) {
      throw error;
    }
  };

  const modificarProducto = async (nombreProductoActual, nuevoNombre, nuevaDescripcion, nuevaCantidad, nuevoPrecio) => {
    try {
      const productoEncontrado = await Producto.findOne({ nombre: nombreProductoActual });
  
      if (!productoEncontrado) {
        return { success: false, message: 'Producto no encontrado.' };
      }
  
      if (nombreProductoActual !== nuevoNombre) {
        const productoExistente = await Producto.findOne({ nombre: nuevoNombre });
  
        if (productoExistente) {
          return { success: false, message: 'El nuevo nombre del producto ya existe.' };
        }
      }
  
      productoEncontrado.nombre = nuevoNombre;
      productoEncontrado.descripcion = nuevaDescripcion;
      productoEncontrado.cantidad = nuevaCantidad;
      productoEncontrado.precio = nuevoPrecio;
  
      await productoEncontrado.save();
  
      return { success: true, message: 'Producto modificado exitosamente.' };
    } catch (error) {
      throw error;
    }
  };

  const eliminarProducto = async (nombreProducto) => {
    try {
      const resultadoEliminacion = await Producto.deleteOne({ nombre: nombreProducto });
  
      if (resultadoEliminacion.deletedCount === 0) {
        return { success: false, message: 'Producto no encontrado.' };
      }
  
      return { success: true, message: 'Producto eliminado exitosamente.' };
    } catch (error) {
      throw error;
    }
  };
  const buscarProducto = async (nombreProducto) => {
    try {
      const productoEncontrado = await Producto.findOne({ nombre: nombreProducto });
  
      if (!productoEncontrado) {
        return { success: false, message: 'Producto no encontrado.' };
      }
  
      return { success: true, producto: productoEncontrado };
    } catch (error) {
      throw error;
    }
  };
  
module.exports = { Producto, agregarProducto,obtenerProductos,comprarProducto,abastecerDespensa,modificarProducto,eliminarProducto,buscarProducto };